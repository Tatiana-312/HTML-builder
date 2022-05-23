const fs = require('fs');
const asyncFs = require('fs').promises;
const path = require('path');
const { Transform } = require('stream');

function replaceMatch(name, path) {
  return new Transform({
    transform(chunk, encoding, callback) {
      fs.readFile(path, { encoding: 'utf-8'}, (err, data) => {
        callback(null, String(chunk).replace(name, data));
      });
    }
  });
}

fs.mkdir(path.join(__dirname, 'project-dist'), () => {
  const input = fs.createReadStream(path.join(__dirname, 'template.html'), { encoding: 'utf-8'});
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), { encoding: 'utf-8'});

  const replaceHeader = replaceMatch('{{header}}', path.join(__dirname, 'components','header.html'));
  const replaceArticles = replaceMatch('{{articles}}', path.join(__dirname, 'components','articles.html'));
  const replaceFooter = replaceMatch('{{footer}}', path.join(__dirname, 'components','footer.html'));
  const replaceAbout = replaceMatch('{{about}}', path.join(__dirname, 'components','about.html'));

  input.pipe(replaceHeader).pipe(replaceArticles).pipe(replaceFooter).pipe(replaceAbout).pipe(output);
});

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) {
    throw err;
  } else {
    files.reverse().forEach(file => {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile() && path.extname(file) === '.css') {
          const input = fs.createReadStream(path.join(__dirname, 'styles', file), { encoding: 'utf-8', flags: 'r' });
          const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), { encoding: 'utf-8', flags: 'a' });
          input.pipe(output);
        }
      });
    });
  }
});

async function copyDir(srcOrigDir, srcCopyDir) {
  await asyncFs.rm(srcCopyDir, { recursive: true, force: true });
  const entries = await asyncFs.readdir(srcOrigDir, { withFileTypes: true });
  await asyncFs.mkdir(srcCopyDir, { recursive: true });
  for(let entry of entries) {
    const srcOrigDirPath = path.join(srcOrigDir, entry.name);
    const srcCopyDirPath = path.join(srcCopyDir, entry.name);
    if(entry.isDirectory()) {
      await copyDir(srcOrigDirPath, srcCopyDirPath);
    } else {
      await asyncFs.copyFile(srcOrigDirPath, srcCopyDirPath);
    }
  }
}
  
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));