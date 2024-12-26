// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Data.sol";

contract UserOperations is Data {
    
    function invest(uint8 _planId, uint _value) public returns(uint _investValue)  {
        uint _allowance = gibi.allowance(msg.sender, address(this));
        require(_value > 0, "Invalid investment value.");
        require(_allowance >= _value, "You must approve to pay GIBI to the contract");
        require(gibi.transferFrom(msg.sender, address(this), _value));
        Investment storage _investment = investments[msg.sender][userInvestmentCount[msg.sender]];
        Plan storage _plan = plans[_planId];
        require(_value >= _plan.minInvestment, "Value is less than minimum investment value.");
        _investment.planId = _planId;
        _investment.time = uint40(block.timestamp);
        _investment.value = _value;
        investmentCount ++;
        totalInvestment += _value;
        if (userInvestmentCount[msg.sender] == 0)
            investorCount ++;
        userInvestmentCount[msg.sender] ++;
        _plan.investmentCount ++;
        _plan.investmentSum += _value;
        _investValue = _value;
        emit Invested(msg.sender, _planId, _value);
    }

    function receiveGain() public returns(uint _gainValue) {
        _gainValue = 0;
        uint _investmentCount = userInvestmentCount[msg.sender];
        for (uint i = 0; i < _investmentCount; i ++) {
            Investment storage _investment = investments[msg.sender][i];
            if (! _investment.gainReceived) {
                (uint _gain, bool _gainReceived) = getInvestmentGain(msg.sender, i);
                if (_gain > 0) {
                    _gainValue += _gain;
                    _investment.gain += _gain;
                    if (_gainReceived)
                        _investment.gainReceived = true;
                    plans[_investment.planId].gainSum += _gain;
                }
            }
        }
        require(_gainValue > 0, "No gain is acceible.");
        require(gibi.transfer(msg.sender, _gainValue), "Not transferred.");
        totalGain += _gainValue;
        emit GainReceived(msg.sender, _gainValue);
    }

    function withdraw() public  returns(uint _withdrawValue) {
        uint _gainValue = 0;
        _withdrawValue = 0;
        uint _investmentCount = userInvestmentCount[msg.sender];
        for (uint i = 0; i < _investmentCount; i ++) {
            Investment storage _investment = investments[msg.sender][i];
            if (! _investment.gainReceived) {
                (uint _gain, bool _gainReceived) = getInvestmentGain(msg.sender, i);
                if (_gain > 0) {
                    _gainValue += _gain;
                    _investment.gain += _gain;
                    if (_gainReceived)
                        _investment.gainReceived = true;
                plans[_investment.planId].gainSum += _gain;
                }
            }
            if (! _investment.withdrew && uint256(_investment.time + plans[_investment.planId].duration) >= block.timestamp) {
                _investment.withdrew = true;
                _withdrawValue += _investment.value;
            }
        }
        uint _totalValue = 0;
        require(_withdrawValue > 0, "No withdrawable value is accessible.");
        if (_gainValue > 0) {
            _totalValue += _gainValue;
            totalGain += _gainValue;
            emit GainReceived(msg.sender, _gainValue);
        }
        _totalValue += _withdrawValue;
        totalWithdraw += _withdrawValue;
        emit Withdrew(msg.sender, _withdrawValue);
        require(gibi.transfer(msg.sender, _totalValue), "Not transferred.");
    }

    function getGainValue() public view returns(uint _gainValue) {
        _gainValue = 0;
        uint _investmentCount = userInvestmentCount[msg.sender];
        for (uint i = 0; i < _investmentCount; i ++) {
            Investment memory _investment = investments[msg.sender][i];
            if (! _investment.gainReceived) {
                (uint _gain, ) = getInvestmentGain(msg.sender, i);
                if (_gain > 0)
                    _gainValue += _gain;
            }
        }
    }

    function getSecondsToWithdraw() public view returns(uint40 _seconds) {
        _seconds = 0;
        uint40 _minWithdrawTime = uint40(block.timestamp) + 315_360_000; // 10 years later
        bool _timeSet;
        uint _investmentCount = userInvestmentCount[msg.sender];
        for (uint i = 0; i < _investmentCount; i ++) {
            Investment memory _investment = investments[msg.sender][i];
            if (! _investment.withdrew) {
                uint40 _withdrawTime = _investment.time + plans[_investment.planId].duration;
                if (_withdrawTime > block.timestamp && _withdrawTime < _minWithdrawTime) {
                    _minWithdrawTime = _withdrawTime;
                    _timeSet = true;
                }
            }
        }
        if (_timeSet)
            _seconds = _minWithdrawTime - uint40(block.timestamp);
    }

    function getWithdrawableValue() public view  returns(uint _withdrawValue) {
        _withdrawValue = 0;
        uint _investmentCount = userInvestmentCount[msg.sender];
        for (uint i = 0; i < _investmentCount; i ++) {
            Investment memory _investment = investments[msg.sender][i];
            if (! _investment.withdrew && block.timestamp - _investment.time > plans[_investment.planId].duration) {
                _withdrawValue += _investment.value;
            }
        }
    }

    function getInvestments() public view returns(Investment[] memory _investments) {
        uint _investmentCount = userInvestmentCount[msg.sender];
        _investments = new Investment[](_investmentCount);
        for (uint i = 0; i < _investmentCount; i ++) 
            _investments[i] = investments[msg.sender][i];
    }

    function getInfo() public view returns(
        uint _investmentSum,
        uint _gainReceivedSum,
        uint _withdrawalSum
    ) {
        _investmentSum = 0;
        _gainReceivedSum = 0;
        _withdrawalSum = 0;
        uint _investmentCount = userInvestmentCount[msg.sender];
        for (uint i = 0; i < _investmentCount; i ++) {
            Investment memory _investment = investments[msg.sender][i];
            _investmentSum += _investment.value;
            _gainReceivedSum += _investment.gain;
            if (_investment.withdrew)
                _withdrawalSum += _investment.value;
        }

    }

    function getPlans() public view returns(Plan[] memory _activePlans) {
        uint _planCount = 0;
        for (uint i = 0; i < plans.length; i ++)
            if (plans[i].active)
                _planCount ++;
        _activePlans = new Plan[](_planCount);
        _planCount = 0;
        for (uint i = 0; i < plans.length; i ++)
            if (plans[i].active) {
                _activePlans[_planCount] = plans[i];
                _planCount ++;
            }
    }

    function getSystemInfo() public view returns(
        uint _investorCount,
        uint _investmentCount,
        uint _totalInvestment,
        uint _totalGainReceived,
        uint _totalWithdrawal,
        uint _currentInvestmentSum,
        uint _availableTokenAmount
    ) {
        _totalInvestment = totalInvestment;
        _totalGainReceived = totalGain;
        _totalWithdrawal = totalWithdraw;
        _investorCount = investorCount;
        _investmentCount = investmentCount;
        _currentInvestmentSum = _totalInvestment - _totalWithdrawal;
        _availableTokenAmount = gibi.balanceOf(address(this));
    }

    function getInvestmentGain(address _userAddress, uint _investmentId) internal view returns(uint _gain, bool _gainReceived) {
        Investment memory _investment = investments[_userAddress][_investmentId];
        uint8 _planId = _investment.planId;
        uint40 _maxDuration = plans[_planId].duration;
        uint40 _duration;
        if (uint40(block.timestamp) > _investment.time + _maxDuration) {
            _gainReceived = true;
            _duration = _maxDuration;
        } else {
            _gainReceived = false;
            _duration = uint40(block.timestamp) - _investment.time;
        }
        _gain = _duration * plans[_planId].apy * _investment.value / 3_153_600_000 - _investment.gain; // 3_153_600_000 = 365* 24 * 60 * 60 * 100
    }

}
