//misc Load functions
load_code("helper");




//init our global memory "myself"
let myself = { // go to the darkside
    id : character.name,
    markName : "bee",
    mark : get_target(),
    alert : {
        low_hp: false,
        low_mp: false,
        rip: character.rip,
    },
    others : {},
    cc : {
        local: [0,0,0]
    },
    potions: {
        hpot0 : 0,
        mpot0 : 0,
        hpot1 : 0,
        mpot1 : 0,
    },
    inventory : {}
};

if (character.name == "TwelvePounds") {
    start_character("Solamare","main");
    start_character("CprCertified","main");
    start_character("Secretary","main");
} else {
    console.log(character.name + " reporting!");
}

// Non-Merchant Code and Module Init
if (character.ctype !== "merchant") {
    // Targeting
    load_code("targeting");
    targetingSubroutine();
    // Movement
    load_code("movement");
    movementSubroutine();
    // Attacking
    load_code("attacking");
    attackSubroutine();
    // Resources, Consumeables
    load_code("resources");
    resourceManagement();
    // Communication
    load_code("alerts");
    alertSubroutine();
    load_code("messaging");
    report();
    metrics();
    // Party Logistics
    load_code("party");
    maintainParty();
}
else{ // Merchant Loads Code
    load_code("messaging");
    metrics();
    load_code("party");
    maintainParty();
    load_code("merchanting");
    potionPurchaseProgram();
    potionDeliveryProgram();
}


// console.log(myself);

/*
const charClass = character.ctype[0].toUpperCase() + character.ctype.substring(1);
load_code(`${charClass}`);

Ask colby on naming convention when you make a class specific file.
*/


character.on("cm",function(data){ //(data.name,data.message) 
    myself.others[data.name] = data.message;
});