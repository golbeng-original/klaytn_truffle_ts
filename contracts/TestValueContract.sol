pragma solidity ^0.5.6;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract TestValueContract is Ownable {

    event SendValue(address sender, uint256 value);

    // fallback함수
    function() external payable {
        //
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
    }

    function testSendValue() public payable {

        emit SendValue(msg.sender, msg.value);
    }
}