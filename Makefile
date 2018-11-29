# Adapted from clarin-eric/docker-nginx-base
# See https://github.com/clarin-eric/docker-nginx-base/blob/master/Makefile

STATUS="-dev"
#STATUS="-pro"
VERSION="0.2${STATUS}"
NAME="clauszinn/jackthesipper"
REPOSITORY="hub.docker.com"
#IMAGE_NAME="${REPOSITORY}/${NAME}:${VERSION}"
IMAGE_NAME="${NAME}:${VERSION}"

all: buildImage

buildImage:
	docker build -t ${IMAGE_NAME} -f docker/Dockerfile . #--no-cache

push:
	docker push ${IMAGE_NAME}
