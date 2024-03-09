FROM node:20

# Working directory
WORKDIR ./src

# Copy package.json files
COPY package*.json ./

# Install deps
RUN npm install

# Copy source files
COPY . .

# Build
RUN npm run build

# Expose the api port
EXPOSE 4000

CMD ["node", "build/index.js"]