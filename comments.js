// Create web server
// Create a web server that listens on port 3000 and serves the comments.html file
// when someone visits http://localhost:3000/comments. The comments.html file
// should have a form that allows users to submit a comment. When a user submits
// a comment, the server should append the comment to a file called comments.txt.
// Each comment should appear on a new line in the file. If the file does not
// exist, it should be created. The server should respond with a 302 redirect
// back to the /comments URL.

const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const file = path.resolve(__dirname, 'comments.txt');

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (pathname === '/comments') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        fs.appendFile(file, body + '\n', err => {
          if (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
          } else {
            res.statusCode = 302;
            res.setHeader('Location', '/comments');
            res.end();
          }
        });
      });
    } else {
      fs.readFile(path.resolve(__dirname, 'comments.html'), (err, content) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        } else {
          res.setHeader('Content-Type', 'text/html');
          res.end(content);
        }
      });
    }
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});