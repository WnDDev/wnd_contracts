// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ITraits.sol";
import "./TraitsState.sol";

contract Traits is Initializable, ITraits, TraitsState {

    using StringsUpgradeable for uint256;

    function initialize() external initializer {
        TraitsState.__TraitsState_init();
    }

    /** ADMIN */

    function setWnD(address _wndAddress) external onlyAdminOrOwner {
        wnd = IWnD(_wndAddress);
    }

    /**
     * administrative to upload the names and images associated with each trait
     * @param traitType the trait type to upload the traits for (see traitTypes for a mapping)
     * @param traits the names and base64 encoded PNGs for each trait
     */
    function uploadTraits(
        uint8 traitType,
        uint8[] calldata traitIds,
        Trait[] calldata traits
    ) external onlyAdminOrOwner {
        require(traitIds.length == traits.length, "Mismatched inputs");
        for (uint256 i = 0; i < traits.length; i++) {
            traitData[traitType][traitIds[i]] = Trait(
                traits[i].name,
                traits[i].png
            );
        }
    }

    /** RENDER */

    /**
     * generates an <image> element using base64 encoded PNGs
     * @param trait the trait storing the PNG data
     * @return the <image> element
     */
    function drawTrait(Trait memory trait)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '<image x="4" y="4" width="32" height="32" image-rendering="pixelated" preserveAspectRatio="xMidYMid" xlink:href="data:image/png;base64,',
                    trait.png,
                    '"/>'
                )
            );
    }

    /**
     * generates an entire SVG by composing multiple <image> elements of PNGs
     * @param tokenId the ID of the token to generate an SVG for
     * @return a valid SVG of the Wizard / Dragon
     */
    function drawSVG(uint256 tokenId) internal view returns (string memory) {
        WizardDragon memory s = wnd.getTokenTraits(tokenId);
        uint8 shift = s.isWizard ? 0 : 9;

        // Trait data indexes 0 - 7 are reserved for Wizards
        // Trait data indexew 9 - 17 are reserved for Dragons.
        string memory svgString = string(
            abi.encodePacked(
                drawTrait(traitData[0 + shift][s.body]),
                s.isWizard
                    ? drawTrait(traitData[1 + shift][s.head])
                    : drawTrait(traitData[1 + shift][s.rankIndex]),
                s.isWizard ? drawTrait(traitData[2 + shift][s.spell]) : "",
                drawTrait(traitData[3 + shift][s.eyes]),
                s.isWizard ? drawTrait(traitData[4 + shift][s.neck]) : "",
                drawTrait(traitData[5 + shift][s.mouth]),
                s.isWizard ? "" : drawTrait(traitData[6 + shift][s.tail]),
                s.isWizard ? drawTrait(traitData[7 + shift][s.wand]) : ""
            )
        );

        return
            string(
                abi.encodePacked(
                    '<svg id="wndNFT" width="100%" height="100%" version="1.1" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
                    svgString,
                    "</svg>"
                )
            );
    }

    /**
     * generates an attribute for the attributes array in the ERC721 metadata standard
     * @param traitType the trait type to reference as the metadata key
     * @param value the token's trait associated with the key
     * @return a JSON dictionary for the single attribute
     */
    function attributeForTypeAndValue(
        string memory traitType,
        string memory value
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"',
                    traitType,
                    '","value":"',
                    value,
                    '"}'
                )
            );
    }

    /**
     * generates an array composed of all the individual traits and values
     * @param tokenId the ID of the token to compose the metadata for
     * @return a JSON array of all of the attributes for given token ID
     */
    function compileAttributes(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        WizardDragon memory s = wnd.getTokenTraits(tokenId);
        string memory traits;
        if (s.isWizard) {
            traits = string(
                abi.encodePacked(
                    attributeForTypeAndValue(
                        _traitTypes[0],
                        traitData[0][s.body].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[1],
                        traitData[1][s.head].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[2],
                        traitData[2][s.spell].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[3],
                        traitData[3][s.eyes].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[4],
                        traitData[4][s.neck].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[5],
                        traitData[5][s.mouth].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[7],
                        traitData[7][s.wand].name
                    ),
                    ","
                )
            );
        } else {
            traits = string(
                abi.encodePacked(
                    attributeForTypeAndValue(
                        _traitTypes[0],
                        traitData[9][s.body].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[1],
                        traitData[10][s.rankIndex].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[3],
                        traitData[12][s.eyes].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[5],
                        traitData[14][s.mouth].name
                    ),
                    ",",
                    attributeForTypeAndValue(
                        _traitTypes[6],
                        traitData[15][s.tail].name
                    ),
                    ",",
                    attributeForTypeAndValue("Rank Score", _ranks[s.rankIndex]),
                    ","
                )
            );
        }
        return
            string(
                abi.encodePacked(
                    "[",
                    traits,
                    '{"trait_type":"Generation","value":',
                    tokenId <= 15000 ? '"Gen 0"' : '"Gen 1"',
                    '},{"trait_type":"Type","value":',
                    s.isWizard ? '"Wizard"' : '"Dragon"',
                    "}]"
                )
            );
    }

    /**
     * generates a base64 encoded metadata response without referencing off-chain content
     * @param tokenId the ID of the token to generate the metadata for
     * @return a base64 encoded JSON dictionary of the token's metadata and SVG
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_msgSender() == address(wnd), "hmmmm what doing?");
        WizardDragon memory s = wnd.getTokenTraits(tokenId);

        string memory metadata = string(
            abi.encodePacked(
                '{"name": "',
                s.isWizard ? "Wizard #" : "Dragon #",
                tokenId.toString(),
                '", "description": "Thousands of Wizards and Dragons compete in a tower in the metaverse. A tempting prize of $GP awaits, with deadly high stakes. All the metadata and images are generated and stored 100% on-chain. No IPFS. NO API. Just the Ethereum blockchain.", "image": "data:image/svg+xml;base64,',
                _base64(bytes(drawSVG(tokenId))),
                '", "attributes":',
                compileAttributes(tokenId),
                "}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    _base64(bytes(metadata))
                )
            );
    }

}
