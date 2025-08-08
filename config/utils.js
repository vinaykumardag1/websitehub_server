const crypto = require('crypto');
const  generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};


const generateId = (length = 16) => {
  return crypto.randomBytes(length).toString('hex'); // returns a hex string
};

module.exports = {
  generateId,
   generateSlug
};

module.exports={
   
}