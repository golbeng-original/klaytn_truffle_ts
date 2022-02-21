pragma solidity ^0.5.6;

contract Counter {

    uint256 private _value;

    function getValue() external view returns (uint256) {
        return _value;
    }

    function plus() public {
        _value = _value + 1;
    }

    function minus() public {
        _value = _value - 1;
    }

}