//获取元素
var audio = document.getElementById("audioTag");
var pause = document.getElementById("playPause");
var recordImg = document.getElementById("record-img");
var preMusic = document.getElementById("skipForward");
var nextMusic = document.getElementById("skipBackward");
var musicTitle = document.getElementById("music-title");
var author = document.getElementById("author-name");
var progress = document.getElementById("progress");
var progressTotal = document.getElementById("progress-total");
var playedTime = document.getElementById("playedTime");
var audioTime = document.getElementById("audioTime");
var volumeTogger = document.getElementById("volume-togger");
var volume = document.getElementById("volume");
//列表按钮
var list = document.getElementById("list");
//关闭列表按钮
var closeList = document.getElementById("close-list");
//音乐列表 
var musicList = document.getElementById("music-list");
var mode = document.getElementById("playMode");
var speed = document.getElementById("speed");

//音乐播放序号
var musicId = 0;

var musicData = [
    ['洛春赋','24215220202-李烨婷'],
    ['Yesterday','24215220202-李烨婷'],
    ['江南烟雨色','24215220202-李烨婷'],
    ['Vision pt.II','24215220202-李烨婷'],
];

//点击播放暂停按钮
pause.addEventListener("click", function() {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
});

function rotateRecord() {
    recordImg.style.animationPlayState = "running";
}

function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused";
}

//刷新唱片角度为0
function refreshRecordAngle(){
    recordImg.classList.add('rotate-play');
}

//初始化音乐
function initAudio() {
    audio.src =`./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.onloadedmetadata = function() {
        musicTitle.innerText = musicData[musicId][0];
        author.innerText = musicData[musicId][1];
        recordImg.style.backgroundImage = `url('./images/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('./images/bg${musicId}.png')`;
        audioTime.innerText = transTime(audio.duration);
        //刚加载时
        audio.currentTime = 0;
        updateProgress();
        refreshRecordAngle();
    };
}
initAudio();

//初始化并播放音乐
function initAndPlay() {
    initAudio();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}
//initAndPlay();

//上一首
preMusic.addEventListener("click", function() {
    musicId--;
    if (musicId < 0) {
        musicId = 3;
    }
    initAndPlay();
});

//下一首
nextMusic.addEventListener("click", function() {
    musicId++;
    if (musicId > 3) {
        musicId = 0;
    }
    initAndPlay();
});

audio.addEventListener("timeupdate", updateProgress);
//进度条
function updateProgress() {
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}

//点击进度条
progressTotal.addEventListener("click", function(event) {
    //音乐开始播放时点击进度条才有效，已经播放暂停也有效
    if(!audio.paused||audio.currentTime!=0){
        var pgsWidth = progressTotal.getBoundingClientRect().width;
        var rate = event.offsetX / pgsWidth;
        audio.currentTime = rate * audio.duration;
        updateProgress(audio);
    }
});


//音频播放时间换算
function transTime(value) {
  var time = '';
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }

  return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
  var time = '';
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length == 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length == 1 ? '0' + s[i] : s[i];

  return time;
}

//音量控制
var lastVolume = 70;
audio.volume = lastVolume/100;

audio.addEventListener("timeupdate", updateVolume);
//滑块音量控制
function updateVolume() {
    audio.volume = volumeTogger.value/100;
}

volume.addEventListener("click", setNoVolume);
//点击静音按钮
function setNoVolume() {
    audio.muted = !audio.muted;
    if(audio.muted){
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
        volume.style.backgroundImage = `url('./images/静音.png')`;
    }else{
        volumeTogger.value = lastVolume;
        volume.style.backgroundImage = `url('./images/音量.png')`;
    }
}

list.addEventListener("click", function() {
    musicList.classList.remove('list-card-hide');
    musicList.classList.add('list-card-show');
    musicList.style.display = 'block';
    closeList.style.display = 'block';
    closeList.addEventListener("click", closeListBoard);
})

//点击关闭列表按钮
function closeListBoard(){
    musicList.classList.remove('list-card-show');
    musicList.classList.add('list-card-hide');
    closeList.style.display = 'none';
}

var modeId = 1;//1.单曲
mode.addEventListener("click", function() {
    modeId++;
    if(modeId>3){
        modeId = 1;
    }
    mode.style.backgroundImage = `url('./images/mode${modeId}.png')`;
});

audio.onended = function() {
    if(modeId==2){
        musicId = (musicId + 1) % musicData.length;
    }else if(modeId==3){
        var oldId = musicId;
        while(true){
            musicId = Math.floor(Math.random()*musicData.length);
            if(musicId!=oldId){
                break;
           }
        }
    }
    initAndPlay();
}

/* audio.onended = function() {
    if (modeId == 1) {
        // 单曲循环
        audio.currentTime = 0;
        audio.play();
        return;
    } else if (modeId == 2) {
        // 顺序播放
        musicId = (musicId + 1) % musicData.length;
    } else if (modeId == 3) {
        // 随机播放（不与当前相同）
        var oldId = musicId;
        do {
            musicId = Math.floor(Math.random() * musicData.length);
        } while (musicId == oldId);
    }
    initAndPlay();
}; */


//倍数
speed.addEventListener("click", function() {
    var speedText = speed.innerText;
    if(speedText=='1.0X'){
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    }else if(speedText=='1.5X'){
        speed.innerText = '2.0X';
        audio.playbackRate = 2.0;
    }else if(speedText=='2.0X'){
        speed.innerText = '0.5X';
        audio.playbackRate = 0.5;
    }else if(speedText=='0.5X'){    
        speed.innerText = '1.0X';
        audio.playbackRate = 1.0;
    }
});

//音乐列表
document.getElementById("music0").addEventListener("click",
    function() {
        musicId = 0;
        initAndPlay();
});
document.getElementById("music1").addEventListener("click",
    function() {
        musicId = 1;
        initAndPlay();
});document.getElementById("music2").addEventListener("click",
    function() {
        musicId = 2;
        initAndPlay();
});
document.getElementById("music3").addEventListener("click",
    function() {
        musicId = 3;
        initAndPlay();
});