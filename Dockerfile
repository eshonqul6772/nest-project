FROM node:18-alpine

# Workdir yaratish
WORKDIR /app

# Dependencies o'rnatish
COPY package.json package-lock.json ./
RUN npm install --only=production

# Kodni nusxalash
COPY . .

# Portni ochish
EXPOSE 3000

# NestJS serverini ishga tushirish
CMD ["npm", "run", "start:prod"]
