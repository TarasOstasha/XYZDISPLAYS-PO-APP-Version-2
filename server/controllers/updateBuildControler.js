const path = require('path');
const { downloadFolderFromFTP } = require('../services/ftpService');
const downloadState = require('../services/downloadState');

// module.exports.updateBuildFolder = async (req, res, next) => {
//     try {
//         const ftpConfig = {
//             host: 'ftp.tarasostasha.com',
//             user: 'tonyjoss@tarasostasha.com',
//             password: process.env.FTPPASSWORD,
//             secure: false // Use true if you're using FTPS
//         };

//         const remoteFolder = '/prod'; //'/build';
//         const localFolder = path.join(__dirname, '../../client/build'); // Path to your local build folder
//         console.log(localFolder, '---BUILD FOLDER');
//         // Download the folder from FTP
//         await downloadFolderFromFTP(ftpConfig, remoteFolder, localFolder);

//         res.status(200).json({ message: "Folder copied successfully!" });
//     } catch (error) {
//         console.error("Error copying folder:", error);
//         res.status(500).json({ message: "Error copying folder", error: error.message });
//     }
// };



module.exports.updateBuildFolder = async (req, res, next) => {
    try {
        const ftpConfig = {
            host: 'ftp.tarasostasha.com',
            user: 'tonyjoss@tarasostasha.com',
            password: process.env.FTPPASSWORD,
            secure: false
        };

        const remoteFolder = '/prod';
        const localFolder = path.join(__dirname, '../../client/build');

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

