<br>
    <h1 align="center">Host in docker compose</h1>
<br>

---

<p>
    Tutorial by <a href="https://github.com/kearfy" target="_blank">Micha de Vries</a>
</p>

---

<br>

As of writing this tutorial, Surreal Cloud is not yet available. For our project (which is currently heavily in development) we need to have an online instance of surrealdb available, so we have resided to a Hetzner VPS with docker-compose to keep it all clean and tidy.

What follows beyond here is a boiler plate with a very basic docker-compose instance, and the way we have deployed it.

<br>

## Basic, no SSL

```yaml
version: '3'

services:
  surrealdb:
    image: surrealdb/surrealdb:latest
    container_name: surrealdb
    restart: always
    command: start --user INSERT_USERNAME_HERE --pass INSERT_PASSWORD_HERE file:/data/database.db
    ports:
      - 8000:8000
    volumes:
      - ./data:/data
```

<br>

## Our deployment

We don't need any automatic SSL generation as we use an SSL provided by cloudflare for our origin server, but feel free to add another template to this guide which automatically requests an SSL from Let's encrypt!

```yaml
version: '3'

services:
  surrealdb:
    image: surrealdb/surrealdb:latest
    container_name: surrealdb
    restart: always
    command: start --user INSERT_USERNAME_HERE --pass INSERT_PASSWORD_HERE --web-crt /data/web.crt --web-key /data/web.key file:/data/database.db
    ports:
      - 443:8000
    volumes:
      - ./data:/data
```