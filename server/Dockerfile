FROM node:24

WORKDIR /usr/src/app
COPY . .
RUN npm install

RUN npm run generate
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npm start"]
