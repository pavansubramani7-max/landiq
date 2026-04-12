FROM node:18-alpine AS build
WORKDIR /app
ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
COPY package.json ./
RUN npm install --legacy-peer-deps && npm install ajv@^8.0.0 --legacy-peer-deps
COPY . .
ENV CI=false
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
