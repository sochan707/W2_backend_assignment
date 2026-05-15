const http = require('http');

const server = http.createServer((req, res) => {
  res.write('Hello, World!');
  return res.end(); // change from endd() => end()
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
