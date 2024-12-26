pragma solidity ^0.8.24;
// SPDX-License-Identifier: MIT

import "./Burnable.sol";

// Deployed on BASE: 0x6889F60A8D98C18D1B5eF67c6982730E860d631c

contract GIBI is Burnable {

    address initialWallet = 0xd317e1703543B61193fEB7E12d93730CA62B4484;
    
    constructor() {
        _name = 'Giggle Bits';
        _symbol = 'GIBI';
        _decimals = 18;
        _totalSupply = 1e29;
        _balances[initialWallet] = _totalSupply;
    }

}