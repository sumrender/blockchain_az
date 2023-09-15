// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.4.11;

contract Samcoin_ICO {
    uint public max_samcoins = 1000000;
    uint public usd_to_samcoins = 1000;
    uint public total_samcoins_bought = 0;

    mapping(address => uint) equity_samcoins;
    mapping(address => uint) equity_usd;

    modifier can_buy_samcoins(uint usd_invested) {
        require(
            usd_invested * usd_to_samcoins + total_samcoins_bought <=
                max_samcoins
        );
        _;
    }

    function equity_in_samcoins(
        address investor
    ) external constant returns (uint) {
        return equity_samcoins[investor];
    }

    function equity_in_usd(address investor) external constant returns (uint) {
        return equity_usd[investor];
    }

    function buy_samcoins(
        address investor,
        uint usd_invested
    ) external can_buy_samcoins(usd_invested) {
        uint samcoins_bought = usd_invested * usd_to_samcoins;
        equity_samcoins[investor] += samcoins_bought;
        equity_usd[investor] = equity_samcoins[investor] / 1000;
        total_samcoins_bought += samcoins_bought;
    }

    function sell_samcoins(address investor, uint samcoins_sold) external {
        equity_samcoins[investor] -= samcoins_sold;
        equity_usd[investor] = equity_samcoins[investor] / 1000;
        total_samcoins_bought -= samcoins_sold;
    }
}
