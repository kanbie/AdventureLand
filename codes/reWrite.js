////////Includes and loadcodes here

///////////////////////////////////



////////Primary Loops

async function AttackLoop() {
    try {       
            // Can I even attack?
        if(character.ctype == 'merchant') {return};

        // Reference pevious targeting state.
        var target = get_targeted_monster();

        // Grab a new target if previous targeting state empty 
        if(!target){
            target = get_nearest_monster({no_target: true, type: current_target_definition});
            if(target) {
                await change_target(target);
            } 
        } else {
        // move closer to the target to get in attack range
        // TODO code the distance closer to account for obsticles
        
        //attack logic, check that we can attack / are we disabled? are we off cooldown? /
        if(!parent.is_disabled(character) && !is_on_cooldown("attack") && distance_to_target(get_targeted_monster()) < character.range * 0.98){
            set_message("Attacking");
            await attack(target);
        }
	}
}
    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { AttackLoop() }, 250)
}
AttackLoop();








async function moveLoop() {
    try {    
////////////////////////////////////////////////////////Items Handle
        if(character.ctype == 'merchant'){
            break;
        }
        else if(quantity("mpot0") > d_potion_stack || quantity("hpot0") > d_potion_stack) { // some asshole filled my inventory with potions, got to check for this.
            if (!smart.moving){
                smart_move({to:"potions"},function(){
                    console.log(character.name + ' is moving to the the potions master in Handle Inventory'); //TODO, remove this
                    sell_potions();
                });
            }	
        }
        else if(quantity("mpot0") < 3 || quantity("hpot0") < 3 || character.esize < 10){
            if (!smart.moving){
                smart_move({to:"potions"},function(){
                    if (quantity("mpot0") < 3 || quantity("hpot0") < 3 ){
                        buy_with_gold("hpot0", d_potion_stack - quantity("hpot0"));
                        buy_with_gold("mpot0", d_potion_stack - quantity("mpot0"));
                    }
                });			
            }
        }
/////////////////////////////////////////////////////////////////////


        if (!smart.moving){
            await smart_move(current_target_definition);
            console.log(character.name + ' is moving to the target'); //TODO, remove this
        }

        if(distance_to_target(target) > character.range * 0.95 && !smart.moving){
			if(!character.moving){
				var half_x = character.real_x + (target.real_x - character.real_x) / 2;
				var half_y = character.real_y + (target.real_y - character.real_y) / 2;
				move(half_x, half_y);
			}
			// We should be close to the target
		}
    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { moveLoop() }, 250)
}
moveLoop();