// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract Data {
    
    IERC20 gibi = IERC20(0x6889F60A8D98C18D1B5eF67c6982730E860d631c);
    uint totalInvestment = 0;
    uint totalWithdraw = 0;
    uint totalGain = 0;
    uint investorCount = 0;
    uint investmentCount = 0;

    struct Plan {
        uint index;
        uint40 duration;
        uint8 apy;
        uint8 order;
        bool active;
        uint minInvestment;
        uint investmentCount;
        uint investmentSum;
        uint gainSum;
        uint wathdrawalSum;
    }

    Plan[] plans;

    struct Investment {
        uint8 planId;
        uint40 time;
        bool withdrew;
        bool gainReceived;
        uint value;
        uint gain;
    }

    mapping(address => mapping(uint => Investment)) investments;
    mapping(address => uint) userInvestmentCount;

    event Invested(address indexed userAddress, uint8 planId, uint value);
    event GainReceived(address indexed userAddress, uint value);
    event Withdrew(address indexed userAddress, uint value);

    modifier isPlanIdCorrect(uint _planId) {
        require(_planId < plans.length, "Invalid plan id.");
        _;
    }

    constructor() {
        plans.push(Plan({
            index: 0,
            minInvestment: 0,
            duration: 0,
            apy: 0,
            order: 0,
            active: false,
            investmentCount: 0,
            investmentSum: 0,
            gainSum: 0,
            wathdrawalSum: 0
        }));
        plans.push(Plan({
            index: 1,
            minInvestment: 0,
            duration: 3 * 86400,
            apy: 35,
            order: 1,
            active: true,
            investmentCount: 0,
            investmentSum: 0,
            gainSum: 0,
            wathdrawalSum: 0
        }));
        plans.push(Plan({
            index: 2,
            minInvestment: 0,
            duration: 14 * 86400,
            apy: 38,
            order: 2,
            active: true,
            investmentCount: 0,
            investmentSum: 0,
            gainSum: 0,
            wathdrawalSum: 0
        }));
        plans.push(Plan({
            index: 3,
            minInvestment: 0,
            duration: 30 * 86400,
            apy: 42,
            order: 3,
            active: true,
            investmentCount: 0,
            investmentSum: 0,
            gainSum: 0,
            wathdrawalSum: 0
        }));
    }
}