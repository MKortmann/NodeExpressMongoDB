const http = require("http");

const todos = [
  { id: 1, text: "Todo One" },
  { id: 2, text: "Todo Two" },
  { id: 3, text: "Todo Three" }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  //the idea is to make a request and the request update the Node.js. We do not need to refresh the page.
  //look about the code 304 -> not modified
  // const { headers, url, method } = req;

  res.statusCode = 404;
  // res.setHeader("Content-Type", "text/html");
  // res.setHeader("Content-Type", "application/json");
  // res.setHeader("X-Powered-By", "Node.js");

  // res.write("<h1>Hello</h1>");
  // res.write("<h1>Hello Again</h1>");

  // console.log(req.headers.authorization);

  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();

      let status = 404;
      const response = {
        success: false,
        data: null,
        error: null
      };

      if (method === "GET" && url === "/todos") {
        status = 200;
        response.success = true;
        response.data = todos;
      } else if (method === "POST" && url === "/todos") {
        const { id, text } = JSON.parse(body);

        if (!id || !text) {
          status = 400;
          response.error = "please add id and text";
        } else {
          todos.push({ id, text });
          status = 201;
          response.success = true;
          response.data = todos;
        }
      }

      res.writeHead(status, {
        "Content-Type": "application/json",
        "X-Powered-By": "Node.js"
      });

      res.end(JSON.stringify(response));
    });

  // console.log(headers, url, method);
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
