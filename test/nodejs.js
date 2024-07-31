const download = require("download");
const productData = require("./product.json");
const fs = require("fs");

(async () => {
  for (const [index, product] of productData.entries()) {
    console.log(`Downloading image for ${product.imgeLink}`);
    const data = await download(product.imgeLink);
    fs.writeFileSync(`./images/${product.model}.jpg`, data);
    console.log(`Downloaded image for ${product.imgeLink}`);
  }
})();
