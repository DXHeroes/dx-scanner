FROM node:12-slim

LABEL maintainer="Prokop Simek, Adéla Homolová"
LABEL "com.github.actions.name"="DX Scanner Action"
LABEL "com.github.actions.description"="Measure Developer Experience directly based on your source code. DX Scanner recommends practices that can help you with improving your product development."
LABEL "com.github.actions.icon"="user-check"
LABEL "com.github.actions.color"="green"

ENV DEBUG scanner

RUN apt-get update && apt-get install git -y --no-install-recommends

RUN yarn global add https://github.com/vlasy/dx-scanner#2d4dec7ae3a05ca5c75ab73858bb1a23366218c9

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
