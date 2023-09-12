FROM node:19
RUN apt-get update
RUN apt-get install openssh-server sudo vim -y
ENTRYPOINT service ssh start && bash
WORKDIR /workspace
#VOLUME [".:/workspace"]
#USER nodejs

COPY src/package.json /workspace/src/package.json
COPY src/package-lock.json /workspace/src/package-lock.json

WORKDIR /workspace/src
RUN npm install

COPY src/client/package.json /workspace/src/client/package.json
COPY src/client/package-lock.json /workspace/src/client/package-lock.json

WORKDIR /workspace/src/client/
RUN npm install
RUN apt-get -y install python
RUN apt-get -y install pip
RUN pip install openai
WORKDIR /workspace