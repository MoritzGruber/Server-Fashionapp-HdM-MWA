# Attatch to running node Container, install mocha, run mocha test
docker exec serverfashionapphdmmwa_node_1 npm install mocha -g
docker exec serverfashionapphdmmwa_node_1 mocha
