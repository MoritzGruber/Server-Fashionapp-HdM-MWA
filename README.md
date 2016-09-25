#Fashionapp-HdM-MWA-backend
Backend / Server

We are using Docker Containers
##Running
Run the server with:
```
run ./start.sh
```
It just builds and runs our docker-compose.yml file, so look there for more details 
##Testing

For testing we use mocha.js

Run the tests with:
```
run ./test.sh
```
Server should be already running when you start testing, because we are attaching to our running server with "docker exec" and run mocha inside,
for details have a look in the script


##Ports
  - 3000 == socket.io connection
  - 27017 == mongo database
  - 8081 == just a monitoring container, to have nice UI for the database

##Hint:
Since we don't have a addend phonenumber identification yet, we use the username as unique identifier, late there will be 2 users with the same.
For now the phonenumber field/identifier will be filled with username. so we don't have to change the database model later

##Programming Team: 
  - Christoph Muth
  - Sylwia Calka
  - Moritz Gruber

##Mentors: 
  - Ansgar Gerlicher
  - Fankhauser Thomas