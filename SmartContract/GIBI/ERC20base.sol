pragma solidity ^0.8.24;
// SPDX-License-Identifier: MIT

contract ERC20base {
    string internal _name;
    string internal _symbol;
    uint256 internal _decimals;
    uint256 internal _totalSupply;

    mapping(address => uint256) internal _balances;
    mapping(address => mapping(address => uint256)) internal _allowed;
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    modifier hasEnaughBalance(address _sender, uint _value) {
        require(_value <= _balances[_sender], "Out of balance.");
        _;
    }

    function name() public view returns(string memory) {
        return(_name);
    }
    
    function symbol() public view returns(string memory) {
        return(_symbol);
    }
    
    function decimals() public view returns(uint256) {
        return(_decimals);
    }
    
    function totalSupply() public view returns(uint256) {
        return(_totalSupply);
    }
    
    function balanceOf(address _owner) public view returns(uint256) {
        return(_balances[_owner]);
    }
    
    function transfer(address _to, uint256 _value) public virtual hasEnaughBalance(msg.sender, _value) returns(bool) {
        require(_to != address(0), "Receiver address is not valid.");
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public virtual hasEnaughBalance(_from, _value) returns(bool) {
        require(_value <= _allowed[_from][msg.sender], "Transfer value is not allowed.");
        require(_to != address(0), "Receiver value is not valid.");
        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public hasEnaughBalance(msg.sender, _value) returns(bool) {
        require(_spender != address(0), "Spender address is not valid.");
        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function allowance(address _owner, address _spender) public view returns(uint256) {
        return _allowed[_owner][_spender];
    }
    
}