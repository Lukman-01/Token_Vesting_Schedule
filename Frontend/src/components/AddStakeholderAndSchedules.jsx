import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenVestingContract from '../contracts/TokenVestingVII.json';
import NavigationBar from './NavigationBar';

const AddStakeholderAndSchedules = ({ wallet }) => {
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [category, setCategory] = useState('');
  const [totalTokens, setTotalTokens] = useState('');
  const [releaseStart, setReleaseStart] = useState('');
  const [releaseEnd, setReleaseEnd] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState('');
  const [addressToAdd, setAddressToAdd] = useState('');
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initContract = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenVestingContract = new ethers.Contract(contractAddress, TokenVestingContract.abi, signer);
        setContract(tokenVestingContract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    if (contractAddress) {
      initContract();
    }
  }, [contractAddress]);

  const handleCategoryChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '0' || inputValue === '1' || inputValue === '2') {
      setCategory(inputValue);
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter a valid category (0 for Community, 1 for Validators, or 2 for Investors).');
    }
  };

  const handleTotalTokensChange = (e) => {
    setTotalTokens(e.target.value);
  };

  const handleNumberOfInstallmentsChange = (e) => {
    setNumberOfInstallments(e.target.value);
  };

  const handleReleaseStartChange = (e) => {
    setReleaseStart(e.target.value);
  };

  const handleReleaseEndChange = (e) => {
    setReleaseEnd(e.target.value);
  };

  const handleAddressToAddChange = (e) => {
    setAddressToAdd(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      if (contract) {
        const parsedTokens = ethers.utils.parseUnits(totalTokens.toString(), 0);
        const parsedStart = Math.floor(new Date(releaseStart).getTime() / 1000);
        const parsedEnd = Math.floor(new Date(releaseEnd).getTime() / 1000);

        const createScheduleTx = await contract.createVestingSchedule(
          category,
          parsedTokens,
          parsedStart,
          parsedEnd,
          numberOfInstallments
        );
        setNotice('Creating vesting schedule... Please wait.');
        await createScheduleTx.wait();
        setNotice('Vesting schedule created successfully! Next trxn will categorize the address provided');

        const categorizedTx = await contract.setCategorizedAddress(addressToAdd, category);
        setNotice('Categorizing stakeholder address... Please wait.');
        await categorizedTx.wait();
        setNotice('Stakeholder address categorized successfully!');

        setAddressToAdd('');
        setCategory('');
        setTotalTokens('');
        setReleaseStart('');
        setReleaseEnd('');
        setNumberOfInstallments('');
      }
    } catch (error) {
      console.error('Error handling button click:', error);
      setNotice('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <NavigationBar />
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto mt-10 bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl text-center text-white font-bold mb-4">
            Add Stakeholder and Create Vesting Schedule
          </h2>

          <InputField
            id="contractAddress"
            label="Your Organization's Token Vesting Contract Address:"
            type="text"
            placeholder="Paste your contract address"
            value={contractAddress}
            onChange={e => setContractAddress(e.target.value)}
          />

          <InputField
            id="category"
            label="Stakeholder Category:"
            type="number"
            placeholder="Enter category"
            value={category}
            onChange={handleCategoryChange}
            errorMessage={errorMessage}
          />

          <InputField
            id="totalTokens"
            label="Amount of Tokens to Release:"
            type="number"
            placeholder="Amount of tokens to release over specific time"
            value={totalTokens}
            onChange={handleTotalTokensChange}
          />

          <InputField
            id="numberOfInstallments"
            label="Number of Installments:"
            type="number"
            placeholder="Number of installments for token release"
            value={numberOfInstallments}
            onChange={handleNumberOfInstallmentsChange}
          />

          <InputField
            id="releaseStart"
            label="Token Release Start Date:"
            type="date"
            value={releaseStart}
            onChange={handleReleaseStartChange}
          />

          <InputField
            id="releaseEnd"
            label="Token Release End Date:"
            type="date"
            value={releaseEnd}
            onChange={handleReleaseEndChange}
          />

          <InputField
            id="addressToAdd"
            label="Address to Add to Defined Category:"
            type="text"
            placeholder="Address to categorize as Community, Validators, or Investors"
            value={addressToAdd}
            onChange={handleAddressToAddChange}
          />

          {notice && (
            <p className="text-lg text-center text-red-600 mb-4">{notice}</p>
          )}

          <div className="text-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              onClick={handleButtonClick}
            >
              Add Stakeholder's Vesting Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type, placeholder, value, onChange, errorMessage }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm text-blue-300">
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      value={value}
      onChange={onChange}
    />
    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
  </div>
);

export default AddStakeholderAndSchedules;
