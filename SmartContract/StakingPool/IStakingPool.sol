pragma solidity ^0.8.24;
// SPDX-License-Identifier: MIT

interface IStakingPool {
    struct Plan {
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

    struct Investment {
        uint8 planId;
        uint40 time;
        bool withdrew;
        bool gainReceived;
        uint value;
        uint gain;
    }
/***********************************************************************************************/
/** Owner Methods                                                                             **/
/***********************************************************************************************/
    function changeOwner(address payable _newOwner) external;

    function addPlan(
        uint40 _duration,
        uint8 _apy,
        uint8 _order,
        bool _active        
    ) external;

    function deactivatePlan(uint8 _planId) external;

    function activatePlan(uint8 _planId) external;

    function setPlanOrder(uint8 _planId, uint8 _order) external;

    function getPlansInfo() external view returns(Plan[] memory _plans);

    function getPlanInfo(uint _planId) external view returns(Plan memory _plan);

/***********************************************************************************************/
/** User Methods                                                                              **/
/***********************************************************************************************/
   function getOwner() external view returns(address);

    function amIOwner() external view returns(bool);

    function invest(uint8 _planId, uint _value) external returns(uint _investValue);

    function receiveGain() external returns(uint _gainValue);

    function withdraw() external  returns(uint _withdrawValue);

    function getGainValue() external view returns(uint _gainValue);

    function getSecondsToWithdraw() external view returns(uint40 _seconds);

    function getWithdrawableValue() external view  returns(uint _withdrawValue);

    function getInvestments() external view returns(Investment[] memory _investments);

    function getInfo() external view returns(
        uint _investmentSum,
        uint _gainReceivedSum,
        uint _withdrawalSum
    );

    function getPlans() external view returns(Plan[] memory _activePlans);

    function getSystemInfo() external view returns(
        uint _investorCount,
        uint _investmentCount,
        uint _totalInvestment,
        uint _totalGainReceived,
        uint _totalWithdrawal,
        uint _currentInvestmentSum,
        uint _availableTokenAmount
    );

 
}