import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils'
import { sha256 } from 'ethereum-cryptography/sha256'

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp.getPublicKey(privateKey)
    setAddress(toHex(publicKey))
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${toHex(publicKey)}`);
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
        <input placeholder="Type an privatekey, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>

      <p>{address.slice(0, 10)}......</p>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
