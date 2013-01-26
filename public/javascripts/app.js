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

function startRecording() {
  if (!flag) {
    recorder && recorder.record();
    flag = true;
    var interval = setInterval(function() {
      console.log('Recording...');
      if (!key.isPressed("k")) {
        clearInterval(interval);
        flag = false;
        stopRecording();
      }
    }, 100);
  }
}

function stopRecording() {
  recorder && recorder.stop();
  console.log('Stopped recording.');

  recorder.exportWAV(function(blob) {
    console.log('Blob created.');
    recorder.clear();

    console.log(blob);

    // window.socket.emit('wav', {msg: blob});
    binaryClient.send(blob);

    // var url = URL.createObjectURL(blob);
    // var li = document.createElement('li');
    // var au = document.createElement('audio');
    // var hf = document.createElement('a');

    // au.controls = true;
    // au.src = url;
    // hf.href = url;
    // hf.download = new Date().toISOString() + '.wav';
    // hf.innerHTML = hf.download;
    // li.appendChild(au);
    // li.appendChild(hf);
    // $('#list').append(li);
  });
}