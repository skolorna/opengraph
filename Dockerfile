FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
# Chromium is already provided in the runtime
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
RUN yarn install --frozen-lockfile

ADD . ./
RUN yarn build

FROM zenika/alpine-chrome:with-node

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
RUN yarn install --frozen-lockfile --production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8000
ENTRYPOINT ["tini", "--"]
CMD ["yarn", "start"]
