let imgFront = document.querySelectorAll('.front-card');
const cards = document.querySelectorAll('.card');
let counter = 0;
let firstClick = true;
let cardPair = [];

let startGame = document.querySelector(".control-button span");
let helloName = document.querySelector(".name span");




function User(name){
	this.name = name;
}

startGame.onclick = function () {
	let yourName = prompt("Whats Your Name?");
	let UserOne = new User(yourName);
        if (yourName == null || yourName == "") {
            helloName.innerHTML = 'Unknown';
        } else {
            helloName.innerHTML = `Hello ${UserOne.name} and welcome to The Memory Game, please choose a theme of your cards and press Enter`;
        }
		startGame.remove();
};



let input = document.querySelector('.input')
    input.addEventListener('keypress', function(event){
        if(event.key === 'Enter'){
			
            const key = '020d921e01bcc08823ec27215c7b82d2';
            let url = `https://api.flickr.com/services/rest/?api_key=${key}&method=flickr.photos.search&text=${input.value}&per_page=12&page=1&sort=relevance&safe_search=2&format=json&nojsoncallback=1`;
            fetch(url).then(
                function(r){
                    return r.json();
                }
            ).then(
                function(data){
					showImg(data);
                    play();
                }
            ).catch(
                function(error){
                    console.log(error)
                }
            )
                
            event.preventDefault();
        }
        
    })

	

function showImg(data) {

	let urls = [];
	for (let i = 0; i < data.photos.photo.length; i++) {
		let serverId = data.photos.photo[i].server
		let id = data.photos.photo[i].id
		let secret = data.photos.photo[i].secret

		let url = `https://live.staticflickr.com/${serverId}/${id}_${secret}_q.jpg`
		urls[i] = url;
	}

	let k = 0;
	for (let j = 0; j < imgFront.length; j++) {

		imgFront[j].src = urls[k];
		k++;

		if(k >= (imgFront.length/2)) {
			k = 0;
		}
	}
	
}

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
	

	function shuffle() {
		let srcs = [];
		for (let i = 0; i < imgFront.length; i++) {
			srcs.push(imgFront[i].src); 
		}
	
		for (let j = srcs.length - 1; j > 0; j--) {
			let k = Math.floor(Math.random() * (j+1))
			let temp = srcs[j]
			srcs[j] = srcs[k]
			srcs[k] = temp
		}
	
		for (let l = 0; l < imgFront.length; l++) {
			console.log(srcs[l]);
			imgFront[l].src = srcs[l]
	
		}
	}

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

		


