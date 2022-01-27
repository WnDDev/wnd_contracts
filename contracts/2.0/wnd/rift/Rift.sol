// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./RiftDragonStakable.sol";
import "./RiftContracts.sol";

contract Rift is Initializable, RiftDragonStakable {

    function initialize() public initializer {
        RiftDragonStakable.__RiftDragonStakable_init();
    }

    function setWizardSettings(uint8 _chanceWizardStolen, uint256 _treasureChestId) external onlyAdminOrOwner {
        require(_chanceWizardStolen >= 8 && _chanceWizardStolen <= 100, "Bad wizard chance");
        chanceWizardStolen = _chanceWizardStolen;
        treasureChestId = _treasureChestId;
    }

    // Moves tokens from L2 -> L1. L2 tokens are burnt.
    function transferToL1(
        uint256 _gpAmount,
        uint256[] calldata _wndTokenIds,
        uint256[] calldata _saIds,
        uint256[] calldata _saAmounts,
        uint256[] memory _consumablesIds,
        uint256[] memory _consumablesAmounts)
    external
    whenNotPaused
    contractsAreSet
    {
        require(_saIds.length == _saAmounts.length, "Bad SA lengths");
        require(_consumablesIds.length == _consumablesAmounts.length, "Bad lengths");

        require(amountCurrentlyStaked >= amountNeededToOpenPortal, "Not enough GP staked");

        bytes memory _message = _getMessageForChild(_gpAmount, _wndTokenIds, _saIds, _saAmounts, _consumablesIds, _consumablesAmounts);

        childTunnel.sendMessageToRoot(_message);
    }

    // Handles validation logic and actually transfering tokens to this contract.
    function _getMessageForChild(
        uint256 _gpAmount,
        uint256[] memory _wndTokenIds,
        uint256[] memory _saIds,
        uint256[] memory _saAmounts,
        uint256[] memory _consumablesIds,
        uint256[] memory _consumablesAmounts)
        internal
        returns(bytes memory)
    {

        if(_gpAmount > 0) {
            // Burn GP
            gp.burn(msg.sender, _gpAmount);
        }

        // Transfer WnD
        for(uint256 i = 0; i < _wndTokenIds.length; i++) {
            uint256 _id = _wndTokenIds[i];
            require(_id != 0, "Bad Wnd ID");
            // Transfer to hold in this contract.
            wnd.adminTransferFrom(msg.sender, address(this), _id);
        }

        if(_saIds.length > 0) {
            sacrificialAlter.adminSafeBatchTransferFrom(msg.sender, address(this), _saIds, _saAmounts);
        }
        if(_consumablesIds.length > 0) {
            consumables.adminSafeBatchTransferFrom(msg.sender, address(this), _consumablesIds, _consumablesAmounts);
        }

        return abi.encode(msg.sender, _gpAmount, _wndTokenIds, _saIds, _saAmounts, _consumablesIds, _consumablesAmounts);
    }

    function handleMessage(bytes calldata _data) external override onlyAdminOrOwner {
        (address _to,
        uint256 _gpAmount,
        uint256[] memory _wndTokenIds,
        WizardDragon[] memory _traits,
        uint256[] memory _saIds,
        uint256[] memory _saAmounts,
        uint256[] memory _consumableIds,
        uint256[] memory _consumableAmounts) = abi.decode(
            _data,
            (address, uint256, uint256[], WizardDragon[], uint256[], uint256[], uint256[], uint256[])
        );

        processMessageFromRoot(_to, _gpAmount, _wndTokenIds, _traits, _saIds, _saAmounts, _consumableIds, _consumableAmounts);
    }

    // Handles a messagae from the root and creates/transfers tokens from this contract to the user in L2.
    function processMessageFromRoot(
        address _to,
        uint256 _gpAmount,
        uint256[] memory _wndTokenIds,
        WizardDragon[] memory _traits,
        uint256[] memory _saIds,
        uint256[] memory _saAmounts,
        uint256[] memory _consumableIds,
        uint256[] memory _consumableAmounts)
    public
    onlyAdminOrOwner
    {

        require(_saIds.length == _saAmounts.length, "Bad SA Amounts");
        require(_consumableIds.length == _consumableAmounts.length, "Bad Consumable Amounts");
        require(_wndTokenIds.length == _traits.length, "Bad WnD lengths");

        if(_gpAmount > 0) {
            gp.mint(_to, _gpAmount);
        }

        for(uint256 i = 0; i < _wndTokenIds.length; i++) {
            uint256 _tokenId = _wndTokenIds[i];
            require(_tokenId != 0, "Bad token id");

            _createWnDIfNeeded(_tokenId, _traits[i]);
        }

        if(_saIds.length > 0) {
            address[] memory _addresses = new address[](_saIds.length);
            for(uint256 i = 0; i < _saIds.length; i++) {
                _addresses[i] = address(this);
            }

            uint256[] memory _balances = sacrificialAlter.balanceOfBatch(_addresses, _saIds);

            for(uint256 i = 0; i < _saIds.length; i++) {
                uint256 _currentBalance = _balances[i];
                // They are requesting more than is held by this contract.
                //
                if(_currentBalance < _saAmounts[i]) {
                    sacrificialAlter.mint(_saIds[i], uint16(_saAmounts[i] - _currentBalance), address(this));
                }
            }

            sacrificialAlter.adminSafeBatchTransferFrom(address(this), msg.sender, _saIds, _saAmounts);
        }

        if(_consumableIds.length > 0) {
            address[] memory _addresses = new address[](_consumableIds.length);
            for(uint256 i = 0; i < _consumableIds.length; i++) {
                _addresses[i] = address(this);
            }

            uint256[] memory _balances = consumables.balanceOfBatch(_addresses, _consumableIds);

            for(uint256 i = 0; i < _consumableIds.length; i++) {
                uint256 _currentBalance = _balances[i];
                // They are requesting more than is held by this contract.
                //
                if(_currentBalance < _consumableAmounts[i]) {
                    consumables.mint(_consumableIds[i], uint16(_consumableAmounts[i] - _currentBalance), address(this));
                }
            }

            consumables.adminSafeBatchTransferFrom(address(this), msg.sender, _consumableIds, _consumableAmounts);
        }

        if(_wndTokenIds.length > 0) {
            _wizardAndDragonsReceivedFromL1(_to, _wndTokenIds);
        }
    }

    function _createWnDIfNeeded(uint256 _tokenId, WizardDragon memory _trait) private {
        if(wnd.exists(_tokenId)) {
            return;
        }

        wnd.mint(address(this), _tokenId, _trait);
    }

    // Called when a wizard or dragon is received from L1. At this point, the Wizards or
    // Dragons exist in L2 and are owned by this contract. Returns a request ID that will
    // be used to withdraw the wizard/dragons.
    function _wizardAndDragonsReceivedFromL1(
        address _recipient,
        uint256[] memory _wndTokenIds)
        private
    {
        uint256[] memory _wizardIds = new uint256[](_wndTokenIds.length);
        uint256 _wizardIndex = 0;
        for(uint256 i = 0; i < _wndTokenIds.length; i++) {
            uint256 _id = _wndTokenIds[i];
            if(_shouldKeepInRift(_id)) {
                _wizardIds[_wizardIndex] = _id;
                _wizardIndex++;
            } else {
                wnd.adminTransferFrom(address(this), _recipient, _id);
                emit TokenWithdrawn(_recipient, _id);
            }
        }

        if(_wizardIndex == 0) {
            // No wizards, so no need to get a random number.
            return;
        }

        bytes32 _requestID = randomizer.getRandomNumber();
        requestIdToTokens[_requestID] = _wizardIds;
        recipientToRequestIDs[_recipient].push(_requestID);
    }

    function withdrawWizardsToWallet() external contractsAreSet whenNotPaused onlyEOA {
        require(treasureChestId > 0, "Treasure chest ID not set");

        bytes32[] memory _requestIds = recipientToRequestIDs[msg.sender];
        require(_requestIds.length > 0, "No requests found");

        for(uint256 i = 0; i < _requestIds.length; i++) {
            bytes32 _requestId = _requestIds[i];
            require(randomizer.isRequestIDFulfilled(_requestId), "Request in progress");

            uint256 _randomness = randomizer.randomForRequestID(_requestId);
            uint256[] memory _tokenIds = requestIdToTokens[_requestId];
            for(uint256 j = 0; j < _tokenIds.length; j++) {
                uint256 _tokenId = _tokenIds[j];

                // Different random per token.
                uint256 _randomForToken = uint256(keccak256(abi.encode(_randomness, _tokenId)));
                _decideFateOfWizard(_tokenId, _randomForToken);
            }

            delete requestIdToTokens[_requestId];
        }

        delete recipientToRequestIDs[msg.sender];
    }

    function _shouldKeepInRift(uint256 _tokenId) private view returns(bool) {
        // The first 15000 wizards are safe from any chance of dying. Gen0.
        if(_tokenId < 15000) {
            return false;
        }
        return wnd.isWizard(_tokenId) && chanceWizardStolen != 0;
    }

    function _decideFateOfWizard(uint256 _tokenId, uint256 _random) private {
        uint256 _result = _random % 100;
        uint8 _wizardProf = trainingProficiency.proficiencyForWizard(_tokenId);
        uint8 _reduction = _wizardProf > 8 ? 8 : _wizardProf;

        uint256 _chanceWizardStolen = chanceWizardStolen - _reduction;

        bool _didWizardGetStolen = chanceWizardStolen != 0
            && world.totalNumberOfDragons() != 0
            && _result < _chanceWizardStolen;

        if(_didWizardGetStolen) {
            uint256 _newRandom = uint256(keccak256(abi.encode(_random, _random)));

            address _randomDragonOwner = world.getRandomDragonOwner(_newRandom, Location.RIFT);

            bool _hasChest = sacrificialAlter.balanceOf(msg.sender, treasureChestId) > 0;

            // Just look at the top bit for the 50/50 odds of stealing the chest
            if(_hasChest && _random >> 255 == 1) {
                sacrificialAlter.adminSafeTransferFrom(msg.sender, _randomDragonOwner, treasureChestId, 1);

                emit ChestStolen(msg.sender, _randomDragonOwner, _tokenId);

                wnd.adminTransferFrom(address(this), msg.sender, _tokenId);
                emit TokenWithdrawn(msg.sender, _tokenId);
            } else {
                wnd.adminTransferFrom(address(this), _randomDragonOwner, _tokenId);

                emit WizardStolen(msg.sender, _randomDragonOwner, _tokenId);
            }
        } else {
            // User keeps token.
            wnd.adminTransferFrom(address(this), msg.sender, _tokenId);
            emit TokenWithdrawn(msg.sender, _tokenId);
        }
    }

}