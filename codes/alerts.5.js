async function alertSubroutine() {
    timeout = 100;
        //Communicate to the myself object our current needs, other functions can dynamically work to fill them.
    try {

        if (character.mp / character.max_mp < 0.25) {
            myself.alert.low_mp = true;
        }
        if (character.hp / character.max_hp < 0.5) {
            myself.alert.low_hp = true;
        }
        myself.alert.rip = character.rip; // we can always update this
    } catch (error) {

    }
    setTimeout(async () => {
        alertSubroutine();
    }, timeout);
}