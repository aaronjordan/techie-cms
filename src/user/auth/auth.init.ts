const path = require('path');
import { readFileSync } from 'fs';
import AppConfig from 'src/globals';

const setupJwtSecrets = (): [string, string] => {
  const keyText = readFileSync(path.resolve('techie-meta/keys.pem'), {
    encoding: 'utf-8',
  });

  const landmarks = {
    pub: {
      s: '-----BEGIN PUBLIC KEY-----',
      e: '-----END PUBLIC KEY-----',
    },
    prv: {
      s: '-----BEGIN ENCRYPTED PRIVATE KEY-----',
      e: '-----END ENCRYPTED PRIVATE KEY-----',
    },
  };

  const getKey = (raw, type: 'pub' | 'prv'): string => {
    const startIdx = raw.indexOf(landmarks[type].s);
    const endIdx = raw.indexOf(landmarks[type].e) + landmarks[type].e.length;
    return raw.slice(startIdx, endIdx + 1);
  };

  return [getKey(keyText, 'pub'), getKey(keyText, 'prv')];
};

const keyPair = setupJwtSecrets();

export const pubKey = keyPair[0];
export const keys = Object.freeze({
  public: pubKey,
  private: keyPair[1],
  passphrase: AppConfig.rsaSecureKey,
});

export default keys;
