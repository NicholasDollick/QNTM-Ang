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

/**
 * Generates PGP keypair using the supplied password as passphrase.
 *
 * @param userName - The name that will be attached to generated keys
 * @param password - The user's password to be hashed and used to encrypt private key to send to server
 * @param length - The number of bits for generated key
 * @param passPhrase - Used to encrypt private key locally, in this case the user's password is used
 * @return A PGP keypair
 *
 **/
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

/**
 * Hashes password before being used as the encryption key for PGP private key.
 * This is NOT the hash the server will store, server side uses salted bycrypt.
 *
 * @param password - The user's password to be hashed and used to encrypt private key to send to server.
 * @return A sha512 hash of user's password.
 *
 **/
hashPass(password: string) {
  return sha512.sha512(password);
}

/**
 *  AES encrypts PGP secret key before sending to server for storage in db.
 *
 * @param privKey - The private key from user's generated keypair.
 * @param passHash - The user's sha512 hashed password to be used as key's AES encryption key.
 * @return An encrypted version of the user's pgp private key to be stored by server.
 *
 **/
encryptKey(privKey: string, passHash: string) {
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(privKey), passHash, {
    keySize: 128 / 8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString();
}

/**
 * Used to decrypt secret key passed back from server on auth'd user access.
 *
 * @param key - The user's encrypted private key that was stored on server.
 * @param password - The user's password to be hashed and used to decrypt private key sent from server.
 * @return The unencrypted pgp private key for user.
 *
 **/
decryptKey(key: string, password: string) {
  const decrypted = CryptoJS.AES.decrypt(key, this.hashPass(password), {
    keySize: 128 / 8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

// testing for more optimal keystorage
async decryptKey2(key: string, password: string) {
  const decrypted = CryptoJS.AES.decrypt(key, this.hashPass(password), {
    keySize: 128 / 8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const privKey = (await openpgp.key.readArmored(decrypted.toString(CryptoJS.enc.Utf8))).keys[0];
  await privKey.decrypt(password);

  return privKey;
}

// method for testing. Will be removed.
async verifyKeys(privateKey: string, password: string) {
  console.log(privateKey);
  console.log('Decrypting');
  const decPriv = this.decryptKey(privateKey  , password);
  console.log(decPriv);
}

// test function for encrpytion and decryption using generated PGP keys.
async encryptDecrypt(privKey: string, publicKey: string, passPhrase: string, message: string) {
  const privKeyObj = (await openpgp.key.readArmored(this.decryptKey(privKey, passPhrase))).keys[0];
  await privKeyObj.decrypt(passPhrase);

  const options = {
    message: await openpgp.message.fromText(message),
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    privateKeys: [privKeyObj]
  };

  openpgp.encrypt(options).then(async cipher => {
    const data = cipher.data;
    // console.log( await this.decrypt(data, publicKey, privKeyObj, passPhrase) );
  });
}

async encrypt(publicKey: string, message: string) {
  const privKeyObj = JSON.parse(sessionStorage.getItem('privateKey'));

  const options = {
    message: await openpgp.message.fromText(message),
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    privateKeys: [privKeyObj]
  };

  return openpgp.encrypt(options);
}

async decrypt(message: string, publicKey: string) {
  const privKeyObj = JSON.parse(sessionStorage.getItem('privateKey'));

  const options = {
    message: await openpgp.message.readArmored(message),
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
    privateKeys: [privKeyObj]
  };

  let plain = '';

  await openpgp.decrypt(options).then(plantext => {
    plain = (plantext.data).toString();
  });

  return plain;
}

encryptFile(password: string, file: File) {
  const reader = new FileReader();
  var encryptedFile;

  reader.onload = async function() {
    const data = reader.result;
    console.log(data);
    encryptedFile = CryptoJS.AES.encrypt("the file contents would go here lol", password, {
      keySize: 128 / 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    console.log(encryptedFile);
  };

  reader.readAsText(file);

  return encryptedFile;
}

// would this be a string? or some form of byte array?
async decryptFile(password: string, message: string,) {
  const privKeyObj = JSON.parse(sessionStorage.getItem('privateKey'));

  const options = {
    message: await openpgp.message.readArmored(message),
    publicKeys: (await openpgp.key.readArmored("publicKey")).keys,
    privateKeys: [privKeyObj]
  };

  let plain = '';

  await openpgp.decrypt(options).then(plantext => {
    plain = (plantext.data).toString();
  });

  return plain;
}

}
/*

this results of the above key pair continue as followed:
  public key remains untouched and past over to db.
  private key gets bcrypted with password during register and passed
  this private key is restored after a successful login, as the pass is needed for key to not be junk


future implementation ideas:
  two passwords: keep login access and private key passes as seperate values
 */



        //notes:
            /*
            Filename is the hash(MD5 or something) of the name + datetime
            
            do not accept strangely unicode file names/extentions 
            regular expression: [a-zA-Z0-9]{1,200}\.[a-zA-Z0-9]{1,10}

            min size: ???? max size: 5mb...this is only POC afterall

            file type whitelist

            integrate virus total api to check files?

            logs for safety? or keep the wild west vibes of no logs ever

            contents will be encrypted blobs by the time they are seen,
                some of these point may be worth ignoring?
            */