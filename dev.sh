
docker-compose build --no-cache node
docker-compose up
sleep 3
docker exec serverfashionapphdmmwa_node_1 cp ./testFiles/1.jpg ./test/1.jpg
docker exec serverfashionapphdmmwa_node_1 npm test -- --watch
