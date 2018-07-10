const express = require("express");
const HttpStatus = require("http-status-codes");
const { get } = require("axios");
const { parseString } = require("xml2js");
const { extractDomain } = require("../lib");

const app = express();

app.get("/podcast", (req, res) => {
  const { query } = req;
  if (!query) {
    res.status(HttpStatus.BAD_REQUEST).send({
      error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
    });
  } else {
    get(query.url)
      .then(response => {
        parseString(
          response.data,
          { trim: true, explicitArray: false },
          (err, result) => {
            if (err) throw err;
            const { channel } = result.rss;
            const categories = [];
            categories.push(
              ...(Array.isArray(channel["itunes:category"])
                ? channel["itunes:category"].map(category => category["$"].text)
                : [channel["itunes:category"]["$"].text])
            );
            const podcast = {
              title: channel.title,
              link: channel.link,
              description: channel.description,
              lastBuildDate: channel.lastBuildDate,
              author: channel["itunes:author"],
              image: channel.image,
              categories: categories
            };
            res.send({ data: podcast });
          }
        );
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        });
      });
  }
});

app.get("/episodes", (req, res) => {
  const { query } = req;
  if (!query) {
    res.status(HttpStatus.BAD_REQUEST).send({
      error: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
    });
  } else {
    get(query.url)
      .then(response => {
        parseString(
          response.data,
          { trim: true, explicitArray: false },
          (err, result) => {
            if (err) throw err;
            const { item } = result.rss.channel;
            const episodes = item.map(i => {
              const image = Object.assign({}, i["itunes:image"]);
              return {
                title: i.title,
                link: i.link,
                sumary: i["itunes:sumary"],
                duration: i["itunes:duration"],
                enclosure: i.enclosure["$"],
                pubDate: i.pubDate,
                description: i.description,
                image: image["$"]
              };
            });
            res.send({ data: episodes });
          }
        );
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        });
      });
  }
});

module.exports = app;
