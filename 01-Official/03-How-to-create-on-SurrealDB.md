<br>
  <h1 align="center">How to CREATE on SurrealDB</h1>
<p>
  Written by <a href="https://github.com/miguelgargallo" target="_blank">Miguel Gargallo</a>, support on <a href="https://twitter.com/miguelgargallo" target="_blank">Twitter</a>.
</p>
<br>

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

