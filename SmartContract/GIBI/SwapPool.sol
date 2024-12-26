// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SwapPool {
    address public token;
    uint256 public totalEther = 0;
    uint256 public totalTokens = 0;

    event TokensPurchased(address buyer, uint256 etherAmount, uint256 tokenAmount);
    event TokensSold(address seller, uint256 tokenAmount, uint256 etherAmount);

    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = _token;
    }

    function addLiquidity(uint256 tokenAmount) external payable {
        require(msg.value > 0, "Ether required");
        require(tokenAmount > 0, "Token amount required");

        (bool success, ) = token.call(abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), tokenAmount));
        require(success, "Token transfer failed");

        totalEther += msg.value;
        totalTokens += tokenAmount;
    }

    function getBuyPrice(uint256 ethAmount) public view returns(uint price) {
        price = totalTokens / (totalEther + ethAmount);
    }

    function getSellPrice(uint256 tokenAmount) public view returns(uint256 price) {
        price = (totalTokens + tokenAmount) / totalEther;
    }

    function getPrice() public view returns(uint256 price) {
        price = totalTokens / totalEther;
    }

    function buyTokens() external payable {
        require(msg.value > 0, "Ether required");

        uint256 tokensToBuy = (msg.value * totalTokens) / (totalEther + msg.value);
        require(tokensToBuy <= totalTokens, "Not enough tokens in pool");

        totalEther += msg.value;
        totalTokens -= tokensToBuy;

        (bool success, ) = token.call(abi.encodeWithSignature("transfer(address,uint256)", msg.sender, tokensToBuy));
        require(success, "Token transfer failed");

        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

    function sellTokens(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount required");

        uint256 etherToPay = (tokenAmount * totalEther) / (totalTokens + tokenAmount);
        require(etherToPay <= totalEther, "Not enough Ether in pool");

        totalTokens += tokenAmount;
        totalEther -= etherToPay;

        (bool successTransfer, ) = token.call(abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), tokenAmount));
        require(successTransfer, "Token transfer failed");

        (bool successEther, ) = msg.sender.call{value: etherToPay}("");
        require(successEther, "Ether transfer failed");

        emit TokensSold(msg.sender, tokenAmount, etherToPay);
    }

    function getPoolReserves() external view returns (uint256 etherBalance, uint256 tokenBalance) {
        return (totalEther, totalTokens);
    }

    receive() external payable {
        totalEther += msg.value;
    }
}
