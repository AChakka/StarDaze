const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const User = require('./user');
const email = 'anotherexample@gmail.com';
// Connect to MongoDB
mongoose.connect('mongodb+srv://sagniks:12345@hacknc2024.coa7s.mongodb.net/user_login_data?retryWrites=true&w=majority&appName=HackNC2024', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
        res.writeHead(204, getCORSHeaders());
        res.end();
        return;
    }

    if (path === '/login' && method === 'POST') {
        let body = '';

        // Collect the data from the request
        req.on('data', chunk => {
            body += chunk;
        });

        // Once all data is received
        req.on('end', async () => {
            try {
                const { email, password } = JSON.parse(body);

                // Find the user by email
                const user = await User.findOne({ email });

                if (!user) {
                    res.writeHead(400, { 'Content-Type': 'application/json', ...getCORSHeaders() });
                    res.end(JSON.stringify({ error: 'Invalid .' }));
                    return;
                }

                // Check if the password matches
                const isMatch = await user.isValidPassword(password);

                if (!isMatch) {
                    res.writeHead(400, { 'Content-Type': 'application/json', ...getCORSHeaders() });
                    res.end(JSON.stringify({ error: 'Invalid email or password.' }));
                    return;
                }

                // Authentication successful
                res.writeHead(200, { 'Content-Type': 'application/json', ...getCORSHeaders() });
                res.end(JSON.stringify({ message: 'Login successful!' }));
            } catch (error) {
                console.error('Login error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json', ...getCORSHeaders() });
                res.end(JSON.stringify({ error: 'Server error.' }));
            }
        });
    } else {
        // Handle 404 Not Found
        res.writeHead(404, { 'Content-Type': 'application/json', ...getCORSHeaders() });
        res.end(JSON.stringify({ error: 'Not found.' }));
    }
});

// Helper function to get CORS headers
function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend URL in production
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});