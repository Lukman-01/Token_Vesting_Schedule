// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title A simple ERC20-like token contract
/// @dev Implements basic token functionalities with a fixed supply
contract CustomToken {
    /// @dev Stores the name of the token
    string private _name;

    /// @dev Stores the symbol of the token
    string private _symbol;

    /// @dev Stores the total supply of the token
    uint256 private _totalSupply;

    /// @dev Mapping to store the token balances of each address
    mapping(address => uint256) private _balances;

    /// @notice Creates a new token instance
    /// @param name_ The name of the token
    /// @param symbol_ The symbol of the token
    /// @param totalSupply_ The total supply of the token
    /// @dev Assigns the total supply to the contract deployer
    constructor(string memory name_, string memory symbol_, uint256 totalSupply_) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = totalSupply_;
        _balances[msg.sender] = totalSupply_; // Assign the total supply to the contract deployer's balance
    }

    /// @notice Returns the name of the token
    /// @return The name of the token
    function name() public view returns (string memory) {
        return _name;
    }

    /// @notice Returns the symbol of the token
    /// @return The symbol of the token
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /// @notice Returns the total supply of the token
    /// @return The total supply of the token
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /// @notice Returns the token balance of a specific account
    /// @param account The address of the account to query
    /// @return The balance of the specified account
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /// @notice Transfers tokens from the sender to a recipient
    /// @param recipient The address of the recipient
    /// @param amount The amount of tokens to transfer
    /// @return A boolean value indicating whether the operation was successful
    /// @dev Requires that the sender has enough tokens to transfer
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _balances[msg.sender] -= amount; // Deduct the amount from the sender's balance
        _balances[recipient] += amount; // Add the amount to the recipient's balance

        return true;
    }
}
