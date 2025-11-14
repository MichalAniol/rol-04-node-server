const chokidar = require('chokidar');
let app = require('./prod/index.js');

// Start początkowy
app.init()
app.startServer()