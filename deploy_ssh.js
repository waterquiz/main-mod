const { Client } = require('ssh2');

const conn = new Client();
const cmds = `
cd /root/main-mod
git fetch origin main
git reset --hard origin/main
npm install
npm run build
pm2 restart all
`;

console.log('Connecting to server...');

conn.on('ready', () => {
  console.log('Client :: ready');
  console.log('Executing deployment commands...');
  
  conn.exec(cmds, (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '157.245.99.129',
  port: 22,
  username: 'root',
  password: 'fRaz128aaa'
});

conn.on('error', (err) => {
  console.error('Connection Error:', err);
});
