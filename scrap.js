const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const siteUrl = 'https://www.lafurniturestore.com/';

axios.get(siteUrl)
  .then(response => {
    const htmlContent = fs.readFileSync('abc.html', 'utf-8');
const $ = cheerio.load(htmlContent);


    let products = [];
    console.log($('.product-item').length);
    $('.product-item').each((index, element) => {
      const productUrl = $(element).find('.product-item-link').attr('href');
      const productImage = $(element).find('.product-item-photo img').first().attr('src');
      const secondaryImage = $(element).find('.secondary-prod-img img').attr('src');
      const productName = $(element).find('.product-item-name a').text().trim();
      const productPrice = $(element).find('.price-box .price-final_price .price').first().text().trim();
      const originalPrice = $(element).find('.price-box .old-price .price').text().trim();
      const inStock = $(element).find('.stock-info').text().includes('In Stock');

      const product = {
        name: productName,
        url: productUrl,
        image: productImage,
        secondaryImage: secondaryImage,
        price: productPrice,
        originalPrice: originalPrice,
        inStock: inStock
      };

      products.push(product);
    });
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2), 'utf-8');
    const data = fs.readFileSync('products.json', 'utf-8');
    products = JSON.parse(data);
    // products.forEach(product => {
    //   console.log(product);
    // });
  })
  .catch(error => {
    console.error('Error fetching the site HTML:', error);
  });
