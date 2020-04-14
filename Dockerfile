FROM ubuntu:18.04

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 12.16.1

RUN mkdir $NVM_DIR

# install all necessary ubuntu packages
RUN apt-get update && apt-get install -y  -q --no-install-recommends \
  curl \
  build-essential \
  libssl-dev \
  ca-certificates \
  git

# install nvm
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash

# install node and npm
RUN . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm i -g yarn \
  && node --version \
  && npm --version \
  && yarn --version

RUN yarn global add dx-scanner \
 && dx-scanner --version

RUN mkdir /usr/app
WORKDIR /usr/app

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh ../entrypoint.sh

RUN chmod +x ../entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["../entrypoint.sh"]
