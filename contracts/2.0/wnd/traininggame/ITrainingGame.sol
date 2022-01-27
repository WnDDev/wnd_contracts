// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITrainingGame {

    // Trains the given wizard. Must be staked at the training grounds.
    function train(uint256 _tokenId) external;

    // Reveals the reward for the given token id.
    function revealTrainingReward(uint256 _tokenId) external;

    // Indicates if the given wizard can play the game.
    function canWizardPlay(uint256 _tokenId) external view returns(bool);

    // Returns the timestamp the wizard can next play the game. May be in the past.
    function timeWizardCanPlayNext(uint256 _tokenId) external view returns(uint256);

    // Returns if a wizard is currently training.
    function isWizardTraining(uint256 _tokenId) external view returns(bool);
}