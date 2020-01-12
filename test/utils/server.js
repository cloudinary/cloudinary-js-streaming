/**
 * This server is used to test the live streaming sdk
 * It serves test/index.html on port 9880
 * And shuts itself down on a GET request to '/stop'
 */

const express = require('express');
const path = require('path');
const port = 9880;
const root = path.resolve(__dirname, '..'); //the folder we're serving

let server;
let app = express();

app.use(express.static(root)); // Serve static files

/**
 * Shutdown server when getting request for /stop
 * Returns a text: 'closing server'.
 */
app.get('/stop', function (req, res) {
  res.send('closing server');
  console.log(`Closing server on http://localhost:${port}`);
  server.close();
});

server = app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
