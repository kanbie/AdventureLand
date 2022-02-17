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

if (character.ctype == 'priest'){
    load_code('priestSkillsRoutines');
}

//Clerical Loads
load_code('nodeFileHelpers');
load_code('UIFIXES'); //hazzah

// Global Settings
let primary_target = 'rat';
console.log(character.name + ' has the primary target: ' +primary_target);

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




//call Clerical functions last
inventoryToFile();










