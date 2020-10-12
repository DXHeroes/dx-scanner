FROM node:12.16-alpine

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh ../entrypoint.sh

RUN apk update && apk add  -q   \
  ca-certificates \
  git && \
  yarn global add dx-scanner \
  && dx-scanner --version && \
  mkdir /usr/app && \
  chmod +x ../entrypoint.sh

WORKDIR /usr/app

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["../entrypoint.sh"]
