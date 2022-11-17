async function attackSubroutine() {
    timeout = 200;
    try {
        // check if we can execute an attack on our target, then execute the attack.
        if(can_attack(myself.mark)){
            attack(myself.mark);
            loot();
        }
        
    } catch (error) {

    }
    setTimeout(async () => {
        attackSubroutine();
    }, timeout);
}