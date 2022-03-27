FROM node:17 as base

WORKDIR /app
# Installing Angular CLI
RUN npm install -g @angular/cli

FROM base as angular

COPY ./app/Ants/package.json ./package.json
COPY ./app/Ants/package-lock.json ./package-lock.json
RUN npm install

FROM angular as app_ready

ENTRYPOINT [ "ng", "serve", "--host", "0.0.0.0", "--poll=2000" ]