// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVoiceMaskAlpha} from "./interfaces/IVoiceMaskAlpha.sol";
import {ERC721A} from "erc721a/contracts/ERC721A.sol";
import {ERC721AQueryable} from "erc721a/contracts/extensions/ERC721AQueryable.sol";

contract VoiceMaskAlpha is IVoiceMaskAlpha, ERC721A, ERC721AQueryable, Ownable {
    constructor() ERC721A("Voice Mask Alpha", "VMA") {}

    address public minter;
    string private baseURI;
    uint256 public auctionSupply = 140;
    uint256 public teamSupply = 60;
    uint256 public auctionCount = 0;
    uint256 public teamCount = 0;

    modifier onlyMinter() {
        require(msg.sender == minter, "Sender is not the minter");
        _;
    }

    function mintAuction() external onlyMinter returns (uint256) {
        require(
            auctionCount + 1 <= auctionSupply,
            "Auction supply all sold out"
        );
        auctionCount++;
        return _mintTo(msg.sender, 1);
    }

    function mintTeam(address to, uint256 quantity)
        external
        onlyOwner
        returns (uint256)
    {
        require(teamCount + quantity <= teamSupply, "Team supply all sold out");

        teamCount++;
        return _mintTo(to, quantity);
    }

    function burn(uint256 alphaId) public override {
        require(ownerOf(alphaId) == msg.sender, "Sender does not own it");
        _burn(alphaId);
        emit AlphaBurned(alphaId);
    }

    function setBaseURI(string memory uri) external onlyOwner {
        baseURI = uri;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
        emit MinterUpdated(minter);
    }

    function setAuctionSupply(uint256 _maxMint) external onlyOwner {
        auctionSupply = _maxMint;
    }

    function setTeamSupply(uint256 _maxMint) external onlyOwner {
        teamSupply = _maxMint;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _mintTo(address to, uint256 quantity) internal returns (uint256) {
        require(
            _totalMinted() + quantity <= auctionSupply + teamSupply,
            "All sold out"
        );

        _mint(to, quantity);
        emit AlphaCreated(_totalMinted(), to);

        return _nextTokenId() - 1;
    }
}
