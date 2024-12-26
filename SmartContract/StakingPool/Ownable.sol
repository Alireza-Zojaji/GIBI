pragma solidity ^0.8.24;
// SPDX-License-Identifier: MIT

contract Ownable {
    address payable _owner;

    modifier isOwner {
        require(msg.sender == _owner,"You should be owner to call this function.");
        _;
    }
    
    constructor() {
        _owner = payable(msg.sender);
    }

    function changeOwner(address payable _newOwner) public isOwner {
        require(_owner != _newOwner,"You must enter a new owner.");
        _owner = _newOwner;
    }

    function getOwner() public view returns(address) {
        return(_owner);
    }

    function amIOwner() public view returns(bool) {
        return(msg.sender == _owner);
    }

}