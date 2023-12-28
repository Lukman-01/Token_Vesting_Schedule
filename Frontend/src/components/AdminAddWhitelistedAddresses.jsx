import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenVestingContract from '../contracts/TokenVestingVII.json';
import NavigationBar from './NavigationBar';

const AdminAddWhitelistedAddresses = ({ wallet }) => {
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [addressesToAdd, setAddressesToAdd] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

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

  const handleAddAddresses = async () => {
    try {
      const addresses = addressesToAdd.split('\n').map((address) => address.trim());

      const tx = await contract.whitelistAddresses(addresses);
      await tx.wait();

      setTransactionHash(tx.hash);
      setAddressesToAdd('');
    } catch (error) {
      console.error('Error adding addresses:', error);
    }
  };

  return (
      <div className="bg-gray-800 min-h-screen">
          <NavigationBar />
          <div className="container mx-auto p-4">
              <div className="max-w-2xl mx-auto bg-gray-700 p-6 rounded-xl shadow-lg">
                  <h2 className="text-3xl text-center text-white font-bold mb-4">
                      Add Whitelisted Addresses (Admin)
                  </h2>

                  <InputField
                      id="contractAddress"
                      label="Contract Address:"
                      type="text"
                      placeholder="Paste the TokenVesting contract address"
                      value={contractAddress}
                      onChange={setContractAddress}
                  />

                  <label htmlFor="addressesToAdd" className="block text-sm text-blue-300 mt-4">
                      Addresses to Add (one per line):
                  </label>
                  <textarea
                      id="addressesToAdd"
                      className="block w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 mt-1"
                      value={addressesToAdd}
                      onChange={(e) => setAddressesToAdd(e.target.value)}
                  ></textarea>

                  <div className="text-center mt-4">
                      <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                          onClick={handleAddAddresses}
                      >
                          Add Addresses
                      </button>
                  </div>

                  {transactionHash && (
                      <div className="mt-4 text-center">
                          <p className="text-yellow-300">
                              Address(es) added successfully! Transaction Hash:
                          </p>
                          <a
                              href={`https://etherscan.io/tx/${transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-300 hover:text-yellow-400"
                          >
                              {transactionHash}
                          </a>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
};

const InputField = ({ id, label, type, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm text-blue-300">
            {label}
        </label>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default AdminAddWhitelistedAddresses;
