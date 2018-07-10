const http = require("http");
const app = require("./src/app");

http.createServer(app).listen(process.env.PORT);
