let typesList = ['bug', 'dark', 'dragon', 'electric', 'fairy', 
				'fighting', 'fire', 'flying', 'ghost', 'grass', 
				'ground', 'ice', 'normal', 'poison', 'psychic', 
				'rock', 'steel', 'water']; // list containing all types
let typeImg = {
				bug: "https://www.serebii.net/pokedex-bw/type/bug.gif", 
				dark: "https://www.serebii.net/pokedex-bw/type/dark.gif",
				dragon: "https://www.serebii.net/pokedex-bw/type/dragon.gif",
				electric: "https://www.serebii.net/pokedex-bw/type/electric.gif",
				fairy: "https://www.serebii.net/pokedex-bw/type/fairy.gif",
				fighting: "https://www.serebii.net/pokedex-bw/type/fighting.gif",
				fire: "https://www.serebii.net/pokedex-bw/type/fire.gif",
				flying: "https://www.serebii.net/pokedex-bw/type/flying.gif",
				ghost: "https://www.serebii.net/pokedex-bw/type/ghost.gif",
				grass: "https://www.serebii.net/pokedex-bw/type/grass.gif",
				ground: "https://www.serebii.net/pokedex-bw/type/ground.gif",
				ice: "https://www.serebii.net/pokedex-bw/type/ice.gif",
				normal: "https://www.serebii.net/pokedex-bw/type/normal.gif",
				poison: "https://www.serebii.net/pokedex-bw/type/poison.gif",
				psychic: "https://www.serebii.net/pokedex-bw/type/psychic.gif",
				rock: "https://www.serebii.net/pokedex-bw/type/rock.gif",
				steel: "https://www.serebii.net/pokedex-bw/type/steel.gif",
				water: "https://www.serebii.net/pokedex-bw/type/water.gif",
			}; // similar to lab9 changing the rated from text to an image

let shiny = 0; // global constant I am using as part of my makeShiny() function, which changes the appearance of the pokemon

let teamList = []; // global array Used for the addToTeam() function, to ensure duplicates aren't added as it does not display the image multiple times

function makeShiny() {
	// changes a constant which acts as a flag in the displayInfo() function,
	// the flag is used to indicate whether the pokemon should have the default or "shiny" appearance
	shiny = (shiny + 1) % 2;
} // end of makeShiny

async function getInfo(){ // await/async needed or pokemon would be added to list in incorrect order
	// communicates with the api to obtain the appropriate information then is sent to displayinfo()
	reset();
	$("#pokemons").show();
	$("#pokemons").html("<tr> <td>Name</td><td>Sprite</td><td>Type(s)</td> <td>Pokedex Number</td></tr>");
	
	let baseURL = "https://pokeapi.co/api/v2/";
	let title = "pokemon/";
	
	for (let i = 1; i <=151; i++){
		let url = baseURL + title + i + "/";
		await $.get(url, function(data){ // await/async needed or pokemon would be added to list in incorrect order
				displayInfo(data);
		});
	
	} // end for

    typeToImage();

} // end getInfo

