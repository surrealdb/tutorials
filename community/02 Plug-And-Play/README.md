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
    is the ultimate cloud <br> database for tomorrow's applications
</h3>

- [Surreal Now](#surreal-now)
	- [Credentials](#Credentials)
	- [Create](#create)
	- [Select](#select)
	- [Relate](#relate)


# Surreal Now

<h2><img height="20" src="/img/gettingstarted.svg">&nbsp;&nbsp;Surreal now</h2>

Surreal now section will allow you directly to access, create, select and releate databases successfully now, here! Go!

First use this command to create and access a database on your IDE or terminal!

## Credentials

	surreal sql --conn http://localhost:8000 --user admin --pass password --ns company --db company --pretty


## Create

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

## Select

Input:

	SELECT * FROM user

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
		"time": "414.956µs"
	}
	]

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

