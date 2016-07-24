# Fashionapp-HdM-MWA-backend
Backend / Server

We are using Docker Containers
## Running
Run the server with:
```
run ./start.sh
```
It just builds and runs our docker-compose.yml file, so look there for more details 
## Testing

For testing we use mocha.

Run the tests with:
```
run ./test.sh
```
Server should be alrady running when you start testing, because we are attaching to our running server with "docker exec" and run mocha
for details have a look in the script


## Ports

3000 == socket.io connection
27017 == mongo database
8081 == just a monitoring container, to have nice UI for the database

