```
 █████   ███   █████            ██████████                                                 
░░███   ░███  ░░███            ░░███░░░░███                                                
 ░███   ░███   ░███  ████████   ░███   ░░███     ███████  ██████   █████████████    ██████ 
 ░███   ░███   ░███ ░░███░░███  ░███    ░███    ███░░███ ░░░░░███ ░░███░░███░░███  ███░░███
 ░░███  █████  ███   ░███ ░███  ░███    ░███   ░███ ░███  ███████  ░███ ░███ ░███ ░███████ 
  ░░░█████░█████░    ░███ ░███  ░███    ███    ░███ ░███ ███░░███  ░███ ░███ ░███ ░███░░░  
    ░░███ ░░███      ████ █████ ██████████   ██░░███████░░████████ █████░███ █████░░██████ 
     ░░░   ░░░      ░░░░ ░░░░░ ░░░░░░░░░░   ░░  ░░░░░███ ░░░░░░░░ ░░░░░ ░░░ ░░░░░  ░░░░░░  
                                                ███ ░███                                   
                                               ░░██████                                    
                                                ░░░░░░                                      
```                                            

## About The Project

Thousands of Wizards and Dragons compete in a tower in the metaverse. Tempting treasures of GP await, with deadly high stakes. All the metadata and images are generated and stored 100% on-chain. No IPFS. No API. Just the Ethereum blockchain.

### Getting started
1. Initialize your repo and download dependencies:
```
npm i
```
2. Initialize your environment variables:
```
mv .env.example .env
```
3. Change every env item in `.env`
4. Compile hardhat and run tests
```
npx hardhat compile && npx hardhat test
```

### Polygon / New contract summaries

**NOTE1**: Each contract has an interface to allow for easy cross-contract calling of external functions.
<br/>**NOTE2**: Each contract has a State base contract that holds all state variables and inherits and initializes all other required utility contracts + libraries to ensure upgradability without malforming storage
<br/>**NOTE3**: Contracts that call other contracts have Contract base classes which handles setting and requiring contracts to be set
<br/>**NOTE4**: Token contracts have an 'adminTransfer' function that allows admin senders to transfer tokens without approval (to save transactions + gas fees for users). These functions were separated out to not mess with the openzeppelin default implementation.

```
shared/randomizer (Polygon contracts)
```
*Not used anymore.*

```
shared/ramdomizercl (Polygon contracts)
```
`RandomizerCL`: Polygon implementation for getting verifiably random seeds

```
shared/tokens (Polygon contracts)
```
`ERC1155OnChainBaseUpgradeable`: A base class with sharable logic needed for storing on-chain art and displaying metadata as svgs

```
shared (Polygon contracts)
```
`Adminable`: Base contract for allow contracts to limit callers of functions to approved sending addresses
<br/>
`AdminableUpgradeable`: Same as Adminable but utilizing openzeppelin's upgradeable contract pattern
<br/>
`Base64ableUpgradeable`: Base contract that allows sharing base64 logic
<br/>
`Utilities`: Base contract with helper modifiers for reusability
<br/>
`UtilitiesUpgradeable`: Same as Utilities but utilizing openzeppelin's upgradeable contract pattern

```
wnd/graveyard (Polygon contracts)
```
*IN PROGRESS / NOT FINAL*<br/>
`Graveyard`: Contract for storing and managing 'killed' wizards. Allows dependent contracts to retreive killed wizards per address, as well as allowing addresses to revive fallen wizards if providing phoenix downs

```
wnd/rift (Polygon contracts)
```
`Rift`: Contract for sending/retrieving assets to/from the Ethereum network (WnD wizards/dragons, Sacrificial Alter erc1155s, Consumable erc1155s, GP erc20s). This contract is responsible for deciding if non-gen0 wizards get stolen by dragons. Also requires a certain threshold of total GP staked in order to send assets to the Ethereum network. Will mint erc721 tokens exactly as they are in the Ethereum network
<br/>
`RiftDragonStakable`: Handles staking and unstaking dragons into the Rift
<br/>
`RiftGP`: Handles staking and unstaking GP into the Rift
<br/>
`RiftTier`: Calculates the Rift's tier for a given address. Tier is calculated based on the amount of GP staked into the rift

```
wnd/riftroot (Ethereum contracts)
```
`RiftRoot`: Contract for sending/retrieving assets to/from the Polygon network (WnD wizards/dragons, Sacrificial Alter erc1155s, Consumable erc1155s, GP erc20s). Also requires a certain threshold of total GP staked in order to send assets to Polygon
<br/>
`RiftRootGP`: Handles staking / unstaking GP in the rift

```
wnd/tokens/consumables (Polygon & Ethereum contracts)
```
`Consumables`: Contract for creating erc1155 items with onchain art (elixir of health, armor, phoenix downs, etc)

```
wnd/tokens/gp (Polygon contracts)
```
`GP`: Contract for minting / burning erc20 tokens called $GP

```
wnd/tokens/sacrificialalter (Polygon & Ethereum contracts)
```
`Sacrificial Alter`: Contract for creating erc1155 items with onchain art (runes, treasure chest, etc)

```
wnd/tokens/traits (Polygon contracts)
```
`Traits`: Contract for storing onchain art for WnD Wizards & Dragons erc721 tokens.

```
wnd/tokens/wnd (Polygon contracts)
```
`WnD`: Contract for minting / burning erc721 tokens.

```
wnd/traininggame (Polygon contracts)
```
*IN PROGRESS / NOT FINAL*<br/>
`TrainingGame`: Contract for participating in the training game for wizards staked in this contract.
<br/>
`TrainingGameRewards`: Handles choosing rewards from wizards who survive the training game.
<br/>
`TrainingGameTimeKeeper`: Handles cooldowns for wizards who have participated in the training game.


```
wnd/traininggrounds (Polygon contracts)
```
`TrainingGrounds`: Contract that handles staking assets to perform game logic in other contracts
<br/>
`TrainingGroundsDragonsStakable`: Handles staking / unstaking dragons
<br/>
`TrainingGroundsWizardStakable`: Handles staking / unstaking wizards. Implements a start/finish function to utilize Chainlink for verifiable randomness and avoid flashbot bundle exploits.

```
wnd/trainingproficiency (Polygon contracts)
```
`TrainingProficiency`: Contract for calculating and sharing the training proficiency level for every wizard who trains.

```
wnd/tunnels (Polygon contracts)
```
`ChildTunnel`: Contract for sending messages to and receiving messages from the Ethereum network. This contract exists on the Polygon network.
<br/>
`RootTunnel`: Contract for sending messages to and receiving messages from the Polygon network. This contract exists on the Ethereum network.

```
wnd/world (Polygon contracts)
```
`World`: Contract for holding information about everything in the Polygon world for WnD.
<br/>
`WorldRandomDragon`: Handles calculating and picking random dragons who are staked in the world. Has a bonus to being picked by location dragons are staked (currently Rift and TrainingGrounds). Also weighs picking logic by Dragon Rank (higher rank has higher chance of being picked than a lower rank)
<br/>
`WorldRouter`: Handles the logic of staking and unstaking wizards and dragons. Implements a start/finish function for wizard staking/unstaking to utilize Chainlink for verifiable randomness and avoid flashbot bundle exploits
<br/>
`WorldStorage`: Handles the transferring of wnd assets to and from the world contract. Also provides information for all staked assets