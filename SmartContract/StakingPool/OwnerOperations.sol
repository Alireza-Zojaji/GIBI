// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Data.sol";
import "./Ownable.sol";

contract OwnerOperations is Data, Ownable {

    function addPlan(
        uint40 _duration,
        uint8 _apy,
        uint8 _order,
        uint _minInvestment,
        bool _active        
    ) public isOwner {
        require(_duration > 0, "Invalid duration.");
        require(_apy > 0, "Invalid APY.");
        Plan memory _plan;
        _plan.index = plans.length;
        _plan.duration = _duration;
        _plan.apy = _apy;
        _plan.order = _order;
        _plan.minInvestment = _minInvestment;
        _plan.active = _active;
        plans.push(_plan);
    }

    function deactivatePlan(uint8 _planId) public isPlanIdCorrect(_planId) isOwner {
        require(plans[_planId].active, "Plan is not active.");
        plans[_planId].active = false;
    }

    function activatePlan(uint8 _planId) public isPlanIdCorrect(_planId) isOwner {
        require(! plans[_planId].active, "Plan is active.");
        plans[_planId].active = true;
    }

    function setPlanOrder(uint8 _planId, uint8 _order) public isPlanIdCorrect(_planId) isOwner {
        plans[_planId].order = _order;
    }

    function getPlansInfo() public view isOwner returns(Plan[] memory _plans) {
        _plans = new Plan[](plans.length);
        _plans = plans;
    }

    function getPlanInfo(uint _planId) public view isPlanIdCorrect(_planId) isOwner returns(Plan memory _plan) {
        _plan = plans[_planId];
    }

}
