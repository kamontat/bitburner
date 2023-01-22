const http = require("http");
const path = require("path");
const fs = require("fs");

const token = "IBL/fPjJko/JSOE3jDpBLfwDuHcSXJaq9/V/Dfmqx5X/0Tbzb9EP5LbBObYuaPMR";
const directory = path.resolve(__dirname, "..", "lib");

/** @type {http.RequestOptions} */
const requestOption = {
  method: "POST",
  protocol: "http:",
  host: "127.0.0.1",
  port: 9990,
  path: "/",
};

function upload(filename) {
  return new Promise(resolve => {
    const filepath = path.resolve(directory, filename);
    const content = fs.readFileSync(filepath, { encoding: "utf8" });
    const code = Buffer.from(content).toString("base64");

    const payload = JSON.stringify({
      filename,
      code,
    });

    requestOption.headers = {
      "Content-Type": "application/json",
      "Content-Length": payload.length,
      Authorization: `Bearer ${token}`,
    };

    const request = http.request(requestOption, res => {
      res.on("data", d => {
        const response = Buffer.from(d).toString();
        console.log(filename, res.statusCode, response);
        resolve();
      });
    });

    request.write(payload);
    request.end();
  });
}

fs.readdirSync(directory).forEach(upload);
