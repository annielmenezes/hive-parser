const express = require("express");
const HttpStatus = require("http-status-codes");
const { get } = require("axios");
const queryPart = require("./lib/helpers/query-part");

const app = express();

app.use((req, res, next) => {
  const { query } = req;

  if (!query) {
    res.status(HttpStatus.BAD_REQUEST).send({
      error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
    });
  } else {
    next();
  }
});

const handlerError = ({ response: { status } }, res) => {
  return res.status(status).send({
    message: HttpStatus.getStatusText(status)
  });
};

app.get("/:part", (req, res) => {
  const { query } = req;
  const { part } = req.params;

  get(query.url)
    .then(({ data }) => {
      queryPart(part, data)
        .then(retorno => res.send({ data: retorno }))
        .catch(err => handlerError(err, res));
    })
    .catch(err => handlerError(err, res));
});

module.exports = app;
