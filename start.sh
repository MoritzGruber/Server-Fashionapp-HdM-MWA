# Basic script to start the server
# We run build first to apply all changes otherwise docker would use data out of chache
docker-compose build
docker-compose up
