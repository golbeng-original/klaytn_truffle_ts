pragma solidity ^0.5.6;

import "@klaytn/contracts/drafts/Counters.sol";
import "@klaytn/contracts/math/SafeMath.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "@klaytn/contracts/token/KIP17/IKIP17.sol";

contract WhiteMint is Ownable, ReentrancyGuard {

    using SafeMath for uint256;
    using Counters for Counters.Counter;

    uint256 public MAX_MINT_COUNT = 3000;

    // 20 KLAY (추후에 pub으로 변경)
    uint public constant nftPrice = 20;

    // 5개씩 구입 가능
    uint public maxMintPerAddress = 5;

    // KIP17 배포 주소
    address private _kip17Address = address(0);
    IKIP17 private _kip17Contract;

    // mint 된 갯수
    uint256 private _currentIndex = 0;

    //Counters.Counter private _mintedCount;

    // address 별 mint 된 count
    mapping(address => uint) _mintedPerAddress;

    // 생성 당시 배포할 tokenId를 
    //uint256[] private _remainTokens;
    bool private _transferIsActive = false;
    uint256 private _startTokenId = 0;
    uint256 private _endTokenId = 0;

    constructor(uint256 startTokenId, uint256 endTokenId, address kip17Address) public {
        _startTokenId = startTokenId;
        _endTokenId = endTokenId;

        _kip17Address = kip17Address;
        _kip17Contract = IKIP17(kip17Address);
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    // fallback함수
    function() external payable {
        //
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
    }

    function setMintActive(bool active) public onlyOwner {
        _transferIsActive = active;
    }

    function mint(uint numberOfTokens) public payable
    nonReentrant
    {
        uint256 startIndex = _currentIndex;

        // 갯수가 0개 이상이여야 한다.
        require(numberOfTokens > 0, "Muse mint more than 0 tokens");

        // mint가 active 되었나?
        require(_transferIsActive, "Sale must be active to mint");
        
        // startTokenId, endTokenId 설정이 정상적인가?
        require(_startTokenId > 0 && _startTokenId <= _endTokenId, "mint startTokenId muse be set");
        
        // 요청 mint갯수가 전체 갯수를 넘어서는가?
        require(_currentIndex.add(numberOfTokens) <= MAX_MINT_COUNT, "total minting count would exceed max supply");

        // address 관점

        // whitelist address 인가??

        // msg.sender가 충분한 value가 있는가?
        require(nftPrice.mul(numberOfTokens) <= msg.value, "Klay value sent is not correct");

        // msg.sender가 mint 실행할 startTokenId가 정상적인가?
        require(_startTokenId.add(startIndex) > 0 && _startTokenId.add(startIndex) <= _endTokenId, "expected startTokenId over _endTokenId");

        // msg.sender에게 할당 된 token 갯수를 안 넘었는가?
        require(_mintedPerAddress[msg.sender] <= maxMintPerAddress, "address minting count would exceed per count");
        

        uint256 updatedIndex = startIndex;
        // mint
        for(uint8 i = 0 ; i < numberOfTokens ; i++)
        {
            uint256 mintTokenId = _startTokenId + updatedIndex;

            // kip17 불러오기 (safeTransferFrom)
            // from, to, uint256
            _kip17Contract.safeTransferFrom(address(this), msg.sender, mintTokenId);

            updatedIndex++;
        }

        _currentIndex = updatedIndex;
    }
}