import server from "./server";
import walletProvider from "./WalletProvider";
import { useState } from "react";

function Wallet({ account, setAccount, balance, setBalance}) {

  const [deposit, setDeposit] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function onSelectAccount(evt) {
    const account = evt.target.value;
    setAccount(account);

    if (account) {
      const {
        data: { balance },
      } = await server.get(`balance/${account}`);
      setBalance(balance)
    } else {
      setBalance(0);
    }
  }

  async function onGenerate(evt) {
    evt.preventDefault();

    walletProvider.newAccount();

    const newAccount = walletProvider.ACCOUNTS.at(-1);
    const newDeposit = parseInt(deposit)

    const addAccount = {
      account: newAccount,
      balance: newDeposit,
    };

    setDeposit(0);

    try{
      const {
        data: {balance},
      } = await server.post(`deposit`, addAccount)
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    // Select account option or create new wallet with starting balance
    <div className="container">

      <div className="wallet">
        <h1>Wallet</h1>
          <select onChange={onSelectAccount} value={account}>
            <option value="">-----Select Account------</option>
            {walletProvider.ACCOUNTS.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))}
          </select>
        <div className="balance">Balance: {balance}</div>
      </div>

      <form className="transfer" onSubmit={onGenerate}>
        <label> Create Account
          <input placeholder="Enter initial deposit"
          value={deposit} 
          onChange={setValue(setDeposit)}></input>
          <input type="submit" className="button" value="Generate"></input>
        </label>
      </form>
    </div>
  );
}

export default Wallet;
