let imgFront = document.querySelectorAll('.front-card'); //Variabel för att komma åt classen fron-card
const cards = document.querySelectorAll('.card'); //Variabel för att komma åt classen card
let counter = 0;
let firstClick = true;
let cardPair = [];

let startGame = document.querySelector(".control-button span"); //Variabel för att komma åt span elementet i control-button classen 
let helloName = document.querySelector(".name span"); //Variabel för att komma åt span elementet i name classen 


function User(name) { //contructor funktion som tar en name parameter
	this.name = name; //pekar på att this.name är lika med parametern name
}

startGame.onclick = function () { //on click funktion
	let yourName = prompt("Whats Your Name?"); //Variabel som frågar användaren efter namn med prompt function
	let UserOne = new User(yourName); //skapar en ny User som kan använda all information från user men lägger till en eget namn med parametern 'yourName'
	if (yourName == null || yourName == "") { //kollar om namnet som användaren skrev in returnerar null eller tomt fält
		helloName.innerHTML = 'Unknown'; //om ovanstående är sant så heter spelaren Unknown
	} else {
		helloName.innerHTML = `Hello ${UserOne.name} and welcome to The Memory Game, please choose a theme of your cards and press Enter`; //annars skrivs detta till användaren med parametern name från contruktorn User
	}
	startGame.remove(); //tar bort startGame knappen
};


let input = document.querySelector('.input') //Variabel för att komma åt input classen 
input.addEventListener('keypress', function (event) { //Event listener med keypress
	if (event.key === 'Enter') { //Om funktionens event key är lika med Enter körs funktionen

		const key = '020d921e01bcc08823ec27215c7b82d2'; //Variabel till api nyckel
		let url = `https://api.flickr.com/services/rest/?api_key=${key}&method=flickr.photos.search&text=${input.value}&per_page=12&page=1&sort=relevance&safe_search=2&format=json&nojsoncallback=1`; //Flickr Api som hämtar bilder med metod flickr.photos.search, text är lika med vad användaren lämnar för value i input, hämtar 12 bilder per sida från första sidan och de mest relevanta till sökningen, satte även safe search till 2 och sen i vilket format som då är json
		fetch(url).then( //fetch som hämtar från url variabeln ovanför och sen utför en funktion med parametern 'r'
			function (r) {
				return r.json(); //returnerar r till json format
			}
		).then( //sen utför funktion med parametern 'data'
			function (data) {
				showImg(data); //Använder datan från json, i funktionen specificeras vilken information vi vill få ut
				play();
			}
		).catch( //fångar upp om något blir fel
			function (error) { //funktion med error parameter
				console.log(error) //skriver ut errorn som fångas upp av catch och loggar det i konsolen
			}
		)

		event.preventDefault();
	}

})


function showImg(data) {

	let urls = []; //tom array
	for (let i = 0; i < data.photos.photo.length; i++) { //for loop som börjar på 0, loopar så länge i är mindre än längden på datan från json flickr i photos photo, ökar med 1
		let serverId = data.photos.photo[i].server //Variabel specificerat på index platsen i photo och server id:et
		let id = data.photos.photo[i].id //Variabel specificerat på index platsen i photo och id:et
		let secret = data.photos.photo[i].secret //Variabel specificerat på index platsen i photo och secret

		let url = `https://live.staticflickr.com/${serverId}/${id}_${secret}_q.jpg` //för att kunna visa bilden behövs dessa tre parametrar fyllas i från ovanstående variabler
		urls[i] = url; //lägger in url i urls arrayn
	}

	let k = 0;
	for (let j = 0; j < imgFront.length; j++) {

		imgFront[j].src = urls[k];
		k++;

		if (k >= (imgFront.length / 2)) {
			k = 0;
		}
	}

}

/*  sätter eventlistener för klick på korten samt när man klickar 
på flera kort så vänder den tills korten om dem är inte ett par.*/

function play() {
	shuffle()

	cards.forEach((card) => {
		card.state = 'unclicked'
	})

	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener('click', () => {
			if (firstClick) {
				time()
				firstClick = false
			}

			if (cards[i].state == 'unclicked') {
				cards[i].style.transform = 'rotateY(180deg)'
				cards[i].state = 'clicked'
				counter++
				cardPair.push(cards[i])
				check()
			} else if (cards[i].state == 'clicked') {
				cards[i].style.transform = 'rotateY(0deg)'
				cards[i].state = 'unclicked'
				counter--
				cardPair = []
			}
		})
	}
}
//funktion som shufflar korten

function shuffle() {
	let srcs = [];
	for (let i = 0; i < imgFront.length; i++) {
		srcs.push(imgFront[i].src);
	}

	for (let j = srcs.length - 1; j > 0; j--) {
		let k = Math.floor(Math.random() * (j + 1))
		let temp = srcs[j]
		srcs[j] = srcs[k]
		srcs[k] = temp
	}

	for (let l = 0; l < imgFront.length; l++) {
		console.log(srcs[l]);
		imgFront[l].src = srcs[l]

	}
}

//Funktion för timer, så fort man vänder på första kortet så sätts tiden igång

function time() {
	let secs = 0
	let mins = 0
	let SS
	let MM
	setInterval(() => {
		secs++
		if (secs == 60) {
			secs = 0;
			mins++
		}
		secs < 10 ? SS = `0${secs}` : SS = `${secs}`
		mins < 10 ? MM = `0${mins}` : SS = `${mins}`

		document.querySelector('#time').innerHTML = `${MM}:${SS}`

	}, 1000);
}

/* Kollar om korten är ett par, är dem par stanna kvar + poäng
 * Är dem inte par, vänd tillbaks korten */

function check() {
	if (counter == 2) {
		if (cardPair[0].querySelector('img').src == cardPair[1].querySelector('img').src) {
			matched()

		} else {
			unmatched(cardPair[0], cardPair[1])
		}
	}
}

function matched() {
	cardPair[0].state = 'blocked'
	cardPair[1].state = 'blocked'
	counter = 0
	cardPair = []
	let score = document.querySelector('#score').innerHTML
	score++
	document.querySelector('#score').innerHTML = score
}

function unmatched(x, y) {
	setTimeout(() => {
		x.style.transform = 'rotateY(0deg)'
		y.style.transform = 'rotateY(0deg)'
	}, 750)
	cardPair[0].state = 'unclicked'
	cardPair[1].state = 'unclicked'
	counter = 0
	cardPair = []
}