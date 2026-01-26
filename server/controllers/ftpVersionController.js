const Client = require('basic-ftp').Client;

// Get version from FTP server
module.exports.getFTPVersion = async (req, res, next) => {
    const client = new Client();
    
    try {
        // Connect to FTP
        await client.access({
            host: 'ftp.tarasostasha.com',
            user: 'tonyjoss@tarasostasha.com',
            password: process.env.FTPPASSWORD,
            secure: false
        });
        
        console.log('Connected to FTP to check version');
        
        // Download version.json from FTP to memory
        const chunks = [];
        await client.downloadTo({
            write: (chunk) => chunks.push(chunk),
            close: () => {}
        }, '/server/version.json');
        
        // Parse the version data
        const versionData = JSON.parse(Buffer.concat(chunks).toString());
        
        console.log('FTP Version:', versionData.version);
        
        res.status(200).json(versionData);
        
    } catch (error) {
        console.error("Error reading version from FTP:", error);
        res.status(500).json({ 
            message: "Error reading version from FTP", 
            error: error.message 
        });
    } finally {
        client.close();
    }
};
