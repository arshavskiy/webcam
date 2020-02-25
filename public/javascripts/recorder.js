var recordButton, stopButton, recorder, liveStream;

window.onload = function () {

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
	recordButton.addEventListener("click", startRecordingAudio);
	stopButton.addEventListener("click", stopRecordingAudio);
	pauseButton.addEventListener("click", pauseRecordingAudio);









	function startRecordingAudio() {
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
		};

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

	function pauseRecordingAudio() {
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

	function stopRecordingAudio() {

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

		let formdata = new FormData(); //create a from to of data to upload to the server
		formdata.append('soundBlob', soundBlob, filename + '.wav');

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
			} // if the response is a JSON object
		).then(
			success => {
				console.log(success);
			} // Handle the success response object
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
		let filenameN = date + '__' + Date.now();

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
		li.insertBefore(span, li.childNodes[0]);

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

	// recorder.addEventListener('change', function (e) {
	// 	var file = e.target.files[0];
	// 	// Do something with the video file.
	// 	player.src = URL.createObjectURL(file);
	// });


	// let shouldStop = false;
	// let stopped = false;
	// const downloadLink = document.getElementById('download');
	// const stopButton = document.getElementById('stop');

	// stopButton.addEventListener('click', function () {
	// 	shouldStop = true;
	// });

	const uploadvideo = (recordedChunks, filename) => {

		let formdata = new FormData(); //create a from to of data to upload to the server
		formdata.append('movBlob', recordedChunks, filename);

		// fetch('https://ps001.taboolasyndication.com:4400/upload/', {

		fetch('//localhost:4500/video/', {
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
			} // if the response is a JSON object
		).then(
			success => {
				console.log(success);
			} // Handle the success response object
		).catch(
			error => console.log(error) // Handle the error response object
		);
	};

	// function handleSuccess(stream) {
	// 	player.srcObject = stream;

	// 	const options = {
	// 		mimeType: 'video/webm'
	// 	};
	// 	const recordedChunks = [];
	// 	window._mediaRecorder = new MediaRecorder(stream, options);

	// 	window._mediaRecorder.addEventListener('dataavailable', function (e) {
	// 		if (e.data.size > 0) {
	// 			recordedChunks.push(e.data);
	// 		}

	// 		if (shouldStop === true && stopped === false) {
	// 			window._mediaRecorder.stop();
	// 			stopped = true;
	// 		}
	// 	});

	// 	window._mediaRecorder.addEventListener('stop', function () {
	// 		downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
	// 		downloadLink.download = 'acetest.webm';
	// 		uploadvideo(recordedChunks, 'video_test');
	// 		player.srcObject = null;

	// 	});

	// 	window._mediaRecorder.start();
	// }

	// recordButton_video.addEventListener('click', (event) => {
	// 	console.log('Video is no longer paused');
	// 	navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(handleSuccess);
	//   });


	// This example uses MediaRecorder to record from an audio and video stream, and uses the
	// resulting blob as a source for a video element.
	//
	// The relevant functions in use are:
	//
	// navigator.mediaDevices.getUserMedia -> to get the video & audio stream from user
	// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
	// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
	// MediaRecorder.start -> start recording
	// MediaRecorder.stop -> stop recording (this will generate a blob of data)
	// URL.createObjectURL -> to create a URL from a blob, which we use as video src


	recordButton = document.getElementById('record');
	stopButton = document.getElementById('stop');

	// get video & audio stream from user
	navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true
		})

		.then(function (stream) {
			liveStream = stream;



			var liveVideo = document.getElementById('live');
			//     liveVideo.src = URL.createObjectURL(stream);
			liveVideo.srcObject = stream;
			liveVideo.play();

			recordButton.disabled = false;
			recordButton.addEventListener('click', startRecording);
			stopButton.addEventListener('click', stopRecording);

		});


	function startRecording() {
		recorder = new MediaRecorder(liveStream);

		recorder.addEventListener('dataavailable', onRecordingReady);

		recordButton.disabled = true;
		stopButton.disabled = false;

		recorder.start();
	}

	function stopRecording() {
		recordButton.disabled = false;
		stopButton.disabled = true;

		// Stopping the recorder will eventually trigger the 'dataavailable' event and we can complete the recording process
		recorder.stop();
	}

	function onRecordingReady(e) {
		var video = document.getElementById('recording');
		const recordedChunks = [];
		recordedChunks.push(e.data);
		uploadvideo(e.data, 'video');

		// e.data contains a blob representing the recording
		video.src = URL.createObjectURL(e.data);
		video.play();
	}

};
