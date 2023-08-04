FROM node:alpine AS development

WORKDIR /backend/src/app

COPY package*.json ./

RUN npm install 

#RUN npm run start:dev
RUN npm run build

COPY . .

#RUN npm run start:dev

EXPOSE 3000

CMD [ "node", "dist/main" ]

# FROM node:alpine AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /backend/src/app

# COPY --from=development /backend/src/app/ .

# EXPOSE 3000

# CMD [ "node", "dist/main" ]