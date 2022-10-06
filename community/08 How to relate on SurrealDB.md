<br>

<p align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img width="300" src="/img/white/logo.svg" alt="SurrealDB Logo">
    </a>
    <a href="https://surrealdb.com#gh-light-mode-only" target="_blank">
        <img width="300" src="/img/black/logo.svg" alt="SurrealDB Logo">
    </a>
</p>

<h3 align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img src="/img/white/text.svg" height="15" alt="SurrealDB">
    </a>
    <a href="https://surrealdb.com#gh-light-mode-only" target="_blank">
        <img src="/img/black/text.svg" height="15" alt="SurrealDB">
    </a>
    and here, Surreal Now will allow you to plug and play now, into the ultimate cloud
database for tomorrow's applications 
</h3>


## Relate

Input:

	RELATE user:1->bought->item:1 SET price=20, created_at = time::now()

Output:

	[
	{
		"result": [
		{
			"created_at": "2022-10-01T16:16:01.350849157Z",
			"id": "bought:rqu54w8dmc96u4a266zs",
			"in": "user:1",
			"out": "item:1",
			"price": 20
		}
		],
		"status": "OK",
		"time": "365.719µs"
	}
	]

