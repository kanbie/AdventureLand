///settings///
var d_potion_stack = 200; // target stack size for potions
let we_in_town = false; // are we in town?
var allowance = 100000;// Amount of gold our farmers are allowed to keep on hand.
//////////////
var party_directory = ['TwelvePounds','Solamare','CprCertified','Secretary']; // might not need this
var sell_whitelist = ["stinger","staff","hpbelt","shoes","hpamulet"];
//////////////



function manageInventory(stringHandle,current_position){
    
    if (current_position == 'town_potions'){we_in_town = true;}
    else {we_in_town = false;}

    should_i_go_to_town = false;
    
    if(character.ctype == 'merchant') {
        //break into merchant activities
    }
    else{
        handle_tithe(); // TODO :fetch code from default
        if(we_in_town){
            sell_items(); // TODO :delegate to merchant
            if(upper_potion_stock_level() > 9999){ //are we too full on potions?
                sell_potions();
            }                  
            buy_potions();
        }
        if(potion_stock_level() < d_potion_stack * 1/100 || character.esize < 10){
            should_i_go_to_town = true; //if code gets here we are low on stock or full on items, need to get to town, set the flag.
        }
    }
    if(should_i_go_to_town == true){
        return 'potion_trip_requested';
    }
    else{
        return null;
    }
}


////auxilary functions////



function potion_stock_level(){
    let mana_pot = quantity('mpot0');
    let health_pot = quantity('hpot0');
    return Math.min(mana_pot,health_pot); // return the lowest number
}

function upper_potion_stock_level(){
    let mana_pot = quantity('mpot0');
    let health_pot = quantity('hpot0');
    return Math.max(mana_pot,health_pot); // return the lowest number
}


function buy_Potions(){
    let mana_pot = quantity('mpot0');
    let health_pot = quantity('hpot0');
        buy_with_gold('mpot0', d_potion_stack - mana_pot);
        buy_with_gold('hpot0', d_potion_stack - health_pot);
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

function handle_tithe(){ // need allownace and party directory
    if (character.gold >= allowance ){
        send_gold(party_directory[0], character.gold - allowance);
    }
    for(var i=0;i<42;i++){ //HEY! We won't have any inventory with this!, just saying.
        if(character.items[i] && G.items[character.items[i].name].compound){
            send_item(party_directory[0],i,9999);
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