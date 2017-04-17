 
 // global variable
 window.requestAnimationFrame || (window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback, element) {
      return window.setTimeout(function() {
        callback(+new Date());
      }, 1000 / 60);
    });

  var audio = {
    buffer: {}, 
    file:"http://s.cdpn.io/1715/the_xx_-_intro.mp3",
    proceed: true,
    playing: false,
    source: {}
  };

  var play = false;
  var btn = document.getElementById('btn');
  btn.style.left = Math.floor(window.innerWidth - btn.offsetWidth) /2 +"px";

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    audio.context = new window.AudioContext();
    audio.analyser = audio.context.createAnalyser();
    audio.analyser.fftSize = 256;
    btn.innerHTML = 'play';
  } catch (e) {
    audio.proceed = false;
    alert('Your browser does not support WEB AUDIO API');
    console.log(e);
  }

  if (audio.proceed) {
    var buffer = audio.context.createBufferSource();
    var req = new XMLHttpRequest();
    req.open('GET', audio.file, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
      audio.context.decodeAudioData(
        req.response,
        function(buffer) {
          audio.buffer = buffer;
          audio.source = {};
        },
        function() {
          alert('Error decoding audio "' + audio.file + '".');
        }
      );
    };
    req.send();
  }


  audio.play = function() {
    audio.playing = true;
    audio.source = audio.context.createBufferSource();
    audio.source.buffer = audio.buffer;
    audio.source.connect(audio.analyser);
    audio.analyser.connect(audio.context.destination); 
    audio.source.start(0);
  };

  audio.stop = function() {
    audio.source.stop(0);
    audio.playing = false;
    audio.source._startTime = audio.source.currentTime;
  };

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    play = !play;
    if (play) {
      audio.play();
      btn.innerHTML = "Stop";
    } else {
      audio.stop();
      btn.innerHTML = "Play";
    }
  });

function Particle(width, height, context){
  this.x = Math.random() * width;
  this.y = Math.random() * height;
  this.v = Math.random()*0.1+0.3;
  this.angle = Math.random()*360;
  var a = Math.random();
  var r = 33;
  var g = Math.round(Math.random() * 33);
  var b = Math.round(Math.random() * 205);
  this.rgba = "rgba("+r+", "+g+", "+b+", "+a+")";
  this.life = Math.random()*20;
  this.size = 3;
  this.update = function() {
    this.x = this.x + this.v * Math.cos(this.angle * Math.PI / 180);
    this.y = this.y + this.v * Math.sin(this.angle * Math.PI / 180);
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }
  this.draw = function(value) {
    context.beginPath();
    context.fillStyle = this.rgba;
    context.strokeStyle = this.rgba;
    context.arc(this.x, this.y, this.size * value, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    // context.stroke();
  }
  this.reset = function() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.angle = Math.random()*360;
    
    // this.color=COLORS[Math.floor(Math.random()*11)];
    this.size = 3;
    this.life = Math.random()*20;
    var r = 33;
    var g = Math.round(Math.random() * 33);
    var b = Math.round(Math.random() * 255);
    var a = Math.random();
    this.rgba = "rgba("+r+", "+g+", "+b+", "+a+")";
  }
}

function Circle(width, height, context) {
  this.x = width / 2;
  this.y = height / 2;
  var r = 33;
  var g = Math.round(Math.random() * 50);
  var b = Math.round(Math.random() * 155);
  var a = Math.random()+ 0.1;
  this.rgba = "rgba("+r+", "+g+", "+b+", "+a+")";
  this.size = 3;
  this.draw = function(value) {
    context.beginPath();
    context.fillStyle = this.rgba;
    context.strokeStyle = this.rgba;
    context.arc(this.x, this.y, this.size * value, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  }
}


window.onload = function() {
  var canvas = document.getElementById('Canvas'),
      context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var width = canvas.width,
      height = canvas.height;
  
  var num = audio.analyser.frequencyBinCount;
  var P = [];
  var C = [];
  
  for (var i = 0; i < num; i++) {
    P.push(new Particle(width, height, context));
  }

  for (var i = 0; i < 5; i++) {
    C.push(new Circle(width, height, context));  
  }

  function drawP(){
    var freqDomain = new Uint8Array(audio.analyser.frequencyBinCount);
    audio.analyser.getByteFrequencyData(freqDomain);
    var value = 1;
    if (audio.playing){
      for (var i = 0; i < audio.analyser.frequencyBinCount; i++) {
        if (i < audio.analyser.frequencyBinCount) {
            value = freqDomain[i] /5;
            if (value === 0) {
              VALUE=1;
            } else {
              VALUE = value/2;
            }
          } 
          var par = P[i];
          par.update();
          par.draw(VALUE);
          context.save();
          var a = Math.random() + 0.5;
          var r = 33;
          var g = Math.round(Math.random() * 33);
          var b = Math.round(Math.random() * 255);
          var Rrgba = "rgba("+r+", "+g+", "+b+", "+a+")";
          context.fillStyle = Rrgba; 
          context.translate(width / 2, -height / 2);
          context.rotate(i * Math.PI/180);
          context.fillRect(i * 15, height-value * 15, 1, height);
          context.restore();
          context.save();
          context.fillStyle = Rrgba; 
          context.translate(width / 2, -height / 2);
          context.rotate(-i * Math.PI / 180);
          context.fillRect(-i * 15, height - value * 15, 1, height);
          context.restore();
      }
      C.forEach(function(c, i){
        c.draw(freqDomain[10+i] / (i+1));
      });
    }
  }
  (function drawFrame(){
    window.requestAnimationFrame(drawFrame, canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillRect(0 ,0, width, height);  
    drawP();
  }());
} 