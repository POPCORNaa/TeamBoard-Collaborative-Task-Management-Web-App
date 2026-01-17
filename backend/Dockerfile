# Use Node.js LTS version (Alpine lightweight image)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the backend server with OpenTelemetry instrumentation
CMD ["node", "--import", "./src/instrumentation.js", "src/index.js"]