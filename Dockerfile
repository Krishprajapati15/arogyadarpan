# 1. Use official Node image
FROM node:18-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Set environment to production
ENV NODE_ENV production

# 7. Expose the port your app will run on
EXPOSE 1355

# 8. Start the app
CMD ["npm", "start"]
