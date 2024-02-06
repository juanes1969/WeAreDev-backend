# Use the official Node.js 18 image as the base image
FROM node:18-alpine


# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Copy the rest of the app's source code to the container
COPY . .

RUN apk add make gcc g++ python3 && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python3


# Compile the TypeScript code to JavaScript
RUN npm run build

# Expose port 3000 for the app to listen on
EXPOSE 4000

# Start the app
CMD ["npm", "start"]