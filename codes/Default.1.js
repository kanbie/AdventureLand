load_code('NodeSupport');

if (character.ctype == 'merchant'){
	load_code('ItemLoops');
}

/*
	Settings
*/
// write to file attempt
	writeToFile('success, Hello World!', 'Hello World.txt')
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
	var current_target_definition = "croc";
// Interval Timer, WARNING: Higher Values will drasticaly increase Character.cc, default should be 1/4 a second, expressed in ms
	var interval_timer = 250;
// Amount of gold our farmers are allowed to keep on hand.
	var allowance = 100000;
// Long term position track, for unstucking
	var last_known_position = null;

/*
	Load Code / Characters
*/

var party_directory = ['TwelvePounds','Solamare','CprCertified','Secretary'];
let party_auxillary = ['Jaja'];

if (restart_on_engage) {
	if (character.ctype == 'merchant'){
		//Load Characters
		start_characters();
	}
}

/*
	Primary Interval
		Function that governs the primary logic loop of party
*/

setInterval(function(){

	// Address health and mana state and drink pots as needed
	handle_inventory();
	handle_use_potions(d_healthpot_healing_factor, d_manapot_regeneration_factor, priest_healing_room);
	attack_monsters();
	// update_party_stats();
	use_skills();
	loot();

},interval_timer); 

/*
	Auxillary Intervals
		Less priority items that shouldn't be checked as often go here. to a minor savings in character cc
*/

setInterval(function(){

	handle_party();
	handle_tithe();
	handle_respawn();
	update_position();

},interval_timer * 100);

/*
	Clerical Intervals
		less priorty items that don't affect moment to moment gameplay.

*/

setInterval(function(){

	update_inventory_keys();
	update_inventory_objects();

},interval_timer * 100);


/*
Secondary Variables
*/


var last_use_hp_potion = null;
var last_use_mp_potion = null;

/*

FUNCTIONS START
`
*/

function attack_monsters(){ // Basic Attack and pathfinding function. Currently manages target baised on global "current_target_definition"
    // Can I even attack?
	if(character.ctype == 'merchant') {return};

	// Reference pevious targeting state.
	var target = get_targeted_monster();

	// Grab a new target if previous targeting state empty 
	if(!target){
		target = get_nearest_monster({no_target: true, type: current_target_definition});
		if(target) {
			change_target(target);
		} else {
			//find a monster to attack, move to it
			set_message("No Monster Found");
			if (!smart.moving){
				smart_move(current_target_definition);
				console.log(character.name + ' is moving to the target'); //TODO, remove this
			}
		}
	} else {
		// move closer to the target to get in attack range
		// TODO code the distance closer to account for obsticles

		if(distance_to_target(target) > character.range * 0.95 && !smart.moving){
			if(!character.moving){
				var half_x = character.real_x + (target.real_x - character.real_x) / 2;
				var half_y = character.real_y + (target.real_y - character.real_y) / 2;
				move(half_x, half_y);
			}
			// We should be close to the target
		}
		//attack logic, check that we can attack / are we disabled? are we off cooldown? /
		else if(!parent.is_disabled(character) && !is_on_cooldown("attack")){
			set_message("Attacking");
			attack(target);
		}
	}
}

