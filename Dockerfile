FROM node:18.12.1

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "build"]
CMD ["npm", "start"]