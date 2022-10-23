import riftRoot from './RiftRootTests';
import rift from './RiftTests';
import trainingProficiency from './TrainingProficiencyTests';
import trainingGrounds from './TrainingGroundsTests';
import lootCrates from './LootCratesTests';

describe('Subject', function() {
    riftRoot();
    rift();
    trainingProficiency();
    trainingGrounds();
    lootCrates();
});