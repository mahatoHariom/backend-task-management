# Use Node.js LTS as base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the application port
EXPOSE 9000

# Start the application
CMD ["npm", "run", "start"]
