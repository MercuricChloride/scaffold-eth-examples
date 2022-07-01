pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract SimpleSBT is ERC721{

  uint public totalSupply;
  mapping (uint => string) public metadata;

  event Mint(address mintedTo, uint256 tokenId);
  event MetadataAdded(string metadata);
  event Revoked(address revokedBy, uint256 tokenId);

  constructor(string memory _name, string memory _symbol, address[] memory _initial)ERC721(_name, _symbol) {
    for(uint i; i < _initial.length; i++){
      totalSupply++;
      _mint(_initial[i], totalSupply);
    }
  }

  //@notice Mints a new token to the given address, can only be called by owners of this SBT or the owner of the contract
  function mint(address _to) public {
    require(balanceOf(msg.sender) > 0, "Only owners of this SBT can mint tokens.");
    totalSupply++;
    _mint(_to, totalSupply);
    emit Mint(_to, totalSupply);
  }

  //@notice Function to fetch the metadata of a token
  function getMetadata(uint256 _tokenId) public view returns (string memory _metadata) {
    _metadata = string(Base64.decode(metadata[_tokenId]));
  }

  //@notice Function to add or update metadata of a token
  function setTokenMetadata(uint256 _tokenId, string memory _metadata) public {
    require(ownerOf(_tokenId) == msg.sender, "Only the owner can set their metadata");
    metadata[_tokenId] = Base64.encode(bytes(_metadata));
  }

  //@notice a function that gets called before any token is transferred. Forces the owner to only be able to revoke the token.
  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal pure override {
    require(to == address(0) || from == address(0), "This token can only be burned");
  }

  function burn(uint256 _tokenId) public {
    require(ownerOf(_tokenId) == msg.sender, "Only the owner can burn their token");
    _burn(_tokenId);
    emit Revoked(msg.sender, _tokenId);
  }

}
