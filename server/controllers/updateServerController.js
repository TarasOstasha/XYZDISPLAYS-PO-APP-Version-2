const path = require('path');
const { downloadFolderFromFTP } = require('../services/ftpService');
const downloadState = require('../services/downloadState');

// update Back End the App
module.exports.updateServerFolder = async (req, res, next) => {
    try {
        const ftpConfig = {
            host: 'ftp.tarasostasha.com',
            user: 'tonyjoss@tarasostasha.com',
            password: process.env.FTPPASSWORD,
            secure: false
        };

        const remoteFolder = '/server';
        const localFolder = path.join(__dirname, '../../');
    

        // Reset download progress
        downloadState.downloaded = 0;
        downloadState.totalFiles = 0;
        downloadState.currentFile = '';
        downloadState.complete = false;

        downloadFolderFromFTP(ftpConfig, remoteFolder, localFolder)
            .then(() => console.log("Download finished"))
            .catch(err => console.error("Download error:", err));

        res.status(200).json({ message: "Download started..." });
    } catch (error) {
        console.error("Error copying folder:", error);
        res.status(500).json({ message: "Error copying folder", error: error.message });
    }
};