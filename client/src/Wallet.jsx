import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    // Derive public key from private key
    const address = "0x" + keccak256(
      secp.getPublicKey(privateKey).slice(1)
    ).slice(-20).join("");

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      {/*Display out address received from private key  */}
      <div>
        Eth Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
