// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.0 <0.9.0;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
contract NFTClase is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
 
    using Strings for uint256;
 
    mapping(uint256 => string) private _tokenURIs;
    string private _baseURIextended;
 
    event MintedNFT(address recipient, uint256 tokenId, string tokenURI);
    event BaseURIUpdated(string baseURI);
 
    constructor() ERC721("NFTClase", "NFTC") {
        // Constructor vacío
    }
 
    function setBaseUri(string memory baseUri) external onlyOwner {
        _baseURIextended = baseUri;
        emit BaseURIUpdated(baseUri);
    }
 
    function _setTokenUri(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Meta: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
 
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
 
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
 
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
 
        return string(abi.encodePacked(base, tokenId.toString()));
    }
 
    function mintNFT(address recipient, string memory _tokenURI) public onlyOwner returns (uint256) {
        require(bytes(_tokenURI).length > 0, "Token URI cannot be empty");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenUri(newItemId, _tokenURI);
        emit MintedNFT(recipient, newItemId, _tokenURI);
        return newItemId;
    }
}
 