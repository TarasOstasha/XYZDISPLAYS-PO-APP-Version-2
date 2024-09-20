# Base Image
FROM --platform=linux/amd64 node:14-alpine

# Install PowerShell dependencies
RUN apk add --no-cache \
    ca-certificates \
    wget \
    tar \
    icu-libs

# Download and install PowerShell
RUN wget -q https://github.com/PowerShell/PowerShell/releases/download/v7.2.7/powershell-7.2.7-linux-alpine-x64.tar.gz -O /tmp/powershell.tar.gz \
    && mkdir -p /opt/microsoft/powershell/7 \
    && tar zxf /tmp/powershell.tar.gz -C /opt/microsoft/powershell/7 \
    && chmod +x /opt/microsoft/powershell/7/pwsh \
    && ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh


# Set the working directory inside the container
WORKDIR /app

# Install dependencies
RUN npm install

# Copy all other project files from the root server folder to the container
COPY / .

# Expose the port the application will run on
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]

