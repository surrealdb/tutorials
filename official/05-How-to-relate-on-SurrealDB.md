<br>
  <h1 align="center">How to RELATE on SurrealDB</h1>
<p>
  Written by <a href="https://github.com/miguelgargallo" target="_blank">Miguel Gargallo</a>, support on <a href="https://twitter.com/miguelgargallo" target="_blank">Twitter</a>.
</p>
<br>

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

