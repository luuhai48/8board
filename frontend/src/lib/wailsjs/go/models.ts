export namespace main {
	
	export class ContextResponse {
	    name: string;
	    namespace?: string;
	
	    static createFrom(source: any = {}) {
	        return new ContextResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.namespace = source["namespace"];
	    }
	}
	export class GetContextsResponse {
	    contexts: ContextResponse[];
	    currentContext: string;
	    err: string;
	
	    static createFrom(source: any = {}) {
	        return new GetContextsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contexts = this.convertValues(source["contexts"], ContextResponse);
	        this.currentContext = source["currentContext"];
	        this.err = source["err"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetNamespacesResponse {
	    namespaces: string[];
	    err: string;
	
	    static createFrom(source: any = {}) {
	        return new GetNamespacesResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.namespaces = source["namespaces"];
	        this.err = source["err"];
	    }
	}
	export class ListPod {
	    name: string;
	    // Go type: v1
	    createdAt: any;
	    // Go type: v1
	    lastUpdate: any;
	    status: string;
	    ready: string;
	    restarts: number;
	    // Go type: v1
	    terminatedAt?: any;
	
	    static createFrom(source: any = {}) {
	        return new ListPod(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.lastUpdate = this.convertValues(source["lastUpdate"], null);
	        this.status = source["status"];
	        this.ready = source["ready"];
	        this.restarts = source["restarts"];
	        this.terminatedAt = this.convertValues(source["terminatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ListPodsResponse {
	    err: string;
	    pods: ListPod[];
	
	    static createFrom(source: any = {}) {
	        return new ListPodsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.err = source["err"];
	        this.pods = this.convertValues(source["pods"], ListPod);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ListSecret {
	    name: string;
	    type: string;
	    // Go type: v1
	    createdAt: any;
	    // Go type: v1
	    lastUpdate: any;
	    data: number;
	
	    static createFrom(source: any = {}) {
	        return new ListSecret(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.type = source["type"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.lastUpdate = this.convertValues(source["lastUpdate"], null);
	        this.data = source["data"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ListSecretsResponse {
	    err: string;
	    secrets: ListSecret[];
	
	    static createFrom(source: any = {}) {
	        return new ListSecretsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.err = source["err"];
	        this.secrets = this.convertValues(source["secrets"], ListSecret);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ReadSecret {
	    data: {[key: string]: string};
	    metadata: v1.ObjectMeta;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new ReadSecret(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.metadata = this.convertValues(source["metadata"], v1.ObjectMeta);
	        this.type = source["type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ReadSecretResponse {
	    secret: ReadSecret;
	    err: string;
	
	    static createFrom(source: any = {}) {
	        return new ReadSecretResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.secret = this.convertValues(source["secret"], ReadSecret);
	        this.err = source["err"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace v1 {
	
	export class FieldsV1 {
	
	
	    static createFrom(source: any = {}) {
	        return new FieldsV1(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class ManagedFieldsEntry {
	    manager?: string;
	    operation?: string;
	    apiVersion?: string;
	    // Go type: Time
	    time?: any;
	    fieldsType?: string;
	    fieldsV1?: FieldsV1;
	    subresource?: string;
	
	    static createFrom(source: any = {}) {
	        return new ManagedFieldsEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.manager = source["manager"];
	        this.operation = source["operation"];
	        this.apiVersion = source["apiVersion"];
	        this.time = this.convertValues(source["time"], null);
	        this.fieldsType = source["fieldsType"];
	        this.fieldsV1 = this.convertValues(source["fieldsV1"], FieldsV1);
	        this.subresource = source["subresource"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class OwnerReference {
	    apiVersion: string;
	    kind: string;
	    name: string;
	    uid: string;
	    controller?: boolean;
	    blockOwnerDeletion?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new OwnerReference(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.apiVersion = source["apiVersion"];
	        this.kind = source["kind"];
	        this.name = source["name"];
	        this.uid = source["uid"];
	        this.controller = source["controller"];
	        this.blockOwnerDeletion = source["blockOwnerDeletion"];
	    }
	}
	export class ObjectMeta {
	    name?: string;
	    generateName?: string;
	    namespace?: string;
	    selfLink?: string;
	    uid?: string;
	    resourceVersion?: string;
	    generation?: number;
	    // Go type: Time
	    creationTimestamp?: any;
	    // Go type: Time
	    deletionTimestamp?: any;
	    deletionGracePeriodSeconds?: number;
	    labels?: {[key: string]: string};
	    annotations?: {[key: string]: string};
	    ownerReferences?: OwnerReference[];
	    finalizers?: string[];
	    managedFields?: ManagedFieldsEntry[];
	
	    static createFrom(source: any = {}) {
	        return new ObjectMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.generateName = source["generateName"];
	        this.namespace = source["namespace"];
	        this.selfLink = source["selfLink"];
	        this.uid = source["uid"];
	        this.resourceVersion = source["resourceVersion"];
	        this.generation = source["generation"];
	        this.creationTimestamp = this.convertValues(source["creationTimestamp"], null);
	        this.deletionTimestamp = this.convertValues(source["deletionTimestamp"], null);
	        this.deletionGracePeriodSeconds = source["deletionGracePeriodSeconds"];
	        this.labels = source["labels"];
	        this.annotations = source["annotations"];
	        this.ownerReferences = this.convertValues(source["ownerReferences"], OwnerReference);
	        this.finalizers = source["finalizers"];
	        this.managedFields = this.convertValues(source["managedFields"], ManagedFieldsEntry);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

