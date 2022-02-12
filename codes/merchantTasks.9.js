//Merchant specific calls and load_code() will be executed here.
set('merchant_at_combine', false);
set('merchant_combine_request',false);

async function lowLevelCombine(){
    try {
        let itemsToConvert = stageCombine(1);
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
        itemIndex = []; // index of slots that could be combined
        for (let slot in character.items) {
            // check for an item and if it is compoundable
            if (character.items[slot] && character.items[slot].name && G.items[character.items[slot].name].hasOwnProperty('compound')){
                if (character.items[slot].level <= maxLevel){
                    itemIndex.push(slot);
                }
            }
        }
        // we now have an index of compoundable slots. lets grab their names
        compoundables = {};
        itemNames = [];
        for (let slot in itemIndex) {
            compoundables[character.items[itemIndex[slot]].name] = {
                name: character.items[itemIndex[slot]].name,
                amount: 0,
                level: []
            };
    
            // example object entry: compoundables {item: {name, amount, level}} 
    
            itemNames.push([character.items[itemIndex[slot]].name, itemIndex[slot]]);
        }

        for (let name in itemNames){
            compoundables[itemNames[name][0]].amount++;
            compoundables[itemNames[name][0]].level.push(character.items[itemNames[name][1]].level)
        }

        // compoundables has the number of duplicates, but each item needs to be an identical level, we captured the level of the items in the level property
        // we should iterate over the level list and see if we have a triplet to combine at the vendor.
        returnPackage = []; // slot 1, slot 2, slot 3, scroll slot.
        for (item in compoundables){
            for (level in [0,1,2,3,4,5,6,7]){
                isItAtThreeYet = 0;
                for (levelInstance in compoundables[item].level){
                    if (level == compoundables[item].level[levelInstance]){
                        isItAtThreeYet++
                    }
                    if (isItAtThreeYet >= 3 && level <= maxLevel) {
                        apple = findSlotsCompound(item, level);
                        return apple;
                    }
                }
            }
        }
        return null; // we don't have any items to compound
    } catch (err) {
        console.error(err);
    }
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