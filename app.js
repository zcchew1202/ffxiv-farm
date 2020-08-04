const XIVAPI = require('xivapi-js');
const NodeCache = require("node-cache");
const express = require('express');
const xiv = new XIVAPI({ private_key: '44bae903b3fc4128886e55a050709485dc38471f9d244919a5beb82844885da5' });
var fcName = 'Kyng\'s Krew';
var serverName = 'Midgardsormr';
var mountName = 'Round Lanner';
const app = express();
const port = 3000;
const cache = new NodeCache();

// todo: add ttl to cache entries
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
        }
        return mimo;
    } catch (error) {
        console.error(error);
    }
}

async function filterByMount() {
    try {
        const response = await xiv.freecompany.search(fcName, { server: serverName });
        const fcID = response.Results[0].ID;
        const fcData = await xiv.freecompany.get(fcID, { data: 'FCM' });
        const fcMembers = fcData.FreeCompanyMembers;
        await getChars(fcMembers);

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
        return filter;
    } catch (error) {
        console.error(error);
    }
}

(async function () {
    const fcMembers = await filterByMount();
    app.get('/', (req, res) => {
        res.send(fcMembers);
    });
})();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});