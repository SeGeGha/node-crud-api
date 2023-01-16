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
>    - `name` — user's name (`string`)
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
Master 71860 is running
Starting 12 forks...
Child process with DB 71871 forked
Load balancer running on port: 4000
Server 71877 running on port: 4001
Server 71914 running on port: 4006
Server 71903 running on port: 4005
Server 71980 running on port: 4012
Server 71885 running on port: 4003
Server 71935 running on port: 4008
Server 71975 running on port: 4011
Server 71897 running on port: 4004
Server 71953 running on port: 4009
Server 71878 running on port: 4002
Server 71955 running on port: 4010
Server 71928 running on port: 4007
```

Use API as usual with the port specified in env. Watch Process-Id in Response Headers or messages in console.

Example console output:
```
Master 72356 is running
Starting 12 forks...
Child process with DB 72367 forked
Load balancer running on port: 4000
Server 72379 running on port: 4002
Server 72404 running on port: 4005
Server 72459 running on port: 4010
Server 72393 running on port: 4004
Server 72485 running on port: 4012
Server 72373 running on port: 4001
Server 72415 running on port: 4006
Server 72432 running on port: 4008
Server 72386 running on port: 4003
Server 72425 running on port: 4007
Server 72447 running on port: 4009
Server 72470 running on port: 4011
DB has message from worker 72373: method - GET, url - /api/users, body - 
Worker 72373 has message from DB: statusCode - 200, headers - {"Content-Type":"application/json"}, body - []
DB has message from worker 72379: method - GET, url - /api/users/invalid-id, body - 
Worker 72379 has message from DB: statusCode - 400, headers - {"Content-Type":"application/json"}, body - {"message":"User id is not valid. Id: invalid-id"}
DB has message from worker 72386: method - GET, url - /api/users/d369c944-5694-46f4-a37e-f0026b4cc8fe, body - 
Worker 72386 has message from DB: statusCode - 404, headers - {"Content-Type":"application/json"}, body - {"message":"User with specified id was not found. Id: d369c944-5694-46f4-a37e-f0026b4cc8fe"}
```

### If you find a bug please let me know [Linkedin](https://www.linkedin.com/in/sergey-sudakov-dev/). Thank you!
