import React, { useState } from 'react';
import Web3 from 'web3';
import { Container, Box, Typography, Button, TextField, Grid } from '@mui/material';

const contractABI = [
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
];
const contractAddress = '0x9eca8bc1340df82a766e769d7a1891dceb70f262';

function Main() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const writeNumber = async () => {
    if (contract && account) {
      try {
        await contract.methods.writeNum(value).send({ from: account });
        alert('Number written successfully');
        setValue(0)
      } catch (error) {
        console.error("Error writing number:", error);
        alert('Failed to write number');
      }
    }
  };

  const readNumber = async () => {
    if (contract) {
      try {
        const num = await contract.methods.readNum().call();
        alert(`The number is ${num}`);
      } catch (error) {
        console.error("Error reading number:", error);
        alert('Failed to read number');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" gutterBottom align="center">
          My DApp
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} align="center">
            {account ? (
              <Typography variant="h6" color="primary">
                Connected Account: {account}
              </Typography>
            ) : (
              <Button variant="contained" color="primary" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </Grid>

          {contract && (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Enter a Number"
                  variant="outlined"
                  fullWidth
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" color="primary" fullWidth onClick={writeNumber}>
                  Write Number
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" fullWidth onClick={readNumber}>
                  Read Number
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default Main;
