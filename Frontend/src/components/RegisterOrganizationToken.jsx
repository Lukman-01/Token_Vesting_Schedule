import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CustomTokenContract from '../contracts/CustomToken.json';
import TokenVestingContract from '../contracts/TokenVestingVII.json';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';

const RegisterOrganizationToken = ({ wallet }) => {
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [walletConnectionStatus, setWalletConnectionStatus] = useState('');
    const [deploymentStatus, setDeploymentStatus] = useState('');
    const [tokenVestingAddress, setTokenVestingAddress] = useState('');
    const [customTokenAddress, setCustomTokenAddress] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        setWalletConnectionStatus(wallet ? 'Wallet connected' : 'Wallet not connected.');
    }, [wallet]);

    const deployContract = async () => {
        if (!window.ethereum || !wallet) {
            setDeploymentStatus('Wallet not connected');
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        try {
            const tokenFactory = new ethers.ContractFactory(
                CustomTokenContract.abi,
                CustomTokenContract.bytecode,
                signer
            );

            const tokenContract = await tokenFactory.deploy(tokenName, tokenSymbol, totalSupply);
            setDeploymentStatus('Contracts deployment in progress...');
            await tokenContract.deployTransaction.wait();
            setDeploymentStatus('Organization Token created. Deploying your vesting contract next...');
            setCustomTokenAddress(tokenContract.address);
            console.log('Organization Token address is:', tokenContract.address);
            console.log('Organization Token creation transaction receipt:', tokenContract.deployTransaction);
            const vestingFactory = new ethers.ContractFactory(
                TokenVestingContract.abi,
                TokenVestingContract.bytecode,
                signer
            );
            const vestingContract = await vestingFactory.deploy(tokenContract.address);
            setDeploymentStatus('Creating your organization\'s custom token contract');
            await vestingContract.deployTransaction.wait();
            setDeploymentStatus('Your organization\'s token vesting plan has been successfully created. \n Please keep its contract address for future use');
            setTokenVestingAddress(vestingContract.address);
            console.log('TokenVesting address is:', vestingContract.address);
            console.log('TokenVesting creation transaction receipt:', vestingContract.deployTransaction);
        } catch (error) {
            setDeploymentStatus(`Error creating Organization Token: ${error.message}`);
            console.log('Error creating Organization Token:', error);
        }
    };

    const handleNavigateToTokenVesting = () => {
        navigate('/add-stakeholder-and-vesting');
    };

    return (
        <div className="bg-slate-800 min-h-screen">
            <NavigationBar />
            <div className="container mx-auto p-4">
                <div className="flex justify-end">
                    <button
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
                        onClick={handleNavigateToTokenVesting}
                    >
                        Already Registered? Continue Here.
                    </button>
                </div>
                <div className="flex flex-col items-center py-10">
                    <div className="max-w-lg w-full bg-gray-700 p-6 rounded-xl shadow-lg">
                        <h2 className="text-3xl text-white font-bold text-center mb-6">
                            Create Your Organization's Custom Token
                        </h2>
                        {walletConnectionStatus && (
                            <p className="text-center text-lg bg-blue-500 text-white p-3 rounded-md mb-4">
                                {walletConnectionStatus}
                            </p>
                        )}
                        {wallet && (
                            <>
                                <InputField label="Input Token Name:" value={tokenName} setValue={setTokenName} />
                                <InputField label="Input Token Symbol:" value={tokenSymbol} setValue={setTokenSymbol} />
                                <InputField label="Input Total Supply:" value={totalSupply} setValue={setTotalSupply} />
                                
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300"
                                    onClick={deployContract}
                                >
                                    Create Organization Token
                                </button>
                            </>
                        )}
                        {deploymentStatus && (
                            <p className="mt-4 text-yellow-300 text-center">
                                {deploymentStatus}
                            </p>
                        )}
                    </div>
                    {tokenVestingAddress && (
                        <div className="mt-6 text-white text-center">
                            <p>Your organization's token vesting contract address: {tokenVestingAddress}</p>
                            <p className="mt-2">Kindly copy and store this address for admin use in future transactions</p>

                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mt-4 transition duration-300"
                                onClick={handleNavigateToTokenVesting}
                            >
                                Ready! Add Stakeholders and Vesting Plans
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, value, setValue }) => (
    <label className="block mt-4">
        <span className="text-lg text-blue-300">{label}</span>
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2 block w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
    </label>
);

export default RegisterOrganizationToken;
