package main

import (
	"context"
	_ "embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"sort"

	"github.com/tidwall/gjson"
	coreV1 "k8s.io/api/core/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

//go:embed wails.json
var wailsJSON string

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	os.MkdirAll(filepath.Join(homedir.HomeDir(), ".8board"), os.ModePerm)

	appConfig := "{\"PATH\": \"/bin:/usr/bin:/usr/local/bin\"}"

	configFilePath := filepath.Join(homedir.HomeDir(), ".8board", "config.json")
	if _, err := os.Stat(configFilePath); err == nil {
		b, readErr := os.ReadFile(configFilePath)
		if readErr == nil {
			appConfig = string(b)
		}
	}

	if !gjson.Valid(appConfig) {
		appConfig = "{\"PATH\": \"/bin:/usr/bin:/usr/local/bin\"}"
	}

	PATH := gjson.Get(appConfig, "PATH").String()
	if PATH == "" {
		PATH = "/bin:/usr/bin:/usr/local/bin"
	}

	os.WriteFile(configFilePath, []byte(appConfig), 0644)

	os.Setenv("PATH", PATH)
}

func (a *App) GetVersion() string {
	version := gjson.Get(wailsJSON, "info.productVersion")
	return version.String()
}

var (
	ClientConfig clientcmd.ClientConfig
	ClientSet    *kubernetes.Clientset
)

func (a *App) ReloadConfig() string {
	clientConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
		&clientcmd.ClientConfigLoadingRules{ExplicitPath: filepath.Join(homedir.HomeDir(), ".kube", "config")},
		&clientcmd.ConfigOverrides{
			CurrentContext: "",
		})

	ClientConfig = clientConfig

	config, err := clientConfig.RawConfig()
	if err != nil {
		return fmt.Sprintf("Get config error: %s", err.Error())
	}

	if len(config.Contexts) > 0 && config.CurrentContext != "" {
		found := false
		for context := range config.Contexts {
			if context == config.CurrentContext {
				found = true
			}
		}
		if !found {
			first := reflect.ValueOf(config.Contexts).MapKeys()[0].Interface().(string)
			cmd := exec.Command("kubectl", "config", "use-context", first)
			_, err := cmd.Output()
			if err != nil {
				return fmt.Sprintf("Switch context error: %s", err.Error())
			}

			return a.ReloadConfig()
		}
	}

	restConfig, errr := clientConfig.ClientConfig()
	if errr != nil {
		return fmt.Sprintf("Get rest config error: %s", errr.Error())
	}

	clientset, errrr := kubernetes.NewForConfig(restConfig)
	if errrr != nil {
		return fmt.Sprintf("Get rest client error: %s", errrr.Error())
	}
	ClientSet = clientset

	return ""
}

type ContextResponse struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace,omitempty"`
}

type GetContextsResponse struct {
	Contexts       []ContextResponse `json:"contexts"`
	CurrentContext string            `json:"currentContext"`
	Err            string            `json:"err"`
}

func (a *App) GetContexts() GetContextsResponse {
	response := GetContextsResponse{}

	config, err := ClientConfig.RawConfig()
	if err != nil {
		response.Err = fmt.Sprintf("Get config error: %s", err.Error())
		return response
	}

	contexts := []ContextResponse{}
	for _, context := range config.Contexts {
		contexts = append(contexts, ContextResponse{
			Name:      context.Cluster,
			Namespace: context.Namespace,
		})
	}
	sort.SliceStable(contexts, func(i, j int) bool {
		return contexts[i].Name < contexts[j].Name
	})

	response.Contexts = contexts
	response.CurrentContext = config.CurrentContext
	return response
}

type GetNamespacesResponse struct {
	Namespaces []string `json:"namespaces"`
	Err        string   `json:"err"`
}

func (a *App) GetNamespaces() GetNamespacesResponse {
	response := GetNamespacesResponse{}

	apiResponse, err := ClientSet.CoreV1().Namespaces().List(context.Background(), v1.ListOptions{})
	if err != nil {
		val, exist := os.LookupEnv("PATH")
		if !exist {
			val = "Not exists"
		}
		response.Err = fmt.Sprintf("List namespaces error: %s, %s", err.Error(), val)
		return response
	}

	namespaces := []string{}
	for _, n := range apiResponse.Items {
		namespaces = append(namespaces, n.Name)
	}

	response.Namespaces = namespaces
	return response
}

func (a *App) SetCurrentContext(context string) string {
	cmd := exec.Command("kubectl", "config", "use-context", context)
	_, err := cmd.Output()
	if err != nil {
		return fmt.Sprintf("Set context to %s error: %s", context, err.Error())
	}
	return ""
}

