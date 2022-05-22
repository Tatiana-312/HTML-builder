const fs = require('fs').promises;
const path = require('path');

async function copyDir(srcOrigDir, srcCopyDir) {
  await fs.rm(srcCopyDir, { recursive: true, force: true });
  const entries = await fs.readdir(srcOrigDir, { withFileTypes: true });
  await fs.mkdir(srcCopyDir, { recursive: true });
  for(let entry of entries) {
    const srcOrigDirPath = path.join(srcOrigDir, entry.name);
    const srcCopyDirPath = path.join(srcCopyDir, entry.name);
    if(entry.isDirectory()) {
      await copyDir(srcOrigDirPath, srcCopyDirPath);
    } else {
      await fs.copyFile(srcOrigDirPath, srcCopyDirPath);
    }
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));