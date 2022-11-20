// Helper functions for dumb code in the runner files.
// I may put some generic functions in here too.

// the in game function for this returns index 0 on search at times, weird. Wrote this to replace it, null on not found.
function findItemIndex(itemName){
    for (slot in character.items){
        if (character.items[slot] && character.items[slot].name == itemName){
            return slot;
        }
    }
    return null;
}

//Colby's smart hacks
function smart_move(destination,on_done)
{
	// despite the name, smart_move isn't very smart or efficient, it's up to the players to implement a better movement method [05/02/17]
	// on_done function is an old callback function for compatibility, smart_move also returns a Promise [25/03/20]
	if(smart.moving) smart.on_done(false,"interrupted");
	smart.map="";
	if(is_string(destination)) destination={to:destination};
	if(is_number(destination)) destination={x:destination,y:on_done},on_done=null;
	if("x" in destination)
	{
		smart.map=destination.map||character.map;
		smart.x=destination.x;
		smart.y=destination.y;
	}
	else if("to" in destination || "map" in destination)
	{
		if(destination.to=="town") destination.to="main";
		if(G.events[destination.to] && parent.S[destination.to] && G.events[destination.to].join)
		{
			join(destination.to);
			smart.moving=false;
			smart.on_done(true);
			return;
		}
		else if(G.monsters[destination.to])
		{
			var locations=[],theone;
			for(var name in G.maps)
				(G.maps[name].monsters||[]).forEach(function(pack){
					if(pack.type!=destination.to || G.maps[name].ignore || G.maps[name].instance) return;
					if(pack.boundaries) // boundaries: for phoenix, mvampire
					{
						pack.last=pack.last||0;
						var boundary=pack.boundaries[pack.last%pack.boundaries.length];
						pack.last++;
						locations.push([boundary[0],(boundary[1]+boundary[3])/2,(boundary[2]+boundary[4])/2]);
					}
					else if(pack.boundary)
					{
						var boundary=pack.boundary;
						locations.push([name,(boundary[0]+boundary[2])/2,(boundary[1]+boundary[3])/2]);
					}
				});
			if(locations.length) // This way, when you smart_move("snake") repeatedly - you can keep visiting different maps with snakes
			{
				theone=random_one(locations);
				smart.map=theone[0]; smart.x=theone[1]; smart.y=theone[2];
			}
		}
		else if(G.maps[destination.to||destination.map])
		{
			if(G.maps[destination.to||destination.map].event)
			{
				if(parent.S[G.maps[destination.to||destination.map].event])
				{
					join(G.maps[destination.to||destination.map].event);
					smart.moving=false;
					smart.on_done(true);
					return;
				}
				else
				{
					game_log("Path not found!","#CF575F");
					smart.moving=false;
					smart.on_done(false,"failed");
					return;
				}
			}
			else
			{
				smart.map=destination.to||destination.map;
				smart.x=G.maps[smart.map].spawns[0][0];
				smart.y=G.maps[smart.map].spawns[0][1];
			}
		}
		else if(destination.to=="upgrade" || destination.to=="compound") smart.map="main",smart.x=-204,smart.y=-129;
		else if(destination.to=="exchange") smart.map="main",smart.x=-26,smart.y=-432;
		else if(destination.to=="potions" && character.map=="halloween") smart.map="halloween",smart.x=149,smart.y=-182;
		else if(destination.to=="potions" && in_arr(character.map,["winterland","winter_inn","winter_cave"])) smart.map="winter_inn",smart.x=-84,smart.y=-173;
		else if(destination.to=="potions") smart.map="main",smart.x=56,smart.y=-122;
		else if(destination.to=="scrolls") smart.map="main",smart.x=-465,smart.y=-71;
		else if(find_npc(destination.to))
		{
			var l=find_npc(destination.to);
			smart.map=l.map,smart.x=l.x,smart.y=l.y+15;
		}
	}
	if(!smart.map)
	{
		game_log("Unrecognized location","#CF5B5B");
		return rejecting_promise({reason:"invalid"});
	}
	smart.moving=true;
	smart.plot=[]; smart.flags={}; smart.searching=smart.found=false;
	if(destination.return)
	{
		var cx=character.real_x,cy=character.real_y,cmap=character.map;
		smart.on_done=function(done,reason){
			if(on_done) on_done(done);
			smart_move({map:cmap,x:cx,y:cy});
			if(done) resolve_deferreds("smart_move",{success:true});
			else reject_deferreds("smart_move",{reason:reason});
		}
	}
	else smart.on_done=function(done,reason){
		if(on_done) on_done(done);
		if(done) resolve_deferreds("smart_move",{success:true});
		else reject_deferreds("smart_move",{reason:reason});
	};
	// console.log("smart_move: "+smart.map+" "+smart.x+" "+smart.y);
	return push_deferred("smart_move");
};

