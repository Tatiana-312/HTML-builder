const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

fs.open(path.join(__dirname, 'text.txt'), 'w', (err) => {
  if(err) throw err;
});

stdout.write(
  'Пожалуйста введите текст\nДля выхода введите exit или ctrl + c\n'
);

stdin.on('data', chunk => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), chunk, err => {
      if (err) throw err;
    });
  }
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Пока!'));
