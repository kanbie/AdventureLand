// // functions and routines to govern upgrades, storage, and compunding of our items

// /*
//     Settings
// */

// // the maximum level we would upgrade to normally
// const max_upgrade = 7;
// let upgradeWhitelist = ['hpamulet','ringsj','hpbelt'];

// /*
//     Upgrade Interval
// */
// setInterval(function(){

// 	upgradeWhitelistItems(upgradeWhitelist);

// },100 * 5000);

// function compoundThese(item,levelTarget){
//     set_message("Upgrades");
//     inventoryItems = inventoryList();
//     itemIndex = [];
// 	for(var i=0;i<42;i++){
// 		if(character.items[i] && G.items[character.items[i].name].compound){
//             if(character.items[i].name == item && character.items[i].level == levelTarget){
//                 itemIndex.push(i);
//                 console.log(i);
//             }
//         }
// 	}
//     smart_move('upgrade', function(){
//         if(!character.items[locate_item('cscroll0')]){ // Do I have the scroll?
//             buy_with_gold('cscroll0',1);
//         }
//         scrollTarget = locate_item('cscroll0') // Lets add logic for cscoll selection.
//         if (itemIndex.length >= 3){
//             compound(itemIndex[0],itemIndex[1],itemIndex[2],scrollTarget);   
//         }   
//     });
// }

// function upgradeWhitelistItems(itemlist){
//     itemlist.forEach(item => {
//         compoundThese(item,0);
//     });
// }

// // load_code('ItemLoops');
// // compoundThese('ringsj',1);