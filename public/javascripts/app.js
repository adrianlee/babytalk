var audio_context;
var recorder;
var flag;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  console.log('Media stream created.');

  input.connect(audio_context.destination);
  console.log('Input connected to audio context destination.');

  recorder = new Recorder(input);
  console.log('Recorder initialised.');
}

function startRecording(button) {
  if (!flag) {
    recorder && recorder.record();
    flag = true;
    interval = setInterval(function() {
      console.log('Recording...');
      if (!key.isPressed("k")) {
        clearInterval(interval);
        flag = false;
        stopRecording();
      }
    }, 100);
  }
}

function stopRecording(button) {
  recorder && recorder.stop();
  console.log('Stopped recording.');

  // create WAV download link using audio data blob
  // createDownloadLink();

  recorder.clear();
}