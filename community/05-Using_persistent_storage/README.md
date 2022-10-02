<br>
<h1 align="center">Using persistent storage</h1>
<br>


---

<p>
    Tutorial by <a href="https://github.com/sewe75" target="_blank">Sebastian Wegert</a>
</p>

---

<br>

[SurrealDB](https://surrealdb.com/) currently offers three modes for data storage:  
- memory: (default) non persistent mode for development and testing
- file: Use the local file system to store data
- tikv: Use [TiKV](https://tikv.org/) as storage system - currently rquired for running in distrbuted mode  

These modes are set by the `path` argument on the binary as written in the [official docs](https://surrealdb.com/docs/cli/start) and shown in the examples below.  

This tutorial contains two sections - one focusing on local storage, one on [TiKV](https://tikv.org/) for running in distributed mode:
- [Local filesystem](01-Local_filesystem/README.md)
- [Distributed](02-Distributed/README.md)

## Storage mode examples

### Memory
To start [SurrealDB](https://surrealdb.com/) in *<u>non-persistent (memory)</u>* mode, start it using `memory` as the `path` argument:
```bash
surreal start --log trace --user root --pass root memory
```

### Local filesystem
To start [SurrealDB](https://surrealdb.com/) in *<u>persistent</u>* mode using the local filesystem, start it using `file://<path_to_data_directory>` as the `path` argument:
```bash
surreal start --log trace --user root --pass root file://${pwd}/data
```

### Using TiKV
To start [SurrealDB](https://surrealdb.com/) in *<u>persistent</u>* mode using [TiKV](https://tikv.org/), start it using `tikv://<address_of_tikv_server>` as the `path` argument, as well as the required parameters for setting the private-/public key pair and the signing CA public key:
```bash
surreal start \
  --log trace \
  --user root \
  --pass root \
  --kvs-ca <path_to_CA_file> \
  --kvs-crt <path_to_client_cert> \
  --kvs_key <path_to_private_key_file> \
  tikv://localhost:20160
```
