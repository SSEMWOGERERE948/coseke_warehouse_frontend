# Step 1: Build stage
FROM node:20-slim as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the React app using `serve` on port 80
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy the build folder from the build stage to the final image
COPY --from=build /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose port 80
EXPOSE 3000

# Run the app using `serve` on port 80
CMD ["serve", "-s", "build", "-l", "3000"]
