async function maintainParty(party = ['TwelvePounds','Solamare','CprCertified','Secretary']){
    try {
        if(!character.party && character.name != party[0]){ // do we belong to a party?
            accept_party_invite(party[0]);
        }else{
            for(attendee in party){
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