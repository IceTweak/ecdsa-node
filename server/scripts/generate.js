const  secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

let accountsLen = 10;
let accounts = [];

for (let i = 0; i < accountsLen; i++) {
    let privateKey = secp.utils.randomPrivateKey();
    let publicKey = secp.getPublicKey(privateKey);

    // write object to array
    accounts.push({
        "publicKey": `0x${keccak256(publicKey.slice(1)).slice(-20).join("")}`,
        "privateKey": `${toHex(privateKey)}`,
        "value": Math.random() * 100,
    });
}

console.log(">>> Ready accounts for transfers <<<");
console.log(accounts);

module.exports = {
    accounts,
}