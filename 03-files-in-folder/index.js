const fs = require('fs');
const path = require('path');
fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach(file => {
      fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          let fileSizeInBytes = stats.size / 1024;
          let fileExtension = (path.extname(file)).slice(1);
          console.log(`${file} - ${fileExtension} - ${fileSizeInBytes}kb`);
        }
      });
    });
  }
});