const fs = require('fs');

function readFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return fileContent;
  } catch (error) {
    // Handle the error if the file is not found
    if (error.code === 'ENOENT') {
      return null;
    // Handle other types of errors
    } else {
      throw error;
    }
  }
}

module.exports = {
  readFile
}
