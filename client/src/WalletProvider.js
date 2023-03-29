import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";


// Map accounts and keys
const ACCOUNT_KEYS = new Map();

// List of eth accounts addresses
const ACCOUNTS = new Array();

/**
 * Create new account and
 * set it to accounts map;
 * Derive public key from private;
 * Derive an account address from public key;
 */
const newAccount = () => {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    const address = toHex(keccak256(publicKey.slice(1).slice(-20)));
    const account = `0x${address.toString()}`;

    ACCOUNT_KEYS.set(account, {
        privateKey: toHex(privateKey),
        publicKey: toHex(publicKey),
    });
    ACCOUNTS.push(account);
}

/**
 * Get the account private key from map of accounts
 * @param {string} account ETH address of account
 * @returns private of given account address
 */
const getPrivateKey = (account) => {
    if (!account) {
        throw Error("This address not registered");
    }
    return hexToBytes(ACCOUNT_KEYS.get(account).privateKey);
}

/**
 * Get the account public key from map of accounts
 * @param {string} account ETH address of account
 * @returns public of given account address
 */
const getPublicKey = (account) => {
    if (!account) {
        throw Error("This address not registered");
    }
    return hexToBytes(ACCOUNT_KEYS.get(account).publicKey);
}

/**
 * Get the public key of an acount in hexa format.
 * @param {string} account ETH address of account
 * @returns hexadecimal public key of an account
 */
const getHexPublicKey = (account) => {
    return toHex(getPublicKey(account));
}

/**
 * 
 * @param {string} message message to hash
 * @returns keccak256 hashed message 
 */
const hashMessage = (message) => keccak256(Uint8Array.from(message));

/**
 * Sign a message by PK of account 
 * @param {string} account ETH address of account
 * @param {string} message Hashed message
 * @returns Account signature
 */
const sign = async (account, message) => {
    const privateKey = getPrivateKey(account);
    const hash = hashMessage(message);

    const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
        recovered: true,
    });

    const fullSignature = new Uint8Array([recoveryBit, ...signature]);
    return toHex(fullSignature);
}

const walletProvider = {
    ACCOUNTS,
    newAccount,
    sign,
    getHexPublicKey,
};

// Export module
export default walletProvider;