pragma solidity ^0.8.24;
// SPDX-License-Identifier: MIT

import "./Ownable.sol";
import "./ERC20base.sol";

contract Burnable is Ownable, ERC20base {

    function burn(uint256 _value) public  hasEnaughBalance(msg.sender, _value) returns(bool) {
        _balances[msg.sender] -= _value;
        _totalSupply -= _value;
        emit Transfer(msg.sender, address(0), _value);
        return true;
    }

    function burnFrom(address _from, uint256 _value) public virtual hasEnaughBalance(_from, _value) returns(bool) {
        require(_value <= _allowed[_from][address(0)], "Transfer value is not allowed.");
        _balances[_from] -= _value;
        _allowed[_from][msg.sender] -= _value;
        _totalSupply -= _value;
        emit Transfer(_from, address(0), _value);
        return true;
    }
}