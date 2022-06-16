FROM node:16-slim

LABEL maintainer="Prokop Simek, Adéla Homolová"
LABEL "com.github.actions.name"="DX Scanner Action"
LABEL "com.github.actions.description"="Measure Developer Experience directly based on your source code. DX Scanner recommends practices that can help you with improving your product development."
LABEL "com.github.actions.icon"="user-check"
LABEL "com.github.actions.color"="green"

RUN yarn global add dx-scanner
RUN apt-get update && apt-get install git -y --no-install-recommends

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
