// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITrainingProficiency {

    // Returns the proficiency for the given Wizard.
    function proficiencyForWizard(uint256 _tokenId) external view returns(uint8);

    // Increases the proficiency of the given wizard by 1.
    // Only admin.
    function increaseProficiencyForWizard(uint256 _tokenId) external;
    // Resets the proficiency of the given wizard.
    // Only admin.
    function resetProficiencyForWizard(uint256 _tokenId) external;
}