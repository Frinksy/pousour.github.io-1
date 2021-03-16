blow = true;

var volume = document.getElementById('volume').value/100;

document.getElementById('volume').addEventListener('change', function() {
	volume = document.getElementById('volume').value/100;
	document.getElementById('label_volume').innerText = "volume: " + parseInt(volume * 100);
});

const KEYS = ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"];

for (var i = 0; i < 10; i++) {
	var div = document.createElement('div');
	div.classList.add('note');
	div.id = i;
	div.innerHTML = KEYS[i].toUpperCase();
	div.addEventListener('mousedown', () => playNote(event.target.id));
	div.addEventListener('mouseup', () => stopNote(event.target.id));
	document.getElementById('harmonica').appendChild(div);

	var audio = document.createElement('audio');
	audio.id = (i+1)+"a";
	audio.src = "notes/"+audio.id+".mp3";
	document.body.appendChild(audio);

	var audio = document.createElement('audio');
	audio.id = (i+1)+"b";
	audio.src = "notes/"+audio.id+".mp3";
	document.body.appendChild(audio);
}

// function playNote(index) {
// 	document.getElementById(index).style.backgroundColor = "#a6a6a6";
// 	index++;
// 	if (blow) index += "a";
// 	else index += "b"
// 	var audio = document.getElementById(index);
// 	audio.currentTime = 0;
// 	audio.volume = volume;
// 	audio.play();
// }

// function stopNote(index) {
// 	document.getElementById(index).style.backgroundColor = "#808080";
// 	index++;
// 	var audio = document.getElementById(index+"a");
// 	audio.pause();
// 	audio.currentTime = 0;

// 	var audio = document.getElementById(index+"b");
// 	audio.pause();
// 	audio.currentTime = 0;
// }

// addEventListener('keydown', function(event) {
// 	if (event.repeat) return
// 	var index = KEYS.indexOf(event.key);

// 	if (index != -1) playNote(index);
// 	else if (event.key == " ") {
// 		var listAudio = document.querySelectorAll('audio');
// 		for (var i = 0; i < listAudio.length; i++) {
// 			if (!listAudio[i].paused) {
// 				var index = listAudio[i].id;
// 				index = index.substr(0, index.length - 1);
// 				index = index - 1;
// 				stopNote(index);
// 				blow = false;
// 				playNote(index);
// 			}
// 		}
// 		blow = false;
// 	} 
// });

// addEventListener('keyup', function(event) {
// 	var index = KEYS.indexOf(event.key);

// 	if (index != -1) stopNote(index);
// 	else if (event.key == " ") {
// 		var listAudio = document.querySelectorAll('audio');
// 		for (var i = 0; i < listAudio.length; i++) {
// 			if (!listAudio[i].paused) {
// 				var index = listAudio[i].id;
// 				index = index.substr(0, index.length - 1);
// 				index = index - 1;
// 				stopNote(index);
// 				blow = true;
// 				playNote(index);
// 			}
// 		}
// 		blow = true;
// 	} 
// });


const frequencies = [440, 493.88, 523.25, 587.3, 659.25, 698.46, 783.99] // A4 -> G6

let oscillatorNodes = []
var audioCtx = new (window.AudioContext || window.webkitAudioContext)({latencyHint: "interactive"});
// Setup oscillatorNodes
for (let i = 0; i < frequencies.length; i++) {
    let osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(frequencies[i]/4, audioCtx.currentTime);

	real = new Float32Array([1.0, 0.98, 2.12, 0.19, 0.2, 0.22, 0.52, 0.3, 0.19, 0.01, 0.02, 0.03, 0.01, 0.00, 0.004, 0, 0, 0, 0, 0]);
	imag = new Float32Array(real.length)

	wave = audioCtx.createPeriodicWave(real, imag);
	osc.setPeriodicWave(wave);

    osc.connect(audioCtx.destination);
    oscillatorNodes.push(
        osc
    );
}

function playNote(index) {

    oscillatorNodes[index].start();

}

function stopNote(index) {
    
	oscillatorNodes[index].stop();
	let osc = audioCtx.createOscillator();
	osc.frequency.setValueAtTime(frequencies[index]/4, audioCtx.currentTime);
	osc.connect(audioCtx.destination);
	real = new Float32Array([1.0, 0.98, 2.12, 0.19, 0.2, 0.22, 0.52, 0.3, 0.19, 0.01, 0.02, 0.03, 0.01, 0.00, 0.004, 0, 0, 0, 0, 0]);
	imag = new Float32Array(real.length)

	wave = audioCtx.createPeriodicWave(real, imag);
	osc.setPeriodicWave(wave);
	
	oscillatorNodes[index] = osc;

}

addEventListener('keydown', function (event) {
	if (event.repeat) return
	console.log("keydown");
	console.log(event.key);
	
	if (KEYS.indexOf(event.key) != -1) {
		console.log("bingo");
		var index = KEYS.indexOf(event.key);
		console.log(index);
		playNote(index);
	}

});

addEventListener('keyup', function (event) {
	if (event.repeat) return
	if (KEYS.indexOf(event.key) != -1) {
		var index = KEYS.indexOf(event.key);
		stopNote(index);
	}
});


const HAPPY_BIRTHDAY = [6, 6, -6, 6, 7, -7, 6, 6, -6, 6, -8, 7, 6, 6, 9, 8, 7, -7, -6, -9, -9, 8, 7, -8, 7];
const TEST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10];

var musique = HAPPY_BIRTHDAY;

document.getElementById('play_song').addEventListener('click', () => playSong(musique));
document.getElementById('musique').addEventListener('change', function() {
	musique = this.value;
	switch (musique) {
		case "Happy_bday":
			musique = HAPPY_BIRTHDAY;
			break;
		case "test":
			musique = TEST;
			break;
	}
})
document.getElementById('show_notes').addEventListener('click', function() {document.activeElement.blur();if (!executing) showNotes(musique);});

function playSong(song, index) {
	if (index == undefined) index = 0;

	var note = song[index];

	if (note < 0) {
		note = -note;
		blow = false;
	}
	else blow = true;
	
	if (index != 0) {
		var previous_note = song[index-1];
		if (previous_note < 0) previous_note = -previous_note;

		stopNote(previous_note -1);
		if (index == song.length) return;
		playNote(note-1);
	}
	else {
		playNote(note - 1);
	}

	if (index < song.length) {
		setTimeout(function() {playSong(song, index+1)}, 1000);
	}
}

var executing = false;

function showNotes(song, index) {
	executing = true;
	if (index == undefined) index = 0;

	var note = song[index];

	var div = document.createElement('div');
	div.classList.add('noteSlide');

	if (note < 0) {
		note = -note;
		div.classList.add('noteSlidingUp');
	} 
	else div.classList.add('noteSlidingDown');

	

	div.style.left = 235 + (note - 1) * 139.5 + "px";
	
	document.getElementById('notes_slides').appendChild(div);

	if (index < song.length - 1) {
		setTimeout(function() {showNotes(song, index+1)}, 1000);
	}
	else {
		setTimeout(function() {
			document.getElementById("notes_slides").innerHTML = "";
			executing = false;
		}, 3000);
	}
}

function test() {
	var div = document.createElement('div');
	div.classList.add('test');
	document.body.appendChild(div);
}