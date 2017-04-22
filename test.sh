#!/usr/bin/env bash

docker exec serverfittshot_node_1 cp ./testFiles/1.jpg ./test/1.jpg
docker exec serverfittshot_node_1 npm test
