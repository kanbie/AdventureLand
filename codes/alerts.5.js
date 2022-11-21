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

        // potion inventory alerts.
        if (myself.potions.hpot0 < 200){
            myself.alert.low_hpot0 = true;
        }
        else {
            myself.alert.low_hpot0 = false;
        }
        if (myself.potions.mpot0 < 200){
            myself.alert.low_mpot0 = true;
        }
        else {
            myself.alert.low_mpot0 = false;
        }



    } catch (error) {

    }
    setTimeout(async () => {
        alertSubroutine();
    }, timeout);
}

async function alertSubroutineMerchant() {
    timeout = 100;
    try {
        if (myself.potions.hpot0 < 300) {
            myself.alert.low_hpot0 = true;
        }
        if (myself.potions.mpot0 < 300) {
            myself.alert.low_mpot0 = true;
        }
        
    } catch (error) {

    }
    setTimeout(async () => {
        alertSubroutineMerchant();
    }, timeout);
}