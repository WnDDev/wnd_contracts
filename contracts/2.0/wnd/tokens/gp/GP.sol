// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IGP.sol";
import "./GPState.sol";

contract GP is Initializable, IGP, GPState {

  function initialize() external initializer {
    ERC20Upgradeable.__ERC20_init("GP", "GP");
    GPState.__GPState_init();
  }

  /**
    * mints $GP to a recipient
    * @param to the recipient of the $GP
    * @param amount the amount of $GP to mint
    */
  function mint(address to, uint256 amount) external override onlyAdminOrOwner {
    _mint(to, amount);
  }

  /**
    * burns $GP from a holder
    * @param from the holder of the $GP
    * @param amount the amount of $GP to burn
    */
  function burn(address from, uint256 amount) external override onlyAdminOrOwner {
    _burn(from, amount);
  }

  /**
    * @dev See {IERC20-transferFrom}.
    *
    * Emits an {Approval} event indicating the updated allowance. This is not
    * required by the EIP. See the note at the beginning of {ERC20}.
    *
    * Requirements:
    *
    * - `sender` and `recipient` cannot be the zero address.
    * - `sender` must have a balance of at least `amount`.
    * - the caller must have allowance for ``sender``'s tokens of at least
    * `amount`.
    */
  function transferFrom(
      address sender,
      address recipient,
      uint256 amount
  ) public virtual override(ERC20Upgradeable, IERC20Upgradeable) returns (bool) {

    // If the entity invoking this transfer is an admin (i.e. the gameContract)
    // allow the transfer without approval. This saves gas and a transaction.
    // The sender address will still need to actually have the amount being attempted to send.
    if(isAdmin(_msgSender())) {
      // NOTE: This will omit any events from being written. This saves additional gas,
      // and the event emission is not a requirement by the EIP
      // (read this function summary / ERC20 summary for more details)
      _transfer(sender, recipient, amount);
      return true;
    }

    // If it's not an admin entity (game contract, tower, etc)
    // The entity will need to be given permission to transfer these funds
    // For instance, someone can't just make a contract and siphon $GP from every account
    return super.transferFrom(sender, recipient, amount);
  }

  function balanceOf(address account) public view override(ERC20Upgradeable, IERC20Upgradeable) returns(uint256) {
    return super.balanceOf(account);
  }

}