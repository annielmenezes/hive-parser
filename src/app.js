const express = require("express");
const HttpStatus = require("http-status-codes");
const { get } = require("axios");
const { parseString } = require("xml2js");
const podcastParser = require("./lib/parsers/podcast");
const episodeParser = require("./lib/parsers/episode");

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

app.get("/podcast", (req, res) => {
  const { query } = req;
  get(query.url)
    .then(({ data }) => {
      parseString(data, { trim: true, explicitArray: false }, (err, result) => {
        if (err) throw err;
        const { channel } = result.rss;
        delete channel.item;
        res.send({ data: podcastParser(channel) });
      });
    })
    .catch(err => {
      res.status(HttpStatus.BAD_GATEWAY).send({
        error: HttpStatus.getStatusText(HttpStatus.BAD_GATEWAY)
      });
    });
});

app.get("/episodes", (req, res) => {
  const { query } = req;
  get(query.url)
    .then(({ data }) => {
      parseString(data, { trim: true, explicitArray: false }, (err, result) => {
        if (err) throw err;
        const { item } = result.rss.channel;
        const episodes = item.map(episodeParser);

        res.send({ data: episodes });
      });
    })
    .catch(err => {
      res.status(HttpStatus.BAD_GATEWAY).send({
        error: HttpStatus.getStatusText(HttpStatus.BAD_GATEWAY)
      });
    });
});

module.exports = app;