func (a *App) SetCurrentNamespace(namespace string) string {
	cmd := exec.Command("kubectl", "config", "set-context", "--current", fmt.Sprintf("--namespace=%s", namespace))
	_, err := cmd.Output()
	if err != nil {
		return fmt.Sprintf("Set namespace to %s error: %s", namespace, err.Error())
	}
	return ""
}

type ListSecret struct {
	Name       string  `json:"name"`
	Type       string  `json:"type"`
	CreatedAt  v1.Time `json:"createdAt"`
	LastUpdate v1.Time `json:"lastUpdate"`
	Data       int     `json:"data"`
}

type ListSecretsResponse struct {
	Err     string       `json:"err"`
	Secrets []ListSecret `json:"secrets"`
}

func (a *App) ListSecrets(namespace string) ListSecretsResponse {
	response := ListSecretsResponse{}

	apiResponse, err := ClientSet.CoreV1().Secrets(namespace).List(context.Background(), v1.ListOptions{})
	if err != nil {
		response.Err = fmt.Sprintf("List secrets of namespace %s error: %s", namespace, err.Error())
		return response
	}

	secrets := []ListSecret{}
	for _, s := range apiResponse.Items {
		secrets = append(secrets, ListSecret{
			Name:       s.Name,
			Type:       string(s.Type),
			CreatedAt:  s.CreationTimestamp,
			LastUpdate: *s.ManagedFields[len(s.ManagedFields)-1].Time,
			Data:       len(s.Data),
		})
	}

	response.Secrets = secrets
	return response
}

type ReadSecret struct {
	Data     map[string]string `json:"data"`
	Metadata v1.ObjectMeta     `json:"metadata"`
	Type     string            `json:"type"`
}

type ReadSecretResponse struct {
	Secret ReadSecret `json:"secret"`
	Err    string     `json:"err"`
}

func (a *App) ReadSecret(namespace string, secretName string) ReadSecretResponse {
	response := ReadSecretResponse{}

	secret, err := ClientSet.CoreV1().Secrets(namespace).Get(context.Background(), secretName, v1.GetOptions{})
	if err != nil {
		response.Err = fmt.Sprintf("Get secret %s error: %s", secretName, err.Error())
		return response
	}

	data := make(map[string]string)
	for k, val := range secret.Data {
		data[k] = string(val)
	}

	response.Secret = ReadSecret{
		Data:     data,
		Metadata: secret.ObjectMeta,
		Type:     string(secret.Type),
	}
	return response
}

type ListPod struct {
	Name         string   `json:"name"`
	CreatedAt    v1.Time  `json:"createdAt"`
	LastUpdate   v1.Time  `json:"lastUpdate"`
	Status       string   `json:"status"`
	Ready        string   `json:"ready"`
	Restarts     int      `json:"restarts"`
	TerminatedAt *v1.Time `json:"terminatedAt,omitempty"`
}

type ListPodsResponse struct {
	Err  string    `json:"err"`
	Pods []ListPod `json:"pods"`
}

func (a *App) ListPods(namespace string) ListPodsResponse {
	response := ListPodsResponse{}

	apiResponse, err := ClientSet.CoreV1().Pods(namespace).List(context.Background(), v1.ListOptions{})
	if err != nil {
		response.Err = fmt.Sprintf("List pods error: %s", err.Error())
	}

	pods := []ListPod{}
	for _, p := range apiResponse.Items {
		status := string(p.Status.Phase)
		if p.DeletionTimestamp != nil {
			status = "Terminating"
		}

		ready := 0
		restarts := 0
		terminatedStates := []coreV1.ContainerState{}

		for _, v := range p.Status.ContainerStatuses {
			restarts += int(v.RestartCount)

			if v.Ready {
				ready += 1
			}

			if v.LastTerminationState.Terminated != nil {
				terminatedStates = append(terminatedStates, v.LastTerminationState)
			}
		}

		var terminatedAt *v1.Time
		if len(terminatedStates) > 0 {
			terminatedAt = &terminatedStates[len(terminatedStates)-1].Terminated.FinishedAt
		}

		pods = append(pods, ListPod{
			Name:         p.Name,
			CreatedAt:    p.CreationTimestamp,
			LastUpdate:   *p.ManagedFields[len(p.ManagedFields)-1].Time,
			Status:       status,
			Ready:        fmt.Sprintf("%d/%d", ready, len(p.Status.ContainerStatuses)),
			Restarts:     restarts,
			TerminatedAt: terminatedAt,
		})
	}

	response.Pods = pods
	return response
}
