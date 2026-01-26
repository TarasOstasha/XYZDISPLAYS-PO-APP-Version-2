const path = require('path');
const { downloadFolderFromFTP } = require('../services/ftpService');
const downloadState = require('../services/downloadState');
const { updateVersion } = require('./versionController');


// update Front End the App
module.exports.updateBuildFolder = async (req, res, next) => {
    try {
        const ftpConfig = {
            host: 'ftp.tarasostasha.com',
            user: 'tonyjoss@tarasostasha.com',
            password: process.env.FTPPASSWORD,
            secure: false
        };

        // Reset download progress
        downloadState.downloaded = 0;
        downloadState.totalFiles = 0;
        downloadState.currentFile = '';
        downloadState.complete = false;

        // Download both client/build and version.json
        const downloadTasks = async () => {
            const Client = require('basic-ftp').Client;
            const ftpClient = new Client();
            
            try {
                await ftpClient.access(ftpConfig);
                
                // Download client build folder
                const remoteBuildFolder = '/prod';
                const localBuildFolder = path.join(__dirname, '../../client/build');
                console.log('Downloading client build folder from FTP...');
                await downloadFolderFromFTP(ftpConfig, remoteBuildFolder, localBuildFolder);
                console.log('✅ Client build folder downloaded');

                // Download ONLY version.json from server folder
                const remoteVersionFile = '/server/version.json';
                const localVersionFile = path.join(__dirname, '../version.json');
                console.log('Downloading version.json from FTP...');
                await ftpClient.downloadTo(localVersionFile, remoteVersionFile);
                console.log('✅ version.json downloaded and updated');
                
                await ftpClient.close();
                console.log("All downloads finished successfully!");
            } catch (error) {
                console.error("Download error:", error);
                await ftpClient.close();
                throw error;
            }
        };

        downloadTasks()
            .then(() => {
                console.log("Download finished successfully!");
                console.log("Version.json has been updated from FTP server");
                // Mark download as complete
                downloadState.complete = true;
            })
            .catch(err => console.error("Download error:", err));

        res.status(200).json({ message: "Download started..." });
    } catch (error) {
        console.error("Error copying folder:", error);
        res.status(500).json({ message: "Error copying folder", error: error.message });
    }
};
