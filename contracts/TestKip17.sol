pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP17/KIP17Token.sol";

contract TestKIP17 is KIP17Token {

    constructor() public KIP17Token("TESTNFT", "TNF") {

    }

    // balanceOf(address) returns (uint256)
    
    //

}