async function displayInfo(data) { // await/async needed or pokemon would be added to list in incorrect order
	//creates a table row that displays the pokemon's information
	let inTeam = false;
    
    let name = data.name;

    for (let i = 0; i <teamList.length; i++){ // checks if pokemon info displayed already
    	if (name === teamList[i]){
    		i = teamList.length;
    		inTeam = true;
    	} // end if
    } // end for
    
    if (!inTeam){
    
    	teamList.push(name); // adds the pokemon's name to a list so the same pokemon does not appear twice, used for team building functionality 
    	
    	let pokeType = collectTypes(data); // creates an array that stores the pokemon's types
    	let length = pokeType.length; // obtains the pokemon's number of types it has
    
    	if (length == 1){

    		let key = pokeType[0];
    		let image = "#" + data.name + "img"; // creates the string needed to make a "dynamic" ID which will be used to show the sprite of the pokemon
    		
    		$("#pokemons").append("<tr id='" + name + "'><td>" + name + "</td><td><image id='" + name + "img'></td><td><image class=" + pokeType[0] + "></image></td><td>" + data.id + "</td></tr>");    	
    	
    		if (shiny == 0) { // shiny check
    			$(image).attr("src", data.sprites.front_default); // displays default sprite
	    	} else {
    			$(image).attr("src", data.sprites.front_shiny); // displays shiny sprite
    		} // end if/else (inner)

		} else {

			let image = "#" + data.name + "img"; // creates the string needed to make a "dynamic" ID which will be used to show the sprite of the pokemon
		
			let key1 = pokeType[0]; // pokemon's primary typing
			let key2 = pokeType[1]; // pokemon's secondary typing
		
			$("#pokemons").append("<tr id='" + name + "'><td>" + name + "</td><td><image id='" + name + "img'></td><td><image class=" + pokeType[0] + "></image><image class=" + pokeType[1] + "></image></td><td>" + data.id + "</td></tr></div>");
    	
    		if (shiny == 0) { // shiny check
    			$(image).attr("src", data.sprites.front_default); // displays default sprite
    		} else {
    			$(image).attr("src", data.sprites.front_shiny); // displays shiny sprite
    		} // end if/else (inner)

	    } // end if/else (middle)
    
	} // end if (outer)

	$("#jsonData").html(JSON.stringify(data));	

} // end of displayInfo

async function filter(){ // await/async needed or pokemon would be added to list in incorrect order
	// used to filter the pokemon by type
	reset();
	$("#pokemons").show(); // is required or the border for the non-existant table is always visible
	
	let baseURL = "https://pokeapi.co/api/v2/";
	let title = "pokemon/";
	
	let flag = 0; // flag which symbolizes if the listed type contains pokemon (is corrrectly input)
	
	for (let i = 0; i < typesList.length; i++) { // confirm type given is valid

		if (typesList[i] === $("#type").val()) {		
			$("#pokemons").html("<tr> <td>Name</td><td>Sprite</td><td>Type(s)</td> <td>Pokedex Number</td></tr>");
			
			flag = 1; // type is valid
			
			for (let i = 1; i <= 151; i++){
				let url = baseURL + title + i + "/";
				await $.get(url, function(data){ // await/async needed or pokemon would be added to list in incorrect order
					filterType(data);
					$("#jsonData").html(JSON.stringify(data));
				});
			} // end for (inner)

		} // end if

	} // end for (outer)

    typeToImage(); 

	if (flag == 0){ // input was invalid
		alert("you put in an incorrect type, remember when entering a type, they should be lowercased the possible types are: bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water");
	} // end if
	
} // end filter

function filterType(data) {
	//sent by function filter checks if a pokemon is of the type that we are filtering by
	let length = data.types.length;
	let type = $("#type").val();

	if (length == 2){
	
		let pokeType1 = data.types[0].type.name;
		let pokeType2 = data.types[1].type.name;
	
		if (type === pokeType1 || type === pokeType2) { // checks if input type matches primary or secondary typing of pokemon
			displayInfo(data);
		} // end if (inner)
	} else {
	
		let pokeType1 = data.types[0].type.name;
	
		if (type === pokeType1) { // checks if input type matches typing of pokemon
			displayInfo(data);
		} // end if (inner)

	} // end if/else (outer)

	typeToImage();

} // end filterType

async function individualShow(){ // await/async needed or pokemon would be added to list in incorrect order
	//shows one pokemon assuming valid input

	let baseURL = "https://pokeapi.co/api/v2/";
	let title = "pokemon/";
	let pokemon = $("#pokemon").val();
	let url = baseURL + title + pokemon + "/";

	let flag = 0;
	for (let i = 1; i <= 1010; i++){ // checks if input is valid, this unfortunately makes the check long if late in the pokedex

		let url = baseURL + title + i + "/";
		await $.get(url, function(data){ // await/async needed or pokemon would be added to list in incorrect order
					
					if (data.name === pokemon){
					
						$("#pokemons").show();
						$("#pokemons").html("<tr> <td>Name</td><td>Sprite</td><td>Type(s)</td> <td>Pokedex Number</td></tr>");
					
						displayInfo(data);
					
						i = 1011;
						flag = 1;
					} // end if

					$("#jsonData").html(JSON.stringify(data));
				});
	
	} // end for
	
	if (flag == 0) {
		alert("your input was incorrect, please ensure your input is spelt corrrectly and is lowercase");
	} // end if

	typeToImage();

} // end individualShow

