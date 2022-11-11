if (character.name == "TwelvePounds") {
    start_character("Solamare","Main");
    start_character("CprCertified","Main");
    start_character("NoAuto","Main");
} else {
    console.log(character.name + " reporting!");
}

// Non-Merchant Code and Module Init
if (character.ctype !== "merchant") {
    // Targeting
    load_code("targeting");
    targetingSubroutine("goo");
    // Movement
    load_code("movement");
    movementSubroutine();
}

/*
const charClass = character.ctype[0].toUpperCase() + character.ctype.substring(1);
load_code(`${charClass}`);

Ask colby on naming convention when you make a class specific file.
*/