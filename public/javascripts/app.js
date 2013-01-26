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

function keyRecord() {
  if (!flag) {
    recorder && recorder.record();
    flag = true;
    var interval = setInterval(function() {
      console.log('Recording...');
      if (!key.isPressed("k")) {
        clearInterval(interval);
        flag = false;
        stopRecord();
      }
    }, 100);
  }
}
function buttonRecord() {
  if (!flag) {
    recorder && recorder.record();
    console.log('Recording...');
  }
}

function stopRecord() {
  recorder && recorder.stop();
  console.log('Stopped recording.');

  recorder.exportWAV(function(blob) {
    console.log('Blob created.');
    recorder.clear();
    console.log(blob);
    window.binaryClient.send(blob, { hash: window.guid, type: 'write' });
  });
}

function GUID () {
  var S4 = function () {
    return Math.floor(Math.random() * 0x10000).toString(16);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}