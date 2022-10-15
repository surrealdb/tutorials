<br>
    <h1 align="center">Running a SurrealDB Instance on Fly.io</h1>
<br>

---

<p>
    Tutorial by <a href="https://github.com/intabulas" target="_blank">Mark Lussier</a>
</p>

---

<br>

These are the steps for getting a [surrealdb](https://surrealdb.com/) instance running on [fly.io](https://fly.io/) and connecting to it. This is **heavily** based off of steps posted in the surrealdb discord by rvdende. [View Origional Post](https://discord.com/channels/902568124350599239/1022387563627028511/1022928762947514449).

These steps work just fine for the hobby (pay as you go) plan.

**HEADS UP** By default this will create an instance on a single shared cpu with 256m memory. This is pretty darn small to do anything but experiment, but its free. You can scale your instance to something more useable by visiting the `https://fly.io/apps/<appname>/scale`. Obviously scaling to larger instances will incur higher costs, please refer to [fly.io pricing](https://fly.io/docs/about/pricing/)

### Installing fly.io client

source: [fly.io docs](https://fly.io/docs/hands-on/install-flyctl/)

```bash
brew install flyctl
```

### Optionally create a free account if needed

source: [fly.io docs](https://fly.io/docs/hands-on/sign-up/)

```bash]
flyctl auth signup
```

### Login to your fly.io account

source: [fly.io docs](https://fly.io/docs/hands-on/sign-in/)

```bash
flyctl auth login
```

## Create a Dockerfile to run SurrealDB

Create a directory locally, cd into it and create a new `Dockerfile`. Note we aren't providing a root user username/password to the start command, we will bre providing those as environment variables.

```docker
FROM surrealdb/surrealdb:latest
EXPOSE 8080
CMD ["start", "--bind","0.0.0.0:8080", "file://data/srdb.db"]
```

### Launch your Instance.. sort of :)

```sh
fly launch
```

You will be prompted for various questions. Give your app a rememberable name since it will be used in the URL. Pick a region close to you and most importantly, answer NO when prompted if you wish to deploy immediately.

### Create a volume

We need to create a volume for surreal to write the database to. Lets create a small 1g volume. Right now you can not scale a volume (you need to create a new one), but fly.io is working on supporting this. You can get up a total of 3g of persistent volume storage (total) for free.

```bash
fly volumes create data --region <region> --size 1
```

Now lets edit and the `fly.toml` file that was created by `fly launch. Put this at the end, no indentations or spaces.

```toml
[mounts]
source="data"
destination="/data"
```

### Secrets

Now lets add our username and password as secrets. You can see the environment variables suurealdb supports by running `surreal start -h`

```bash
fly secrets set USER=root
fly secrets set PASS=<passwordhere>
```

### Let's Deploy

```bash
fly deploy
```

### Connecting

Now that your surrealdb instance is up and running, you need to be able to connect to it. Even though we exposed port 8080 in the Dockerfile, fly will map that appropriatly to port 80/443.

If your connecting via a websocket client library, surrealdb-go in my case, you would connect like the following. Note the use of wss://

```go
db, err := surrealdb.New("wss://<appname>.fly.dev/rpc")
if err != nil {
	fmt.Printf("error creating socket: %s", err)
	os.Exit(2)
}
```

### Surreal sql Command

If your connecting via the surreal cli either, use the connection string of `--conn https://<appname<.fly.dev`. Please don't forget to pass --user/--pass with the values you used when creating secrets.

### Third Party tools like rvdende's [surrealreact](https://surrealreact.fly.dev/)

When creating a connection, specify the host as `https://<appname>.fly.dev/rpc`
