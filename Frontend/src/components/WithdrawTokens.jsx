import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenVestingContract from '../contracts/TokenVestingVII.json';
import NavigationBar from './NavigationBar';

const WithdrawTokens = ({ wallet }) => {
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize the contract instance
    const initContract = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenVestingContract = new ethers.Contract(
          contractAddress,
          TokenVestingContract.abi,
          signer
        );
        setContract(tokenVestingContract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    if (contractAddress) {
      initContract();
    }
  }, [contractAddress]);

  const handleWithdrawTokens = async () => {
    try {
      if (!contractAddress) {
        setError('Contract address is required');
        return;
      }

      const tx = await contract.releaseTokens();
      await tx.wait();
      console.log('Tokens withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setError('Only whitelisted addresses can perform this transaction');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <NavigationBar />
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl text-center text-white font-bold mb-4">
              Withdraw Tokens
          </h2>
          
          {error && (
              <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <div className="mb-4">
            <label htmlFor="contractAddress" className="block text-sm text-blue-300">
                Contract Address:
            </label>
            <input
                type="text"
                id="contractAddress"
                placeholder="Enter the TokenVesting contract address"
                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>

          <div className="text-center">
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                onClick={handleWithdrawTokens}
            >
                Withdraw Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawTokens;
