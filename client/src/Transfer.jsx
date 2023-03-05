import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { sha256 } from 'ethereum-cryptography/sha256'
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils'
import { keccak256 } from 'ethereum-cryptography/keccak'

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const messageBytes = utf8ToBytes("{ 'key': 'transfer', 'from': address, 'to': recipient }")
    const transactionHash = keccak256(messageBytes)
    const signature = await secp.sign(toHex(transactionHash), privateKey, { recovered: true })
    console.log(signature[0])
    const pKey = secp.recoverPublicKey(toHex(transactionHash), signature[0], signature[1])
    console.log(toHex(pKey))
    const asArray = signature[0]
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        signature,
        hash: toHex(transactionHash),
        amount: parseInt(sendAmount),
        recipient,
      });
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
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
