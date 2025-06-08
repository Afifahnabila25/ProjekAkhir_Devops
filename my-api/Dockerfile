# Sesuaikan dengan teknologi backend kamu (PHP/Node.js/Python)
# Contoh untuk PHP:
FROM php:8.1-fpm-alpine
WORKDIR /var/www/html
COPY . .
RUN docker-php-ext-install mysqli pdo pdo_mysql
EXPOSE 9000
CMD ["php-fpm"]

# Atau jika Node.js:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
