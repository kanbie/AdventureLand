// Load Code Lines
load_code('targeting');
load_code('movement');
load_code('attacking');
load_code('potionConsumption');
load_code('purchasePotions');
load_code('partyLogistics');
load_code('inventoryLogistics');
load_code('helper');

if (character.ctype == 'merchant'){
    load_code('merchantTasks');

    lowLevelCombine();
}

// Global Settings
let primary_target = 'croc';
console.log(primary_target);

let party_directory = ['TwelvePounds','Solamare','CprCertified','Secretary','NoAuto'];

//Todo, have targetUpdate actually update our target for the rest of the bros.

//initParty();
targetUpdate(primary_target); 
moveOrder(primary_target);
attackOrder(primary_target);
drinkPots();
purchasePotions();
maintainParty(party_directory);
vacateItems();














// node.js code goes here.

const fs = require('fs');
const homedir = require('os').homedir();
const workingDir = homedir + '/AdventureLandStorage/';

/*
    writeToFile accepts the file content and a filename, this creates and overwrites the file on use.
*/
async function writeToFile(content, filename){
    if (typeof(filename) == 'string'){
        fs.writeFile(workingDir + filename, content, writeError => {
            console.error(writeError);
            return
        });
    }
}

