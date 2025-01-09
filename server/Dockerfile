# Base Image
FROM node:18-alpine

# Install PowerShell dependencies (optional)
RUN apk add --no-cache \
    ca-certificates \
    wget \
    tar \
    icu-libs

# Download and install PowerShell (optional)
RUN wget -q https://github.com/PowerShell/PowerShell/releases/download/v7.2.7/powershell-7.2.7-linux-alpine-x64.tar.gz -O /tmp/powershell.tar.gz \
    && mkdir -p /opt/microsoft/powershell/7 \
    && tar zxf /tmp/powershell.tar.gz -C /opt/microsoft/powershell/7 \
    && chmod +x /opt/microsoft/powershell/7/pwsh \
    && ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Expose port 5000
EXPOSE 5000

CMD ["node", "index.js"]

# Start the server
# CMD ["npm", "run", "dev"]