FROM  node:16-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run config  && npm run build

FROM nginx:1.17.5
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=builder  /app/dist/web-client /usr/share/nginx/html
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
