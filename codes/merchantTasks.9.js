//Merchant specific calls and load_code() will be executed here.
set('merchant_at_combine', false);
set('merchant_combine_request',false);

async function lowLevelCombine(){
    try {
        let itemsToConvert = stageCombine(1);
        console.log(itemsToConvert);
        console.log('debug');
        if (itemsToConvert){
            scrollCheck();
            set('merchant_combine_request',true)
            await compoundThese(itemsToConvert);
        }else{
            set('merchant_combine_request',false);
        }

    } catch (error) {
        console.log(error);
    }
    setTimeout(() => {
        lowLevelCombine();
    }, 2000);
}

// stageCombine will return to us an index of 3 slots that are currently combineable to a maximum level;
// it is primarlly a hueristic function, it will upgrade items blindly against maxLevel
function stageCombine(maxLevel){
    try {
        let levelCheck = [0,1,2,3,4,5,6,7];
        inventory = character.items;
        for (level in levelCheck){
            if (level > maxLevel){
                return null;
            }else{
                stage = {};
                for (slot in inventory){
                    if(isValidItemCompound(inventory[slot])){
                        stage[inventory[slot].name + inventory[slot].level] = {
                            name: inventory[slot].name,
                            slot: [],
                            level: inventory[slot].level // can probably exclude; is metadata
                        }
                    }
                }
                for (slot in inventory){
                    if(isValidItemCompound(inventory[slot])){
                        stage[inventory[slot].name + inventory[slot].level].slot.push(slot);
                    }
                }
                for (item in stage){
                    if (stage[item].slot.length >= 3){
                        return stage[item].slot.slice(0,3);
                    }
                }
            }
        }
        return null;
        
    } catch (err) {
        console.error(err);
    }
}

function itemInSlotName(slot){
    if (character.items[slot]){
        if (character.items[slot].name){
            return character.items[slot].name;
        }
    }
    return null;
}

function hasCompoundProperty(itemName){
    return G.items[itemName].hasOwnProperty('compound');
}

//provides a set of indexs for compounding
function findSlotsCompound(itemName, level){
    index = [];
    for (slot in character.items){
        if(character.items[slot].name && character.items[slot].name == itemName && character.items[slot].level == level){
            index.push(slot);
            if (index.length == 3){return index;}
        }
    }
    return null; // failed to return an index for compounding.
}

function scrollCheck(){
    let low_scroll = findItemIndex("cscroll0");
    let high_scroll = findItemIndex("cscroll1");

    if (low_scroll){
        if (character.items[low_scroll] > 9999){
            sell(low_scroll, 9999);
        }
        if (character.items[low_scroll] < 10){
            buy_with_gold('cscroll0', 200 - character.items[low_scroll].q);
        }
    }else {
        buy_with_gold('cscroll0', 200);
    }

    if (high_scroll){
        if (character.items[high_scroll] > 9999){
            sell(high_scroll, 9999);
        }
        if (character.items[high_scroll] < 10){
            buy_with_gold('cscroll1', 20 - character.items[high_scroll].q);
        }
    }else {
        buy_with_gold('cscroll1', 20);
    }
}

async function compoundThese(itemIndex) {
    try {
        // Sanity checks for compounding
        set('merchant_combine_request',true);
        let grade = item_grade(character.items[itemIndex[0]]);
        let scroll = null;
        
        if (grade == 0){scroll = 'cscroll0';}
        if (grade == 1){scroll = 'cscroll1';} 
        if (scroll == null) {return null;}
        
        itemIndex.push(findItemIndex(scroll));
        
        let have_we_arrived = get('merchant_at_combine');

        if(have_we_arrived){
            await compound(itemIndex[0],itemIndex[1],itemIndex[2],itemIndex[3]);
            set('merchant_at_combine', false);
            set('merchant_combine_request',false);
        }
        
        console.log('compounded inventory slots ');
        console.log(itemIndex);

    } catch (err) {
        console.log(err);
    }
}

function isValidItemCompound(itemObject){
    if(itemObject){
        if(itemObject.name){
            if(itemObject.hasOwnProperty('level')){
                if(G.items[itemObject.name].hasOwnProperty('compound')){
                    return true;
                }
            }
        }
    }
}