# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Set API URL at build time
ARG REACT_APP_API_URL=https://titotest.co.uk/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]