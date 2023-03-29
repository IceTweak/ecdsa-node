import { useState } from "react";
import server from "./server";
import walletProvider from "./WalletProvider";

// Add privateKey to component props for ability
// to get it on server post(/send) request 
function Transfer({ account, setBalance}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    
    const message = {
      amount: parseInt(sendAmount),
      recipient,
    }

    const signature = await walletProvider.sign(account, message);

    const transaction = {
      message,
      signature
    };

    // TODO - send a signature not an private key, and derive public key from it
    try {
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <select onChange={setValue(setRecipient)} value={recipient}>
          <option value="">-----Select Recipient------</option>
            {walletProvider.ACCOUNTS.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))
            }
         </select> 
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
