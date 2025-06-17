const path = require('path');
const downloadState = require('../services/downloadState');



module.exports.progressBuildFolder = async (req, res) => {
    try {
       res.status(200).json(downloadState); 
    } catch (error) {
        console.error("Error proggres folder:", error);
        res.status(500).json({ message: "Error proggres folder", error: error.message });
    }
}