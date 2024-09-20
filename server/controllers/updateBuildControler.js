const path = require('path');
const { downloadFolderFromFTP } = require('../services/ftpService');

module.exports.updateBuildFolder = async (req, res, next) => {
    try {
        const ftpConfig = {
            host: 'ftp.tarasostasha.com',
            user: 'tonyjoss@tarasostasha.com',
            password: process.env.FTPPASSWORD,
            secure: false // Use true if you're using FTPS
        };

        const remoteFolder = '/'; //'/build';
        const localFolder = path.join(__dirname, '../../client/build'); // Path to your local build folder
        console.log(localFolder, '---BUILD FOLDER');
        // Download the folder from FTP
        await downloadFolderFromFTP(ftpConfig, remoteFolder, localFolder);

        res.status(200).json({ message: "Folder copied successfully!" });
    } catch (error) {
        console.error("Error copying folder:", error);
        res.status(500).json({ message: "Error copying folder", error: error.message });
    }
};


// TEST
// module.exports.updateBuildFolder = async (req, res, next) => {
//     try {
//         // For testing, just send a simple message instead of performing the FTP operation
//         res.status(200).json({ message: "Test message from backend!" });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: "Error in backend", error: error.message });
//     }
// };
