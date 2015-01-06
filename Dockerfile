FROM node:0.10

RUN mkdir /app
ADD package.json /app/
WORKDIR /app
RUN npm install
ADD . /app

CMD ["npm", "start"]
