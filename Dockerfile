FROM node:16.10-alpine

RUN apk update && apk add  -q \
 ca-certificates \
 git

RUN yarn global add dx-scanner \
 && dx-scanner --version

RUN mkdir /usr/app
WORKDIR /usr/app

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /usr/app/entrypoint.sh

RUN chmod +x /usr/app/entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/usr/app/entrypoint.sh"]
