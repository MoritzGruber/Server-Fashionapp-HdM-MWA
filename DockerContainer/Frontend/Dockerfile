FROM ubuntu:latest
MAINTAINER moritzgruber@yahoo.de

RUN apt-get update
RUN apt-get install -y nodejs nodejs-legacy npm
RUN npm install -g http-server
RUN apt-get clean

COPY . /src

WORKDIR src/

CMD ["http-server", "app", "-p", "8000", "-c-1", "-s"]

