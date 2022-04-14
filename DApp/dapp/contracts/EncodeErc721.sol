// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Encode is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Encode", "ECD") {}

    mapping(address => uint256[]) internal nfts;

    function safeMint(address to, string memory uri) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        nfts[to].push(tokenId);
    }

      function getNfts(address tokenOwner)
        public
        view
        returns (uint256[] memory)
    {
        return nfts[tokenOwner];
    }

    function transferNft(
        address from,
        address to,
        uint256 tokenId
    ) public {
        transferFrom(from, to, tokenId);
        // Correct for zero-indexed array
        uint _index = tokenId-1;
        nfts[to].push(nfts[from][_index]);
        nfts[from][_index] =0;
        // What happens if you swap the two previous commands around?        
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
