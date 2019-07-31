import { Injectable } from '@angular/core';
import * as openpgp from 'openpgp';
import * as CryptoJS from 'crypto-js';
import * as sha512 from 'js-sha512';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private privateKey: any;
  private publicKey: any;

constructor() { }

// generates PGP keypair using the supplied password as passphrase.
async genKeyPair(userName: string, password: string, length: number, passPhrase: string) {
  const options = {
    userIds: [{name: userName}],
    numBits: length,
    passphrase: passPhrase
  };

  await openpgp.generateKey(options).then(key => {
    const priv = key.privateKeyArmored;
    const pub = key.publicKeyArmored;
    this.publicKey = pub;
    this.privateKey = this.encryptKey(priv, this.hashPass(password));
  });

  return { public: this.publicKey, private: this.privateKey };
}

/*

this results of the above key pair continue as followed:
  public key remains untouched and past over to db.
  private key gets bcrypted with password during register and passed
  this private key is restored after a successful login, as the pass is needed for key to not be junk


future implementation ideas:
  two passwords: keep login access and private key passes as seperate values
 */


 // hashes password before being used as the encryption key for PGP private key.
hashPass(password: string) {
  return sha512.sha512(password);
}

// encrypts PGP secret key before sending to server for storage in db.
encryptKey(privKey: string, passHash: string) {
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(privKey), passHash, {
    keySize: 128 / 8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString();
}

// used to decrypt secret passed back from server on auth'd access.
decryptKey(key: any, passHash: string) {
  const decrypted = CryptoJS.AES.decrypt(key, this.hashPass(passHash), {
    keySize: 128 / 8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

// method for testing. Will be removed.
async verifyKeys(privateKey: string, password: string) {
  console.log(privateKey);
  console.log('Decrypting');
  const decPriv = this.decryptKey(privateKey  , password);
  console.log(decPriv);
}

// test function for encrpytion and decryption using generated PGP keys.
async encryptDecrypt(privKey: any, publicKey: string, passPhrase: string, message: string) {
  const privKeyObj = (await openpgp.key.readArmored(this.decryptKey(privKey, passPhrase))).keys[0];
  await privKeyObj.decrypt(passPhrase);

  const options = {
    message: await openpgp.message.fromText(message),
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    privateKeys: [privKeyObj]
  };

  openpgp.encrypt(options).then(async cipher => {
    const data = cipher.data;
    await this.decrypt(data, publicKey, privKeyObj, passPhrase);
  });
}

async decrypt(message: string, publicKey: string, privateKey: any, passphrase: string) {
  const options = {
    message: await openpgp.message.readArmored(message),
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    privateKeys: [privateKey]
  };

  openpgp.decrypt(options).then(plantext => {
    console.log(plantext.data);
  });
}
}
