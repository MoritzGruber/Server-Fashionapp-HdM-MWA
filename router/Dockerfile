FROM ubuntu:latest
MAINTAINER moritzgruber@yahoo.de

RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get clean
COPY conf/default /etc/nginx/sites-available/default
WORKDIR /

CMD ["nginx", "-g", "daemon off;"]

