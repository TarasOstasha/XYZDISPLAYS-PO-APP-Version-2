const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function downloadFolderFromFTP(ftpConfig, remoteFolder, localFolder) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access(ftpConfig);
        console.log(`Connected to FTP server at ${ftpConfig.host}`);

        // Ensure the local folder exists
        if (!fs.existsSync(localFolder)) {
            fs.mkdirSync(localFolder, { recursive: true });
        }

        // Download each file in the remote folder
        const folderContents = await client.list(remoteFolder);
        for (const file of folderContents) {
            const localFilePath = path.join(localFolder, file.name);
            const remoteFilePath = `${remoteFolder}/${file.name}`;
            
            if (file.isDirectory) {
                // Recursively download sub-folders
                await downloadFolderFromFTP(ftpConfig, remoteFilePath, localFilePath);
            } else {
                console.log(`Downloading ${remoteFilePath} to ${localFilePath}`);
                await client.downloadTo(localFilePath, remoteFilePath);
            }
        }
        console.log("Folder downloaded successfully!");
    } catch (error) {
        console.error("Error downloading folder from FTP:", error);
        throw error;
    } finally {
        client.close();
    }
}

module.exports = {
    downloadFolderFromFTP
};
