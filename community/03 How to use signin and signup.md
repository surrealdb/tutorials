<br>
  <h1 align="center">How to use signin and signup</h1>
<br>

---

<p>
  Tutorial by <a href="https://github.com/koakh" target="_blank">Koakh</a> from <a href="https://github.com/tobiemh" target="_blank">Tobie</a> code snippet
</p>

---

## Start InMemory Server

```shell
$ surreal start --log trace --user root --pass root
```

## Option #1: SCHEMAFULL

launch surreal REPL to connect to local SurrealDB server instance

```shell
$ surreal sql --conn http://localhost:8000 --user root --pass root --ns test --db test --pretty
```

now paste bellow surrealQL code block to create the schemafull scheme

```sql
---define SCHEMAFULL and PERMISSIONS
DEFINE TABLE user SCHEMAFULL
  PERMISSIONS
    FOR select, update WHERE id = $auth.id, 
    FOR create, delete NONE;
--- define FIELD's
DEFINE FIELD user ON user TYPE string;
DEFINE FIELD pass ON user TYPE string;
DEFINE FIELD settings.* ON user TYPE object;
DEFINE FIELD settings.marketing ON user TYPE string;
DEFINE FIELD tags ON user TYPE array;
--- define INDEX's
DEFINE INDEX idx_user ON user COLUMNS user UNIQUE;

-- define SCOPE
DEFINE SCOPE allusers
  -- the JWT session will be valid for 14 days
  SESSION 14d
  -- The optional SIGNUP clause will be run when calling the signup method for this scope
  -- It is designed to create or add a new record to the database.
  -- If set, it needs to return a record or a record id
  -- The variables can be passed in to the signin method
  SIGNUP ( CREATE user SET settings.marketing = $marketing, user = $user, pass = crypto::argon2::generate($pass), tags = $tags )
  -- The optional SIGNIN clause will be run when calling the signin method for this scope
  -- It is designed to check if a record exists in the database.
  -- If set, it needs to return a record or a record id
  -- The variables can be passed in to the signin method
  SIGNIN ( SELECT * FROM user WHERE user = $user AND crypto::argon2::compare(pass, $pass) )
  -- this optional clause will be run when calling the signup method for this scope
```

check info db in REPL

```sql
> INFO FOR DB;
[
  {
    "result": {
      "dl": {},
      "dt": {},
      "sc": {
        "allusers": "DEFINE SCOPE allusers SESSION 2w SIGNUP (CREATE user SET settings.marketing = $marketing, user = $user, pass = crypto::argon2::generate($pass), tags = $tags) SIGNIN (SELECT * FROM user WHERE user = $user AND crypto::argon2::compare(pass, $pass))"
      },
      "tb": {
        "user": "DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select WHERE id = $auth.id, FOR create NONE, FOR update WHERE id = $auth.id, FOR delete NONE"
      }
    },
    "status": "OK",
    "time": "153.601µs"
  }
]
```

## Option #2 : SCHEMALESS

another nice option suggested by [George Shammas / georgyo](https://gist.github.com/georgyo)

```sql
DEFINE SCOPE allusers 
SESSION 14d
SIGNUP (
  CREATE type::thing("user", string::lowercase(string::trim($user)))
  SET pass = crypto::argon2::generate($pass)
)
SIGNIN (
  SELECT * FROM type::thing("user", string::lowercase(string::trim($user)))
  WHERE crypto::argon2::compare(pass, $pass)
)
```

Because we are **reusing the id, the username unique constraint is enforced** even in a SCHEMALESS table.

However this also means that **username will not be changeable in the future** as all relationships will be using the old username as the key.

check info db in REPL

```sql
> INFO FOR DB;
[
  {
    "result": {
      "dl": {},
      "dt": {},
      "sc": {
        "allusers": "DEFINE SCOPE allusers SESSION 2w SIGNUP (CREATE type::thing(\"user\", string::lowercase(string::trim($user))) SET pass = crypto::argon2::generate($pass)) SIGNIN (SELECT * FROM type::thing(\"user\", string::lowercase(string::trim($user))) WHERE crypto::argon2::compare(pass, $pass))"
      },
      "tb": {
        "user": "DEFINE TABLE user SCHEMALESS PERMISSIONS NONE"
      }
    },
    "status": "OK",
    "time": "93.978µs"
  }
]

> SELECT * FROM user;
[
  {
    "result": [
      {
        "id": "user:tobie",
        "pass": "$argon2id$v=19$m=4096,t=3,p=1$oFQ8a4HFXjfaadQcOdPlLw$MZrA6mNvtvFLuQq1GGhfrGs4wk9iflhKT2rRsZLxwE4"
      }
    ],
    "status": "OK",
    "time": "125.017µs"
  }
]
```

## Test signin and signup with Javascript surrealdb.js integration

use following query from the client to **signup a new user**

```js
db.signup({
  NS: 'my_ns',
  DB: 'my_db',
  // We want to signup to the 'allusers' scope defined above
  SC: 'allusers',
  // We can add any variable here to use in the SIGNUP clause
  user: 'tobie',
  // We can add any variable here to use in the SIGNUP clause
  pass: 'some password',
  // We can add any variable here to use in the SIGNUP clause
  marketing: true,
  // We can add any variable here to use in the SIGNUP clause
  tags: ['rust', 'golang', 'javascript'],
});
```

you should receive a jwt token for ex

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjQyMjQxMjEsIm5iZiI6MTY2NDIyNDEyMSwiZXhwIjoxNjY1NDMzNzIxLCJpc3MiOiJTdXJyZWFsREIiLCJucyI6InRlc3QiLCJkYiI6InRlc3QiLCJzYyI6ImFsbHVzZXJzIiwiaWQiOiJ1c2VyOmQ4dzR4aHZtY2hxcHh6enl5ZjUyIn0.TWjIEm8z2TeuE27uJ9MvgfCELvOT0hC6e8vlOPUNJMx-lvxYXIYgXXcibdVxEWNQqnXu1gaUOus4KgjsWaUD-A
```

and **signin an existing user**

```js
db.signin({
  NS: 'my_ns',
  DB: 'my_db',
  // We want to signup to the 'allusers' scope defined above
  SC: 'allusers',
  // We can add any variable here to use in the SIGNUP clause
  user: 'tobie',
  // We can add any variable here to use in the SIGNUP clause
  pass: 'some password',
});
```

you should receive a jwt token for ex

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjQyMjQxNjMsIm5iZiI6MTY2NDIyNDE2MywiZXhwIjoxNjY1NDMzNzYzLCJpc3MiOiJTdXJyZWFsREIiLCJucyI6InRlc3QiLCJkYiI6InRlc3QiLCJzYyI6ImFsbHVzZXJzIiwiaWQiOiJ1c2VyOmQ4dzR4aHZtY2hxcHh6enl5ZjUyIn0.kKx_WShYBf9T_sCa_pRldHTG9LyfIx-4q0V4sz2kKzxSG4b_okG-MddTwdqHnsdS7rEJxZ-Gp-iP4cpgo77kqQ
```