function handle_use_potions(healthpot_healing_factor, manapot_regeneration_factor, priest_healing_room){
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

var last_respawn = null;

function handle_respawn(){
	if(character.rip){
		if(last_respawn == null || new Date() - last_respawn >= 10000){
			respawn();
			last_respawn == new Date(); 
		}
		return;
	} 
}

function distance_to_target(target){
	if(target){
		var dist = distance(character,target);
	} else {
		var dist = null;
	}
	return dist
}
/*
function calculate_minimum_movement_to_target(){
	//calculate trigonmic distance to move and calculate x,y cord to target.
}
*/

function handle_inventory(){
	if(character.ctype == 'merchant'){
		return;
	}
	if(quantity("mpot0") > d_potion_stack || quantity("hpot0") > d_potion_stack) { // some asshole filled my inventory with potions, got to check for this.
		if (!smart.moving){
			smart_move({to:"potions"},function(){
				console.log(character.name + ' is moving to the the potions master in Handle Inventory'); //TODO, remove this
				sell_potions();
			});
		}	
	}
	if(quantity("mpot0") < 3 || quantity("hpot0") < 3 || character.esize < 10){
		if (!smart.moving){
			smart_move({to:"potions"},function(){
				if (quantity("mpot0") < 3 || quantity("hpot0") < 3 ){
					buy_with_gold("hpot0", d_potion_stack - quantity("hpot0"));
					buy_with_gold("mpot0", d_potion_stack - quantity("mpot0"));
				}
			});			
		}
	}
}


function sell_items(){
	character.items.forEach(sell_candidate => {
		if (sell_candidate != null){
			if (sell_whitelist.includes(sell_candidate.name) && !sell_candidate.p){ //(.p is the shiny check)
				sell(locate_item(sell_candidate.name),9999);
			}
		}
	});
}

		
function sell_potions(){
	for(let i in character.items){
		let slot = character.items[i];
		if(slot.name == "hpot0" || slot.name == "mpot0"){
			if(!slot.p){ // Shiny check, translate to "IS NOT SHINY?"
				sell(i,9999);
			}
		}
	}
}



// ToDo, Make sure we don't get kidnapped into another party.
function handle_party(){
	// Are we in a party?
	if(!character.party || character.ctype == 'merchant'){
		//merchant starts the party
		if(character.ctype == 'merchant'){
			party_directory.forEach(attendee => {
				if (!parent.party_list.includes(attendee)){
					send_party_invite(attendee);
				}
			});
			party_auxillary.forEach(attendee => {
				if (!parent.party_list.includes(attendee)){
					send_party_invite(attendee);
				}
			});
		}
		//everybody else accepts the invite.. from the merchant
		else {
			accept_party_invite('TwelvePounds');
		}
	}
}

function handle_tithe(){
	if(character.ctype != 'merchant'){
		if (character.gold >= allowance ){
			send_gold(party_directory[0], character.gold - allowance);
		}
		for(var i=0;i<42;i++){ //HEY! We won't have any inventory with this!, just saying.
			if(character.items[i] && G.items[character.items[i].name].compound){
				send_item(party_directory[0],i,9999);
			}
		}
	}
}

function update_position(){
	if(character.ctype != 'merchant'){
		if(character.position == last_known_position){
			//Then you stuck son
			smart_move(get_target());
		}
	}		
	last_known_position = character.position;
}

// This function handles which ctype we are and calls the correct skill logic
function use_skills(){
	if (character.ctype == 'priest'){
		use_priest_skills();
	}
}

function use_priest_skills(){
	/*
	List of Priest Skills
	Absorb Sins
	G.skills.absorb
		Taunts all monsters from a target
	Curse
	G.skills.curse
		Debuff and hamstring a monster
	Dark Blessing
	G.skills.darkblessing
		Buff (personal?)
	Party Heal
	G.skills.partyheal
		Heals all party Members
	Phase Out
	G.skills.phaseout
		Lasts 5 seconds with a 4 second cooldown; has reagent
	Revive
	G.skills.revive
		Full heal or a reagent "essence of life" powered revive
	*/
	parent.party_list.forEach(partyMember => {
		let skillTarget = get_player(partyMember);
		if (skillTarget != undefined){
			if (skillTarget.max_hp - skillTarget.hp > 500){
				use_skill('partyheal',skillTarget.name);
			}
		}
	});
}

//Helper function to grab a list of items that exist in your inventory, deletes duplicates.
async function inventoryList(){
	inventory = [];
	character.items.forEach(item => {
		if (item != (undefined || null) ){
			if (item.name != undefined){
				inventory.push(item.name);
			}
		}
	});
	transient = new Set(inventory); // A set is going to delete the duplicates
	inventory = Array.from(transient);
	transient.clear(); // Once we are done with the set we want to delete it to clear memory and prevent leaks.
	return inventory;
}

//Helper function to grab a list of items that exist in your inventory, does not delete duplicates
function inventoryRaw(){
	inventory = [];
	character.items.forEach(item => {
		if (item != (undefined || null) ){
			if (item.name != undefined){
				inventory.push(item.name);
			}
		}
	});
	return inventory;
}

//Helper function to restart a character in game.
async function restartC(character){
	stop_character(character);
	start_character(character,'Default');
}


//Helper function to obtain the skills a class can use, returns a list.
async function getClassSkills(classCall) {
	classSkills = [];
	Object.keys(G.skills).forEach(skillName => {
		if (G.skills[skillName].hasOwnProperty('class')){
			if (G.skills[skillName].class[0] == classCall){ // .class is a 2 entity array
				classSkills.push(skillName);
			}
		}
	});
	return classSkills;
}

function start_characters(){
	start_character(party_directory[1],'Default');
	start_character(party_directory[2],'Default');
	start_character(party_directory[3],'Default');
}

function stop_characters(){
	stop_character(party_directory[1]);
	stop_character(party_directory[2]);
	stop_character(party_directory[3]);
}

//Clerical Function to update our party list.
async function update_inventory_keys(){
	filename = character.ctype + '_inventory_keys.txt'
	inventory = await inventoryList();
	content = inventory.join('\n');
	writeToFile(content, filename);
	log('updated ' + filename);
}

async function update_inventory_objects(){
	filename = character.ctype + '_inventory_object.txt'
	let inventorycontent = [];
	Object.keys(character.items).forEach(item => {
		Object.keys(character.items[item]).forEach(itemProp => {
			inventorycontent.push(itemProp);
		});
	});
	writeToFile(inventorycontent, filename);
	log('updated ' + filename);
	log(inventorycontent);
}



// Learn Javascript: https://www.codecademy.com/learn/introduction-to-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland
