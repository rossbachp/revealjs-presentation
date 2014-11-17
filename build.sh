#!/bin/bash
DECK=presentation
TAG_RELEASE=0.5.0
DOCKER_USER=rossbachp
docker build -t="${DOCKER_USER}/$DECK" .
DATE=`date +'%Y%m%d%H%M'`
ID=$(docker inspect -f "{{.Id}}" ${DOCKER_USER}/$DECK)
docker tag $ID ${DOCKER_USER}/$DECK:$DATE
docker tag $ID ${DOCKER_USER}/$DECK:$TAG_RELEASE

#docker login
#docker push ${DOCKER_USER}/$DECK:latest
#docker push ${DOCKER_USER}/$DECK:$DATE
#docker push ${DOCKER_USER}/$DECK:$TAG_RELEASE
