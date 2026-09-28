const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '../version.json');

// Get current version
module.exports.getVersion = async (req, res, next) => {
    try {
        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        res.status(200).json(versionData);
    } catch (error) {
        console.error("Error reading version:", error);
        res.status(500).json({ message: "Error reading version", error: error.message });
    }
};

// Update version (increment patch version)
module.exports.updateVersion = () => {
    try {
        const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        const versionParts = versionData.version.split('.');
        
        // Increment patch version (e.g., 1.0.0 -> 1.0.1)
        versionParts[2] = parseInt(versionParts[2]) + 1;
        
        const newVersion = versionParts.join('.');
        const updatedData = {
            version: newVersion,
            lastUpdated: new Date().toISOString()
        };
        
        fs.writeFileSync(versionFilePath, JSON.stringify(updatedData, null, 2));
        console.log(`Version updated to ${newVersion}`);
        
        return updatedData;
    } catch (error) {
        console.error("Error updating version:", error);
        return null;
    }
};
