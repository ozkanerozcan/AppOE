
// when using Vue Router "history" mode
/*
const express = require("express"),
  serveStatic = require("serve-static"),
  history = require("connect-history-api-fallback"),
  port = process.env.PORT || 9200;

const app = express();
var ip = require("ip");

app.use(history());
app.use(serveStatic("../dist/pwa", { index: ["index.html", "index.htm"] }));
app.listen(port);
console.log("Server running", port, ip.address());
*/

// when using default Vue Router "hash" mode
/*
 const express = require("express"),
   serveStatic = require("serve-static"),
   port = process.env.PORT || 3000;

 const app = express();

 var ip = require("ip");

 app.use(serveStatic("dist/pwa", { index: ["index.html", "index.htm"] }));
 app.listen(port);

 console.log("Server running", port, ip.address());
*/


const express = require("express"),
  serveStatic = require("serve-static"),
  history = require("connect-history-api-fallback"),
  port = process.env.PORT || 9200;

const https = require('https');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
var ip = require("ip");

// Path to SSL certificate and key files
const sslOptions = {
  key: fs.readFileSync('../ssl/server.key'),
  cert: fs.readFileSync('../ssl/server.cert')
};

app.use(history());
app.use(serveStatic("../dist/pwa", { index: ["index.html", "index.htm"] }));


// Create HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log("Server running", port, ip.address());
});


