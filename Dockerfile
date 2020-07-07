# This file is a template, and might need editing before it works on your project.
FROM node:lts

# Uncomment if use of `process.dlopen` is necessary
# apk add --no-cache libc6-compat

ENV PORT 4142
EXPOSE 4142
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .

CMD [ "yarn", "start" ]
