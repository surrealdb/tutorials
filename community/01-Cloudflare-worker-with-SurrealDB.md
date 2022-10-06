<br>
<h1 align="center">Cloudflare worker with SurrealDB</h1>
<br>

---

<p>
    Tutorial by <a href="https://github.com/kearfy" target="_blank">Micha de Vries</a>
</p>

---

<br>

I am building an [open-source social media platform](https://kards.social) with cloudflare workers. Internally, we we're in debate between projects like [Cloudflare D1](https://blog.cloudflare.com/introducing-d1/) and [Planetscale](https://planetscale.com) but eventually we stumbled upon [SurrealDB](https://surrealdb.com). It really made a lot of sense for our project, so we went with it!

To be able to achieve this, we built [our own database driver](https://github.com/theopensource-company/surrealdb-cloudflare), which is also available via [NPM](https://www.npmjs.com/package/@theopensource-company/surrealdb-cloudflare).

Below follow a few examples on how to use the database drivers with cloudflare workers. In these examples we use the worker typescript template.


### Connection variables from environment
```typescript
import Surreal from '@theopensource-company/surrealdb-cloudflare';

// Type safety, typescript example :D
type Env = {
    HOST: string;
    USER: string;
    PASS: string;
    NAMESPACE: string;
    DATABASE: string;
}

// We can update the connection variables later on, as we don't have them available here just yet...
const db = new Surreal();

export default {
	async fetch(
		request: Request,
        env: Env
	): Promise<Response> {
        // If database not yet connected, let's update the connection details.
        if (!db.connected()) db.connect({
            host: env.HOST ?? '',
            username: env.USER ?? '',
            password: env.PASS ?? '',
            namespace: env.NAMESPACE ?? '',
            database: env.DATABASE ?? ''
        });

        // Example query: Retrieves all records from table 'table'.
        let res = await db.getRecords('table');
		console.log(res[0].result);

		return new Response("Hello World!");
	},
};
```


### Connection variables defined in code
```typescript
import Surreal from '@theopensource-company/surrealdb-cloudflare';

// We can update the connection variables later on, as we don't have them available here just yet...
const db = new Surreal({
    host: 'http://surreal.domain.com',
    username: 'root',
    password: 'password',
    namespace: 'awesome',
    database: 'example'
});

export default {
	async fetch(
		request: Request
	): Promise<Response> {
        // Example query: Retrieves all records from table 'table'.
        let res = await db.getRecords('table');
		console.log(res[0].result);

		return new Response("Hello World!");
	},
};
```

### Strong type result

```typescript
const res = await db.getRecords<{
    id: string;
    username: string;
    status: "verified" | "unverified";
}>('user');

res.forEach(record => {
    // Everything in "result" is now strong typed with the defined type.
    const { result: {
        id,
        username,
        status
    } } = record;
    console.log(`${id} - User ${username} is ${status}`);
});
```
