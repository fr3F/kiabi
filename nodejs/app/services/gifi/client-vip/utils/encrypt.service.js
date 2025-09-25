const openpgp = require('openpgp');
const fs = require('fs');

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

async function loadPublicKey(armoredKey) {
    return openpgp.readKey({ armoredKey });
}

async function createMessage(input) {
    if (Buffer.isBuffer(input)) {
        return openpgp.createMessage({ binary: input });
    } else {
        return openpgp.createMessage({ text: input });
    }
}

async function encrypt(message, key) {
    return openpgp.encrypt({ 
        config: {           
            rejectPublicKeyAlgorithms: new Set(),   // dsa keys are considered too weak.
            minRSABits: 0,     
        },
        message, encryptionKeys: key 
    });
}

async function encryptWithGPG(keyPath, text) {
  const armoredKey = readFile(keyPath);
  const publicKey = await loadPublicKey(armoredKey);
  const message = await createMessage(text);
  return encrypt(message, publicKey);
}

module.exports = { encryptWithGPG };
