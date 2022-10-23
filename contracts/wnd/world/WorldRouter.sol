// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./WorldStorage.sol";

abstract contract WorldRouter is WorldStorage {

    function __WorldRouter_init() internal initializer {
        WorldStorage.__WorldStorage_init();
    }

    function startStakeWizards(uint256[] calldata _tokenIds, Location _location) external override contractsAreSet whenNotPaused {
        require(_isValidWizardLocation(_location), "Invalid wizard location");
        require(_tokenIds.length > 0, "no token ids specified");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];

            require(!isTokenInWorld(_tokenId), "Token already in world");
            require(wnd.isWizard(_tokenId), "Token is not wizard");

            address _tokenOwner = wnd.ownerOf(_tokenId);
            require(_tokenOwner == msg.sender || isAdmin(msg.sender), "Invalid permission");

            _getWizardStakableForLocation(_location).startStake(_tokenId, _tokenOwner);
        }
    }

    function finishStakeWizards(uint256[] calldata _tokenIds, Location _location) external override contractsAreSet whenNotPaused {
        require(_isValidWizardLocation(_location), "Invalid location");
        require(_tokenIds.length > 0, "no token ids specified");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];

            require(locationOfToken(_tokenId) == _getStartStakeLocation(_location), "Bad location");
            require(isOwnerOfTokenId(_tokenId, msg.sender) || isAdmin(msg.sender), "Invalid permission");

            _getWizardStakableForLocation(_location).finishStake(_tokenId);
        }
    }

    function startUnstakeWizards(uint256[] calldata _tokenIds, Location _location) external override contractsAreSet whenNotPaused {
        require(_isValidWizardLocation(_location), "Invalid wizard location");
        require(_tokenIds.length > 0, "no token ids specified");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];

            require(locationOfToken(_tokenId) == _location, "Invalid wizard location");
            require(isOwnerOfTokenId(_tokenId, msg.sender) || isAdmin(msg.sender), "Invalid permission");

            _getWizardStakableForLocation(_location).startUnstake(_tokenId);
        }
    }

    function finishUnstakeWizards(uint256[] calldata _tokenIds, Location _location) external override contractsAreSet whenNotPaused {
        require(_isValidWizardLocation(_location), "Invalid location");
        require(_tokenIds.length > 0, "no token ids specified");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];
            require(locationOfToken(_tokenId) == _getStartUnstakeLocation(_location), "Bad location");
            require(isOwnerOfTokenId(_tokenId, msg.sender) || isAdmin(msg.sender), "Invalid permission");

            _getWizardStakableForLocation(_location).finishUnstake(_tokenId);
        }
    }

    function stakeDragons(uint256[] calldata _tokenIds, Location _location) external override contractsAreSet whenNotPaused {
        require(_isValidDragonLocation(_location), "Invalid location");
        require(_tokenIds.length > 0, "no token ids specified");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];

            require(!wnd.isWizard(_tokenId), "Token is not dragon");

            address _tokenOwner;

            if(isTokenInWorld(_tokenId)) {
                // Call unstake event but don't transfer NFT to owner's wallet because it 
                // will be staked in new location
                _getDragonStakableForLocation(locationOfToken(_tokenId)).unstake(_tokenId, false);
                _tokenOwner = ownerOfTokenId(_tokenId);
            }
            else {
                _tokenOwner = wnd.ownerOf(_tokenId);
            }

            require(_tokenOwner == msg.sender || isAdmin(msg.sender), "Not owner or admin");

            _getDragonStakableForLocation(_location).stake(_tokenId, _tokenOwner);
        }
    }

    function unstakeDragons(uint256[] calldata _tokenIds, Location _location) external override contractsAreSet whenNotPaused {
        require(_isValidDragonLocation(_location), "Invalid location");
        require(_tokenIds.length > 0, "no token ids specified");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];

            require(locationOfToken(_tokenId) == _location, "Bad location");
            require(isOwnerOfTokenId(_tokenId, msg.sender) || isAdmin(msg.sender), "Invalid permission");

            _getDragonStakableForLocation(_location).unstake(_tokenId, true);
        }
    }

    function _isValidWizardLocation(Location _location) private pure returns(bool) {
        return _location == Location.TRAINING_GROUNDS;
    }

    function _isValidDragonLocation(Location _location) private pure returns(bool) {
        return _location == Location.TRAINING_GROUNDS || _location == Location.RIFT;
    }

    function _getStartStakeLocation(Location _location) private pure returns(Location) {
        if(_location == Location.TRAINING_GROUNDS) {
            return Location.TRAINING_GROUNDS_ENTERING;
        } else {
            revert("Bad location");
        }
    }

    function _getStartUnstakeLocation(Location _location) private pure returns(Location) {
        if(_location == Location.TRAINING_GROUNDS) {
            return Location.TRAINING_GROUNDS_LEAVING;
        } else {
            revert("Bad location");
        }
    }

    function _getWizardStakableForLocation(Location _location) private view returns(IWizardStakable) {
        if(_location == Location.TRAINING_GROUNDS_ENTERING || _location == Location.TRAINING_GROUNDS_LEAVING || _location == Location.TRAINING_GROUNDS) {
            return trainingGrounds;
        } else {
            revert("Unable to find stakable");
        }
    }

    function _getDragonStakableForLocation(Location _location) private view returns(IDragonStakable) {
        if(_location == Location.TRAINING_GROUNDS) {
            return trainingGrounds;
        } else if(_location == Location.RIFT) {
            return rift;
        } else {
            revert("Unable to find stkable");
        }
    }
}