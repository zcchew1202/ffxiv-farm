const XIVAPI = require('xivapi-js');
const xiv = new XIVAPI({ private_key: '44bae903b3fc4128886e55a050709485dc38471f9d244919a5beb82844885da5' });
var fcName = 'Kyng\'s Krew';
var serverName = 'Midgardsormr';
var mountName = 'Round Lanner'

// todo: cache results & do periodic refresh
// get mounts & minions along with each FC member
async function getChars(fcMembers) {
    let mimo = [];
    let i = 0;
    try {
        for (let element of fcMembers) {
            mimo = [...mimo, await xiv.character.get(element.ID, { data: 'MIMO' })];
            console.log(`Current downloading ${element.Name} | total progress: ${i}/${fcMembers.length}`)
            //console.log(mimo);
            i += 1
        }
        // fcMembers.forEach(async element => {
        //     mimo = [...mimo,await xiv.character.get(element.ID, { data: 'MIMO' })];
        // });
        return mimo;
    } catch (error) {
        console.error(error);
    }
}

async function allMounts() {

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
        // let response1 = xiv.freecompany.search(fcName, { server: serverName }).then(res => console.log(res));
        let response = await xiv.freecompany.search(fcName, { server: serverName });
        let fcID = response.Results[0].ID;
        let fcData = await xiv.freecompany.get(fcID, { data: 'FCM' });
        let fcMembers = fcData.FreeCompanyMembers;
        // let allMounts = await xiv.search('*',{indexes: 'Mount'});
        // console.log(allMounts.Results);
        let chars = await getChars(fcMembers);
        // console.log('x is: ', x);
        // fcMembers.forEach(async element => {
        //     const char = await xiv.character.get(element.ID, { data: 'MIMO' });

        // console.log(chars);
        chars.forEach(char => {
            char.Mounts.forEach(mount => {
                if (mount.Name === mountName) {
                    console.log(char.Character.Name + ' has ' + mountName);
                }
            }
            );
        });
        // if (hasMount(char, mountName)) {
        //     console.log(char.Character.Name + ' has ' + mountName);
        // }
        //filterByMount(chars)

        // });
    } catch (error) {
        console.error(error);
    }
})();