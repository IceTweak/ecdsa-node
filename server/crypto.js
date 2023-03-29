const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

/**
 * Get hashed message         
 * @param {string} message Message to hash
 * @returns keccak256 hashed message
 */
const hashMessage = (message) => keccak256(Uint8Array.from(message));

/**
 * Get ETH address from public key of an account
 * @param {string} publicKey pubKey of account
 * @returns ETH address of account
 */
const publicKeyToAccount = (publicKey) => {
    const address = toHex(keccak256(publicKey.slice(1).slice(-20)));
    return `0x${address}`;
}

/**
 * Recover public key of account from it's signature
 * @param {string} message Account sended message
 * @param {string} signature Account signature provided by private key  
 * @returns Recovered public key
 */
const signatureToPublicKey = (message, signature) => {
    const hash = hashMessage(message);
    const fullSignatureBytes = hexToBytes(signature);
    const recoveryBit = fullSignatureBytes[0];
    const signatureBytes = fullSignatureBytes.slice(1);

    return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
};

module.exports = {
    hashMessage,
    publicKeyToAccount,
    signatureToPublicKey,
}