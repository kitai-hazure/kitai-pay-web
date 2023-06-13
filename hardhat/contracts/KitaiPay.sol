// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./IERC20.sol";
import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

struct PaymentData {
    address to;
    address token;
    uint256 amount;
}

struct FlowData {
    address to;
    address token;
    int96 flowRate;
}

contract KitaiPay {
    event Payment(address indexed from, PaymentData[] indexed items);

    using SuperTokenV1Library for ISuperToken;

    function sendTokens(PaymentData[] memory items) public {
        for (uint256 i = 0; i < items.length; i++) {
            PaymentData memory item = items[i];
            IERC20(item.token).transferFrom(msg.sender, item.to, item.amount);
        }
        emit Payment(msg.sender, items);
    }

    function createFlows(FlowData[] memory items) external {
        for (uint256 i = 0; i < items.length; i++) {
            FlowData memory item = items[i];
            ISuperToken(item.token).createFlowFrom(
                msg.sender,
                item.to,
                item.flowRate
            );
        }
    }

    function deleteFlows(FlowData[] memory items) external {
        for (uint256 i = 0; i < items.length; i++) {
            FlowData memory item = items[i];
            ISuperToken(item.token).deleteFlow(msg.sender, item.to, "");
        }
    }
}
