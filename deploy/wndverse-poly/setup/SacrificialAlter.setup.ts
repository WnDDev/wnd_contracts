import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.unpauseContractIfNeeded('SacrificialAlter');
        await this.setContractsIfNeeded('SacrificialAlter', this.getContractAddress('GP'));
        await this.setAdminsIfNeeded('SacrificialAlter', 
            this.getContractAddresses('Rift', 'World', 'TrainingProficiency', 'TrainingGame', 'TrainingGrounds')
        );

        await this.setupSacrificialAlterIdsIfNeeded();
    }

    private async setupSacrificialAlterIdsIfNeeded() {
        const imgs = [
            {"name":"Air Rune",
            "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaElEQVR42u1XOwrCQBT0AjbW3sPGyka8hF3uYGmXzkuItWBpn07wCNYewqy8wMDk8TbuT1AxMOBm484nbz8Zjf7Xt17jydQxrHvcV5x4U1XufDq626XpIPekva9rt5zNeygigomFRJNDEERIm5ElwkcMSB+nICgmwIqbAUL0Q2QREUPkTOxDdi0g0lhiRnIKcJ9Dni2A3aO6783BPdq2h+tu1QEzhesgaUZo9z5ije160UGLiK4FeSCW3EqDkwtOgd3LnzW5tEECDKXAIhiDAnhOW+SWa18KUcXI7sUFu5ffcs8XPT+bJQDuNdkQeVEBKL6PFqALk2vANxWLJyAiAP2MTiB4GmoBMUWIPiuB4IWIBYSKEKeW86RtWa//MoglwlqEfO8+WgDv/3h/GNxaklmQRR69GfEgvAWzEDjVsMiTDiVaRMppKPt07BOBd/qKvMihVJ8LZHBe3UIcZ3+cxHwBvfWL6GevJ/FypFOAMK19AAAAAElFTkSuQmCC"},
            {"name":"Earth Rune",
            "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABlUlEQVR42u2XMU4DMRBFcwEa6hwDiYbUNJHSIERJk5aaE5AudfqUFEiUVDRIFFwhylEcjaUf/XyNF8/aFCBW+tqsV/F/M/bY3snk//qt19n5NLG8Nn7X3fhxuUxvry9p//WR79Zm9+1qla4vr07UBYKNzQTmJgYChD2zmiBKxpC9AwggugFoulUwxHtAdoGImHtqngtIadSYNToLiL7FvBmAyyzP7NtZ2jwsTmRtJlQJz4HRFaHRl8wVAiAKEZ4LGn3J/G52cXy3e77PzyaFCGWBo8efvYjNCM/vT/Msg+BM6FCwBgG4pjV6GH+ub7IhA5gYgCdtVQZ07K1DjtgEY5P9VgAdhuMw1gJw3aNzz5g1lIVwBrjmuUPPuATRHQCd1gDo2tAEwFFh4nnGXI5eKVaXoQJgxvNCw8ZajqXFqHohUgDrhA3YRNtLqQ/tB1oFSB+becaWkdIqGAbQ/Z8heCjYfGgfCG9G3IkHwZGqdCsefUD1IKLngubTcQkCY/qdeZdD6dD5vzbi5o+TyBfQj34R/dnrAGp12XZEUPcgAAAAAElFTkSuQmCC"},
            {"name":"Water Rune",
            "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABdUlEQVR42u2XPU7DQBCFc4AgRVQpqIJokahCkRpO4jtwgxRUqVPmAEiU9HSIK6TjFmSjZ+kl48ns2OtdKwrC0pNl72rfN7P/o9H/c6nP1fVNkLL+ybLixi9VFT7e38L267N+4x/em+UyPM8XDRWBkMYwoTkkgQiBb6ksiJgxhTKCEKIYgE63Fg1ZTsgiEJ65NI4peywwpX3Ms7PA6Gl6vwonmj7+1kJdmfpiAIweZuPb11oHgO8jCMsskF4zQkd/9xQa6bcgvGwkjwWv7wHTAIhAyLGSlAUdfau5gNBdoSGkXAAdPb5n1c42drKQPBit6GXk65+jBgPQ0cMckuYWBDOUDaD7Hg13AYA56p4NAPUGBYCJNwZQL7YgdZ6GLkDLDPCi77wQWQCTh50PsfKjT9oPrFmAxggRU9umlLwKSgj2oQWBrHiR99qMZEMWBA2lsWfe61ASg0hR9unYgpCH0DbzIodS7/zfNeLsy0nKDWjQG9GfffbgLy8PlT3p0wAAAABJRU5ErkJggg=="},
            {"name":"Fire Rune",
            "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABfUlEQVR42u2XLW7DQBCFfYGQ4IKQKEeIWlUhAea9g3lhaJEPElBYKTA8LLywsCcodjWWnvU6mdnsH6lkS09xdiW/b2Zn/5pmfv7rs1g+DCyrjfuqGx+6bjifPiZJm/we+35ot89/VAWCjcUExl/Xyw2Q9Mt/VhEEG4shSwylDyCAqAbA0WljLWnn7BRDWOafu9Xw9rgfJf1sqFVcC0gpm79snkZxukPKzgKiZ3MdPbITykoRgI6epUE8iKwZoaNH0TGAfJgNLbDsWtDRs/n363o0ZwAvM1nrghU9GwgAF2NoaHi6AhoKAug5D2OYa3EfzxIEEl2MVuUj/WLw895OgikrNAzRAF7lewD8XgXAGnuOkiF0JqoDyEdC5gwBc10D1QA8cwawVsmkaZgLEEp90kJkAVgFaEXvpT5pP7BWQGTBMxeFzJMB9P7vQcDcG/fs4xnvZBYE617k2QdUDwKGbOwdTIpPxx5EjKqdilMOpF7ExZcT77YTo/n+GPP8Asdyya8KLZNZAAAAAElFTkSuQmCC"},
            {"name":"Treasure Chest",
            "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABs0lEQVR42u1WMU7EMBC8FgESQikRDTU1NAhxoqOhQrS01BS00PAC7gNUCJ7BA3gM3QFGY2WO8caOnRA6W1rZ2Xh3Z2fXcWazOuqoo47E2NzadVPLoODf79vu/uLUvd2euJfrYz8PEdrAB3xBikFgI4ynyvz88MD7KwaBTUAOQwjWpXJzdhQI7ZWNLIgUADqEYF0CQgGwLFkQMQCYfW88rHsHfUAsANtDgwHY4O7jOWgsBRErAQGMZmAFQIIvm8Z9Xs09KG02svJnAFYQiMExL3bmHoRnAsxQ2vIoAFLPXigCQGdKe3O3/KVf3nudKQ9BKANFx3EVXDLq1N7oMb9e7rm1x40OCAugEzxGN5xhI2ZdExTXwayA2v16ipKZQ6FdTUr7RANRAnZikqIdyq+n/YABPNsAFLtXbWKnB8+9lxGN9YunZzw4Ca3efnhgSwAaXI9w9ubTo6LZ0omywppam9TNmAWA+sEJu5XBoCcA1hjv+FGBkAH6iL0bxAAzivUBdDb7SRjgmWVNNQOrs+/IkPrgHoLLAiCtY4WMjWaADuz9b7NOZc/gKRaLfkD+U+ovft/4AZC8tkWxNf7bAAAAAElFTkSuQmCC"},
            {"name":"Dragon Whip",
             "png":"iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAYAAAAaLWrhAAAFaUlEQVR42u3dvY0UQRAG0HXwT2CDjTBxIADMMyGQNREmCRDDJYMJkRDCQQRTYj9N9/bP+6QyV7vb1W+cUk9fLnJqHh5e/Z29dFEABFAEQBEAARQBUARAAEUAFBkS0vV6PayfT0+nV/p91efAFQABFAABBFAABFAABBBAARBAARBAAKUppBZYUhAj1ePj42GBKwACKAACCKAACKAACCCAAAIIoAAIIICbIWsxl2sxQxupKmQtCk4AAQRQAAQQQAABBFAABBBAAAEEUAAEUDZDtvNMayS4cAIIIIACIIAAAggggAACCCCAAAIIIIAAAigLItONc/tXIWtx/Ek3ANQ/AAEEEEABEEAAAQQQQAEQQAABBBBAuaGBkO35cE2PfllxAAVAADUJQAFQbwEEUJMAFAD1FkAANQlAjTgJmSbBqe8ACoAAagSA+g6gAAigRgCo7wAKgABqBID6fjHrEwABFAAtNoACIIACoMUG0J4AEEABEEAA7QkAARQAAQQQQAABFAABBBBAAAEUAAEEEEAAARQAdwFosQEEEEABEECLDSCAAAqAAFpsAO0JAAVAAC02gPbEHRb7++sPh6URc++J9G55fQdQAARQIwDUdwAFQAA1AkAAARQAAQQQQIt9EsCq/rx9c1iaNEbf02NoFU69BVAABBBAAPUWQAABBBBAAAEEUN8BBBBAAKUDTjPCuZGZ9QEoAGoggAACCKAACCCAAAIIoAAIIIAA6t+dG7j6jLD6Lb1/Z/qQhAxAAAEUAAEEEEAAARQAAQQQQAABFAABBHBggNU8r0Vze+NM//tIANNZH2QAAgigAAgggAACCCCAAAIIIIAAAggggADKwDirt2NVja829vPXF4eVbpidkZn1AQgggAIggAACCCCAAiCAAAIIIIACIIAA3tCIkTZFNbOrcKaXe6QzwgrZSEejzPoABBBAARBAAAEEEEAAAQQQQAABBBBAAAEE8M4AZ5lbVRs7hVt9XzU/nAWZt5sBCCCAAiCAAAIIIIAAAggggAACCCCAAAIIIJz/9VtSEOlmqr4vXZfea5ZedgMZgAACCCCAAAIIIIAAAggggAACCCCAAAIIoNwZ4Eg407eppbPFWR5aAAIIIIACIIAAAggggAIggAACCCCAAiCAAA6MrNqEsxxjSo/krHCEq3owtcAJLoAAAggggAACCCCAAAIIIIAAAggggAACCCBkNyAb6e1f6X/v/Ta1FR5MVX378v6wfv34dFjL4wQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAHcF2C6Cas3g61wcUv631d4MLWYEW6NE0AAAQQQQAABBBBAAAEEEEAAAQQQQAABBBDAW6uaac2Cs/qdz79fHtYK89HeM8IUJ4AAAggggAACCCCAAAIIIIAAAggggAACCCCAUwNM7zuf5XKWcp5XIKvWZYXjSOl6VlhSgJ8/vjusJWaEAAIIIIAAAggggAACCCCAAAIIIIAAAggggPsCTI/dtJihpZd7lJDC31JtmFkupum9lypI1ecqZGkNtdYAAggggAACCCCAAAIIIIAAAggggAACCCCAawMcCWd6jCkF32LWt8Jb0UaaH7YAOM0RJwABBBBAAAEEEEAAAQQQQAABBBBAAAEEEMB9Aab3x8dYWiALv6/FvPKyceAEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABNKI4CWc8z+s860sfMJCtixNAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQwOEXrfed9C0uRIFsT5wAAigAAggggAACCCCAAAIIIIAAAggggAACuOyCtgAB0p44e+8zAAEEEEAABUAAAQQQQAAFQAABBBBAAGVfgP8AJG53c52Hca4AAAAASUVORK5CYII="},
            {"name":"Magic Rune",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABjElEQVR42u2XPU7DQBCFc4E01Ei5AD1Nami4BcoNKKhpfIs0FJRI0ERpKBAdFRfgGgghbTSrPPQy2p2d/aEAYenJsp34fW92vF7PZv/bb93mR8eBlTrH14YbX69WYftwH95fX+Jezsn+dprC+enyQEMg2FhMYC5iIEDIMasLImcMyTWAAGIYgC63FgxxHZBDIGrMU+ruBZS0xby7CkhfMr9YXEVNJ+vxAFZ6Geu3s000FnEDspqeiFJ6mH9cPhYBmnrBSg9zLwD+465CKT2bh5vn7x6wKgAIlgmQSq9LH+6e4p4BeA5oakadnk1hjOQA0I0IaRg3ANLDFIJp1OdXPAYQ/07DAMQNgPS4EUwO0gsAYPYgGlg3ZzUAhgA3EsVKkKlWLn0zgJ755OYYe6TmJsw1ovsxzAEAQoy45JzYegLcE5EFIBIAHm/PLFj1PrBmQA3gff6rAaz3vxjWlL7pZcQ3TQGwSmuB5gWqBeFdjHSvjnMQGNOhZa9ZE1oLj1Ti7o+Tmi+gH/0i+rPbDpnRTBL7tdYOAAAAAElFTkSuQmCC"}
        ];
        for(var i = 1; i <= 7; i++) {
            let typeInfo = await this.deployments?.read('SacrificialAlter', `typeInfo`, i);
            let imgInfo = await this.deployments?.read('SacrificialAlter', `traitData`, i);
            if(typeInfo.maxSupply == 0) {
                await this.deployments?.execute(
                    'SacrificialAlter',
                    { from: this.deployer, log: true },
                    `setType`,
                    i,
                    2 ** 16 - 1
                );
            }
            if(imgInfo.name != imgs[i - 1].name || imgInfo.png != imgs[i - 1].png) {
                await this.deployments?.execute(
                    'SacrificialAlter',
                    { from: this.deployer, log: true },
                    `uploadImage`,
                    i,
                    imgs[i - 1]
                );
            }
        }
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['sacrificialalter'];
script.setupFunc.dependencies = [
    'sacrificialalter-deploy', 'gptoken-deploy', 'rift-deploy', 'world-deploy',
    'trainingproficiency-deploy', 'traininggrounds-deploy', 'traininggame-deploy'
];
script.setupFunc.runAtTheEnd = true;