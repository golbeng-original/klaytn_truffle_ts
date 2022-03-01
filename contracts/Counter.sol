pragma solidity ^0.5.6;

contract Counter {

    uint256 private _value;

    event PlusEvent(address indexed executer, uint256 value);
    event MinusEvent(address indexed executer, uint256 value);

    function getValue() external view returns (uint256) {
        return _value;
    }

    function plus() public {
        _value = _value + 1;

        emit PlusEvent(msg.sender, _value);
    }

    function minus() public {
        _value = _value - 1;

        emit MinusEvent(msg.sender, _value);
    }

}