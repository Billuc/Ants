FROM node:17 as base

WORKDIR /app
# Installing Angular CLI
RUN npm install -g @angular/cli

FROM base as angular

ENTRYPOINT [ "/bin/bash" ]