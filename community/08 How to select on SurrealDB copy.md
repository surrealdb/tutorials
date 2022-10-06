<br>
  <h1 align="center">How to SELECT on SurrealDB</h1>
<p>
  Written by <a href="https://github.com/miguelgargallo" target="_blank">Miguel Gargallo</a>, support on <a href="https://twitter.com/miguelgargallo" target="_blank">Twitter</a>.
</p>
<br>

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

