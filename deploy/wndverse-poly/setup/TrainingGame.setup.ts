import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.unpauseContractIfNeeded('TrainingGame');
        await this.setContractsIfNeeded('TrainingGame', 
            this.getContractAddresses('World', 'SacrificialAlter', 'Consumables', 'GP', 'WnD', 'TrainingProficiency', 'RandomizerCL', 'Rift', 'Graveyard')
        );
        await this.setAdminsIfNeeded('TrainingGame', 
            this.getContractAddresses('World', 'Rift', 'TrainingProficiency', 'TrainingGrounds', 'Graveyard')
        );

        await this.setupTrainingGame();
    }

    private async setupTrainingGame() {
        const gameCooldownInSeconds = 30 * MINUTE_TO_SECONDS;
        await this.deployments?.execute(
            'TrainingGame',
            { from: this.deployer, log: true },
            `setGameCooldown`,
            gameCooldownInSeconds
        );

        const commonDropMultiplier: { min: number[], max: number[] } = {
            min: [1, 1, 1, 2, 2, 2, 2, 2, 3],
            max: [1, 2, 2, 2, 3, 3, 3, 4, 4]
        };
        const uncommonDropMultiplier: { min: number[], max: number[] } = {
            min: [1, 1, 1, 1, 1, 1, 2, 2, 2],
            max: [1, 1, 1, 2, 2, 2, 2, 2, 3]
        };
        const rareDropMultiplier: { min: number[], max: number[] } = {
            min: [1, 1, 1, 1, 1, 1, 1, 1, 2],
            max: [1, 1, 1, 1, 2, 2, 2, 2, 2]
        };
        const epicDropMultiplier: { min: number[], max: number[] } = {
            min: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            max: [1, 1, 1, 1, 1, 1, 1, 1, 1]
        };
        const legendaryDropMultiplier: { min: number[], max: number[] } = {
            min: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            max: [1, 1, 1, 1, 1, 1, 1, 1, 1]
        };

        const commonDropMultiplierRaised: { min: number[], max: number[] } = {
            min: [2, 2, 2, 4, 4, 4, 4, 4, 5],
            max: [2, 4, 4, 4, 6, 6, 6, 7, 7]
        };
        const uncommonDropMultiplierRaised: { min: number[], max: number[] } = {
            min: [1, 1, 1, 2, 2, 2, 3, 3, 3],
            max: [2, 2, 2, 2, 2, 3, 3, 4, 5]
        };
        const rareDropMultiplierRaised: { min: number[], max: number[] } = {
            min: [1, 1, 1, 1, 1, 1, 1, 2, 2],
            max: [1, 2, 2, 2, 2, 2, 2, 2, 2]
        };

        const commonDropMultiplierLimitedEvent: { min: number[], max: number[] } = {
            min: [4, 4, 4, 8, 8, 8, 8, 8, 12],
            max: [4, 8, 8, 8, 12, 12, 12, 16, 16]
        };
        const uncommonDropMultiplierLimitedEvent: { min: number[], max: number[] } = {
            min: [2, 2, 2, 4, 4, 4, 4, 5, 5],
            max: [4, 4, 4, 4, 4, 5, 6, 6, 8]
        };
        const rareDropMultiplierLimitedEvent: { min: number[], max: number[] } = {
            min: [2, 2, 2, 2, 2, 2, 2, 3, 3],
            max: [2, 3, 3, 3, 3, 3, 3, 4, 4]
        };

        const elixirOfHealingId: number = 1;
        const elixirOfHealingOdds: number = 37500;
        const elixirOfHealingMultiplier: { min: number[], max: number[] } = commonDropMultiplierRaised;
    
        const equipmentId: number = 2;
        const equipmentOdds: number = 18750;
        const equipmentMultiplier: { min: number[], max: number[] } = uncommonDropMultiplierRaised;
    
        const foodId: number = 3;
        const foodOdds: number = 37500;
        const foodMultiplier: { min: number[], max: number[] } = commonDropMultiplierRaised;
    
        const phoenixDownId: number = 4;
        const phoenixDownOdds: number = 6200;
        const phoenixDownMultiplier: { min: number[], max: number[] } = rareDropMultiplier;
    
        const robeOfMetropolisId: number = 5;
        const robeOfMetropolisOdds: number = 45;
        const robeOfMetropolisMultiplier: { min: number[], max: number[] } = epicDropMultiplier;
    
        const itemOfManyMysteriesId: number = 6;
        const itemOfManyMysteriesOdds: number = 5;
        const itemOfManyMysteriesMultiplier: { min: number[], max: number[] } = legendaryDropMultiplier;

        const rewardIds: number[] = [
            elixirOfHealingId,
            equipmentId,
            foodId,
            phoenixDownId,
            robeOfMetropolisId,
            itemOfManyMysteriesId
        ];
        const rewardOdds: number[] = [
            elixirOfHealingOdds,
            equipmentOdds,
            foodOdds,
            phoenixDownOdds,
            robeOfMetropolisOdds,
            itemOfManyMysteriesOdds
        ];
        const rewardMultipliers: { min: number[], max: number[] }[] = [
            elixirOfHealingMultiplier,
            equipmentMultiplier,
            foodMultiplier,
            phoenixDownMultiplier,
            robeOfMetropolisMultiplier,
            itemOfManyMysteriesMultiplier
        ];
        console.log(`About to execute setRewardSettings`);
        await this.deployments?.execute(
            'TrainingGame',
            { from: this.deployer, log: true },
            `setRewardSettings`,
            rewardIds,
            rewardOdds,
            rewardMultipliers
        );

        console.log(`About to execute setGPRewardSettings`);
        await this.deployments?.execute(
            'TrainingGame',
            { from: this.deployer, log: true },
            `setGPRewardSettings`,
            [
                this.hre?.ethers.utils.parseEther("0"),
                this.hre?.ethers.utils.parseEther("3000"),
                this.hre?.ethers.utils.parseEther("6000"),
                this.hre?.ethers.utils.parseEther("10000"),
                this.hre?.ethers.utils.parseEther("25000"),
                this.hre?.ethers.utils.parseEther("50000"),
                this.hre?.ethers.utils.parseEther("100000")
            ],
            [
                55000,
                26500,
                10500,
                5200,
                2500,
                290,
                10
            ],
        );
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['traininggame'];
script.setupFunc.dependencies = [
    'traininggame-deploy', 'world-deploy', 'sacrificialalter-deploy', 'consumables-deploy',
    'gptoken-deploy', 'wndtoken-deploy', 'trainingproficiency-deploy', 'randomizercl-deploy',
    'rift-deploy', 'graveyard-deploy'
];
script.setupFunc.runAtTheEnd = true;

const MINUTE_TO_SECONDS = 60;
const HOUR_TO_SECONDS = 3600;
const DAY_TO_SECONDS = 86400;