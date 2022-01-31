////////Includes and loadcodes here

///////////////////////////////////
////////Settings
/*
	Settings
*/
// write to file attempt
//writeToFile('success, Hello World!', 'Hello World.txt')
// Restart characters when we push new code?
	let restart_on_engage = false;
// We will sell these items on shop vists.
	var sell_whitelist = ["stinger","staff","hpbelt","shoes","hpamulet"];
// Default potion regeneration values
	var d_healthpot_healing_factor = 200;
	var d_manapot_regeneration_factor = 300;
	let priest_healing_room = 500;
// Potion batch to buy in qty
	var d_potion_stack = 200;
// Monster we want to grind
	var current_target_definition = "goo";
// Interval Timer, WARNING: Higher Values will drasticaly increase Character.cc, default should be 1/4 a second, expressed in ms
	var interval_timer = 250;
// Amount of gold our farmers are allowed to keep on hand.
	var allowance = 100000;
// Long term position track, for unstucking
	var last_known_position = null;




////////Primary Loops

async function LootLoop(){
    try {
        loot();
    } catch (error) {
        console.error(error);
    }
    setTimeout(async () => {
    LootLoop();
    }, 150);
    ;
}
LootLoop();










async function moveLoop() {
    try {    
////////////////////////////////////////////////////////Items Handle
        if(character.ctype == 'merchant'){}
        else if(quantity("mpot0") > d_potion_stack || quantity("hpot0") > d_potion_stack) { // some asshole filled my inventory with potions, got to check for this.
            if (!smart.moving){
                smart_move({to:"potions"},function(){
                    // console.log(character.name + ' is moving to the the potions master in Handle Inventory'); //TODO, remove this
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

        target = current_target_definition; //smart move is generic, maybe we should generalize our target in reference to our state? (potion trip, slaying, hunting, etc.);
        if (!smart.moving && distance_to_target(target) > 175){
            console.log('we are going to start smart moving');
            await smart_move(target);
            console.log('we should be smart moving');
            // console.log(character.name + ' is moving to the target'); //TODO, remove this
        }
        else if(distance_to_target(target) > character.range * 0.95 && !smart.moving){
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
    setTimeout(async () => { moveLoop();}, 250)
}
moveLoop();

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
        
        //attack logic, check that we can attack / are we disabled? are we off cooldown? /
        if(!parent.is_disabled(character) && !is_on_cooldown("attack") && distance_to_target(parent.ctarget.name) < character.range * 0.98){
            set_message("Attacking");
            await attack(target);
        }
	}

    } catch (e) {
        console.error(e)
    }
    setTimeout(async () => { AttackLoop();}, 250)
}
AttackLoop();


/////////Auxillary Functions
function distance_to_target(targetName){ // should I just use distance (character,parent.ctarget?);
	if(parent.ctarget.mtype == targetName){
		var dist = distance(character,parent.ctarget);
	} else {
		var dist = null;
	}
	return dist
}