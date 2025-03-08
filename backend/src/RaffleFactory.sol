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

contract RaffleFactory {

    uint256 s_raffleCounter = 0;
    mapping(uint256 raffleId => address raffle) public raffles;

    function createRaffle(uint256 subscriptionId, bytes32 gasLane, uint256 interval, uint256 entranceFee, uint32 callbackGasLimit, address vrfCoordinatorV2) public returns (Raffle) {

        

        Raffle raffle = new Raffle(subscriptionId, gasLane, interval, entranceFee, callbackGasLimit, vrfCoordinatorV2);
        s_raffleCounter++;
        raffles[s_raffleCounter] = address(raffle);
        return raffle;
        
    }

    // function getAllRaffle() public view returns (address[] memory) {
    //     for (uint256 i = 0; i < s_raffleCounter; i++) {
    //         raffleAddresses[i] = raffles[i];
    //     }
    //     return raffleAddresses;
    // }

}