//init our global memory "myself"
let myself = { // go to the darkside
    markName : "goo",
    mark : get_target(),
    alert : null
};

if (character.name == "TwelvePounds") {
    start_character("Solamare","Main");
    start_character("CprCertified","Main");
    start_character("NoAuto","Main");
} else {
    console.log(character.name + " reporting!");
}

// Non-Merchant Code and Module Init
if (character.ctype !== "merchant") {
    // Enable Self Reporting
    load_code("alerts");
    alertSubroutine();
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
}

console.log(myself);

/*
const charClass = character.ctype[0].toUpperCase() + character.ctype.substring(1);
load_code(`${charClass}`);

Ask colby on naming convention when you make a class specific file.
*/