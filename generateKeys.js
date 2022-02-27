const { generateKeyPair } = require("crypto");
const { readFileSync, writeFile, write } = require('fs');
const path = require('path');

const conf = readFileSync(path.resolve('rsa.config'), {encoding: 'utf-8'});
const searchFor = 'secureKey=';
const passphrase = conf.slice(conf.indexOf(searchFor) + searchFor.length);

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
    },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase
  }
}, (err, pub, priv) => {
  if (!err) {
    const data = `${pub}\n${priv}`;
    writeFile(path.resolve('keys.pem'), data, 'utf8', (err) => {
      if (err) {
        console.error("Generation of new PEM keys failed.");
        throw err;
      } else {
        console.log('New PEM keys were successfully generated.');
      }
    })
  } else {
    console.error("Generation of new PEM keys failed.");
    throw err;
  }
});