FROM node:16
WORKDIR '/usr/survey-3-api'
COPY package.json .
RUN npm install --omit=dev
COPY . .
RUN npm run build
EXPOSE 5000
CMD npm start