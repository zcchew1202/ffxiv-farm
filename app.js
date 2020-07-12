const XIVAPI = require('xivapi-js');
const xiv = new XIVAPI({ private_key: '44bae903b3fc4128886e55a050709485dc38471f9d244919a5beb82844885da5' });
var fcName = 'Kyng\'s Krew';
var serverName = 'Midgardsormr';
var mountName = 'Round Lanner'

// get mounts & minions along with each FC member
function getChars(fcMembers) {
    let mimo = null;
    try {
        fcMembers.forEach(async element => {
            mimo = await xiv.character.get(element.ID, { data: 'MIMO' });
            return mimo;
        });
    } catch (error) {
        console.error(error);
    }
}

function hasMount(char, mountName) {
    try {
        char.Mounts.forEach(mount => {
            if (mount.Name === mountName) {
                return true;
            }
            return false;
        })
    } catch (error) {
        console.log(error);
    }
}


(async function () {
    try {
        let response = await xiv.freecompany.search(fcName, { server: serverName });
        let fcID = response.Results[0].ID;
        let fcData = await xiv.freecompany.get(fcID, { data: 'FCM' });
        let fcMembers = fcData.FreeCompanyMembers;
        fcMembers.forEach(async element => {
            const char = await xiv.character.get(element.ID, { data: 'MIMO' });
            // console.log(char);
            char.Mounts.forEach(mount => {
                if (mount.Name === mountName) {
                    console.log(char.Character.Name + ' has ' + mountName);
                }
            });
            // if (hasMount(char, mountName)) {
            //     console.log(char.Character.Name + ' has ' + mountName);
            // }
            //filterByMount(chars)

        });
    } catch (error) {
        console.error(error);
    }
})();