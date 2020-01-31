FROM node:lts
WORKDIR /usr/src/app
COPY package* ./
RUN npm install
EXPOSE 80
CMD [ "./bin/hubot", "-a", "discord" ]
