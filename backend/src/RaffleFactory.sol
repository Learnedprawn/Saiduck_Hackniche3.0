// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Raffle} from "./Raffle.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

contract RaffleFactory {
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    address private immutable i_vrfCoordinatorV2;

    constructor(
        uint256 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit,
        address vrfCoordinatorV2
    ) {
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_vrfCoordinatorV2 = vrfCoordinatorV2;
        // uint256 balance = address(this).balance;
        // if (balance > 0) {
        //     payable(msg.sender).transfer(balance);
        // }
    }

    uint256 s_raffleCounter = 0;
    mapping(uint256 raffleId => address raffle) public raffles;
    mapping(uint256 raffleId => uint256 entranceFee) public raffleEntranceFees;
    uint256[] public raffleEntranceFeesArray;

    function createRaffle(uint256 interval, uint256 entranceFee) public returns (Raffle) {
        Raffle raffle =
            new Raffle(i_subscriptionId, i_gasLane, interval, entranceFee, i_callbackGasLimit, i_vrfCoordinatorV2);
        s_raffleCounter++;
        raffles[s_raffleCounter] = address(raffle);
        return raffle;
    }

    function getAndUpdateRaffleEntranceFeesArray() public returns (uint256[] memory) {
        for (uint256 i = 0; i < s_raffleCounter; i++) {
            raffleEntranceFeesArray.push(raffleEntranceFees[i]);
        }
        return raffleEntranceFeesArray;
    }
}
