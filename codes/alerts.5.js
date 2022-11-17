async function alertSubroutine() {
    timeout = 100;
        //Communicate to the myself object our current needs, other functions can dynamically work to fill them.
    try {

        if (character.mp / character.max_mp < 0.25) {
            myself.alert = "mp_low";
        }
        else if (character.hp / character.max_hp < 0.5) {
            myself.alert = "hp_low";
        }
        else{
            myself.alert = null;
        }

    } catch (error) {

    }
    setTimeout(async () => {
        alertSubroutine();
    }, timeout);
}