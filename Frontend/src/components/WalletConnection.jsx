import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';

const WalletConnection = ({ onConnect }) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletConnected(true);
                onConnect();
            } catch (error) {
                console.log('Error connecting wallet:', error);
            }
        } else {
            console.log('No Ethereum wallet found');
        }
    };

    const handleNavigateToContractDeployment = () => {
        navigate('/register-organization-token');
    };
    const handleNavigateToTokenVesting = () => {
        navigate('/add-stakeholder-and-vesting'); 
     };

    const handleNavigateToWithdrawals = () => {
        navigate('/make-withdrawal'); 
    };

    const handleNavigateToWhitelisting = () => {
        navigate('/whitelist-addresses'); 
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-4">
            {walletConnected && (<NavigationBar />)}
            <h2 className="text-3xl md:text-4xl text-center text-white font-bold mb-6">
                A Multi-User Organizations' Token Vesting Schedule DApp
            </h2>
            <div className="w-full max-w-4xl p-6 space-y-4">
                {!walletConnected && (
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-6 rounded-lg transition duration-300"
                        onClick={connectWallet}
                    >
                        Connect Ethereum Wallet
                    </button>
                )}
                {walletConnected && (
                    <div className='grid grid-cols-2 gap-8'>
                        <ActionButton text="Register Organization" onClick={handleNavigateToContractDeployment} />
                        <ActionButton text="Manage Token Vesting" onClick={handleNavigateToTokenVesting} />
                        <ActionButton text="Whitelist Addresses" onClick={handleNavigateToWhitelisting} />
                        <ActionButton text="Withdraw Tokens" onClick={handleNavigateToWithdrawals} />
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton = ({ text, onClick }) => (
    <button
        className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold py-4 px-6 rounded-lg transition duration-300"
        onClick={onClick}
    >
        {text}
    </button>
);

export default WalletConnection;
