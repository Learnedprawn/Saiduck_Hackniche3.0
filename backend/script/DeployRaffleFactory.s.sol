//SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {RaffleFactory} from "../src/RaffleFactory.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployRaffleFactory is Script {
    function run() public {
        HelperConfig helperConfig = new HelperConfig(); // This comes with our mocks!
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        vm.startBroadcast();
        new RaffleFactory(config.subscriptionId, config.gasLane, config.callbackGasLimit, config.vrfCoordinatorV2_5);
        vm.stopBroadcast();
    }
}
