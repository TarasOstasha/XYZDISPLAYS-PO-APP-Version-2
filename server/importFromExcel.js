const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(__dirname, 'utils', 'optionsData.xlsx');
const outputJsPath = path.join(__dirname, '..', 'client', 'src', 'utils', 'optionsData.js');

// Read Excel
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// Rebuild JS file
const jsContent = `export const OPTION_DATA = ${JSON.stringify(data, null, 2)};\n`;

fs.writeFileSync(outputJsPath, jsContent, 'utf-8');
console.log('optionsData.js updated from Excel.');
