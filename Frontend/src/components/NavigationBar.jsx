import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <aside className="fixed top-0 left-0 h-screen bg-gray-800 text-white w-64 p-4">
            <div className="flex justify-end sm:hidden">
                <button
                    className="text-white p-2 rounded focus:outline-none focus:bg-gray-700"
                    onClick={handleMenuToggle}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>
            <ul className={`${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
                <NavLink to="/" text="Dashboard" active={location.pathname === '/'} />
                <NavLink to="/register-organization-token" text="Register Orgs" active={location.pathname === '/register-organization-token'} />
                <NavLink to="/add-stakeholder-and-vesting" text="Add Stakeholder" active={location.pathname === '/add-stakeholder-and-vesting'} />
                <NavLink to="/whitelist-addresses" text="Whitelist Addr" active={location.pathname === '/whitelist-addresses'} />
                <NavLink to="/make-withdrawal" text="Withdrawals" active={location.pathname === '/make-withdrawal'} />
            </ul>
        </aside>
    );
};

const NavLink = ({ to, text, active }) => (
    <li className={`mt-2 ${active ? 'bg-blue-600' : ''} rounded-md`}>
        <Link to={to} className="block p-2 hover:bg-blue-700 rounded-md transition duration-300">
            {text}
        </Link>
    </li>
);

export default NavigationBar;

