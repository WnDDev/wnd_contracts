import { BigNumber } from 'ethers';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.setWnDForTraitIfNeeded(this.getContractAddress('WnD'));
        // await this.loadWnDTraits('Traits');
        await this.unpauseContractIfNeeded('Traits');
    }

    private async setWnDForTraitIfNeeded(address: string) {
        if(!this.forceSetContracts && (await this.deployments?.read('Traits', `wnd`)) == address) {
            return;
        }
        await this.deployments?.execute(
            'Traits',
            { from: this.deployer, log: true },
            `setWnD`,
            address
        );
    }

    private async loadWnDTraits(contract: string) {
    
        const baseTraitType = BigNumber.from("0");
        const headTraitType = BigNumber.from("1");
        const spellTraitType = BigNumber.from("2");
        const eyeTraitType = BigNumber.from("3");
        const feetTraitType = BigNumber.from("4");
        const neckTraitType = BigNumber.from("4");
        const mouthTraitType = BigNumber.from("5");
        const wandTraitType = BigNumber.from("7");
        const baseTraitIds = 
        [
        0,1,2,3,4
        ];
    
        const headTraitIds = 
        [
        0,1,2,3,4,5,6,7,8
        ];
    
        const spellTraitIds = 
        [
        0,1,2,3,4,5,6,7,8,9,10
        ];
    
        const eyeTraitIds =
        [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16
        ];
    
        const feetTraitIds =
        [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13
        ];
    
        const neckTraitIds =
        [
        0,1,2,3,4,5,6,7,8,9,10,11
        ];
        
        const mouthTraitids =
        [
        0,1,2,3,4,5,6,7,8,9,10,11
        ];
    
        const wandTraitIds = 
        [
        0,1,2,4,3,5,6,7,8,9,10,11
        ];
    
        const Trait = [
            {"name":"Blue Wizard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABU0lEQVR42u1XQQrCQAz0A148S/HqS7z4DW+Cxx79gr/w6iekDxE8CZ68upLCwJhmt61tKkoLQWm3mUkmyXYnk/H61Ws6mwe2wcF3y0tYHJ+lyf/BSAC8uF3fbBASDI7oYe4kAC6WZdsKAbmH5y4kxCmAAcKGmpA1bgQ4QsvcM5ACZxJuBCTFdQSw5j8JfEWCWISp6Hsb0XCqRy6ApOXQdrjHI7qTHHDK4xYkYqMY4Pqd1iQsTTkizgYD63W6ZhqD3095OOebypTTIFa6tVxi4kt8Jknw4v1qHR7FofzlArNAdY0wGTH2xUGZBGSBLIaBNQjoTQja602JCYgP9gkSySyALQgABHpbWdDPIAHk5Gw2LkKwjbVYTAYuymTa2wwgK3JLgtiO2Xn8Noled0Dnscw93xRcd0Qv4zhGwJLA5Uv5UwlcDiJ1g8j9oFL3PTCeGdteL8qHhyLj5s5dAAAAAElFTkSuQmCC"},
            {"name":"Green Wizard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABV0lEQVR42u1XsQ3CQAxkARpKRJMaCjagpGEBBmADpJRMgMQorECBmIEpqKiDHOmkw/F/PiQOAiWSBUo+vrPP9udHo+H61Ws8mRVsvYOvtotif8xKk/+9kQD45T5/s15IMDiih7mTALhYtpxWCMg9PHchIU4BDBA21ISscSPAEVrmnoEYOJNwIyApriOANf9J4CsShCKMRd/ZiIZTPXIBJC2HtsM9HtGt5IBTHrcgERrFANfvNCZhacoRcTYYWK/TNZMM/jjnxTXfVaacBrHSreUSE1/iM0qCFx/Wm+J5O5W/XGAWqK4RJiPGvjgok4AskMUwsAYBvQlBe70pMQHxwT5BIpoFsAUBgEBvKwv6GSSAnJzN5CIE21CLhWTgooymvckAsiK3JAjtmK3Hb0r0ugNaj2Xu+VRw3RGdjOMQAUsCly/lTyVwOYjUDSL3g0rd98BwZmx6vQCH8/BMl+xQQAAAAABJRU5ErkJggg=="},
            {"name":"Purple Wizard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABVElEQVR42u1XsQ3CQAzMAjTUSIxAwQ7QMAE9LW1KVqBnCcoMAKJnkVTUjxzppMPxfxISB4GIZIGSj+/ss/35LPtf33pNprPANjr4fnEK91VRmfwfjQTAy+LyYqOQYHBED3MnAXCx5XxbIyD38NyFhDgFMEDYUBOyxo0AR2iZewZS4EzCjYCkuIkA1vwmgY9IEIswFf1gIxpO9cgFkLQc2g73eET3kgNOedyCRGwUA1y/05mEpSlHxNlgYL1O10xr8PKch2u+q005DWKlW8slJr7EZ5IELz6sN+FxO1a/XGAWqK4RJiPGvjgok4AskMUwsAYBvQlBe70pMQHxwT5BIpkFsAUBgEBvKwv6GSSAnJzN1kUItrEWi8nARZlMe5cBZEVuSRDbMXuP3zbR6w7oPZa559uC644YZBzHCFgSuHwpvyuBy0GkaRC5H1Savgf+Z8au1xMICXhfA911ggAAAABJRU5ErkJggg=="},
            {"name":"Orange Wizard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABW0lEQVR42u1XMQrCQBDMB2wsrOzsfYFgI4jgA2wsfUOw8gti6yf8hNj5DFsbrSMbGBg3e5eLyUWUHCxKstmZ3b2d5JKkW7+6ev1hxtY6+HYyza7rQW7yvzUSAH8cF2/WCgkGR/aw6CQALjYbjQsE5BruRyEhQQEMEDbsCfGJRoAztCx6BXzgTCIaASlxGQH4/CeBr7TAlaEv+8YkGkG15AJIRg5jh2ss0bXagaAstyDhkmKA62cqk7B6yhlxNRhY++k9Ewx+P6XZOd0UVE6DWOXW7RKTWBLTS4Kdd/Nl9rzs81/eYBao3iNMRoxjcVImAXEQZxhYg4B+Cd0OqwIh+OA5icExQcJbBbAFAYCg31YV9D20AO3kagZvQrB1jZirDbwpvWWvIkBW5lYLXG/M2vIbkr2egNqyzDMfCq4nohE5dhGwWhDlS/nTFkQ5iJQJUfSDStn3QHdmrLpe1kkPtY0EBdwAAAAASUVORK5CYII="},
            {"name":"Red Wizard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABWUlEQVR42u1XsQ3CQAzMAjTUULNBCkoahMQALIAYISWMgJiEJRArMAEtFXWQIy66OP5PQvJBoLxkgRLHd/a9nXwUDetX12g8Sdl6Bz/MFuktjjOT/72RyMF3ccF6IVEAj5WFJgFwsdV0XiIg13A/CAkJCmCAsGFPiE8wApyhZcEr4ANnEsEISImrCMDnPwl8RQJXhr7sOxvRCKpHLoCk5dB2uMYjupUcOTiP3DcJ1yjOwdUzjUlYmnJGXA0G1n56z9QGf5yT9JJsS1NOg1jl1nKJSSyJ6SXBzvvlOn1ej9kvbzALVO8RJiPGsTgpk4A4iDMMrEFAv4Tup02JEHzwnMTgmCDhrQLYggBAoLdVBX0PEkBOrmbtTQi2rhZzycCb0lv2JgPIytySwPXGbD1+62SvO6D1WOaerwuuO6KTcewiYEkQ5Ev5UwmCHESqBlHwg0rV98BwZmy6XsLUCJySNTd2AAAAAElFTkSuQmCC"} 
        ]
    
        const headTraits = [
            // need 11 more 
            {"name":"Blue Mist",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdUlEQVR42mNgQAO8QjL/QZhhIADIYruLP8CYro6A+RpmObIjaO4QmMW8lhswHKAUAsF0cQTIAciOALFBltMlStDjHmY53R0AC26Y5WA+KGTokSCRExyyI+ieI9AdNGBlwigYBaNgFIyCUTAKRsEoGAWjgF4AAFyYhJYc37uRAAAAAElFTkSuQmCC"},
            {"name":"Devil Horns",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAjUlEQVR42mNgIALwCsn8h2FqqmUg1vIb6Wb/b5iZEe0AkFqQHoodATLg2aQIoi1HdwRIL0WOAGluUHci2wEgvRQ7ADn4SUkDVIkGWAjAQsFT1gqvgSA5kBqY76kTAmZmcMsJGQhzMMwRpEYdwVAgNgqo4nts8Uor9aNgFIyCUTAKRsEoGAWjYBSMggEFAJl7fYUPNtEeAAAAAElFTkSuQmCC"},
            {"name":"Fires 1",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnklEQVR42mNgwAN4hWT+gzADhYAsc0AaLrntoNgBIP3+p9VJMwekOE9/NlUsV+u1Jd1ykM9BDqAkBGA+BzmArBB4VLkFjN/vOEKRIy5/0QbjP/+3EmcOLPh/33sCxiBHkOMAWPCDLAZhkCOIdgAo6GEOIDcaYFEAcwBJ0QBzBLm+R3cE0b4fNGXAKBgFo2AUjIJRMApGwSgYBaOAngAAITSTthUywn4AAAAASUVORK5CYII="},
            {"name":"Fires 2",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVR42mNgwAN4hWT+gzADhYAsc0Aa/nFzU+wAkP6NBYqkmQNS3KDuRBXLs3xNSLcc5HOQAygJAZjPQQ4gKwT+xYhD8EJxihzxcJYuGH+5Nok4c2DB//+oMRiDHEGOA2DB/+/JCjAGOYJoB4CCHu4AMqMBFgUwB5AUDTBHkOt7dEcQ7ftBUwaMglEwCkbBKBgFo2AUjIJRMAroCQDJSIX/lUppfAAAAABJRU5ErkJggg=="},
            {"name":"Floating Eye",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNggAJeIZn/IMwwUABk+RfF5QPviP/VW+jvCFjwwxxA95BADv4YuYaBC4Wp0rPADgE5AuYguiVOWPDDHAGiYY6iuQOQowAZ0y0twHx6tDz1/9fjE8AYxKar75EtR3YEzUMB5oD///+CMYjvqWkK59PFAaCgRnYAOEFC+XSLBpBF6FFAF8vRowIZD2iRPKCV0igYBaNgFIyCUTAKRgE9AQDOAddH3JGgcwAAAABJRU5ErkJggg=="},
            {"name":"Green Floating Eye",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAq0lEQVR42mNggAJeIZn/IMwwUABkuf9p9YF3xJ//W+nvCFjwwxxA95BADn6ROLv/l79oD0woqPXagh0CcgTMQXRLnCBLQD6HOQJEwxxFcwcgRwEypltagPn0aHnq/6/HJ4AxiE1X3yNbjuwImocCzAH///8FYxDfU9MUzqeLA0BBjewAEIbx6RYNIIvQo4AulqNHBTIe0CJ5QCulUTAKRsEoGAWjYBSMAnoCAMFKzAttlg7sAAAAAElFTkSuQmCC"},
            {"name":"Halo",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAlElEQVRYhWNkIBPwCsn8R9b5+d0TsswiWRPM4mfFv1DEpXrZyHIISYpBln86LMDwZcMrFEthjuEJEGPgs/1AkiNYSHEADKD7VqoXEiqfAkg3i4kcB3x6vAnsa1CIgDCIDRKjC4BZ+v+qzv//X89B8FWd/zBxUt0w4LlgFIyCUTAKRsEoGAWjYBSMglEwCgYWMDAwAAA91kESzrMeRAAAAABJRU5ErkJggg=="},
            {"name":"Horns",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeUlEQVR42mNgIALwCsn8h2FqqmUg1vLrG/L////3l2gHgNSC9FDsCJhhxFpOqT6KfU/1UED3CSlpgGohkB/rAQ8FQj5CDjEQDdJLtRCAOYQYB4DUUiUEkA0lNj5JVc9ASjlAK/WjYBSMglEwCkbBKBgFo2AUjIIBBQCayKpFE5/udAAAAABJRU5ErkJggg=="},
            {"name":"Purple Mist",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdUlEQVR42u2UMQqAMBAE7wM2torgv3yMn7DxA37QXtnAwnHWbpodWEi3k1ySiMIwzg8SPUDxvV4tUgnumuVZ4ncRFm/L/hE4prNFIgGBLIE1yiUjqbNnuVyAx81yBDKSC5kvXJaQv4gq1O1PMMYYY4wxxqh4AVcvfPvog0uvAAAAAElFTkSuQmCC"}
        ]
    
        const spellTraits = [
            {"name":"Flies",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAXklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjILBBniFZP6DMF3NhUmC8P9/f8GYmo5ANxfFMeiSX49PoJkDQGZjeBJdktZRgNWTyJKJhWo0cwDMbJyepFcIDKpcBwCsmnHXe9isrQAAAABJRU5ErkJggg=="},
            {"name":"Green Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAk0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DEA14hmf8gPGD2goiSXsX/9HIIzB6YnXBBkMDPVwk0dQTIbJAdKJYjS3qkGNHcAVjtwAgSGkcB1uBHdxm10gS6ObBQgDsCWQDmCGqGCHoiR7cL7gB1J3WwBC0SI3LiA2GQXRgOAGFkRdR2ALLnYPahpAN0TKv8j24HAEEhoAUEHMPGAAAAAElFTkSuQmCC"},
            {"name":"Lava",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUDBbAKyTzH4bpbgdI4KsqKxg3qJvRxBEgM0Fmw+yB2wG3vBaK0RVQyXKYucj2gO0AS9ayomBqhwLc92j24HQAigJq+B6f+YPCAdiCh1rpACONYYtm9BRK00SIK6ch51FaZUNs5gMA3yDUye1Jp4QAAAAASUVORK5CYII="},
            {"name":"Blue Lightning",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAc0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUDAbAKyTzH4QHzD4Q5/+/v3RxBE676OEIgnbQ0hF4zYbFCUgBCOds+E1VR4DMApkJMx8lDcAkYZbSKkEim41sH4okTALZMdSymCiz8bqSgqAnK3SpHQK45AGMVpZv0h26mgAAAABJRU5ErkJggg=="},
            {"name":"Lightning",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAc0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUDAbAKyTzH4QHzD4Q5///v3RxBE676OEIgnbQ0hF4zYbFCUgBCP9+lkNVR4DMApkJMx8lDcAkYZbSKkEim41sH4okTALZMdSymCiz8bqSgqAnK3SpHQK45AFqN5nZq7+5ZQAAAABJRU5ErkJggg=="},
            {"name":"Purple Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAk0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DEA14hmf8gPGD2gohLbjv+08shMHtgdsIFQQKPKrfQ1BEgs0F2oFiOLJmnP5vmDsBqB0aQ0DgKsAY/usuolSbQzYGFAtwRyAIwR1AzRNATObpdcAcYSUWBJWiRGJETHwiD7MJwAAgjK6K2A5A9B7MPJR2gY1rlf3Q7AIbvsX2PRDj2AAAAAElFTkSuQmCC"},
            {"name":"Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAk0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DEA14hmf8gPGD2goi1srL/6eUQmD0wO+GCIIHnBao0dQTIbJAdKJYjS8bKG9PcAVjtwAgSGkcB1uBHdxm10gS6ObBQgDsCWQDmCGqGCHoiR7cL7gBbaSOwBC0SI3LiA2GQXRgOAGFkRdR2ALLnYPahpAN0TKv8j24HAFA4lCFrd3y0AAAAAElFTkSuQmCC"},
            {"name":"Slime",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUDBbAKyTzH4bpbgdIoOI+DxjbdJvQxBEgM0Fmw+yB2wGz/PFPeTDGUEAly2HmItsDtgNEwARhmNqhAPM9uj04HYCigAqW4zV/UDgAW/BQKx2gpzGs0YyeQmmZCHHmNOQ8SqtsiM18AE/+8TFZi/oLAAAAAElFTkSuQmCC"},
            {"name":"Swords",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyUlEQVR42u2Syw3CQAxE0wAXzvTBhTNUkh6gKiTEIeJMBZRAA1QAixxprIFYYS3tjRnJym898+LdrpMkSZIkSZKkv9f9cC6P4eplz7ftUFrnmGeUNX5YLFcfZe9aQsAvynGAy+no1RKCw6MMB9j3/fihvJ6+wMpM+L5GUS97W5YDgBIQu/XGFwIEDRkA9MDHPM17Es6jiiAwmSwA9/4MjyCsCdfvLakZP4LZazZ8boQMUfv33JPdwskh4oNTC8/A2UMcwmS3oHb9G3zJV+xALD0YAAAAAElFTkSuQmCC"},
            {"name":"Red Swords",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyElEQVR42u2SMQ7CMAxFewEWZjpyBhb2nqQ7I5dCSIzM3IUTdISgX8mWW0yxpWz9X7IaJfH/r0mahqIoiqIoiqJWr+HRlXk9T/tSOweeXta4sNnuJoW5mhDi5+UowP121aoJYcO9DAU49/24UN4v3YCCiR1H5PVab2QpAHRpW4XoDkfdKCDSkAGQHvGBJ7xlHpmTpl8QcjJZANv7N9yDQJN851cSOX4Jtl6L4UtHaCGif297slf49Yjsw4nCW+DsI3ZhslcQ3f8B2QRKeMExOGgAAAAASUVORK5CYII="},
            {"name":"Water Spell",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUDBbAKyTzH4bpbgdIgKf1PgTrHaSJI8B2AM2G2QO3A2a5z+2HYIyhgFqWQ81FtgdsB4iACcIlqRwKMN+j24PTASgKqGA5XvMHhQOwBQ+10gF6GsMazegplJaJEGdOQ86jtMqG2MwHANxy9Ffs0JkiAAAAAElFTkSuQmCC"}
        ];
    
        const eyesTraits = [
            {"name":"Blue Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZklEQVR42mNgGAWjYBQMRcArJPOfGDGaWa6w/N9/ZAuxidHUAfmajzEcgC5G8xCQk8sBWwjCIDZdQgDm0+NvnsF9jE2Mpg7A5lv0UKF5KKBbhE1s+GbDUTAKRsEoGAWjYBSMAmoDAAeRUufgx/QFAAAAAElFTkSuQmCC"},
            {"name":"Green Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZklEQVR42mNgGAWjYBQMRcArJPOfGDGaWV7Sq/gf2UJsYjR1gH2kDoYD0MVoHgKKBlJgC0EYxKZLCMB8evCmNtzH2MRo6gBsvkUPFZqHArpF2MSGbzYcBaNgFIyCUTAKRsEooDYAAH/8R7WuQ6RKAAAAAElFTkSuQmCC"},
            {"name":"Mouth Eyes",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaElEQVR42mNgGAWjYBSMgqEI/KVt/n89PuE/iEZm08VykGUg+v//v3ALYWyYHE19jmwxOgDJ0S0kBgQgB/ESWbf//zQ0wBjExqaGZgAWDTAHoKcJujmAkNgoGAWjYBSMglEwCkYBMQAA9g9KsZQV1OkAAAAASUVORK5CYII="},
            {"name":"Orange Eyes",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgElEQVRYhWMYBaNgFIyCIQt4hWT+/5smDsYgNl39AbMcRCOzyTGLiVSL7xoL/P/Y8htDDiQGkiPVISQ54PO7J4wG93kY7s/9CeYHC7PA5UBiIDmQGlLMJEkxMgD5FBYS/DWscAeSax7ZjqB7AhwFo2AUjIJRMApGwSigKmBgYAAAW040JmGKjSIAAAAASUVORK5CYII="},
            {"name":"Purple Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZklEQVR42mNgGAWjYBQMRcArJPOfGDGaWX7Jbcd/ZAuxidHUAXn6szEcgC5G8xAwkooCWwjCIDZdQgDm00eVW+A+xiZGUwdg8y16qNA8FNAtwiY2fLPhKBgFo2AUjIJRMApGAbUBAH4RUHdD9TvQAAAAAElFTkSuQmCC"},
            {"name":"Tentacle",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAfElEQVR42mNgGAWjYBQMZcArJPMfhgfE8h65CXCMzRHIDqSqQ2GW/8md+f+L4nIwRncEsgNhakCYYkeADAAZhGw5uiNglsPEkMUpdgTMEGIxtpChuQNgoYMrbVAl/nFZTFPLiXEEcnzTrQygSVYbBaNgFIyCUTAKRsGIAQB8NdjUJ7oZMAAAAABJRU5ErkJggg=="},
            {"name":"White Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZklEQVR42mNgGAWjYBQMRcArJPOfGDGaWX59Q/5/ZAuxidHUAfmxHhgOQBejeQg4WhiBLQRhEJsuIQDz6f9/f+E+xiZGUwdg8y16qNA8FNAtwiY2fLPhKBgFo2AUjIJRMApGAbUBAE5KUne8hrWiAAAAAElFTkSuQmCC"},
            {"name":"Green Demon",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPklEQVRYhWMYBaNgFIyCUTAkgc1Fxv8y8Yz/YW4HsUFidPOLRDCmZdjERsEoGAWjYBSMglEwCkbB4AcMDAwA4moJ5zswMw8AAAAASUVORK5CYII="},
            {"name":"Angry",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAVElEQVR42mNgGAWjYBSMgqEG1kTZ/ydHjmqg2MPj/4sqTwyLQGIgOZo74P//v/95hWT+I/sWxAaJgeTo4gBsFuESHwWjYBSMglEwCkbBKBgFgx4AAFovLLn2BgTmAAAAAElFTkSuQmCC"},
            {"name":"Big",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAATUlEQVR42mNgGAWjYBSMglFAIlgTZf8fhIs9PP7DxEBsmDjNHfD//9//IEysOE0cwCskg2ERSIxuDhjQEBgFo2AUjIJRMApGwSgYdgAAs/A3TdhyKbIAAAAASUVORK5CYII="},
            {"name":"Blue Demon",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPElEQVR42mNgGAWjYBSMglEwFIHwztf/HRTe/IfxQWyQGN0coGA07T8xYqNgFIyCUTAKRsEoGAWjYEgAANOuDdE5g8LoAAAAAElFTkSuQmCC"},
            {"name":"Blue Star",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAATklEQVR42mNgGAWjYBSMgqEIHBTe/CdGjGZAbu21/8SIUd/iimv/RYyO/1f6+BBMw8SRxUBq6OIQYsSGbxoYBaNgFIyCUTAKRsEoGFYAAKq8Ji+ZbP4JAAAAAElFTkSuQmCC"},
            {"name":"Crossed",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOElEQVR42u3NsQkAIBAEQTu1M2u0AXnTDxQ0MBBmkoNNrhQALvVWI++uPRUx4qQ9Pc+HqwYAwDcmOSsjjQSYb4EAAAAASUVORK5CYII="},
            {"name":"Demon",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPElEQVR42mNgGAWjYBSMglEwFMFXVdb/zZLq/2F8EBskRjcHxIkr/SdGbBSMglEwCkbBKBgFo2AUDAkAAEztCu04Y3coAAAAAElFTkSuQmCC"},
            {"name":"Green Star",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAR0lEQVR42mNgGAWjYBSMgqEIeMpM/hMjRjMgd03+PzFiNLEY5NOz/yv+I/sYWYxuDhmQEBg0aWAUjIJRMApGwSgYBaNgWAEA2nYgm1PtJBgAAAAASUVORK5CYII="},
            {"name":"Purple Star",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAR0lEQVR42u3SKxIAIAhFUbfCqm0Gi5tyGXYcG5GCv7knvgKPISUAeFGWop4szJCmnixk8GqqtattbLNtixy5wDU/AAAA8JUJEjQqA1z0pyQAAAAASUVORK5CYII="},
            {"name":"Red Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAZUlEQVR42mNgGAWjYBQMRcArJPOfGDGaWf4vRvw/soXYxGjrAG5uTAegidE8BBrUncAWgjCITZcQgPn0/1FjuI+xidHUAdh8ix4qNA8FdIuwiQ3fbDgKRsEoGAWjYBSMglFAbQAALdxOx5rRACYAAAAASUVORK5CYII="}
        ];
        const neckTraits = [
            {"name":"Black Neck",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdUlEQVR42mNgGAWjYBSMAiyAV0jmPzqmVD9JZoAUb5aXB+PHntpgTKonYPpg5pDqCbAjvNzd4ZhUByDrJdlymAPS0tL+z5s3j2wHgPSCzCDLAeiOIFUvxZYjRwPIIFL1gvSQHfyjYBSMglEwCkbBKBgFIwoAACjXVctNO2ADAAAAAElFTkSuQmCC"},
            {"name":"Clock",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAU0lEQVR42mNgGAWjYBSMglEwCkbBUAL/p+n8p4YamjmC5pbDLboKsQhEI7PpGx1AC3mFZP5/ff/iP90thzkAZDnIEQPiAPQoGAWjYBSMglEwZAEAZZQzASjE3jwAAAAASUVORK5CYII="},
            {"name":"Dark Horns",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAhklEQVR42u2TwQnAIBAEbSCfvFOHLQgp5OzKutKNyQoHPiToachnB+Ty2XUk6hwh5IVtPzLWL3kEL++nBUwdJRjnNp+SWC4QLQKP9apfMCSgFwfBlFIWEZMEMsiiQw/S1aNBzDOE8o05KlBn685uew1iWgXqDtNLsGzcEllxmQkhhBBCPuMGLXpw/etiuIEAAAAASUVORK5CYII="},
            {"name":"Diamond Clock",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUUlEQVR42mNgGAWjYBSMglEwCkbBUALal779p4YamjmC5pbDwKb/EItANDKbrtEBspBXSOY/yNd0txzmAJDlIEcMiAPQo2AUjIJRMApGwZAFAEFWOJ1Z/dnYAAAAAElFTkSuQmCC"},
            {"name":"Diamond Necklace",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPUlEQVR42mNgGAWjYBSMglEwCkbBUALal779p4YamjmC5pbDwKb/mBZhE6O5I5DxaAIdBaNgFIyCUTBkAQCrESGtSwQ+GQAAAABJRU5ErkJggg=="},
            {"name":"Ear",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAR0lEQVR42mNgGAWjYBSMglEwCkbBUALvN5T/p4YamjmC5pbjs4hulsPAvxdn/4MwyOKj5an/BzQ90N33o2AUjIJRMAqGFQAAg+glwjF8xZgAAAAASUVORK5CYII="},
            {"name":"Gold Cape",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUUlEQVR42mNgGAWjYBSMglEw2AGvkMx/EKaXPgxD/v//C8akGEauPqwG/TvHCcakOoAcfVgNelfNAsakOoAcfYMvDYyCUTAKRsEoGAWjYEQAAPXxPXE8Za4vAAAAAElFTkSuQmCC"},
            {"name":"Tiny Dragon Wings",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAh0lEQVR42mNgGAWjYBSMAiTAKyTzHxnT3VyQ5N/nz8H4hpkZVRwBMgNkFsxcgmbCNMAwJY4gyyy4pnQzikIC2ecgs4gyB6SgQd0Jronc6EAPdphZILMJpgFsGkGY1BDAZgZBj2BLMJSmAZISNswBtMqGRDmAmhbT2/xRMApGwSgYBaNgFJAFACEZzjl0tJ0QAAAAAElFTkSuQmCC"},
            {"name":"Horns",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAcElEQVR42mNgGAWjYBTgAbxCMv9BeED0gzT++/mJYgeQZQY1LKfIrEHjAGpFAUnmwBIOTCO5jsBmBlHmIAfZ+w3lYDaIJtUByHpJjgaY5TCaXAcgm0FWTiDHYmwOoUZiHgWjYBSMglEwCkbBKKAZAACxrp9F/WUbAQAAAABJRU5ErkJggg=="},
            {"name":"Purple Neck",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaklEQVR42mNgGAWjYBSMglGABfAKyfxHx5TqJ8kMkOIbZmZg/CtKFYxJ9QRMH8wcUj0BdkQn10M4JtUByHpJthzmgMvOT8GYXAfA9JPlAJgjkA0jVh+yo8m2fBSMglEwCkbBKBgFo4BeAABRK1SVMMI58wAAAABJRU5ErkJggg=="},
            {"name":"Red Cape",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUElEQVR42mNgGAWjYBSMglEw2AGvkMx/EKaXPgxDbqSbgTEphpGrD7tBZmZgTLIDyNCH1aAGdScwJtUB5OgbfGlgFIyCUTAKRsEoGAUjAgAAuZwzBdjMYTQAAAAASUVORK5CYII="},
            {"name":"Sun Strike",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAoklEQVR42mNgGAWjYBTgALxCMv9BeMDMAWn6st6dIkeQbAbMtTANlDgCXS+62Xg1wTR+SVL+T24QwvTBzEA2lygHwBTDDCHVAciORzeTqKCDuxxIg/gkOwCLGSSnBZDGP89PkO0AsF5SoxE53mCWkxsFMEcgm0l0yiU36PFGBb5owMgBVLAc2REEcwJyPqVGCUhv80fBKBgFo2AUjIJRQDYAANAg3OHjA22wAAAAAElFTkSuQmCC"}
        ];
    
        const mouthTraits = [
            {"name":"Blood",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASUlEQVR42mNgGAWjYBSMglEwCkYBmSBeUOM/CL/TYgDTdLUcZCkyexUTnR2B7ACQ5cg0XQA2y+jqAGIdNQpGwSgYBaNgFAwJAABoJBi7www5lwAAAABJRU5ErkJggg=="},
            {"name":"Brown Mustache",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdUlEQVR42mNgGAWjYBSMglEwCogAvEIy/+mhB69hu+IN4QaW+7ig8EFskBgyn6oOgBn6occZbDGMjYyRxZEdR9VQgPkcHwapobrvkR0Biw6YRcgOg/HpkihhFiM7hO45AxbsdLccPSRGC6pRMApGwSgYBZQAAH1da3Pu8X6CAAAAAElFTkSuQmCC"},
            {"name":"Drool",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASklEQVR42u3QwQkAIAiFYVdwtvZovJYzMOzkoUN0EIL/A9HbeygCAAAeaTePadP3Lg2P0HzrsNoSuUCE513z/kNYaYHbUgAAfGEBh7Qnn5vC7bMAAAAASUVORK5CYII="},
            {"name":"Gray Beard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeUlEQVR42mNgGAWjYBSMglEwCkYBCSDYye1/b2Pj/7yUFDCGicP4IDmQGqpbzCskA7cARMMsQXYISAxZDUgP1R1ACqaqA2COgPkShkF8bGJUtxybI0BBjYxpbjmyI9BDA2YxzS3HlS7oajG20BgtoEbBKBgFo4ASAABmVIlTUchmMgAAAABJRU5ErkJggg=="},
            {"name":"Green Tentacle",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaklEQVR42mNgGAWjYBSMglEwCkYBieDu/1v/mbJj/4PYIBqZDZKjmcW8QjJgC4TP1oIxyEKQGAiD2DBxkBqQGIgNoqnqAJihMIwsB8Mwh1DVcnQHEFI3YJbTNP4HzPJRMApGwSgYBcMeAAAjpUrl3cOyhQAAAABJRU5ErkJggg=="},
            {"name":"Mustache",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaUlEQVR42mNgGAWjYBSMglEwCogAvEIy/+mhB69h/35+ghv4fkM5Ch/EBokh86nqAJihpGCaRAPM5/gwSA3VfY/sCFh0wCxCdhiMT5dECXMIXS3GljBpkuBIDYnRgmoUjIJRMApGASUAAA2MoDdDNS8VAAAAAElFTkSuQmCC"},
            {"name":"Purple Tentacles",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaklEQVR42mNgGAWjYBSMglEwCkYBieB/29X/eXxF/0FsEI3MBsnRzGJeIRmwBV8Ul4MxyEKQGAiD2DBxkBqQGIgNoqnqAJihMIwsB8Mwh1DVcnQHEFI3YJbTNP4HzPJRMApGwSgYBcMeAACFP04D+V/fjwAAAABJRU5ErkJggg=="},
            {"name":"Purple Tongue",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPklEQVR42mNgGAWjYBSMglEwCkYBBaCWe+N/EB4Qy3mFZP4fEjkAxiD2yHMAzBEDZvkoGAWjYBSMglEwbAAA7wUWIf+7aCQAAAAASUVORK5CYII="},
            {"name":"Red Tongue",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPklEQVR42mNgGAWjYBSMglEwCkYBBaBB3ek/CA+I5bxCMv9vmJmBMYg98hwAc8SAWT4KRsEoGAWjYBQMGwAAGSQUOU7PSOkAAAAASUVORK5CYII="},
            {"name":"Slime",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASUlEQVR42mNgGAWjYBSMglEwCkYBmYBlos1/EP7/FkLT1XKQpchswd9i9HUEsgNAliPTdAHYLKOrA4h11CgYBaNgFIyCUTAkAABnHyCjiBmPsAAAAABJRU5ErkJggg=="},
            {"name":"Tusks",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAe0lEQVR42mNgGAWjYBSMglEwCvAAXiGZ/yA8UPrBBvz7+QnDEHSDsVmESy9ZDoAZBMLvN5T/b0vyBGOYOhgfJAdTh6yPIgeADIUZhoxB4jB1+NRQ5ABcjkA3mBg1FDuCkMHojqCa5egJDZ/BxKgZBaNgFIyCUTAKBh0AAGd7vQFXbjlDAAAAAElFTkSuQmCC"},
            {"name":"White Beard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaklEQVR42mNgGAWjYBSMglEwCkYBCeD9hvL//35+gmOYOLIYSA3VLeYVkvmPzRJkh6A7DqSHZg4gBlPVATBHoPsSxMcmRnXL8TmCbpYjOwLdITCLaW45rnRBV4uxhcZoATUKRsEoGAWUAADddtytunFzQAAAAABJRU5ErkJggg=="}
        ];
    
        const wandTraits = [
            {"name":"Black Wand",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAa0lEQVR42mNgGAWjYBSMAjoDXiGZ/yA8YJanRgSPOmBgHACzfH5J1MA5AGR5tJXFwIbAyI1/UNAPuAMGLP5hYMAc8H5D+X8QhrEHxAFHy1P/IztkwBwxoNlwwCwf0AII5vvRltAoGAWDFgAAlppZBHQ1PNcAAAAASUVORK5CYII="},
            {"name":"Cross",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgUlEQVR42mNgGAWjYCQCXiGZ/yA8YJaviTAZYQ6ABTkIF7g5DYwDQJaC8ONSAzAeEEfAfA+iByQhDmgChFkOCv4BcwDIcljwj+b/ASl6B9QBA5b1kMGAJcD3G8r/gzCMPSAOOFqe+h/ZIQPmiAHNhgNm+YAWQDDfjzZER8EoGLQAAKBGeudYvzKHAAAAAElFTkSuQmCC"},
            {"name":"Enchanted Sword",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAxklEQVR42mNgGAV0BrxCMv8HzGIQ7jNd/p+ujoBZ/P/hDzAGsS+57aCPI5AtgzkAxqdbKMAsQg7+///+0j8a/lQ/AltakZpKXwfAgh/Z8l2b1oPZdEsHMAeALAY5wN3chr4OgAX/gDkAlvLp7gBky2HxT3ffw7LegAQ/CAy4A0AAZDnMAXS1HBb3A5L/McoCqO8HxAHoNSMoJOjqiPcbyv+DMIxNd5+DLD1anvof2SED5ogBj/8BsZzuiW7QtIRHwSgYBcQAAJJGEESzBLBXAAAAAElFTkSuQmCC"},
            {"name":"Enchanted Red Sword",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAxElEQVR42u2WMQrCQBBF0wcRbGy8RSA26b2E7Z4hHsR7JFja5zyewB35Sz4MprH6Y7EfBjbVf/NnNknTVIm1O5wszBh13/cmhaCxLV0pnHPbaiC8GQH4LEuBRj5+y2/9GPL1WExvKWkBGL83fz6mcpbtAQFgDIDLedACMP44gHXz5QDenPOXd8+rFxI/FA4AwZwAUnPOPuT+b94Fa/chAN9fRiQhhXjNo6F4lncO02VM5kHCIMLnH2IuX7q/+ROuqqr6RR8udwM+slyb1wAAAABJRU5ErkJggg=="},
            {"name":"Flower",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAtElEQVR42mNgGAXDHfAKyfwHYVx8mlv+99sbMIZZjMynm+Uw/PjwJBQ+TR0x4A6AOQJkKYj+N1sSjAckCsAOCIc4AETDHEXX4Ic5AhYqNHUENgds6wscuEQIshjkAGyhQpdCCBbsdLUc3SFhh7kGxnJ0RwyI5QPuAJClhs3G///+5RmhDoABkCMGxAHvN5T/B2EYe0AccLQ89T+yQwbMEQOaDQfM8gEtgGC+H22ej4JRMGgBABEBQywkWCInAAAAAElFTkSuQmCC"},
            {"name":"Flower Stick",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAq0lEQVR42mNgGAWjYBTQGfAKyfwH4QGzfE2EycA4AGRp2GGu///3PQFjuocEzEKYAwybjennAJBFf70fgzEoCuhuObIDfv0UAkcFXR0A8zFy/NM9AYIcAXMAKCTongBBwQ4KflhUDEgowMqAAbG8wM0J7AC6JkB0B4DwgBXDIDBgDni/ofw/CMPYA+KAo+Wp/5EdMmCOGNCqeMAsH7A2ALLvR9uCo2AUDFoAAA5dof+xl8GgAAAAAElFTkSuQmCC"},
            {"name":"Golden Cross",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgUlEQVR42mNgGAWjYCQCXiGZ/yA8YJb/2aA8whwAC3IQ/pkiPDAOAFkKwv9fHADjAXEEzPcgekAS4oAmQJjloOAfMAeALIcF/2j+H5Cid0AdMGBZDxkMWAJ8v6H8PwjD2APigKPlqf+RHTJgjhjQbDhglg9oAQTz/WhDdBSMgkELAN71id6D5u1oAAAAAElFTkSuQmCC"},
            {"name":"Icicle",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVR42mNgGAWjYBTQCfAKyfwH4QF1QPSuJwPvCLOEjwPviGdf/wyMI2DRAHLAgEQHzPd0tRyW+mHxD7KcrukAOdhBFtM9ESL7fFAkvgFxBCwUBjT1I4fCgBVEsLRAdwe831D+H4RhbLr7HGTp0fLU/8gOGTBHDFj8D2h7YFC0A0bbhKNgFAxaAACjlp2kkG1hsgAAAABJRU5ErkJggg=="},
            {"name":"Leaf Wand",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAlElEQVR42mNgGAWjYBTQGfAKyfwH4QGzfE2EycA4AGRp2GEuMIaFAt0dghwChs3GA+cAulqOHNyg4P/1UwgeDXRzAMzHj0sN/he4OQ1M0IMcMeA5ABT8I7cMAMU9yAF0TYDoDhiQBIgMBswB7zeU/wdhGHtAHHC0PPU/skMGzBEDmg0HzPIBy//Ivh9tC46CUTBoAQAlxH1DCOIaewAAAABJRU5ErkJggg=="},
            {"name":"Sunflower",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR42mNgGAXDHfAKyfwHYVx8mlv+/5gpGMMsRubTzXIw/njm/78ibjAbRtPUESgOAFoOsxhmOd1CAWSho7Qo2LJyI3W4Y+gXBUALYZaDaJBjQI6iW/CDgxzqCFhIwKKCZo6AOQA5vhc5y8IdQ5c0gB4KIAcgW063dADDyKFBF8vRHRJ2mGtgLEd3xIBYPuAOAFlq2Gz8/+9fnhHqABgAOWJAHPB+Q/l/EIaxB8QBR8tT/yM7ZMAcMaDZcMAsH9ACCOb70eb5KBgFgxYAAJKUESViq8E9AAAAAElFTkSuQmCC"},
            {"name":"White Wand",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAbklEQVR42mNgGAWjYBSMAjoDXiGZ/yA8YJb/efts1AED4wCY5Vfn1AycA0CWLw91HNgQGLnxDwr+AXUAKO4HLAHCwIAlwPcbyv+DMIw9IA44Wp76H9khA+aIAc2GA2b5gBZAMN+PtoRGwSgYtAAAF8prjLFnqX8AAAAASUVORK5CYII="},
            {"name":"Wooden Wand",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAa0lEQVR42mNgGAWjYBSMAjoDXiGZ/yA8YJaviTAZdcDAOABm+eNSg4FzAMjyAjengQ2BkRv/oKAfcAcMWPzDwIA54P2G8v8gDGMPiAOOlqf+R3bIgDliQLPhgFk+oAUQzPejLaFRMAoGLQAA37ZbURptCv0AAAAASUVORK5CYII="}
        ];
    
        console.log("Uploading Wizard Body");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[baseTraitType, baseTraitIds, Trait]
        );
    
        console.log("Uploading Wizard Body Complete");
        console.log("Uploading Wizard Head");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[headTraitType, headTraitIds, headTraits]
        );
    
        console.log("Uploading Wizard Head Complete");
        console.log("Uploading Wizard Spell");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[spellTraitType, spellTraitIds, spellTraits]
        );
    
        console.log("Uploading Wizard Spell Complete");
        console.log("Uploading Wizard Eyes");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[eyeTraitType, eyeTraitIds, eyesTraits]
        );
    
        console.log("Uploading Wizard Eyes Complete");
        console.log("Uploading Wizard Neck");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[neckTraitType, neckTraitIds, neckTraits]
        );
    
        console.log("Uploading Wizard Neck Complete");
        console.log("Uploading Wizard Mouth");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[mouthTraitType, mouthTraitids, mouthTraits]
        );
    
        console.log("Uploading Wizard Mouth Complete");
        console.log("Uploading Wizard Wand");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[wandTraitType, wandTraitIds, wandTraits]
        );
    
        console.log("Uploading Wizard Wand Complete");

        //Dragons traits 
        const dragBaseTrait = BigNumber.from("9");
        const dragEyesTrait = BigNumber.from("12");
        const dragMouthTrait = BigNumber.from("14");
        const dragHeadTrait = BigNumber.from("10");
        const dragTailTrait = BigNumber.from("15");
        const dragBaseIds =
        [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13
        ];
        const dragEyesIds = 
        [
        0,1,2,3,4,5,6,7,8,9
        ];
        const dragMouthIds = 
        [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13
        ];
        const dragHeadIds = 
        [
        0,1,2,3//,4,5,6,7,8,9
        ];
        const dragTailIds = 
        [
        0,1,2,3,4,5,6
        ];
    
        const dragBaseTraits = [
            {"name":"Green Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACXElEQVRYhe1WsUoDQRCdE1tD8AQbQ4RoYRUhoKWCf5AqiN9gviCF+APmH0SsUtgLWlpYWFmooGChYDRoLSvvLu+Y29vL3UXFwjxYbu9ud9+b2ZnZlQn+FWZmFwzan9gMYmM+zcHZakzEdNYk9j9eH73vkN/cLUn3vCFHvX7+SVD79LYZtFGuo2tdLsY75q/tVgIP2Gs5PYAB+705adXL0Te8d5pibE9wrIZrXBqm0sjbG5cyXz7N9JJNTrH0xnv/QY6vBnKyV3OuEROgyTVcQtLINUD+PNgK9j3NmIQHbEB9UXIGGsiz1ssUkIZO8yX6gz7fQX7RvQ+sX67dBoR4T0MkwOV+lwXEyo7n7NtkOpBdGFkHoN6OB2K76cf7zThZya/GDGEMwFM6Q0YK0AiE9BpRiuEJN2uEpCExCg+AbZAgIN0eLRQDsJApRit1k+HWgBwWo2E8vuG/K6AjsPKhWrFisa8bvtsVkk3P12vgu30GELm3gIBVrXroSrjXTkftZjv3sWUlv2rGigEbNjnSD8Fok0IQAi/MlEZCRCIGMAH7BQI8cYJpq9DHPwYZcX1oEh7gWBmmp64dROJgEevoZT1fby8G9RwLwhqdhqIKkCbVa2Ed9Pl0CnCBZzkimK4kObKCka2tK3J3yExDLKYtIjnqgv7OmlD04pKrDoSFJ7l/GtgiiCh654uywJjMeV7JryQGce8R4RBRFJG7cggQCNAxAHJEP92v67/k3I5CAjzPS9wFKEKGZVhnh33w/IgASbmQaCFEeI8cLWIsAWJd2QnXhVW+eaWf4HchIl82RsqQgEg2RAAAAABJRU5ErkJggg=="},
            {"name":"Pink Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcUlEQVRYhe2Wv2sUQRTH30lKA8FGBC+9Cmm0C5Lef8CQTjjQVhEsQ8qApDZwYCf5C+wtziopxT4niI0cxFI4+Wz2u5l5O7Oze0Vs8mDZ2dmZ+X7f9/3YtRu7blu/c3/JJdhb14kP8OzJNJrrRUCsQ+argJ9/OmnNr5U2cRfr7dPJyuDfXn6w+dEfm/6aR++yCkguNm48/lsEyKkk8Peff9r4zW17++xetDepgMBLwJaJ6/bpZHnx+8eouDmlgA6E7frOxmBwq0MmNYj74myt5XmSQAgezSeI5MBDA/ziy6KKe86ZYhXAfii4Eg3w0nkr94GwIhjrGfCDwweV94+OX1WAPOesIZCSP+WB7MV4Pzn2YKVE7lQA9j4fZJO742jsq2ZzbzfpCEqFFdLZiEKDyOxo2pQYd9/ZKtDjyzG1jxEG7HznJKlobwJWyzmzSxLeSxnhoOSU9bOzaZUXrE0lbiOFzwHYpkqHeUIjueWh1fXvc4gzaMGWkH+wAtb0hEUD7r0KZfYOELLNvd2oS65chh5ctQ+oLhHCc96jBCQ6/wfYIC+4syn0ijHgSjLZx/lBSwGtxV5/fV4RWTzdivZFISCuxFdNRaWFN/vvvlfJxYEkmu9ozBF/QKMSrOXeGj+spNdd76MkxCsAtEBzVvcEiAGkHiDC5jpj3y8h1isHwkwXON6G8+oJQ8BbBFIfHlnpb4gQ+QQbRKDubs233C/MeUZ2owbKQGKodYYAUJWbSKncqA7yQdkPCY2H/MC2vFJHDLuWDuPZ/wtASMBhglqm8xUJeMDce98BQyIy70gngeWyrNhodHVOnzwpOXJj/9/M7B+He57f7isA5QAAAABJRU5ErkJggg=="},
            {"name":"Pink Spiked Cheek",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcklEQVRYhe2WMWsUURSF70pKF4KNCG56FdJoF2R7/4AhnbCgrSJYhpQBSW1gwU7yC+wt1iopxT4riI0sxFJY+TZ7JvfdfTNvZovY5MIys2/mzTn33HPvjN3EdUf/zv05P8Heuk58gCdPxslaKwJi7ZmvA37+6WRlfaO0iaNY75yO1gb/9vKDTY/+2PjXNLlWq4DkYuPm479FgDqVBP7+808bvLltb5/dS/ZmFRB4Cdhq6rpzOppf/P7RK27OKaAHwrY/3OwMbsuSSQ3q/uj4lX2cHpQJePBkPUOkDjzG1t6u5cynaDQhMTvbsP6wG7iMJmBPguf5WHsO+I7gXP8BPzh8kAXPRUUgJ//Fl1ntxheD/ew54AQtBzgd0BSNCiBX9INidHeQnPuuAdwr5BNh3XdI0QMKiEyOxlWLcYzSkrEdX54rczqAOB+eZBVtTYAgw4ldkqgAQ1AOho06Z3I2XviCe3PGraSIHoBtrv1YpzSSWxnasv+jh3gGJbGM/J0VsGomzCrwmJWXOSZAybb2dpMpuXYbRnD1PqD6iRCZcx0lINH4PcAGZcGRTT4rzgGP7aVRm7uXeP31+YLI7Ol2si8pAXWlvmohtRbZ7L/7vjAXD8RocaKxRv0B9eaU3NuDhwvpddT1xIRkBYBu0JotZwLEANIMEGELk7Htm5Bo5QHvdIGTrV/XTOgCvkIgyuqj9DVEiaLBOhFYTrfqXR5vrMsMd6MGykCiazSWAFC1m0ip3egO/CD3Q0LnXT5gV7LSRPRTSw/jf/wWgJCAvUGtZvIVCUTAuutxAnoiiphII4H5vKxYr3f1nDY+KSVyE/8/zOwfcBSjYgAkDXUAAAAASUVORK5CYII="},
            {"name":"Red Spiked Cheek",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcklEQVRYhe1WPUscURS9EywkxF0wBGRxrUR/gT9BtrUQ3CKQIpVsKZYisqVYitUWgoVCirRhf8L+AsUqhiCEBKIiFsLIec4Z75u5M29nErbywLAz7+2759zPGXnFpDEzOx/jIu2bSfKDeLTY8tbGEkDVWnkd8utvO7n1qdAh/FL1yuXP2uQ3mwty3hvI6d933l5hBBguHFxeLdXpRSgbJZLvfZmW9uFn2V1/8M6alkkeIpaCvK5cSnz750cUPGxFgAah9n7tU2VySVLGaCDv58PHnOemAE2uYQkpItcA+duvxy7vRc4EuwDqq5Kz0EAesld7DuiOwD2fQb59suG8bxx9d4R4LkIqwAq/5YHVz/o5SxYq5NJdqM/WA3DVG3ikeGbX3Cdrc52+5whrAJHSHRLuswQQMuoNXsLd6bsZIcke0ADp0TMx95AG4HrNjujYAiQJ50haab5pnKTA1ocl13L0eDR8nn6IiFW4hQKg1mrHZTl2IpjbVETS/+3DjTQNtNHtDaTbbOXCXzkCWgTJs17pMGd7H3Uz1+l7U7J2G2bJ2fsg5UVB8Bz7LN7S7wEcQL5AgF8c0l7hHnssMuLg10UuAvyvJO1pvU3TUHAOZPPEvt//eOaKCwZRaN3mnWeIA0iTArQFO7jnrylAH9Dr7l0+fHTiNDkKkaNVezfumxBIU4BD1kGsaY9IjurW6xxMVcg9AWWA0dDXEFKULbBKAuI4Lr1ufl+ZniH3rtebd05EVURaQAiN9+1Y1wDIUf0Mv57/MmY6KgmIoij3LUARkoxh3R3W5PtnAVLwQaKFEFZb/xcBotpWw2phqdEZr5gcROQJzqmmVdA0Rq4AAAAASUVORK5CYII="},
            {"name":"Blue Winged Cheek",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbElEQVRYhe1WvU4CQRCeMyZSqCReYYFHbKUgIVBgyQtAwRvYYiJPoNHawgJaWysKfAFKLSAmFhQ2JiCFMZiomGgj5rvLwO7e3i8JFV+yud292ZlvZ2dml1ZYNrZ29qZobHZtmfZh2GwOpLlQBJi1yDyO8cdhP/oitP2bP7vFJYB1l09vto6Tg6GkZ91vEdx1nB8T0ZgaPdPXgDj+en8xxH9n9w80rPxQpzuhVj5BVJzLagnIxoN3p54r1dJTkYQfXDHACjvlCVVTG9GNExHm+Phw7vCe1U5odUgeEI2LAJFGby4jGtLBXl92Ai5rZeho946q3aRWNjAL1LPnSPY1rshfvx566otdB8a1tNQXx1EwI6Bzf2v066kKbtX1YxPQAe5SXcpon6akPmdN6XZTkkMMIA0Z8JSYIZ51QAWIlGhAWctxNRSplS1r5ZxvTV58XsxRddjXejQ0AQA7bDQHs/PG7lTgOJBynMLwSOViZMvqAteTANh2yvKco9QhwUUKu2PAQF2JIegoUYpMGrjcH9kDIgk2ru5KdLNayHBkWSsjVcnYaagah5vZKDcmhJ3jP44DJHzfA1iA84IBfLFI3BX6+CdGNsDFRicL1LtJ/1rB1656s2H8/P1pX6O4UjFGn69obpiDHMuo7wfue17pXg8O8S5XjfM8/1v00RLKO2wQu9WNo+oOFYSI2qBaf1X4cAVYGMzScDoNXGdsm5ZLCNGNAEOuU2EUxbYMEAhqagzw+w7u5yOIGguzghDCA2QYhusVBA9wCqIMi5eUrvItTIA8nmIiEYbZ1JffhQmQRz6rhlgm7AN1heWDiP4BjT3MMUuJSs8AAAAASUVORK5CYII="},
            {"name":"Turquoise Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC70lEQVRYhe1VPWgUQRR+e1yhEqPcCha3dxAhghbKaRVMp4WdpXI2FgELQwqVgE1QC4WgUcJVYpEmh/YWgukMnI05SSGohXhZC8EcqCEKnjfyjffGmdmZZe+E2OSDtzv/3zdv3puhbWw1gmJBwJg2t5X8ID7SqKlyXxNt5YOQ/xJdZffEG/d6OhGXj7bq0gYVgHkgxBogZzGJ9XSVTIyJPNknQPeQPYbJg8Up+de9gL68PrATf6Z8tE/WUZ6nd5l2R9Vxs62+LMTHdmCPnaJRueblaEzWMSY1CDGhX3KJ6rhxlAtrL2muekl1Y3MMJQBqsHt02rt3CfGSa1iMm7Ky+vyFsQZ42EM5sgLv2NojSc4ToL5v8uZ7SX4+qtBc3DC67PVyWAyDeOe+HSdQX/7bgjLXQf7sierCeXeq973L5JiQg+9C6bjqTA3CQ0VnWSeHF2C8tgsqC/TAYMBdK6Vz7pmVEbNcGaHRiTOyejE8obo2dm4a01bHJimRIfqFo+epq65fUnXxwTC07S5E4sHPTWWow3y3n/QAFGW55XA8C40adiHHIsh0DH3fRbmrE7LlbH6H/N9YmqaNp23aG5bpwKtZ/+K2B+xbS2/Xb0jeIay4Mi++iK4yeAB/tMMwxubNu+X4ITOk9Kd7JjxJw0vTxtjHnR+qzF5gxOstisKy+NaOVQwM/Bzb5HAzk7KxoK+nZmX/4WZNitA9kRCA1EPaIH/x54tJ7wf53U9vjXndOw8THkD5yv6Dsty6NiOFeMEx4HrN5MvVe82gfs+t6+pc2dDG567HBa/DZVccKCJXJuhvuU0OMj3AbNIsMB4j1xOKNn4+gaHTBfl/XZlU7qVegAF6gPUlIA0QgRssDeXbNxMBlkmAEIKyWDded+4M0Q1vwDMQkRXMGeCTFcNhSeCm42MAOaKf3R+FZWOltONg3r4EBEEgXWznP6egLg5A2vlEDCyAeqlk34C6EAbG+ET8kwDy5LNNxGPSBGzj/4KIfgPc0pxv2AgSAgAAAABJRU5ErkJggg=="},
            {"name":"Dark Purple Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeElEQVRYhe1WPUsDQRCd86NUIZJGFBEsLQS1CKJYCwGLYKU/QBAsrFNIaouA4A9IKrEQBMFOFEmhATtLCYoIfoBaSlh5R+Yymdvbu4sgFj44crfZ2/dm5u3s0T9+GwOZUYOLaXt+kx/Ea5lax1giAaxaKu+G/O6yERrvi3sJv6y6+pbrmvxw65qK+Ue6eL9JJoDTtbLe7z8fVb5ihTI+3x48Tb69d0Vn58tUP+inQjlGgCaPi07XtUo5I0W4EPIAL1g6HqGZ1ayVkCO2kVOrZHIesre7OWeV0SFAkkuwEJiIjRRFLsFzUXdbMCEBNsja1w+eaWJ+PIgyCiAEOeai/hLaS6n6QKE8GxhM7gjc8zPIYTb5jnyOzIAt/YhYg+s63rsf/CPvJRmXjLNmg7MPIF3aD7zgwtB0MIb7BWrvGhchMiV3iFOABISUqN3JsJDubD5xmTrqjhIwbBlNLIDEAigVBNgi5XKw69cqNd8XmGszbqQAkEVtx6PKYxCljNDmITwX8+SXSKffKcAFrjXIdVQyzXrvt/xjuvKAhiZHmmFGTQpBiBylQSa0iFAf4GYDAvziBJNR4R7/6QbTaG6EMsBzqbU9nacp9vfG5H3ozMfzy23TTGWPzenOk/8/7jFXXhjDPJ6jvx/k+SHX9/QEbRI+TtETOJXcA+AFbq0yuqQnIRCUAC/ZXsSYdDqTw91ynHtCGvIOAS5g0bivoaXFE19E2s+2QIAxxnl9vN5bI4P7kQ1kBiLSwpMC4jA4PGakB0AO93P6dWdMUo5UAjzPC32IsAhqtWF5SNk6348FUMTXkBTC4DPDJaIrAWTZzxSxhW3j//g7IKJvapq0dqICFtUAAAAASUVORK5CYII="},
            {"name":"Cyan Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACzklEQVRYhe1WT0hUQRz+PWkhkGTpmSaoENmSkAR18RCeO0gFRQlGS9466qUEj4J00VOdQlNcsAgpKOgsHTxUp8DozyWFdW23pJCCtIlveL/H7817u/Nmgz35wTDz5r2d7/v9naV9NBoH29oVBtM2NZIfxB3DNyN7qQSwaqm8HvKd0mZs/4DtR5hZdbEwVzf5tTfvqWdsnH58/pj+R8dG76j8+nc9sK7mAekh8xs84/f+hctqTym9lt8keoBjNTB2O5VQM67Fwpz6vVXy0hgaywE+8NP0FM12Zp3JKQgZewNxX5m+S4P3HtgFSHKJJCHVyE2MbGzruFczxloFUO9KzomGxLOd59wHOIFkRWDNzyDfevYkQiifTTTJg033w30m2Krm/nPhG7k2yW2JXNMDOMDMByZsOX4ifMZaVk3W76LMbobK84sxQ+ApWSE1G5EEhPQQ0aOzJ/Xuzuorkp0NJHi3vJuhpQ9Pw/2hXJ+eZyvriR5NLQCAhSvBDLLm9qOR97A6Mzis1+f9M3rumJyk8uqa9kpr/nr1w7nzoVtxx+K1HNwVuUseOtwZjtz9h2pP/Q3Hi/JrPWMfA9/8lwco6AkjQayXT/dpCyVeVt6GT+wFxnblC2X9bvXz24Z7DpgwyeHm1v7eGCkEFScmdGh6aSEmIlYFSBQMVABm3GAyebAGuUw04M/zQkgoyYdyl/T66/yUFmIidAX3gaQrF9nedvGK7ucghzWwVgIeAIkkBdhSxB9rnvl9RABm8xbjuxweQV1L8pmrp2j08Tu9ltZJAhvCEIA46QrFHtc+wORrt25ELEVsXcmBVHcBRNj+DR3Jj2sRSaWWSoBSqub4VdpMtAyxhzfgGYhwhScF2NDidymZAyBH9rP7s3535IQ04XAS4HmedrFZ/1yCZnUgMW0inAVQUFJmB5RCGPjGJqIuASzCfG8S8TeulbGPxoGI/gEpeOzwbJ0sywAAAABJRU5ErkJggg=="},
            {"name":"Gold Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbElEQVRYhe1WsW4TQRCdNecyQQlIVpwgSviAdCnSIWp/Q8RHRApEiZSeDiG+gZqWgi59QomELSFZWDhlYl/0Nvcuc3O7mztbMk1GWt3e3uy8N3MzsyuPsmpZ29zJMQjbWSU+gCdno3LeaqNlvgh4Pp+VY35xHLangTi/+dTxY1EC2AdA2AA4ydTsaZYExkZujhHQEbI6BB++cf6po4BvmVacjn/J+vOX/h3z/OdpI+/4Xykbhzv51d/fzuq6V0fe5tO9L/4dOskkxIa24BCsMRpwZP79RLY+fii/Y41SEgAbeI+P1vsQkRi4Fdj88zWv2MAaI5SJKYnZ56509t+XG8D+idpM3RQ4ALWX3rFiDnsi/fsIwOC/Hwel5zGPKdTZOLw3gjnfAc5wM59S0iEgleE9JZWEl7vD4Lz/7aZMNh2FmJRVEFL24X93HdzaG7jKfDIYVcjfZfpdtiPCOlq1CtENR9dp6F3Xu/7GuuZg/9C60e5HEg8R0A0pNmzDgT7WaL8xAdu1LAnrYcgB2ki18izIJiFIMDYP/Gdbjqn+UXTaSpdsTYBiwVF+SEYLCkJIPFRKT7oyHV9XSNRaMTagJAGAJxqT9oq9XGc25PX5di0Cuu+jPHXvqEksSZjBTC4mGv8rB9Z0ptuTUR/xUQKhj/ost+Bct5URd3NB0dEhoL4z6Pe2CI3uhEiY5P8TkdHbzGd5WxJZnjfWd+vPXtSUkf1IMGQ4SIhsNzJGXNeCgICAL6fiHAA4sp/niD39QreipQg452oXEZKQ4oTUh1Tw4FmWgERuQ5oIBToxEksRkEg9WyDqpAg8yv8VEbkFHi7J1YUdUqIAAAAASUVORK5CYII="},
            {"name":"Dark Green Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcklEQVRYhe1Wu0oDQRS9EbFTxKAIKgFFiH8gCoL/YCVYWmhhY2GjVSoFG4tYpLT1HwKC/oI2CqKCKAminSAjZzdnvTs72dnZIpV3WXYymZlz7rmPXfm3QdvoxKzBTdihQeIDeHp3NjVXiABZa+ZlwD86j5n5Yd8mPMn6tflcGvzobk3qR6vSvU370FcByoWN23vzXoB+KhH8eOde7hrXcnC+kNrrVIDgPmDpE1dpivnqPle8m10EeCDYwk7ft8LAGbKmREog7pDe9pyWCoENTtufvCgMbhscQNxdZ8C8VdA6ewgGZ6Ih9r7zgvsAk0xXBMb8DfC3y5sUoP5t25A+2JbfFX96NbI+k8zpsQ3uS+RcBXCAnQ8EnFj6S3KMddWQOFXRjmBOV0huI9IGInVZlUb9Kj6oHWc4DSD4ryG1aIZKcf1+x61oYQIweNjqPXHweLWWWQN1UHLM+tZu3P2wNrdqkAOLh8vmp3edvG0mY31hHutwY6w7oN6vz+B617skSAFhT9iLpYQKtldaZrv2EbLxas2UygHbbHDIjGS0QUEIiYfQoCPaJDJVgA24UQF4YpP2islmN5nv9ktGAa6VXnm63qaJFOwDrkVgPbWxEiUXDrTLUFQD0qAweorzMebTSUBv0PPwFopQSoJHVdFrrZp40TchLAkBNrk2Yk57RHD0BT3PnhACniKQZzjU9zWEEIFE6GdbQsAYk3t/dp6cniH2UAPKgESoVTQBn41V54zOAYAj+ym/3RmLhCOoD0RZ3BYjS3H9g0hXZhLgTHUU+DQLUqBSiZe7PkiohjaWdR6JUgREla02VwlLicr4t8GZiPwCMrnPpQrDIbsAAAAASUVORK5CYII="},
            {"name":"Ice Blue Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoUlEQVRYhe1WPW/UQBAdn06Cgg8JFxTBUVpSnHQiRSjvD4Qi/4A2SOQXJLrUKSiSNm0qiuQPpIQChESRggbpjitQlEjho6CJo7f2u4zHu/64nBAFT1p5vd6Zeftmdr3yz+H+oycp2jx4NfHV8Q1uv/8k8yJhfdWSwsevv3+4dlsS1hfa0uFVwa9XAeLz+HTKeJbU/Lz4FvWSZdeHLzSLjhhZtBEN4/2Ra7NicHzPWeL5YmdS8DJVgLkiERoBr56dV4a2KlnFYP9m5VJO1n5JcnS3YNvlqoer/ZQSQQEYDY7jRsGtOucbi25B6wt3RKvpQ6EGuGoag3Hb4ADGhqt9eTv541K49zEurZyYEoAKYA4jBNew71XBrR38Ie8+H0CnrsLBvm1wFhqC1/lzCsAZZA8F9AFqEejzHcE3Pzx00iMN8If3EKYpwGQQ0Xn3rYB4+fidt2+D1RVxF7mXjcWg/KFCPNpaKPRjGeXBslzr6td1BaVcTBKQvADrTjkQGchIQJak7cnWS/oyzPtMKZQF1senXkW7VUEtsMK9/YyEXSWBdGDLccWYj7rAXF/hBgmA7clacSxzmpFgbrlCyYt509QQfAwkS5GVv7UCmoSowrXEi3NvgJT1kuVUk6j8G1bBBufeR1A2EsLK8R0nLf+wQQIwQL4QAE8Y6VWhj28sMuLg+/OSApwr+fbUZ0cJvsuCqEvF66fjdPfLmfuOPubqhjHM4xx7urIf3G2h4xhjcEpyOjjH+W2e98kSCQZhQF6z7Htb342KkH/KKuDCYQusCbpp2nh+9CBOSpP588Fel5WJ37IKINC02RpA33fzbVMLUQsFJIqi0l0ACnAL4hjWPynfyXdrAhK4kGgiBObUkZiJgAT2sw2kr/qNg/zHX4WIXAOcBiJWcYyr8AAAAABJRU5ErkJggg=="},
            {"name":"Purple Spiked Cheek",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACkElEQVRYhe2WsWsUQRTG30lKD4KNCF56FdJoF+R6/wFDOuFAW4NgGa4UJLWBhXRyf4G9xVklpdjfCWKhHMZSWPmN941v52b3dk9MlQfLzr2dN9/3vnlvbuzKLtv6N26XPIK9dpn4AE8fFHHM04qAJnvmm4DP3k7i7yeDo/BuJCBQWIv5puAfn76x+fFPK77Og290c9BMQMAEbt//VfHXEc2pJPDX777Y4PC6vXh0K/i15lYTuAeWId2pjcuL7597luyrbO9sFL/X2eJ8K6+AFoRtf7i9Ei7p6sAxfFKDfb938sxO5+MslQoBD17xOyJSpQ48tZ2DffPFl1p2C7whVX/41yHpmsBVaAL2JBSfVaCL7Z2N4mzG+g34+NWdLHjOIoGc/BfvF7WB6uN0DDhGywFOBzSp1KgAcqX1kPaxxr5rAPcK+UTwQ1jxa2tABpHpcREX4J1KS8Z28meszOkAbDacrBChVVsTsGUHTK2I2QXAxCDHYaPOmZ4XQTXm5go3HhZpDcA2dw7gZ2sktzK0ZWekNcQabInPGiwdVJ0UsHgmLCJ4mpWXOU2ALds52K+ckhu3YQqu4gRUjwiROd9RAhKN9wEC2C8AeBPks2LMt7S9dNTm5mLPPzwORBYPdytxK1tAgJeIP5bZ4cSOXn4KxcV3Ci090fCx/0ogkliutTu4G6TXW98rRegDvJ9sAUx7mEIUkUrfr/kn9Ba3gKBcID5f6QInW+/XmdAFHGtVhCzqM8wZW5QWWCcCZVk2Pj++zbOZUd2ogTKQaGvC6tyGaje6I9yOltUPCY27XGBjVrBZO7nXW7mIQEjAvkDNnXy5tYTXmYDV3IY8ERlz6kj8EwGruR3nWjjnb4t3Zf/fzOw3Q9HQ/lITGWcAAAAASUVORK5CYII="},
            {"name":"Black Spiked Wings",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnUlEQVRYhe1WsWoUURS9E9JqocUW7vR+gWZTCYtdthAUQRAWCdimDbJV8BskIJIPECw2XSJYGfELxHZjsYUWCrYj52XOcubO3d15USu98JiZN+/dc+55994Z+yftyrV+hYHYN3IE4EZuvoxh7/zDUTcg//zz82kaOQTUF32s3a8LFTgX3PvC9dHDBw0VC12I649v54WJVLuTw4Wz6cmZ6ZocEm+e37dX777YfHZu06ODNN/bGsdM+Qy2py/20lilguZG9A77h9uDtBf3um6TCxFVb2ucosZ1dHdgT+7cWDiCEpECcIS1atOTs2qdSny/4SchCxy+PHhq28OdxiaQw1CVPDgMc4wS6yH9/uPbDT9hGdIhwNVIBOQwQHQZuCf8/u1xOncNhj5aBCIDe6/SOnAAwgDuzfvbjBx0MeQDSTA38OyzHHN8jmyhQCR/FAHt1s0yvPdgmsgrCUQGuXw+0Hplv3Hvq0ZrXAOBWlohnY8ARHalxHD1PT2BPnud7tF4YPfq5/lwJ1Q0KwcuIhwkEj5KGo4DJcesH9Xdj/nQmQDYxuV4nEhQbkZodRL6HErKTQ5tVPZb8mcr0CRxAe6jUpmjRoYue6kc8ObBk8xlvwUKQogcRwMlPIlWFWADzgsAuGKTRoV7vGOS0T5+mrUU4Fqry5P9Qq31UfHnxH4+Gk9ScsEhotEypAIAUVBzn3d2UfW/9H9A5/ktp5QERyKytWp0Of8LiyPApmgj5jQigiO7dZ49IfdnpdNPad14Vq7BEelnNptAVVUrx/evszAynD3USO14POkMTKxCJ9bZ1etlpTkAcGQ/5fedcdVxEC+LQFEUrb8gkrC6DWt1RJ3vtwnYkl8xJUKLyvqPEDApW7WohG3JUXTB+29/38zsF4GqOFNtiX9eAAAAAElFTkSuQmCC"},
            {"name":"Purple Body",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACi0lEQVRYhe2WP2sUQRjG35OUBoKNCF56FdJoFyS9X8CQTjjQ1iBYhisFSW1gIZ3cJ7C3OKukFPs7QSyUw6QUVn7jPcO7s7N7uyemygPLzs7uzPO8f3fsGleNzVt3Sy7R3rhKfoinj4o45uokQB975euQz95P4vOz4VG4twoQKaqlfF3yz8/f2fz40orv8zA3uj1sFyBiFm49/F2ZbxKa85LI3374ZsPDm/bqyZ0wrz032sg9sYDrTm1cXvz8OrAkrsLu2Si+b8LifCPvAW2I2s29rdpyua6JHDAnbxB3yGR5iooAT16Zd0LklSZyD8gvPi5C3HPGZD2QQq4S9NxGrkSDfNV+a/eB3bNRZaxnyMdv7gXrH5y8CIQ8NyEKyLk/Z4GgOrZknJLlEtmcl1o9gPo0H9I61jitmu2D/awheArBWp8twxwQMj0u4gbcfWeLpCd/x9Q+IAxgtjepCaFUOwuwpTunVsR4eysFxFFyyvrpeRG8xre5xI3NIs0B1OZKh3lCI3fLQltWRppD7EEL9lbDpUbVywMWe8IikqdWeTenBhCy7YP9SpdcuwxTciUnpLokCMt5jycQ0XoeYAHxgoA7i7xVjHmnJBNO5+OaB/QtePnpaRCyeLxTWVcLAQu8i/ixzA4ndvT6S0gu3pNoaUdjjvjLgChiudfO8H5wve56X0lCv8DPYy2EaQ2TiBLiO+OqP6FHDAGLcguZ85kucqz18+oJfchBpyRkU29hDoQoTbBeAsqybL1+/ZhnLSO78QaeQURXiKt3GarcqI5wOlpmPyI07nOAjVahZuXHg0HtIIIgEfsENdf5cnuJr7cAazgNeSEC3zSJ+CcB1nA6zpVwbr4r3zX+P8zsD1s4zHu5cRLOAAAAAElFTkSuQmCC"}
        ];
        const dragEyeTraits = [
            {"name":"Grey Eyes",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAARElEQVRYhe3QMQoAIAiFYWlvCbqS9/H+Q2EQtGYt0f+B6CI+FADAs2rJbWZf510psuQHVXV0LzM7ChFy6wMAAACfE5EOddMLwEfagrkAAAAASUVORK5CYII="},
            {"name":"Blue Glow",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAQElEQVRYhe3QwQkAIAxD0SzgpWdXcz3HVKkiOEFF+e/S3BIqAMCzkuW+t585hBdaad3vzHXl8BHXPgAAAPAPSQPZUA7yUZPEpAAAAABJRU5ErkJggg=="},
            {"name":"Blue Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASklEQVRYhWMYBaNgFIyCUUAu4BWS+Y+sFZ1PLGAiRxPIsnjhe3BL0fk0dwAIHMxixMunOaBWFIyCUTAKRsEoGAWjYBSMcMDAwAAAYmIOzRE6pOIAAAAASUVORK5CYII="},
            {"name":"Yellow Orange",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAQklEQVRYhe3QsQkAIAxE0eusbKzd2BGdw9ZICsEJDMp/EHJdjggA8Kxcqu3uZ77CD46WzLfP7MVCSoR9AAAA4B+SFuT5D0FHJDgMAAAAAElFTkSuQmCC"},
            {"name":"White Glow",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAPElEQVRYhe3QsQ0AIAwDQS9AQ83+W4JRCqRMEAT6a+LOVgQAeFbrw2d7ziWi0HM5bs7lI659AAAA4B+SNoyYEcNw2vEeAAAAAElFTkSuQmCC"},
            {"name":"Red Glow",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAQklEQVRYhe3QsQkAIAxE0UuZwsba/VdxGmeIpBCcQFH+g5DrckQAgGeV2mJ13/MRebC7R+6cYRZXSlz7AAAAwD8kTYrlDZf1TBESAAAAAElFTkSuQmCC"},
            {"name":"Red Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASklEQVRYhWMYBaNgFIyCUUAu4BWS+Y+sFZ1PLGAiRxPIstMqUnBL0fk0dwAIqLuy4OXTHFArCkbBKBgFo2AUjIJRMApGOGBgYAAAO+IMx/9ylncAAAAASUVORK5CYII="},
            {"name":"Green Glow",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAATUlEQVRYhWMYBaNgFIyCUTAkAa+QzH+NM7L/YW4HsUFidPOLSJv1/69/wsCWgjCIDRKja2Ai+5iuvh8Fo2AUjIJRMApGwSgYXoCBgQEAP10VsZtkX2UAAAAASUVORK5CYII="},
            {"name":"Green Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASklEQVRYhWMYBaNgFIyCUUAu4BWS+Y+sFZ1PLGAiRxPIMrNucbil6HyaOwAEfINf4uXTHFArCkbBKBgFo2AUjIJRMApGOGBgYAAA1X0Oly2xzNYAAAAASUVORK5CYII="},
            {"name":"Blue Eyes",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAATklEQVRYhWMYBaNgFIyCUUAO4BWS+a/b//s/TCuIDRKjW2CKWXz57/D3I9hSEAaxQWJ0jU1kH9PV96NgFIyCUTAKRsEoGAWjgKqAgYEBAP5uF6WiFYsoAAAAAElFTkSuQmCC"}
        ];
        const dragMouthTraits = [
            {"name":"Red Spell",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJ0lEQVRYhWMYBaNgFIyCUTAKSAGyfHz/QZiagcaITxLdshgREQYuISGGWbduMTz+9AmvXoodALK8S12dwYgRomTVv38MYUxMYLaavj6D3MqVDHs0NBjUT52iyCFMuCxPU1NjiDAwAFsGAjWGhnDLGdzdGR7Nmwd2FKUAwwEgy9eoqDB8e/cORfzWxYtwxzDs3AmmQFFBdQfAQICAAEPV3r1gi5EdAad37mQAhRKliRKnAxigjljw5g2YDfM9LCSQHUYzByADkIUwx4DYoPinRm7AqhmWDjZ8+ADOdrDUD7IUlDaomRXxZkOQI3YxMTG4/fsHppETHc3LAQYsBRHIQQIsLAwuN25QzQEs+CSRLYE55sOfP9SwlzxAi7pgFIyCUTCwgIGBAQD1/3m8BJRJlAAAAABJRU5ErkJggg=="},
            {"name":"Blizzard",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAs0lEQVRYhWMYBaNgFIyCUTAKRgE5gFdI5j8I6579DabpFojIFlPLchZiLQbRCrvvMzAcgIgpGP5geIAk//ndE0ZKHYPTct9/n8FY1/f3/+3/IRjEBmFKo4KJWIUPznMwPDiqiBBwYGBQ2PgDHCoPXBUZyA0BojSBfKdQDQ1+BwgGWQqOEgYGihxANAA5Ahb8sOCGJUpKzCUqESKDsnMIDs19jQ6o4eNRMApGwSgYXICBgQEAlztfC1XWYNAAAAAASUVORK5CYII="},
            {"name":"Poison Spray",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAwElEQVRYhWMYBaNgFIyCUTAKRgE5gFdI5j8IT/gAoSkJREZSFMMsa74H4dcqMTB8fveEJDPQAROxFoMwyGKzbnGwmBcWh5EDCLoeZPhZqI89SiUZjk/RBbMtcy6D6ddrn4NDhNzQICoEQGAb1DIYULT4x7CjmzLLiXIAyGBjJQaGzWvFGUSDJRmillxkWP59F8Op0pdgR9ENgKLi1gcIhsU5LG1Q4gYWUjUg+5rSHEAyoIaPR8EoGAWjYHABBgYGAG38SL24lNc3AAAAAElFTkSuQmCC"},
            {"name":"Orange Lightning",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAiklEQVRYhWMYBaNgFIyCUTAKRjxgJCcAeIVk/n9M+83AaGcG5jN6bSbLHLIsBuF/FeL//99Y8P//Nt//dLEYZvkOdym4xSBHgMToZjmyr+lmOXqQw0KAbpbDLEZ3CM0dALMMFu90tZwBKeiR2XSzHJtjYKEwIJbTNbthc8CAWT4KRsEooAtgYGAAAD4ncVuc+pAFAAAAAElFTkSuQmCC"},
            {"name":"White Smoke",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABF0lEQVRYhWMYBaNgFIyCUTDiASOhAOAVkvmPzP/87glBPVQDIMv//v0Lxnfu3AHT6A6iqeWLFi0CY5gjQGyQQ5DlKLWHCZflH14/xBCPjo5mOHbsGMP5UwcYrKysGPbv389AqSNY8EmCLMQFWltbwTIgR4AcTNW0gRz3sKBH58PSBE3SBSyOkS1Fx8gOgKULujkCZCEypiQUcCbCqRPaGLILqhiWLl2KIpeSkoKhHl0NKQAj4cAsB6VyEDA0c2AI8XcFsx0dHcHioJwAkwexQQ4lNxHizQUgAHIMCMAshLFBDoMBSnIARhSADAP5COQzmO9wAZBamhXNoKiAJSxYgoQlPGqmeKJdj2wpXSukUTAKhjdgYGAAAOqTFC+wCSK8AAAAAElFTkSuQmCC"},
            {"name":"Fire Spray",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAArklEQVRYhWMYBaNgFIyCUTAKRjxgJCYAeIVk/iPzT6tIMSjbfGdg7btMlH58gIUYy2EW3j3CyaA+nRcsfjOTgeH/Wef/f5a+osgheDXishwGbmZ+ZjC984zh87snZDuAiZACkOXoAGQxyOfY5EgFBEMAmQ8LDZZoMbADQKFCaQiQpBEWJQzQkBFa8J4iy0GAYBSgA1iwg3xPDUByCCDzKfX9KBgFo2AUjAIGBgYGACqSQ8qaQ10UAAAAAElFTkSuQmCC"},
            {"name":"Red Lightning",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAm0lEQVRYhWMYBaNgFIyCUTAKRjxgJCcAeIVk/j810WLgcHMD89lKSsgyhyyLQfiTm9v/fy9f/v/V0/OfLhbDLF+p4Q+3GOQIkBjdLEf2Nd0sRw9yWAhQ03ImfJaDEtrH62cZpM9cY+DXNGbwlPtOLXvxA5ivYfGOHAp0DXpkNt0sx+YYWCgMiOV0zW7YHDBglo+CUTAK6AIYGBgARYlqTDpcTy8AAAAASUVORK5CYII="},
            {"name":"Purple Smoke",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJUlEQVRYhWMYBaNgFIyCUTAKSAG8QjL/QZiagcaITxLdMlMhdwZpUVWGDTenMHx+9wSvXoodALI8WCmXQV3SAsy/9uY4g5aIJZhtYibAENTvzVBlvZShcrM9RQ5hwmV5gHoOQ7S/B9gyEIjz8oRbrqqlzHB59g2woygFGA4AWV6itpnh6evbKOJnTn2AO+b2tbtgGhQVVHcADNiL5DC0L5wEthjZETAa5AhQKFGaKHE6gAHqiN3XF4HZMN/DQgLZYTRzADIAWQhzDIgNin9q5AasmmHp4OCbKeBsB0v9IEtBaYOaWRFvNgQ54g7jTgaV/+5gGjnR0bwcYMBSEIEcZOXNBC4DqOUAFnySyJbAHHNs6z9q2EseoEVdMApGwSgYWMDAwAAA2Bx83PkRKwoAAAAASUVORK5CYII="},
            {"name":"Blue Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdElEQVR42mNgGAWjYBSMglEwCkbBUAC8QjL/QRiZDcJbf3yFi9PcAbr9v8GW5aj+AlsM4sPE6BoKIMtBGOQQ5JChueUgC0E+hvkeWYzmjgBZoAW1DIRhvqdbNMAsAzlCC2o5eoKkWxqgW6IbBaNgFIyCEQMAEzJkoNcuMnkAAAAASUVORK5CYII="},
            {"name":"Blue Lightning",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAWUlEQVR42mNgGAWjYBSMglEwCkYBiYBXSOY/DAv3vAZjulo8/8sbMAZZDBOji+VXfv8AY2SL6eYAbEGP7iC6WI5sMd1CADne6R7s6EE/WgaMglEwCkbBsAQAjmdYtBFX54wAAAAASUVORK5CYII="},
            {"name":"Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAcElEQVR42mNgGAWjYBSMglEwCkbBUAC8QjL/QRiZDcL/zzrDxWnugN9FumDLbpiZgS0G8WFidA0FkOUgDHIIcsjQ3HKQhSAfw3yPLEZzRyBbBsIw39MtGmCWgSyGWY6eIOmWBuiW6EbBKBgFo2DEAADdI18Q1AbBoQAAAABJRU5ErkJggg=="},
            {"name":"Green Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdElEQVR42mNgGAWjYBSMglEwCkbBUAC8QjL/QRiZDcL//t6Ai9PcAZG/dcGWiSw0A1sM4sPE6BoKIMtBGOQQ5JChueUgC0E+hvkeWYzmjgBZwB5mCg92mO/pFg0wy0COAGFsCZJuaYBuiW4UjIJRMApGDAAAga5d/gR3ksIAAAAASUVORK5CYII="},
            {"name":"Purple Fire",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdklEQVR42mNgGAWjYBSMglEwCkbBUAC8QjL/QRiZDcJ/bL7CxWnugMXSN8GWRcou+v8/9zuYDxOjayiALAdhkEOQQ4bmloMsBPkY5ntkMZo7AmSBkWQjPNhhvqdbNMAsAzkChLElSLqlAbolulEwCkbBKBgxAAD6v14ZZX77xwAAAABJRU5ErkJggg=="},
            {"name":"Lightning",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAWklEQVR42mNgGAWjYBSMglEwCkYBiYBXSOY/DP9fZgDGdLX4/xMDCAZaDBOji+X/f92CYCSL6eYArEGP5iD6BD+SxXQLAeR4p3uwowf9aBkwCkbBKBgFwxIAAHc1WVkSOAxUAAAAAElFTkSuQmCC"}
        ];
        const dragHeadTraits = [
            {"name":"Crown",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAc0lEQVRYhWMYBaNgSAJeIZn/IIzN7fjksAEmcgPgYxYTimUwNkicFEC2A2Dg0xFTsOUgGoRJBRQ5AGyh/xWyLIYBFkocAAYbdcDU/2VnwTT/tH8UG0kQEEpkpCTCUTAKRsEoGAWjYBSMglEwCgYWMDAwAAAXdx/vNR3XmQAAAABJRU5ErkJggg=="},
             {"name":"Halo",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUElEQVRYhWMY8YCR0gDgFZL5j03887snRJlNkQNAlr+J4WFgSzZBEf819wyDyJIvRDliwENgFIyCUTAKRsEoGAWjYBSMglEwCkbBwAIGBgYAgtYSBMSq0csAAAAASUVORK5CYII="},
            {"name":"Wing Armour",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3ElEQVRYhWMYaMBIb/t5hWT+w9if3z1hZCJWEzKmxPL2SGuGJT2ZcDEWYlwL0iRrrAcWiymZTrblyBYTdADMtTCLiQH///9nYGTEjFWYWZ7+EQzbN65AkcMaBciWgzQRAiCLQZgBysZmFgjALH989hJcHsO5yBqw+T6mZPr/z++eMPEKych8evv4CT638QnL6n1+9+QSPjVYoyBn6kpGiGOOoqQBqMt/Q5U9Jxg0DAxXCCkgOhvCEiQo68DE0IMbxWAsaWEUjIJRMApGwSgYBaNgFIyCUTD4AAMDAwDQP1QfoIziVAAAAABJRU5ErkJggg=="},
             {"name":"Basic",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAJ0lEQVRYhe3QoREAMAgEsJeYGjT7z8kSNdwlIyQAAD+8nhIJADclWRn9AEQPyDPxAAAAAElFTkSuQmCC"}
        ];
        const dragTailTraits = [
            {"name":"Blue Staff",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeklEQVRYhWMYBaNgFIyCUTAKRsEoGAWjYBTQC/AKyfwHYboGOMxSELbL//jf7uZHDEcw0doRbi1VDFvunWC4de0aA8M0WtuGBYB8fPDDEzCmexSAwJqbZ8EWB0+bNjAOgAG6JkKQRSCf08UyXJYPWHAPSH4nGzAwMAAA9/U01HAzsAUAAAAASUVORK5CYII="},
            {"name":"Wooden Staff",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAhElEQVRYhWMYBaNgFIyCUTAKRsEoGAWjYBSMGMArJPMfhNH9y0SPAABZ/GiuEcP2RAEGdEfQ3AEwy68euccw9ZIwhiNo7gCQhTDLs/XeYsgz0toBDNBQyHPXALMn7bzB8PndE9raC7KwOtLlP7oYtkRIE8uPFOvQxzJcDhgwy0kGDAwMALVIK7U2Rd9UAAAAAElFTkSuQmCC"},
            {"name":"Trident",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAfklEQVRYhWMYBaNgFIyCUTAKRsEoGAWjYEQAXiGZ/yCMza9MtA4AkMW3i5/C2egOYaG15Z8uiTDw6UH4EPYbFDU0D4GXCy9iWI4rOmgCQJb9f2LwHxb8L1oZcaYHmgCY5SCLYWy6WY4M8OUEmlgG8jFdLMNm+cgJaooBAwMDADYSOMJ54ip3AAAAAElFTkSuQmCC"},
            {"name":"Staff",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAiUlEQVRYhWMYBaNgFIyCUTAKRsEoGAWjYBTQC/AKyfwHYXTrGGlpP7KFp1WkGMSVHzHI7WRh+PzuCdxeJloHwO3ipwyfLokwrPjIw/DyrhytrcMEoFD4/8QAjLFFAc1DAOR7Pr03DC8XXqS1VfgBrkRIM8tAQU4Xy3BZTjffYnPAgFlOMmBgYAAA8iMtu0F45PcAAAAASUVORK5CYII="},
            {"name":"Dagger",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAARElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjCTAKyTzH4QHzOIf757Q3wEwiwfEchAYUMuRQ4HuFn5aEPl/5KX2IQkAtxgkkISZO8AAAAAASUVORK5CYII="},
            {"name":"Spear",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAQ0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AU0BHwCsn8B+EBs/zHuycD44ABt/zTgsiBC/oBtXxAUzvI5yMzuw05AADnkB8JFyt+HwAAAABJRU5ErkJggg=="},
            {"name":"Sword",
             "png":"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AU0BnwCsn8B+EBs/jHuyf0dwDM4pFl+acFkWDLQBZ/PT1zYOIdORTobiEsBED0gDgAZumAZbshAwDNwzenNs0KNwAAAABJRU5ErkJggg=="}
        ];
    
        console.log("Uploading Dragon Body");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[dragBaseTrait, dragBaseIds, dragBaseTraits]
        );
    
        console.log("Uploading Dragon Body Complete");
        console.log("Uploading Dragon Eyes");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[dragEyesTrait, dragEyesIds, dragEyeTraits]
        );
    
        console.log("Uploading Dragon Eyes Complete");
        console.log("Uploading Dragon Mouth");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[dragMouthTrait, dragMouthIds, dragMouthTraits]
        );
    
        console.log("Uploading Dragon Mouth Complete");
        console.log("Uploading Dragon Head");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[dragHeadTrait, dragHeadIds, dragHeadTraits]
        );
    
        console.log("Uploading Dragon Head Complete");
        console.log("Uploading Dragon Tails");
        await this.deployments?.execute(
            contract,
            { from: this.deployer, log: true },
            `uploadTraits`,
            ...[dragTailTrait, dragTailIds, dragTailTraits]
        );
        console.log("Uploading Dragon Tails Complete");
        console.log("Loading Traits complete!");
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['traits'];
script.setupFunc.dependencies = [
    'traits-deploy', 'wndtoken-deploy'
];
script.setupFunc.runAtTheEnd = true;