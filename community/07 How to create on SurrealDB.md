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


# Create command in SurrealDB

Input:

	CREATE user:1 SET name='no-reply', email='no-reply@surrealdb.com', age=28

Output:

	[
	{
		"result": [
		{
			"age": 28,
			"email": "no-reply@surrealdb.com",
			"id": "user:1",
			"name": "no-reply"
		}
		],
		"status": "OK",
		"time": "673.794µs"
	}
	]

Input:

	CREATE item:1 SET name='Item Two', price=20

Output:

	[
	{
		"result": [
		{
			"id": "item:1",
			"name": "Item Two",
			"price": 20
		}
		],
		"status": "OK",
		"time": "453.432µs"
	}
	]

