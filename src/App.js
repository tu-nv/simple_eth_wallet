import './App.css';
import Web3 from 'web3';
import { useCallback, useEffect, useState } from 'react';

function App() {

  const [accounts, setAccounts] = useState([]);
  const [accWithBalances, setAccWithBalances] = useState([]);
  const [transmitter, setTransmitter] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [ethToSend, setEthToSend] = useState(0);
  const [password, setPassword] = useState(null);

  // init the web3
  const [web3] = useState(new Web3('http://141.223.181.151:2232'));

  // get the account lists and balances when the page is loaded/refresh
  useEffect(() => {
    async function getAccounts() {
      const _accounts = await web3.eth.getAccounts();
      setAccounts(_accounts);

      const _accWithBalances = await Promise.all(
        _accounts.map(async e => {
          const _balance = Web3.utils.fromWei(
            await web3.eth.getBalance(e), 'ether'
          );
          return {
            account: e,
            balance: Number(_balance)
          }
        })
      );
      setAccWithBalances(_accWithBalances);
    }

    getAccounts();
  }, []);

  // listen on the change of transitter
  const onTransmitterChange = useCallback(async e => {
    setTransmitter(e.target.value);
  }, []);

  // listen on the change of recipient
  const onRecipientChange = useCallback(async e => {
    setRecipient(e.target.value);
  }, []);

  // listen on the change of amount of eth to send
  const onEthToSendChange = useCallback(async e => {
    setEthToSend(e.target.value);
  }, []);

  // listen on the change of password input
  const onPasswordChange = useCallback(async e => {
    setPassword(e.target.value);
  }, []);

  // Send eth and display the result in a popup
  const sendEth = async () => {
    if (transmitter === null || recipient === null || ethToSend <= 0 || password === null) {
      alert("wrong input. Please check again!", transmitter);
      return;
    }

    web3.eth.personal.sendTransaction({
        from: transmitter,
        to: recipient,
        value: web3.utils.toWei(ethToSend, 'ether'),
      }, password)
      .then(alert)
      .catch(alert);
  };

  // The UI
  return (
    <div className="App">
        <p> Simple Eth Wallet </p>
        {/* Account table */}
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
          {accWithBalances.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.account}</td>
                  <td>{val.balance}</td>
                </tr>
              )
            })}
          <tr>
            <td>Total</td>
            <td>{accWithBalances.reduce((total, e) => total + e.balance, 0 )}</td>
          </tr>
          </tbody>
        </table>

        <label className='label'> Transmitter
        <select onChange={onTransmitterChange}>
            <option value={null} selected disabled hidden>Choose here</option>
            { accounts.map(e => <option key={e}>{e}</option>) }
          </select>
        </label>

        <label className='label'> Recipient
          <input type="text" onInput={onRecipientChange}/>
        </label>

        <label> Amount of ETH
          <input type="number" step="any" required onInput={onEthToSendChange}/>
        </label>

        <label> Password
          <input type="password" required onInput={onPasswordChange}/>
        </label>

        <button onClick={sendEth}>
          Send
        </button>

      </div>
  );
}

export default App;
