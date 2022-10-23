import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export module FileLocations {

    export const CACHED_TOKEN_MINTING_EVENTS = `./data/event_cache/tokenMintingEvents.json`;
    export const CACHED_WIZARD_TRAINING_EVENTS = `./data/event_cache/wizardsTrainingEvents.json`;
    export const CACHED_TOWER1_STAKING_EVENTS = `./data/event_cache/stakingEventsTower1.json`;
    export const CACHED_TOWER2_STAKING_EVENTS = `./data/event_cache/stakingEventsTower2.json`;
    export const CACHED_TOKEN_TYPES = `./data/event_cache/tokenTypes.json`;

}