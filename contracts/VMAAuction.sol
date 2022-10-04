// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "hardhat/console.sol";

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IVMAAuction} from "./interfaces/IVMAAuction.sol";
import {IVoiceMaskAlpha} from "./interfaces/IVoiceMaskAlpha.sol";

contract VMAAuction is IVMAAuction, Pausable, ReentrancyGuard, Ownable {
    IVoiceMaskAlpha public voiceMaskAlpha;

    uint256 public timeBuffer;

    uint256 public reservePrice;

    uint256 public duration;

    uint8 public minBidIncrementPercentage;

    IVMAAuction.Auction public auction;

    constructor(
        IVoiceMaskAlpha _alpha, //alpha nft
        uint256 _timeBuffer, //새 입찰 생성되고 옥션에 남은 최소 시간 줌. 300 = 5분
        uint256 _reservePrice, //최저가 1 => 0만 아니면됨
        uint256 _duration, //하나의 옥션이 몇분동안 진행되는지 86400 = 1일
        uint8 _minBidIncrementPercentage //비드 증감율
    ) {
        _pause();

        voiceMaskAlpha = _alpha;
        timeBuffer = _timeBuffer;
        reservePrice = _reservePrice;
        duration = _duration;
        minBidIncrementPercentage = _minBidIncrementPercentage;
    }

    function settleCurrentAndCreateNewAuction()
        external
        override
        nonReentrant
        whenNotPaused
    {
        _settleAuction();
        _createAuction();
    }

    /**
     * Settle the current auction.
     * This function can be called when the contract is paused.
     */
    function settleAuction() external override whenPaused nonReentrant {
        _settleAuction();
    }

    /**
     * Create a bid for an Alpha, with a given value.
     */
    function createBid(uint256 alphaId) external payable override whenNotPaused nonReentrant {
        IVMAAuction.Auction memory _auction = auction;

        require(block.timestamp < _auction.endTime, "Auction is expired");
        require(_auction.alphaId == alphaId, "Not for this auction");
        require(msg.value >= reservePrice, "Send at least reservePrice");
        require(
            msg.value >=
                _auction.price +
                    ((_auction.price * minBidIncrementPercentage) / 100),
            "Increase the bid by minBidIncrementPercentage"
        );

        address payable lastBidder = _auction.bidder;

        // Refund the last bidder
        if (lastBidder != address(0)) {
            _transferEtH(lastBidder, _auction.price);
        }

        auction.price = msg.value;
        auction.bidder = payable(msg.sender);

        // Extend the auction if bidded within timeBuffer time before the auction ends.
        bool extended = _auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auction.endTime = _auction.endTime = block.timestamp + timeBuffer;
        }

        emit AuctionBid(_auction.alphaId, msg.sender, msg.value, extended);

        if (extended) {
            emit AuctionExtended(_auction.alphaId, _auction.endTime);
        }
    }

    /**
     * Pause the auction.
     * CreateBid is unactivated by this function.
     * The auction can be settled by anyone after the endtime has passed.
     */ 
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * Unpause the auction.
     * If there is no active auction, this function will start a new auction.
     */
    function unpause() external override onlyOwner {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    function setTimeBuffer(uint256 _timeBuffer) external override onlyOwner {
        timeBuffer = _timeBuffer;

        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    function setReservePrice(uint256 _reservePrice)
        external
        override
        onlyOwner
    {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    function setMinBidIncrementPercentage(uint8 _minBidIncrementPercentage)
        external
        override
        onlyOwner
    {
        minBidIncrementPercentage = _minBidIncrementPercentage;

        emit AuctionMinBidIncrementPercentageUpdated(
            _minBidIncrementPercentage
        );
    }

    /**
     * Create an auction.
     * Store the auction details in the auction state variable.
     * If the mint reverts, the minter was updated without pausing this contract first. To remedy this,
     * catch the revert and pause this contract.
     */
    function _createAuction() internal {
        try voiceMaskAlpha.mintAuction() returns (uint256 alphaId) {
            
            uint256 startTime = block.timestamp;
            uint256 endTime = startTime + duration;

            auction = Auction({
                alphaId: alphaId,
                price: 0, //입찰가
                startTime: startTime,
                endTime: endTime,
                bidder: payable(0),
                settled: false
            });

            emit AuctionCreated(alphaId, startTime, endTime);
        } catch Error(string memory error) {
            // console.log(error);
            _pause();
            emit AuctionCreateFailed(error);
        }
    }

    /**
     *  Settle an auction. Finish the bid and payment.
     *  If there is no bid the Alpha NFT is burned.
     */
    function _settleAuction() internal {
        IVMAAuction.Auction memory _auction = auction;

        require(block.timestamp >= _auction.endTime, "Auction is active");
        require(!_auction.settled, "Auction is settled already");
        require(_auction.startTime != 0, "Auction didn't start yet");

        auction.settled = true;

        if (_auction.bidder == address(0)) {
            voiceMaskAlpha.burn(_auction.alphaId);
        } else {
            voiceMaskAlpha.transferFrom(
                address(this),
                _auction.bidder,
                _auction.alphaId
            );
        }

        if (_auction.price > 0) {
            //send money to the owner EOA
            _transferEtH(owner(), _auction.price);
        }

        emit AuctionSettled(_auction.alphaId, _auction.bidder, _auction.price);
    }

    /**
     * Transfer ETH.
     */
    function _transferEtH(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            //리펀 실패시
            emit AuctionRefundFailed(to, amount);
        }
    }

    /**
     * Transfer ETH and return the success status.
     * This function only forwards 30,000 gas to the callee.
     */
    function _safeTransferETH(address to, uint256 value)
        internal
        returns (bool)
    {
        (bool success, ) = to.call{value: value, gas: 30000}(new bytes(0));
        return success;
    }
}