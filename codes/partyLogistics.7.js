


function initParty(party = ['TwelvePounds','Solamare','CprCertified','Secretary']){
    if(character.name == party[0]){ // are we the host window?
        start_character(party[1],'mainLine');
        start_character(party[2],'mainLine');
        start_character(party[3],'mainLine');
    }
}


async function maintainParty(party){
    try {
        if(!character.party && character.name != party[0]){ // do we belong to a party?
            accept_party_invite(party[0]);
        }else{
            for(attendee in party){
                console.log(attendee);
                if(!parent.party_list.includes(party[attendee])){
                    send_party_invite(party[attendee]);
                }
            }
        }
        
    } catch (error) {
        console.error(error);
    }
    setTimeout(async () => {
        maintainParty(party);
    }, 10 * 1000); // 10 second loop
}