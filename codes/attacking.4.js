async function attackOrder() {
    if(character.ctype == 'merchant'){return;}
    try {
        loot();
        useSkills();
        if (can_attack(get_targeted_monster())){
            attack(get_targeted_monster());
        }
    } catch (error) {
        console.error('Error call from attackOrder')
        console.error(error)
    }
    setTimeout(() => {
        attackOrder()
    }, 250); //Todo, ping compensate using character.ping and whatever our attack cooldown is.
}

function useSkills(){
    if (character.ctype == 'priest'){
        priestSkillsRoutine();
    }
}