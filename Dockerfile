FROM node:22.11.0

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY bin/ bin/
COPY src/ src/
COPY test/ test/
COPY index.html index.html

RUN npm install

EXPOSE 5173

ENTRYPOINT npm start
