let potions_restock_level =5;
let potions_stack_limit = 9999;
let potions_stock_target = 200;


async function purchasePotions(){
    try {
        if(tooManyPotions()){
            sellPotions(); // somehow we are over stock, sell the poitions
        }
        if(notEnoughPotions()){
            buy_with_gold('hpot0', potions_stock_target - quantity('hpot0'));
            buy_with_gold('mpot0', potions_stock_target - quantity('mpot0'));
        }
    } catch (err) {
        console.error(err);
    }
    setTimeout(async () => {
        purchasePotions();
    }, 600);
}

function tooManyPotions(){
    if(quantity("mpot0") > potions_stack_limit || quantity("hpot0") > potions_stack_limit){return true;}
    else{return false;}    
}

function notEnoughPotions(){
    if(quantity("mpot0") < potions_restock_level || quantity("hpot0") < potions_restock_level){return true;}
    else{return false;}
}

function sellPotions(){
    for(let i in character.items){ //for each item slot
        if(character.items[i].name == 'hpot0' || character.items[i].name == 'mpot0'){
            sell(i,9999); 
        }
    }
}