const XIVAPI = require('xivapi-js');
const NodeCache = require("node-cache");
const xiv = new XIVAPI({ private_key: '44bae903b3fc4128886e55a050709485dc38471f9d244919a5beb82844885da5' });
var fcName = 'Kyng\'s Krew';
var serverName = 'Midgardsormr';
var mountName = 'Round Lanner'
const cache = new NodeCache();

// todo: cache results & do periodic refresh
// {}
// get mounts & minions along with each FC member
async function getChars(fcMembers) {
    let mimo = [];
    let i = 1;
    try {
        for (let fcMember of fcMembers) {
            // mimo = [...mimo, await xiv.character.get(element.ID, { data: 'MIMO' })];
            if (!cache.has(fcMember.Name)) {
                const char = await xiv.character.get(fcMember.ID, { data: 'MIMO' });
                cache.set(char.Character.Name, char.Mounts);
                console.log(`Caching ${fcMember.Name} | total progress: ${i}/${fcMembers.length}`);
                i += 1;
            } else {
                console.log('Char data already cached');
            }

            //console.log(`Current downloading ${element.Name} | total progress: ${i}/${fcMembers.length}`)
            //console.log(mimo);
        }
        // fcMembers.forEach(async element => {
        //     mimo = [...mimo,await xiv.character.get(element.ID, { data: 'MIMO' })];
        // });
        return mimo;
    } catch (error) {
        console.error(error);
    }
}

function hasMount(char, mountName) {
    char.Mounts.forEach(mount => {
        if (mount.Name === mountName) {
            return true;
        }
        return false;
    })
}


(async function () {
    try {
        let response = await xiv.freecompany.search(fcName, { server: serverName });
        let fcID = response.Results[0].ID;
        let fcData = await xiv.freecompany.get(fcID, { data: 'FCM' });
        let fcMembers = fcData.FreeCompanyMembers;

        let chars = await getChars(fcMembers);

        let fcMemberNames = [];
        for (let fcMember of fcMembers) {
            fcMemberNames.push(fcMember.Name);
        }

        const filter = fcMemberNames.filter((fcMember) => {
            for (let mount of cache.get(fcMember)) {
                if (mountName === mount.Name) {
                    return true;
                }
                continue;
            }
        });
        console.log(filter);

        chars.forEach(char => {
            char.Mounts.forEach(mount => {
                if (mount.Name === mountName) {
                    console.log(char.Character.Name + ' has ' + mountName);
                }
            }
            );
        });
    } catch (error) {
        console.error(error);
    }
})();