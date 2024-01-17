const url = "https://www.cnet.com";

const getDomainName = (url) => {
  return url.match(/www\.(.*?)\./)[1];
};

console.log(getDomainName(url));
