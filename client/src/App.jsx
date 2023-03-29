import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState("");

  return (
    <div className="app">
      <h1 className="title">ECDSA Signature Node</h1>
      <div className="window-container">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          account={account}
          setAccount={setAccount}
        />
        <Transfer setBalance={setBalance} account={account} />
      </div>
    </div>
  );
}

export default App;