function collectTypes(data){
	let length = data.types.length;
	
	let typeArr = [];

	if (length == 2){
	
		let pokeType1 = data.types[0].type.name;
		let pokeType2 = data.types[1].type.name;
		typeArr = [pokeType1, pokeType2];
	
	} else {
	
		let pokeType1 = data.types[0].type.name;
		typeArr = [pokeType1];
	
	} // end if/else
	
	return typeArr;

} // end collectTypes
function typeToImage(){
	// used to display the pokemon's type as an image (gif) instead of text, similar to lab 9
	$(".bug").attr("src", typeImg.bug);
	$(".dark").attr("src", typeImg.dark);
	$(".dragon").attr("src", typeImg.dragon);
	$(".electric").attr("src", typeImg.electric);
	$(".fire").attr("src", typeImg.fire);
	$(".fighting").attr("src", typeImg.fighting);
	$(".flying").attr("src", typeImg.flying);
	$(".ghost").attr("src", typeImg.ghost);
	$(".ice").attr("src", typeImg.ice);
	$(".normal").attr("src", typeImg.normal);
	$(".poison").attr("src", typeImg.poison);
	$(".grass").attr("src", typeImg.grass);
	$(".ground").attr("src", typeImg.ground);
	$(".fairy").attr("src", typeImg.fairy);
	$(".psychic").attr("src", typeImg.psychic);
	$(".rock").attr("src", typeImg.rock);
	$(".steel").attr("src", typeImg.steel);
	$(".water").attr("src", typeImg.water);
}

function teamBuilder(){
	// activates "Team Builder" mode, change in website functionality
	reset(); // clears page to original state, basically a refresh of the page
	$(".default").hide();
	$("#pokemons").show();
	$("#pokemons").html("<tr> <td>Name</td><td>Sprite</td><td>Type(s)</td> <td>Pokedex Number</td></tr>");
	$(".alternate").show();
}

function pokeList(id){
	// appends the current pokemon being added to user's "team" to a list
	teamList.push(id);
}

async function addToTeam(){
	// adds pokemon from input into team if input is valid
	let baseURL = "https://pokeapi.co/api/v2/";
	let title = "pokemon/";
	let pokemon = $("#teamMember").val();

	let flag = 0;

	for (let i = 0; i < teamList.length; i++) {

		if (pokemon === teamList[i]) {

			alert("This Pokemon is already in your team! This is not allowed")
			flag = 1;

		} // end if
	} // end for

	if (flag == 0){
	
		let url = baseURL + title + pokemon + "/";
		await $.get(url, function(data){
			displayInfo(data);
		});

		typeToImage();
		
		} // end if
} // end addToTeam

function removeMember(){
	// removes member from team
	let pokemon = $("#teamMember").val();
	let pokemonID = "#" + pokemon;

	for (let i = 0; i < teamList.length; i++){
		
		if (teamList[i] === pokemon){
			
			if(teamList.length == 1){
				
				teamList = [];

				document.getElementById('pokemons').deleteRow(i+1)
			
			} else{

				teamList.splice(i, 1);
				
				document.getElementById('pokemons').deleteRow(i+1)
			} // end if/else (inner)

		} // end if (outer)

	} // end for
	
} // end removeMember

function reset(){
	// resets the page, in essence it is a refresh

	$(".alternate").hide();
	$("#pokemons").hide();
	$("#pokemons").html("");
	$(".default").show();
	
	teamList = [];
}
reset(); // initially hides the id "pokemons" such that the corresponding table does not show up