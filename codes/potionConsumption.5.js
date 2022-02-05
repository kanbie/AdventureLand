//settings

let healthpot_healing_factor = 200;
let manapot_regeneration_factor  = 200;
let priest_healing_room = 200;
let last_use_mp_potion = null;
let last_use_hp_potion = null;


async function drinkPots(){
    try {
            if(character.mp <= character.mp_cost * 5){
                if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown){
                    //pop a mana potion to keep the attacks flowing
                    use_skill('use_mp');
                    last_use_mp_potion = new Date()
                }
            } else if(character.hp <= character.max_hp - (healthpot_healing_factor + priest_healing_room)){
                if(last_use_hp_potion == null || new Date() - last_use_hp_potion >= parent.G.skills.use_hp.cooldown){
                    //pop a health potion if the potions healing factor would be efficient
                    use_skill('use_hp');
                    last_use_hp_potion = new Date()
                }
            } else if(character.mp <= character.max_mp - manapot_regeneration_factor){
                if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown){
                    //pop a mana potion if th potions mana regen would be efficient
                    use_skill('use_mp');
                    last_use_mp_potion = new Date()
                }
            }
        } 
    catch (err) {
        console.error(err);
    }
    setTimeout(async () => {
        drinkPots();
    }, 250);
}