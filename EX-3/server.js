// server.js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to the Home Page');
    }

    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
        return;
    }

    if (url === '/contact' && method === 'POST') {
        // Implement form submission handling
        const body = [];

        req.on('data', chunk => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedData = new URLSearchParams(
                Buffer.concat(body).toString()
            );

            const name = parsedData.get('name');

            console.log('Submitted name:', name);

            if (!name || name.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                return res.end(`
                    <h1>Error</h1>
                    <p>Name cannot be empty.</p>
                    <a href="/contact">Go back</a>
                `);
            }

            fs.appendFile('submissions.txt', name + '\n', err => {
                if (err) {
                    console.error('File write error:', err);

                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    return res.end(`
                        <h1>Server error</h1>
                        <p>Could not save your submission.</p>
                        <a href="/contact">Try again</a>
                    `);
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>Thank you, ${name}!</h1>
                    <p>Submission received.</p>
                    <a href="/contact">Submit again</a>
                `);
            });
        });

        req.on('error', err => {
            console.error('Request error:', err);

            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>Request error</h1>');
        });

        return;
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
