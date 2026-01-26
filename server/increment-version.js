const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, 'version.json');

try {
    // Read current version
    const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
    const currentVersion = versionData.version;
    
    // Parse version parts (e.g., "1.0.0" -> [1, 0, 0])
    const versionParts = currentVersion.split('.').map(part => parseInt(part, 10));
    
    // Increment patch version (last number)
    versionParts[2] = versionParts[2] + 1;
    
    // Create new version string
    const newVersion = versionParts.join('.');
    
    // Update version data
    const updatedData = {
        version: newVersion,
        lastUpdated: new Date().toISOString()
    };
    
    // Write back to file
    fs.writeFileSync(versionFilePath, JSON.stringify(updatedData, null, 2));
    
    console.log('✅ Version updated successfully!');
    console.log(`   ${currentVersion} → ${newVersion}`);
    console.log(`   Updated at: ${updatedData.lastUpdated}`);
    
} catch (error) {
    console.error('❌ Error updating version:', error.message);
    process.exit(1);
}
