# Step 1: Build stage
FROM node:18-slim as build 
# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean npm cache
RUN npm cache clean --force

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build  # Fix OpenSSL error

# Step 2: Serve the React app using `serve` on port 80
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the build folder from the build stage to the final image
COPY --from=build /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Run the app using `serve` on port 80
CMD ["serve", "-s", "build", "-l", "80"]
