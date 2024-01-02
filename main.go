package main

import (
	"crypto/ed25519"
	"embed"
	"log"
	"os"

	"github.com/fynelabs/selfupdate"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/build
var assets embed.FS

func update() {
	selfupdate.LogError = log.Printf

	publicKey := ed25519.PublicKey{129, 31, 223, 237, 32, 3, 188, 221, 30, 228, 194, 68, 224, 40, 66, 67, 191, 78, 70, 145, 16, 55, 126, 243, 255, 101, 16, 234, 222, 2, 153, 125}

	httpSource := selfupdate.NewHTTPSource(nil, "https://github.com/luuhai48/8board/releases/latest/download/{{.Executable}}-{{.OS}}-{{.Arch}}{{.Ext}}")
	config := &selfupdate.Config{
		Source:    httpSource,
		Schedule:  selfupdate.Schedule{FetchOnStart: true},
		PublicKey: publicKey,

		ProgressCallback:       func(f float64, err error) { log.Println("Download", f, "%") },
		RestartConfirmCallback: func() bool { return true },
		UpgradeConfirmCallback: func(_ string) bool { return true },
		ExitCallback:           func(_ error) { os.Exit(1) },
	}

	_, err := selfupdate.Manage(config)
	if err != nil {
		log.Println("Error while setting up update manager: ", err)
		return
	}
}

func main() {
	update()

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "8board",
		Width:            900,
		Height:           500,
		WindowStartState: options.Maximised,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		EnableDefaultContextMenu: true,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
