# Use a Windows Server Core image with Node.js
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install PowerShell
RUN powershell -Command Install-Module -Name PSReadLine -Force -SkipPublisherCheck

# Set working directory
WORKDIR /app

# Copy files to the container
COPY . .

# Install Node.js (if needed)
RUN powershell -Command Invoke-WebRequest -Uri https://nodejs.org/dist/v18.15.0/node-v18.15.0-x64.msi -OutFile node.msi; \
    Start-Process msiexec.exe -ArgumentList '/i', 'node.msi', '/quiet' -NoNewWindow -Wait; \
    Remove-Item -Force node.msi

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
