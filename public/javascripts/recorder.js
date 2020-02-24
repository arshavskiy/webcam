(function(window){

	document.querySelector('#time').innerHTML = '00:00:00';
	//webkitURL is deprecated but nevertheless
	URL = window.URL || window.webkitURL;
	
	var gumStream; //stream from getUserMedia()
	var rec; //Recorder.js object
	var input; //MediaStreamAudioSourceNode we'll be recording
	
	// shim for AudioContext when it's not avb. 
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext //audio context to help us record
	
	var recordButton = document.getElementById("recordButton");
	var stopButton = document.getElementById("stopButton");
	var pauseButton = document.getElementById("pauseButton");
	
	//add events to those 2 buttons
	recordButton.addEventListener("click", startRecording);
	stopButton.addEventListener("click", stopRecording);
	pauseButton.addEventListener("click", pauseRecording);


})(this);




function startRecording() {
	stopButton.classList.remove('clicked');
	recordButton.classList.add('clicked');
	pauseButton.classList.remove('clicked');

	stopWatch.startCounter();

	console.log("recordButton clicked");
	recording = true;

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

	let constraints = {
		audio: true,
		video: false
	}

	/*
		Disable the record button until we get a success or fail from getUserMedia() 
	*/

	
	/*
		We're using the standard promise based getUserMedia() 
		https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		// audioContextOptions.sampleRate = 24000;
		document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz";

		/*  assign to gumStream for later use  */
		gumStream = stream;

		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input, {
			numChannels: 1
		});

		//start the recording process
		rec.record();

		console.log("Recording started");

	}).catch(function (err) {
		//enable the record button if getUserMedia() fails
	});
}

function pauseRecording() {
	console.log("pauseButton clicked rec.recording=", rec.recording);
	if (rec.recording) {
		//pause
		rec.stop();
		pauseButton.classList.add('clicked');
		recordButton.classList.remove('clicked');
		stopButton.classList.remove('clicked');
	} else {
		//resume
		rec.record();
		pauseButton.classList.remove('clicked');

	}
}

function stopRecording() {

	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	//reset button just in case the recording is stopped while paused
	stopButton.classList.add('clicked');
	recordButton.classList.remove('clicked');
	pauseButton.classList.remove('clicked');


	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();
	stopWatch.stopCounter();
			
	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
	// var client = new BinaryClient('ws://localhost:9001');
}

const upload = (soundBlob, filename) => {

	let formdata = new FormData() ; //create a from to of data to upload to the server
	formdata.append('soundBlob', soundBlob,  filename+'.wav');

	// fetch('https://ps001.taboolasyndication.com:4400/upload/', {
	fetch('//localhost:4500/upload/', {
	  method: 'POST',
	  headers: {
		// Content-Type may need to be completely **omitted**
		// or you may need something
		// "Content-Type": "multipart/form-data"
		'enctype': 'multipart/form-data'
	  },
	  body: formdata // This is your file object
	}).then(
	  response => {
		response.blob();
	  }// if the response is a JSON object
	).then(
	  success => {
		  console.log(success);
		}// Handle the success response object
	).catch(
	  error => console.log(error) // Handle the error response object
	);
  };
  
  // Event handler executed when a file is selected
  
function createDownloadLink(blob) {

	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	

	//name of .wav file to use during upload and download (without extendion)
	const now = new Date(Date.now());
	let day = now.getDate();
    let month = now.getMonth() + 1;
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    let date = day + '.' + month + '.' + now.getFullYear();
	let filenameN =  date + '__' + Date.now();
	
	// const filename = now.getDate() + '.' + now.getMonth() + '__' + Date.now();
	// const date = (now.getDay() < 10 ? '0' + now.getDay(): now.getDay()) + '.' + now.getMonth() + '.' + now.getFullYear();
	const recordTitleName = date + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes());

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	upload(blob, filenameN);

	//save to disk link
	link.href = url;
	link.download = filenameN + ".wav"; //download forces the browser to donwload the file using the  filename
	link.innerHTML = "Save to disk";

	//add the new audio element to li
	li.appendChild(au);

	//add the filename to the li
	// li.appendChild();

	//add the save to disk link to li
	// li.appendChild(link);
	const span = document.createElement('span');
	span.innerHTML = recordTitleName;
	span.className = 'record_title';
	li.insertBefore( span, li.childNodes[0]);

	//upload link
	// var upload = document.createElement('a');
	// upload.href="#";
	// upload.innerHTML = "Upload";
	// upload.addEventListener("click", function(event){
	// 	  var xhr=new XMLHttpRequest();
	// 	  xhr.onload=function(e) {
	// 	      if(this.readyState === 4) {
	// 	          console.log("Server returned: ",e.target.responseText);
	// 	      }
	// 	  };
	// 	  var fd=new FormData();
	// 	  fd.append("audio_data",blob, filename);
	// 	  xhr.open("POST","upload.php",true);
	// 	  xhr.send(fd);
	// });
	// li.appendChild(document.createTextNode (" "))//add a space in between
	// li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li);
}