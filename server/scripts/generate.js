const  secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

// TODO complete logic to create many accounts and paste it to json

const privateKey = secp.utils.randomPrivateKey();

console.debug(`Private key: ${toHex(privateKey)}`);

const publicKey = secp.getPublicKey(privateKey);

// TODO maybe fix the public key creation
console.debug(`Public key (eth version): 0x${keccak256(publicKey.slice(1)).slice(-20).join("")}`);

module.exports = {
    privateKey,
    publicKey
}