function start_pathfinding()
{
	smart.try_exact_spot=false;
	smart.searching=true;
	smart.start_x=character.real_x;
	smart.start_y=character.real_y;
	queue=[],visited={},start=0,best=null;
	if(game.cli)
	{
		parent.CLI_OUT.push({"type":"smart_move",G:G,start_x:smart.start_x,start_y:smart.start_y,start_map:character.map,x:smart.x,y:smart.y,map:smart.map});
	}
	else
	{
		qpush({x:character.real_x,y:character.real_y,map:character.map,i:-1});
		// game_log("Searching for a path...","#89D4A2");
		bfs();
	}
};

function bfs()
{
	var timer=new Date(),result=null,optimal=true;

	while(start<queue.length)
	{
		var current=queue[start];
		// game_log(current.x+" "+current.y);
		var map=G.maps[current.map];
		var c_moves=moves,qlist=[];
		if(current.map==smart.map)
		{
			var c_dist=abs(current.x-smart.x)+abs(current.y-smart.y);
			var s_dist=abs(current.x-smart.start_x)+abs(current.y-smart.start_y);
			smart.flags.map=true;
			if(c_dist<smart.baby_edge || s_dist<smart.baby_edge || map.small_steps) c_moves=baby_steps;
			if(c_dist<smart.edge)
			{
				result=start;
				break;
			}
			else if(best===null || abs(current.x-smart.x)+abs(current.y-smart.y)<abs(queue[best].x-smart.x)+abs(queue[best].y-smart.y))
			{
				best=start;
			}
		}
		else if(current.map!=smart.map)
		{
			if(smart.prune.map && smart.flags.map) {start++; continue;}
			map.doors.forEach(function(door){
				// if(simple_distance({x:map.spawns[door[6]][0],y:map.spawns[door[6]][1]},{x:current.x,y:current.y})<30)
				if(smart.map!="bank" && door[4]=="bank" && !G.maps[current.map].mount || door[8]=="complicated") return; // manually patch the bank shortcut
				if(is_door_close(current.map,door,current.x,current.y) && can_use_door(current.map,door,current.x,current.y))
					qlist.push({map:door[4],x:G.maps[door[4]].spawns[door[5]||0][0],y:G.maps[door[4]].spawns[door[5]||0][1],transport:true,s:door[5]||0});
			});
			map.npcs.forEach(function(npc){
				if(npc.id=="transporter" && simple_distance({x:npc.position[0],y:npc.position[1]},{x:current.x,y:current.y})<75)
				{
					for(var place in G.npcs.transporter.places)
					{
						qlist.push({map:place,x:G.maps[place].spawns[G.npcs.transporter.places[place]][0],y:G.maps[place].spawns[G.npcs.transporter.places[place]][1],transport:true,s:G.npcs.transporter.places[place]});
					}
				}
			});
		}

		if(smart.use_town) qpush({map:current.map,x:map.spawns[0][0],y:map.spawns[0][1],town:true}); // "town"

		shuffle(c_moves);
		c_moves.forEach(function(m){
			var new_x=current.x+m[0],new_y=current.y+m[1];
			// game_log(new_x+" "+new_y);
			// utilise can_move - game itself uses can_move too - smart_move is slow as can_move checks all the lines at each step
			if(can_move({map:current.map,x:current.x,y:current.y,going_x:new_x,going_y:new_y,base:character.base}))
				qpush({map:current.map,x:new_x,y:new_y});
		});
		qlist.forEach(function(q){qpush(q);}); // So regular move's are priotised

		start++;
		if(mssince(timer)>(!parent.is_hidden()&&40||500)) return;
	}
	
	if(result===null)
	{
		result=best,optimal=false;
		game_log("Path not found!","#CF575F");
		smart.moving=false;
		smart.on_done(false,"failed");
	}
	else
	{
		plot(result);
		if(1) // [08/03/19] - to attempt and move to the actual coordinates
		{
			var last=smart.plot[smart.plot.length-1]; if(!last) last={map:character.map,x:character.real_x,y:character.real_y};
			if(smart.x!=last.x || smart.y!=last.y)
			{
				smart.try_exact_spot=true;
				smart.plot.push({map:last.map,x:smart.x,y:smart.y});
			}
		}
		smart.found=true;
		if(smart.prune.smooth) smooth_path();
		// if(optimal) game_log("Path found!","#C882D1");
		// else game_log("Path found~","#C882D1");
		// game_log(queue.length);
		parent.d_text("Yes!",character,{color:"#58D685"});
	}
};

// function game_log(message,color,x)
// {

// }