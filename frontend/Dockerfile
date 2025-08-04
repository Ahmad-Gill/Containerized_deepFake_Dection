# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies (copy package first for caching)
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start React dev server (overwritten by `command` in compose)
CMD ["npm", "start"]
