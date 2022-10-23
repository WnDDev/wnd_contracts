// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ISacrificialAlter.sol";
import "./SacrificialAlterState.sol";

contract SacrificialAlter is Initializable, ISacrificialAlter, SacrificialAlterState {

    function initialize() external initializer {
        ERC1155OnChainBaseUpgradeable.__ERC1155OnChainBase_init();
        SacrificialAlterState.__SacrificialAlterState_init();
    }

    /** CRITICAL TO SETUP */

    modifier requireContractsSet() {
        require(areContractsSet(), "SacrificialAlter: Contracts not set");
        _;
    }

    function areContractsSet() public view returns(bool) {
        return address(gpToken) != address(0);
    }

    function setContracts(address _gp) external onlyOwner {
        gpToken = IGP(_gp);
    }

    function adminSafeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount) external override whenNotPaused onlyAdminOrOwner {
        _safeTransferFrom(_from, _to, _id, _amount, "");
    }

    function adminSafeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _amounts) external override whenNotPaused onlyAdminOrOwner {
        _safeBatchTransferFrom(_from, _to, _ids, _amounts, "");
    }

    /**
    * Mint a token - any payment / game logic should be handled in the game contract.
    */
    function mint(uint256 typeId, uint16 qty, address recipient) external override whenNotPaused onlyAdminOrOwner {
        require(typeInfo[typeId].mints - typeInfo[typeId].burns + qty <= typeInfo[typeId].maxSupply, "All tokens minted");
        if(typeInfo[typeId].gpExchangeAmt > 0) {
            // If the ERC1155 is swapped for $GP, transfer the GP to this contract in case the swap back is desired.
            // NOTE: This will fail if the origin doesn't have the required amount of $GP
            gpToken.transferFrom(tx.origin, address(this), typeInfo[typeId].gpExchangeAmt * qty);
        }
        typeInfo[typeId].mints += qty;
        _mint(recipient, typeId, qty, "");
    }

    /**
    * Burn a token - any payment / game logic should be handled in the game contract.
    */
    function burn(uint256 typeId, uint16 qty, address burnFrom) external override whenNotPaused onlyAdminOrOwner {
        if(typeInfo[typeId].gpExchangeAmt > 0) {
            // If the ERC1155 was swapped from $GP, transfer the GP from this contract back to whoever owns this token now.
            gpToken.transferFrom(address(this), tx.origin, typeInfo[typeId].gpExchangeAmt * qty);
        }
        typeInfo[typeId].burns += qty;
        _burn(burnFrom, typeId, qty);
    }

    function setType(uint256 typeId, uint16 maxSupply) external onlyAdminOrOwner {
        require(typeInfo[typeId].mints <= maxSupply, "max supply too low");
        typeInfo[typeId].maxSupply = maxSupply;
    }

    function setExchangeAmt(uint256 typeId, uint256 exchangeAmt) external onlyAdminOrOwner {
        require(typeInfo[typeId].maxSupply > 0, "this type has not been set up");
        typeInfo[typeId].gpExchangeAmt = exchangeAmt;
    }

    function getInfoForType(uint256 typeId) external view returns(TypeInfo memory) {
        require(typeInfo[typeId].maxSupply > 0, "invalid type");
        return typeInfo[typeId];
    }

    function uri(uint256 typeId) public view override returns (string memory) {
        require(typeInfo[typeId].maxSupply > 0, "invalid type");
        Image memory img = traitData[typeId];
        string memory metadata = string(abi.encodePacked(
            '{"name": "',
            img.name,
            '", "description": "Mysterious items spawned from the Sacrificial Alter of the Wizards & Dragons Tower. Fabled to hold magical properties, only Act 1 tower guardians will know the truth in the following acts. All the metadata and images are generated and stored 100% on-chain. No IPFS. NO API. Just the Ethereum blockchain.", "image": "data:image/svg+xml;base64,',
            _base64(bytes(_drawSVG(typeId))),
            '", "attributes": []',
            "}"
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64(bytes(metadata))
        ));
    }
}