# CRUD API
Simple CRUD API using in-memory database underneath

## How to start
1. Fork this repository
2. Init project (use Node **v.18+**)
3. Create .env file with PORT value. Example: `PORT=3000` or rename `.env.example` file.

`npm run start:dev` - run app in development mode

`npm run start:prod` - run app in production mode (script starts the build process and then runs the bundled file)

`npm run start:multi` - run app with horizontal scaling and load balancer

`npm run test` - run jest tests

## Implementation details
App supports 'GET', 'POST', 'PUT', 'DELETE' methods and `api/users` endpoint.

- **GET** `api/users` is used to get all persons
    - Server answers with `status code` **200** and all users records
- **GET** `api/users/{userId}` 
    - Server answers with `status code` **200** and record with `id === userId` if it exists
    - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server answers with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
    - Server answers with `status code` **201** and newly created record
    - Server answers with `status code` **400** and corresponding message if request `body` does not contain **required** fields
> Request body must have following properties:
>    - `username` — user's name (`string`)
>    - `age` — user's age (`number`)
>    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, if you don't specify it, an empty array will be substituted)
- **PUT** `api/users/{userId}` is used to update existing user
    - Server answers with` status code` **200** and updated record
    - Server answers with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server answers with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **DELETE** `api/users/{userId}` is used to delete existing user from database
    - Server answers with `status code` **204** if the record is found and deleted
    - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server answers with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

### Multi-mode
Use `npm run start:multi` and wait for the app to launch.

Example console output:
```
> CRUD API@1.0.0 start:multi
> ts-node src/multi/index.ts

Master 14020 is running
Starting 12 forks...
Child process with DB 15704 forked
Load balancer running on port: 4000
Server 10596 running on port: 4004
Server 2984 running on port: 4008
Server 7008 running on port: 4009
Server 4208 running on port: 4005
Server 13332 running on port: 4006
Server 10144 running on port: 4001
Server 7412 running on port: 4002
Server 17028 running on port: 4011
Server 9260 running on port: 4012
Server 15188 running on port: 4007
Server 16516 running on port: 4010
Server 7860 running on port: 4003
```

Use API as usual with the port specified in env. Watch Process-Id in Response Headers or messages in console.

Example console output:
```
> CRUD API@1.0.0 start:multi
> ts-node src/multi/index.ts

Master 14020 is running
Starting 12 forks...
Child process with DB 15704 forked
Load balancer running on port: 4000
Server 10596 running on port: 4004
Server 2984 running on port: 4008
Server 7008 running on port: 4009
Server 4208 running on port: 4005
Server 13332 running on port: 4006
Server 10144 running on port: 4001
Server 7412 running on port: 4002
Server 17028 running on port: 4011
Server 9260 running on port: 4012
Server 15188 running on port: 4007
Server 16516 running on port: 4010
Server 7860 running on port: 4003
DB has message from worker 10144: method - GET, url - /api/users, body -
Worker 10144 has message from DB: statusCode - 200, headers - {"Content-Type":"application/json"}, body - []
DB has message from worker 7412: method - POST, url - /api/users, body - {
    "age": 22,
    "username": "Pavel2",
    "hobbies": []
}
Worker 7412 has message from DB: statusCode - 201, headers - {"Content-Type":"application/json"}, body - {"age":22,"username":"Pavel2","hobbies":[],"id":"0d6b9e8d-a224-4679-87d3-c34030a255b9"}
DB has message from worker 7860: method - GET, url - /api/users, body -
Worker 7860 has message from DB: statusCode - 200, headers - {"Content-Type":"application/json"}, body - [{"age":22,"username":"Pavel2","hobbies":[],"id":"0d6b9e8d-a224-4679-87d3-c34030a255b9"
}]
```

### If you find a bug please let me know [Linkedin](https://www.linkedin.com/in/sergey-sudakov-dev/). Thank you!
