# Attatch to running node Container, run mocha
docker exec serverfashionapphdmmwa_node_1 npm install --global ava
docker exec serverfashionapphdmmwa_node_1 ava --init
docker exec serverfashionapphdmmwa_node_1 npm test
