const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

stdout.write(
  'Пожалуйста введите текст\nДля выхода введите exit или ctrl + c\n'
);

let data = '';
stdin.on('data', chunk => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    data += chunk;
    const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
    output.write(data);
  }
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Пока!'));
