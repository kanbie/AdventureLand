async function attackOrder() {
    if(character.ctype == 'merchant'){return;}
    try {
        loot();
        if (can_attack(get_targeted_monster())){
            attack(get_targeted_monster());
        }
    } catch (error) {
        console.log('Error call from attackOrder')
        console.error(error)
    }
    setTimeout(() => {
        attackOrder()
    }, 250); //Todo, ping compensate using character.ping and whatever our attack cooldown is.
}