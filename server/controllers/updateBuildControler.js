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

        // Download both client/build and server folders
        const downloadTasks = async () => {
            // Download client build folder (as before)
            const remoteBuildFolder = '/prod';
            const localBuildFolder = path.join(__dirname, '../../client/build');
            console.log('Downloading client build folder...');
            await downloadFolderFromFTP(ftpConfig, remoteBuildFolder, localBuildFolder);

            // Download server folder (excluding node_modules) - server is on same level as prod
            const remoteServerFolder = '/server';
            const localServerFolder = path.join(__dirname, '..');
            console.log('Downloading server folder (excluding node_modules)...');
            await downloadFolderFromFTP(ftpConfig, remoteServerFolder, localServerFolder, ['node_modules']);
            
            console.log("All downloads finished");
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
