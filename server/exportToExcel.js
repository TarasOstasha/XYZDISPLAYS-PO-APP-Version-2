const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Path to your original JS data
const optionsPath = path.join(__dirname, '..', 'client', 'src', 'utils', 'optionsData.js');
const exportPath = path.join(__dirname, 'utils', 'optionsData.xlsx');

// 1. Load and eval the JS file
const raw = fs.readFileSync(optionsPath, 'utf-8');
const match = raw.match(/const OPTION_DATA = (\[.*\]);/s);
if (!match) throw new Error('Could not parse OPTION_DATA array');

const data = eval(match[1]); // ← Executes the JS array safely

// 2. Convert to worksheet and export
const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Options');

XLSX.writeFile(wb, exportPath);
console.log('Excel exported to optionsData.xlsx');
