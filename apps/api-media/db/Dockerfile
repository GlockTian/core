FROM node:16-alpine
WORKDIR /app
COPY ./tsconfig.base.json /app/tsconfig.base.json
COPY ./apps/api-media /app/apps/api-media

RUN npm install --silent arangojs@^7.6.1 ts-node@^10.9.1 tslib@^2.3.1
CMD npx ts-node /app/apps/api-media/db/seed.ts