const net = require('net');

const port = process.env.PORT ? process.env.PORT - 100 : 3000;
const client = new net.Socket();

let startedElectron = false;
const tryConnection = () =>
  client.connect({ port }, () => {
    client.end();
    if (!startedElectron) {
      console.log('Starting electron');
      startedElectron = true;
      // eslint-disable-next-line
      const exec = require('child_process').exec;
      exec('npm run electron');
    }
  });

tryConnection();

client.on('error', () => {
  setTimeout(tryConnection, 1000);
});
