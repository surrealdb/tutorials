<br>
<h1 align="center">Distributed</h1>
<br>


---

<p>
    Tutorial by <a href="https://github.com/sewe75" target="_blank">Sebastian Wegert</a>
</p>

---

<br>

As described in the [overview](../) of this tutorial, [SurrealDB](https://surrealdb.com/) provides different modes when it comes to data persistence. This tutorial will focus on the `tikv` mode (or `path` parameter) which uses [TiKV](https://tikv.org/) to persist data and enables distributed mode.  

## Examples
To run [SurrealDB](https://surrealdb.com/) in *<u>persistent</u>* mode using [TiKV](https://tikv.org/), start it using `tikv://<address_of_tikv_pd>` as the `path` argument:
```bash
surreal start \
  --log trace \
  --user root \
  --pass root \
  tikv://localhost:2379
```

### ToC
- [1. docker-compose](#1-docker-compose)
- [2. Kubernetes](#2-kubernetes)

### 1. docker-compose

Please find detailed instructions in the [SurrealDB docker repo](https://github.com/surrealdb/docker.surrealdb.com) including a [docker-compose file](https://github.com/surrealdb/docker.surrealdb.com/blob/main/docker-compose.yml) for an HA setup for [TiKV](https://github.com/tikv/tikv) using [PD](https://github.com/tikv/pd) (Placement Driver for TiKV).  

### 2. Kubernetes

In order to run [SurrealDB](https://surrealdb.com/) in distributed mode on kubernetes, we have to prepare a basic installation of [TiKV](https://tikv.org/).  
The instructions below are based on the [TiDB](https://github.com/pingcap/tidb) [quickstart](https://docs.pingcap.com/tidb-in-kubernetes/stable/get-started) as the [TiKV operator](https://tikv.org/docs/3.0/tasks/try/tikv-operator/) project is in archived state.

> Attention: These instructions are for testing purposes only and will
> deploy a TiDB instance on top of TiKV as you follow along.  
> Suggestions on how to optimize the setup are welcome.  

#### 0. Prerequisits

- Running kubernetes cluster ([minikube](https://minikube.sigs.k8s.io/docs/start/)/[kind](https://kind.sigs.k8s.io/docs/user/quick-start/)/...)
- [helm](https://helm.sh/docs/helm/helm_install/)
- Kubernetes CLI ([kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl))

#### 1. Deploy TiDB operator

```bash
# Deploy the CRD (custom resourc edefinitions)
kubectl create -f https://raw.githubusercontent.com/pingcap/tidb-operator/v1.3.8/manifests/crd.yaml

# Add the PingCAP repository
helm repo add pingcap https://charts.pingcap.org/

# Update the local helm chart index
helm repo update

# Create a namespace for the TiDB operator
kubectl create namespace tidb-admin

# Deploy the TiDB operator
helm install --namespace tidb-admin tidb-operator pingcap/tidb-operator --version v1.3.8

# Watch the deployment
kubectl --namespace tidb-admin get pods --watch
NAME                                       READY   STATUS              RESTARTS   AGE
tidb-controller-manager-6b85b576cc-bw8vz   0/1     ContainerCreating   0          5s
tidb-scheduler-77fb7f4445-l9gdd            0/2     ContainerCreating   0          5s
tidb-controller-manager-6b85b576cc-bw8vz   1/1     Running             0          12s
tidb-scheduler-77fb7f4445-l9gdd            2/2     Running             0          14s
```

#### 2. Deploy a TiDB cluster and its monitoring services

The deployment manifest we use to deploy the TiDB cluster can be found in the examples section of the [TiDB operator GitHub repo](https://github.com/pingcap/tidb-operator/tree/master/examples/basic).  

```bash
# Deploy a TiDB cluster
kubectl create namespace tidb-cluster && \
    kubectl -n tidb-cluster apply -f https://raw.githubusercontent.com/pingcap/tidb-operator/master/examples/basic/tidb-cluster.yaml

# Deploy TiDB monitoring services (optional)
kubectl -n tidb-cluster apply -f https://raw.githubusercontent.com/pingcap/tidb-operator/master/examples/basic/tidb-monitor.yaml

# Watch the deployment
kubectl --namespace tidb-cluster get pods --watch
NAME                              READY   STATUS            RESTARTS   AGE
basic-discovery-ccc989595-j2f4v   1/1     Running           0          59s
basic-monitor-0                   0/4     PodInitializing   0          43s
basic-pd-0                        1/1     Running           0          59s
basic-tikv-0                      1/1     Running           0          33s
basic-discovery-ccc989595-j2f4v   1/1     Running           0          77s
basic-pd-0                        1/1     Running           0          78s
basic-tidb-0                      0/2     Pending           0          0s
basic-monitor-0                   0/4     PodInitializing   0          62s
basic-tidb-0                      0/2     Pending           0          0s
basic-tikv-0                      1/1     Running           0          52s
basic-tidb-0                      0/2     ContainerCreating   0          0s
basic-tidb-0                      0/2     ContainerCreating   0          1s
basic-monitor-0                   2/4     Running             0          67s
basic-monitor-0                   3/4     Running             0          67s
basic-monitor-0                   4/4     Running             0          69s
basic-tidb-0                      1/2     Running             0          16s
basic-tidb-0                      2/2     Running             0          30s

# Find the name of the pd-service we need to connect to
kubectl get svc -n tidb-cluster | grep pd
basic-pd                 ClusterIP   10.105.153.103   <none>        2379/TCP              8m19s
basic-pd-peer            ClusterIP   None             <none>        2380/TCP,2379/TCP     8m19s
```

The service we need to connect our SurrealDB instance to ist named `basic-pd` in this case and resides in the namespace `tidb-cluster`.  
So the endpoint we have to configure in SurrealDB will be `tikv://basic-pd.tidb-cluster:2379`.  

##### (Optional) Scale the TiDB instance down to zero
As mentioned we have used the TiDB operator due to the deprecation of the TiKV operator which resulted in an unused TiDB instance on or cluster.  
To avoid unused workloads running on our minikube instance we can scale the TiDB StatefulSet to zero:  
```bash
# List the stateful sets in the tidb-cluster namespace
kubectl get sts -n tidb-cluster
NAME            READY   AGE
basic-monitor   1/1     80m
basic-pd        1/1     80m
basic-tidb      1/1     79m
basic-tikv      1/1     79m

# Scale down the `basic-tidb` statefulset
kubectl scale statefulset basic-tidb -n tidb-cluster --replicas=0
statefulset.apps/basic-tidb scaled

# Verify the sts is scaled down
kubectl get sts -n tidb-cluster
NAME            READY   AGE
basic-monitor   1/1     82m
basic-pd        1/1     82m
basic-tidb      0/0     81m
basic-tikv      1/1     82m
```

#### 3. Deploy SurrealDB
In order to run on Kubernetes we have to create the following objects:  
- [namespace](#namespaceyaml)
- [configmap](#configmapyaml)
- [secret](#secretsyaml)
- [deployment](#deploymentyaml)
- [service  ](#serviceyaml)

While we can use `kubectl` to create a namespace and service for us on the commandline, I will use YAML files to create all required objects within this tutorial.  
Please find the required YAML snippets below.  

> **Hint**: All these files can be found in the folder `kube` in this tutorial on GitHub.

#### namespace.yaml
```yaml
{{#include kube/namespace.yaml}}
```
[[back]](#3-deploy-surrealdb)

#### configmap.yaml
```yaml
{{#include kube/configmap.yaml}}
```
[[back]](#3-deploy-surrealdb)

#### secrets.yaml
```yaml
{{#include kube/secrets.yaml}}
```
[[back]](#3-deploy-surrealdb)

#### deployment.yaml
```yaml
{{#include kube/deployment.yaml}}
```
[[back]](#3-deploy-surrealdb)

#### service.yaml
```yaml
{{#include kube/service.yaml}}
```
[[back]](#3-deploy-surrealdb)

#### Deploy on Kubernetes
Please find a detailed description on how to deploy on minikube below.  
For those who want to the fast way there is a [gist](https://gist.githubusercontent.com/sewe75/88f2f2a89dc3933cacad5f861de3c79e) available.

Using the gist:
```bash
# Start minikube
minikube start

# Get the gist
wget -O surrealdb-minikube-example-tikv.yaml \
  https://gist.githubusercontent.com/sewe75/88f2f2a89dc3933cacad5f861de3c79e/raw

# !!! Check the gists content !!!

# Apply the downloaded gist
kubectl apply -f ./surrealdb-minikube-example-tikv.yaml -n surrealdb-tikv

# or for those who trust public internet content
kubectl apply -n surrealdb-tikv \
  -f https://gist.githubusercontent.com/sewe75/88f2f2a89dc3933cacad5f861de3c79e/raw

# Watch the deployment
kubectl --namespace surrealdb-tikv get pods --watch
NAME                              READY   STATUS              RESTARTS   AGE
surrealdb-tikv-6b7d9ff5f6-4htl6   0/1     ContainerCreating   0          2s
surrealdb-tikv-6b7d9ff5f6-md4tm   0/1     ContainerCreating   0          2s
surrealdb-tikv-6b7d9ff5f6-n78l5   0/1     ContainerCreating   0          2s
surrealdb-tikv-6b7d9ff5f6-4htl6   1/1     Running             0          4s
surrealdb-tikv-6b7d9ff5f6-md4tm   1/1     Running             0          5s
surrealdb-tikv-6b7d9ff5f6-n78l5   1/1     Running             0          7s
```

The long way:
```bash
# Start minikube
minikube start

# Create local folder for the kubernetes manifest files
mkdir kube && cd $_

# Create the files
touch \
  configmap.yaml \
  deployment.yaml \
  namespace.yaml \
  secrets.yaml \
  service.yaml

# Edit one by one and paste the content found above
nano  configmap.yaml
nano  deployment.yaml
nano  namespace.yaml
nano  secrets.yaml
nano  service.yaml

# Verify the kubernetes context is set correctly
kubectl config current-context

# Even if we have a namespace.yaml we have to create the namespace first to avoid errors
kubectl create ns surrealdb-tikv

# Deploy to minikube
kubectl apply -f ./
# or enforce namespace validation
kubectl apply -f ./ --namespace surrealdb-tikv

# Watch the deployment
kubectl --namespace surrealdb-tikv get pods --watch
NAME                              READY   STATUS              RESTARTS   AGE
surrealdb-tikv-6b7d9ff5f6-4htl6   0/1     ContainerCreating   0          2s
surrealdb-tikv-6b7d9ff5f6-md4tm   0/1     ContainerCreating   0          2s
surrealdb-tikv-6b7d9ff5f6-n78l5   0/1     ContainerCreating   0          2s
surrealdb-tikv-6b7d9ff5f6-4htl6   1/1     Running             0          4s
surrealdb-tikv-6b7d9ff5f6-md4tm   1/1     Running             0          5s
surrealdb-tikv-6b7d9ff5f6-n78l5   1/1     Running             0          7s
```
[[back]](#3-deploy-surrealdb)

#### Testing
In order to connect we have to open a new terminal and to run the following command, which returns the URL we have to use to connect.
```bash
minikube service surrealdb-tikv -n surrealdb-tikv --url
http://127.0.0.1:35417
❗  Because you are using a Docker driver on linux, the terminal needs to be open to run it.
```

In a different terminal we can run `surreal` to connect to the server running on minikube.
```bash
surreal sql -c http://localhost:35417 -u root -p root --ns myns --db mydb
```
For other options to expose apps see the [minikube docs](https://minikube.sigs.k8s.io/docs/handbook/accessing/).  
[[back]](#3-deploy-surrealdb)
  
[[back to top]](#examples)