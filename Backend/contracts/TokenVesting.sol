// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './CustomToken.sol';

/// @title A token vesting contract
/// @dev Manages token vesting schedules for different stakeholder categories
contract TokenVesting {
    /// @dev The address of the admin who can manage the vesting schedules
    address private _admin;

    /// @dev Instance of the CustomToken contract
    CustomToken private _tokenContract;

    /// @dev Enum to define different stakeholder categories
    enum StakeholderCategory { Community, Validators, Investors }

    /// @dev Struct to define the vesting schedule for stakeholders
    struct VestingSchedule {
        uint256 totalTokens; // Total tokens allocated for the schedule
        uint256 releaseStart; // Start timestamp of the release period
        uint256 releaseEnd; // End timestamp of the release period
        uint256 releasedTokens; // Number of tokens already released
    }

    /// @dev Mapping to store whitelisted addresses
    mapping(address => bool) private _whitelist;

    /// @dev Mapping to categorize stakeholders
    mapping(address => StakeholderCategory) private _stakeholderCategories;

    /// @dev Mapping of vesting schedules by stakeholder category
    mapping(StakeholderCategory => VestingSchedule) private _vestingSchedules;

    /// @notice Creates a new TokenVesting instance
    /// @param tokenContractAddress The address of the CustomToken contract
    constructor(address tokenContractAddress) {
        _admin = msg.sender;
        _tokenContract = CustomToken(tokenContractAddress);
    }

    /// @notice Ensures only the admin can call certain functions
    modifier onlyAdmin() {
        require(msg.sender == _admin, "Only the admin can perform this transaction");
        _;
    }

    /// @notice Ensures only whitelisted addresses can call certain functions
    modifier onlyWhitelisted() {
        require(_whitelist[msg.sender], "Only whitelisted addresses can perform this transaction");
        _;
    }

    /// @notice Whitelists multiple addresses
    /// @dev Can only be called by the admin
    /// @param addresses An array of addresses to whitelist
    function whitelistAddresses(address[] calldata addresses) external onlyAdmin {
        for (uint256 i = 0; i < addresses.length; i++) {
            _whitelist[addresses[i]] = true;
        }
    }

    /// @notice Creates a vesting schedule for a stakeholder category
    /// @dev Can only be called by the admin
    /// @param category The stakeholder category
    /// @param totalTokens The total tokens allocated for the schedule
    /// @param releaseStart The start timestamp for the release period
    /// @param releaseEnd The end timestamp for the release period
    function createVestingSchedule(
        StakeholderCategory category,
        uint256 totalTokens,
        uint256 releaseStart,
        uint256 releaseEnd
    ) external onlyAdmin {
        require(totalTokens > 0, "Tokens must be greater than zero");
        require(releaseStart < releaseEnd, "Release period must be in the future");

        _vestingSchedules[category] = VestingSchedule({
            totalTokens: totalTokens,
            releaseStart: releaseStart,
            releaseEnd: releaseEnd,
            releasedTokens: 0
        });
    }

    /// @notice Assigns a stakeholder category to an address
    /// @dev Can only be called by the admin
    /// @param beneficiary The address of the stakeholder
    /// @param category The category to assign
    function setCategorizedAddress(address beneficiary, StakeholderCategory category) external onlyAdmin {
        require(beneficiary != address(0), "Invalid beneficiary address");
        _stakeholderCategories[beneficiary] = category;
    }

    /// @notice Releases tokens according to the vested schedule
    /// @dev Can only be called by whitelisted addresses
    function releaseTokens() external onlyWhitelisted {
        StakeholderCategory category = _stakeholderCategories[msg.sender];
        require(category != StakeholderCategory(0), "No stakeholder category found for this caller");

        VestingSchedule storage schedule = _vestingSchedules[category];
        require(schedule.totalTokens > 0, "No vesting schedule found for this caller");

        uint256 tokensToRelease = calculateTokensToRelease(schedule);
        require(tokensToRelease > 0, "No tokens available for release");

        schedule.releasedTokens += tokensToRelease;

        bool transferSuccess = _tokenContract.transfer(msg.sender, tokensToRelease);
        require(transferSuccess, "Token transfer failed");
    }

    /// @dev Calculates the number of tokens to release for a given vesting schedule
    /// @param schedule The vesting schedule to use for calculation
    /// @return The number of tokens available for release
    function calculateTokensToRelease(VestingSchedule memory schedule) private view returns (uint256) {
        uint256 currentTimestamp = block.timestamp;
        if (currentTimestamp < schedule.releaseStart) {
            return 0;
        } else if (currentTimestamp >= schedule.releaseEnd) {
            return schedule.totalTokens - schedule.releasedTokens;
        } else {
            uint256 timePassed = currentTimestamp - schedule.releaseStart;
            uint256 totalTime = schedule.releaseEnd - schedule.releaseStart;
            uint256 tokensPerSecond = schedule.totalTokens / totalTime;
            uint256 tokensToRelease = timePassed * tokensPerSecond - schedule.releasedTokens;
            return tokensToRelease;
        }
    }
}
