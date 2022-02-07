// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../../../shared/AdminableUpgradeable.sol";
import "../../../shared/Base64ableUpgradeable.sol";
import "../wnd/IWnD.sol";

abstract contract TraitsState is Initializable, AdminableUpgradeable, Base64ableUpgradeable {

    // struct to store each trait's data for metadata and rendering
    struct Trait {
        string name;
        string png;
    }

    // mapping from trait type (index) to its name
    string[9] internal _traitTypes;

    // storage of each traits name and base64 PNG data
    mapping(uint8 => mapping(uint8 => Trait)) public traitData;
    // mapping from rankIndex to its score
    string[4] internal _ranks;

    IWnD public wnd;

    function __TraitsState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        Base64ableUpgradeable.__Base64able_init();

        _traitTypes = [
            "Body",
            "Head",
            "Spell",
            "Eye",
            "Neck",
            "Mouth",
            "Wings",
            "Wand",
            "Rank"
        ];

        _ranks = ["8", "7", "6", "5"];
    }
}