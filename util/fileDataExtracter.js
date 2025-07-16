const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('moment')


const fileExtractData = (filePath) => {


    const absolutePath = path.resolve(filePath);
    const workbook = xlsx.readFile(absolutePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    return jsonData;
}


const convertJSONtoXLS = (fileName, jsonData) => {
    // Convert JSON to worksheet
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // Create a new workbook and append the worksheet
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Folder where Excel will be saved

    const exportFolder = path.join(__dirname, '../export/');

    // Create folder if it doesn't exist
    if (!fs.existsSync(exportFolder)) {
        fs.mkdirSync(exportFolder);
    }

    let filePath = "";

    if (fileName === 'UPLOAD') {
        filePath = path.join(exportFolder, `${fileName}-${moment(new Date).format('DD-MM-yyyy hh:mm')}.csv`);

    } else {
        filePath = path.join(exportFolder, `${fileName}-${moment(new Date).format('DD-MM-yyyy hh:mm')}.xlsx`);

    }
    // File path for Excel

    // Write workbook to file
    xlsx.writeFile(workbook, filePath);

    console.log(`✅ Excel file has been saved to ${filePath}`);

}

module.exports = {
    fileExtractData,
    convertJSONtoXLS
}