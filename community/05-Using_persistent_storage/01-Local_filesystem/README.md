<br>
<h1 align="center">Local filesystem</h1>
<br>


---

<p>
    Tutorial by <a href="https://github.com/sewe75" target="_blank">Sebastian Wegert</a>
</p>

---

<br>

As described in the [overview](../) of this tutorial, [SurrealDB](https://surrealdb.com/) provides different modes when it comes to data persistence. This tutorial will focus on the `file` mode (or `path` parameter) which uses the local filesystem to persist data.  

## Examples
In order to run [SurrealDB](https://surrealdb.com/) in *<u>persistent</u>* mode using the local filesystem, start it using `file://<path_to_data_directory>` as the `path` argument:
```bash
surreal start --log trace --user root --pass root file://<path_to_data_directory>
```

### ToC
- [1. Working folder](#1-working-folder)
- [2. System path](#2-system-path)
- [3. Docker using working folder](#3-docker-using-working-folder)
- [4. docker-compose](#4-docker-compose)
- [5. Kubernetes](#5-kubernetes-using-persistent-volume-claim)

### 1. Working folder
Using a local folder in the current working directory.

```bash
# Create folder in which to persist data
mkdir $(pwd)/data

# Start SurrealDB while providing the path to the newly created folder as the "path" argument
surreal start --log trace --user root --pass root file://$(pwd)/data
```
[[back to top]](#examples)

### 2. System path
In case you run SurrealDB e.g. as a system service you might want to keep the data outside of a users scope.  
The example below is ... *just an example* ... and has to be adjusted according to your needs and/or system setup, requirements, corp. policies, etc.

```bash
# Create folder in which to persist data
sudo mkdir -p /var/lib/surrealdb/data

# Start SurrealDB while providing the path to the newly created folder
sudo $(which surreal) start --log trace --user root --pass root file:///var/lib/surrealdb/data
```
[[back to top]](#examples)

### 3. Docker using working folder
The following example shows how to run [SurrealDB](https://surrealdb.com/) using docker while storing the database files locally in a folder in the current working directory.  

```bash
# Pull the latest image (required to ensure we run the latest version)
docker pull surrealdb/surrealdb:latest

# Verify we run the latest/desired version
docker run --rm surrealdb/surrealdb:latest version

# Run the container
docker run \
  --rm \
  --name surrealdb \
  -p 8000:8000 \
  -v $(pwd)/data:/data \
  surrealdb/surrealdb:latest \
  start --log trace --user root --pass root file:///data
```

You might run in a situation where `Ctrl+C` won't force the container to quit.  
This can be solved by opening a new shell and quit the container by running the following command:

```bash
# Stop the container
docker stop surrealdb

# or

# Force quit
docker rm -f surrealdb
```
[[back to top]](#examples)

### 4. docker-compose
docker-compose offers two ways handle storage/volume mounts.  
Option one allows us to mount a local folder as we did in the above example
while option two uses the docker volume management and lets docker create the local folder for us.

#### using working folder
The following compose file allows us to run [SurrealDB](https://surrealdb.com/) using a data folder in the current wrking directory.  

```yaml
{{#include docker-compose/docker-compose.local-path.yml}}
```

#### using a docker volume
The following compose file allows us to run [SurrealDB](https://surrealdb.com/) using a docker volume. By using a volume docker creates a local folder for us (below `` on Linux systems) that is mounted to the container for us.  
For a more detailed explanation about managing storage in docker please refer to the [official documentation](https://docs.docker.com/storage/).

```yaml
{{#include docker-compose/docker-compose.volume.yml}}
```

#### Run using docker compose
To start [SurrealDB](https://surrealdb.com/) using one of these compose file just copy one of snipped above to a `docker-compose.yml` file and run 
```bash
# Old syntax
docker-compose -f docker-compose.yml up

# New syntax
docker compose -f docker-compose.yml up

# Run in the background
docker compose -d -f docker-compose.yml up
```
[[back to top]](#examples)

### 5. Kubernetes using persistent volume claim
This section is about running [SurrealDB](https://surrealdb.com/) in persistent mode on Kubernetes - [minikube](https://minikube.sigs.k8s.io/docs/) in this case. 
Instructions on how to install and run `minikube` can be found in the [minikube docs](https://minikube.sigs.k8s.io/docs/start/).  

In order to run on Kubernetes we have to create the following objects:  
- [namespace](#namespaceyaml)
- [configmap](#configmapyaml)
- [secret](#secretsyaml)
- [persistent volume claim](#pvcyaml)
- [deployment](#deploymentyaml)
- [service  ](#serviceyaml)

While we can use `kubectl` to create a namespace and service for us on the commandline, I will use YAML files to create all required objects within this tutorial.  
Please find the required YAML snippets below.  

> **Hint**: All these files can be found in the folder `kube` in this tutorial on GitHub.

#### namespace.yaml
```yaml
{{#include kube/namespace.yaml}}
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### configmap.yaml
```yaml
{{#include kube/configmap.yaml}}
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### secrets.yaml
```yaml
{{#include kube/secrets.yaml}}
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### pvc.yaml
```yaml
{{#include kube/pvc.yaml}}
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### deployment.yaml
```yaml
{{#include kube/deployment.yaml}}
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### service.yaml
```yaml
{{#include kube/service.yaml}}
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### Deploy on Kubernetes
Please find a detailed description on how to deploy on minikube below.  
For those who want to the fast way there is a [gist](https://gist.githubusercontent.com/sewe75/298c0b8da785af372d3ab525cf61ebf8/raw/65ad7973ab59aaba2545d0765c0245d82f01e13c/surrealdb-minikube-example.yaml) available.

Using the gist:
```bash
# Start minikube
minikube start

# Get the gist
wget https://gist.githubusercontent.com/sewe75/298c0b8da785af372d3ab525cf61ebf8/raw/65ad7973ab59aaba2545d0765c0245d82f01e13c/surrealdb-minikube-example.yaml

# !!! Check the gists content !!!

# Apply the downloaded gist
kubectl apply -f ./surrealdb-minikube-example.yaml -n surrealdb

# or for those who trust public internet content
kubectl apply -n surrealdb -f https://gist.githubusercontent.com/sewe75/298c0b8da785af372d3ab525cf61ebf8/raw/65ad7973ab59aaba2545d0765c0245d82f01e13c/surrealdb-minikube-example.yaml
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
  pvc.yaml \
  secrets.yaml \
  service.yaml

# Edit one by one and paste the content found above
nano  configmap.yaml
nano  deployment.yaml
nano  namespace.yaml
nano  pvc.yaml
nano  secrets.yaml
nano  service.yaml

# Verify the kubernetes context is set correctly
kubectl config current-context

# Even if we have a namespace.yaml we have to create the namespace first to avoid errors
kubectl create ns surrealdb

# Deploy to minikube
kubectl apply -f ./
# or enforce namespace validation
kubectl apply -f ./ --namespace surrealdb
```
[[back]](#5-kubernetes-using-persistent-volume-claim)

#### Testing
In order to connect we have to open a new terminal and to run the following command, which returns the URL we have to use to connect.
```bash
minikube service surrealdb -n surrealdb --url
http://127.0.0.1:45453
❗  Because you are using a Docker driver on linux, the terminal needs to be open to run it.
```

In a different terminal we can run `surreal` to connect to the server running on minikube.
```bash
surreal sql -c http://localhost:45453 -u root -p root --ns myns --db mydb
```
For other options to expose apps see the [minikube docs](https://minikube.sigs.k8s.io/docs/handbook/accessing/).  
[[back]](#5-kubernetes-using-persistent-volume-claim)
  
[[back to top]](#examples)