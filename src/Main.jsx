import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractABI = [[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_num",
				"type": "uint256"
			}
		],
		"name": "writeNum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "readNum",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]];
const contractAddress = '0x9eca8bc1340df82a766e769d7a1891dceb70f262';

function Main() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const[value, setValue] = useState(0);
  
  const connectwallet = async () => {
        if (window.ethereum) {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const signer = newProvider.getSigner();
          const newContract = new ethers.Contract(contractAddress, contractABI, signer);
          
          setProvider(newProvider);
          setContract(newContract);
  
          const userAccount = await signer.getAddress();
          setAccount(userAccount);
        } else {
          alert('Please install MetaMask');
        }
  }

  return (
    <div className="App">
      <h1>My DApp</h1>   

      {account ? <p>Connected Account: {account}</p> : <button onClick={connectwallet}>Connect Wallet</button>}
    
        {contract && <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />}

        {contract && <button onClick={async () => {
            await contract.writeNum(value);
            alert('Number written');
            }
        }>Write Number
        </button>}

        {contract && <button onClick={async () => {
            const num = await contract.readNum();
            alert(`The number is ${num}`);
            }
        }>Read Number
        </button>}
    </div>
  );
}

export default Main;
