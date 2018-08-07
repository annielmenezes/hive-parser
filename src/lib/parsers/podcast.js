module.exports = ({
  description,
  link,
  lastBuildDate,
  image,
  title,
  ...rest
}) => {
  const categories = [];
  categories.push(
    ...(Array.isArray(rest["itunes:category"])
      ? rest["itunes:category"].map(category => category["$"].text)
      : [rest["itunes:category"]["$"].text])
  );

  return {
    title,
    link,
    description,
    lastBuildDate,
    author: rest["itunes:author"],
    image,
    categories
  };
};
