const { parseString } = require("xml2js");
const podcastParser = require("../parsers/podcast");
const episodeParser = require("../parsers/episode");

module.exports = (part, xml) =>
  new Promise((resolve, reject) => {
    parseString(xml, { trim: true, explicitArray: false }, (err, { rss }) => {
      if (err) {
        reject(err);
      }
      let objectPart = {};
      switch (part) {
        case "podcast":
          objectPart = Object.assign({}, podcastParser(rss.channel));
          break;
        case "episodes":
          objectPart = Object.assign({}, rss.channel.item.map(episodeParser));
          break;
      }
      resolve(objectPart);
    });
  });
