FROM eu.gcr.io/pryvio/base:1.7.0 as build-stage
LABEL "Tech@Pryv" <tech@pryv.com>
WORKDIR /app
COPY ./package.json ./
RUN npm ci
COPY ./ .
RUN just build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
