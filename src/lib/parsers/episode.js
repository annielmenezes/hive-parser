module.exports = ({
  title,
  link,
  pubDate,
  description,
  enclosure,
  ...rest
}) => {
  const image = Object.assign({}, rest["itunes:image"]);
  return {
    title,
    link,
    sumary: rest["itunes:sumary"],
    duration: rest["itunes:duration"],
    enclosure: enclosure["$"],
    pubDate,
    description,
    image: image["$"]
  };
};
