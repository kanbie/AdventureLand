//Priest Healing

function priestSkillsRoutine(){ // Lets use our skills if we are a priest.
    try {
        for (let member in parent.party_list){        
            skill_target = parent.entities[parent.party_list[member]];
            if (skill_target && skill_target.hasOwnProperty('max_hp')){
                if (skill_target.max_hp - skill_target.hp > 500){
                    use_skill('partyheal',skill_target.name);
                    console.log('casted partyheals');
                }
            }
        }
    }catch (err) {
            console.error(err);
        }
    // setInterval(async () => { // We are serial at the moment, no need to recall.
    //     priestSkillsRoutine();
    // }, 250);
}