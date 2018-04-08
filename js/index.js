//创建歌曲信息对象，返回当前播放器的状态。
var playStatus = {
	musicList: playlist.result.tracks.length, //歌单歌曲数
	musicIndex: 0, //当前播放的歌曲索引，默认加载第一首歌
	currentTime: 0, //当前歌曲播放的时间
	musicTotalTime: 0, //当前歌曲的总时间
	playStatus: false, //true为播放状态，false为暂停状态
};

//时间转换函数
var timeConvert = function(timestamp) {
	var minutes = Math.floor(timestamp / 60);
	var seconds = Math.floor(timestamp - (minutes * 60));

	if (seconds < 10) {
		seconds = '0' + seconds;
	}

	timestamp = minutes + ':' + seconds;
	return timestamp;
};

//歌曲基本信息设置
function trackInfo(args) {
	//playerlist是playlist.js中的歌单数据，根据需求进行数据读取即可
	var obj = playlist.result.tracks[playStatus.musicIndex];

	args = args || {
		name: obj.name,
		artist: obj.artists[0].name,
		album: obj.album.name,
		albumPic: obj.album.picUrl,
		total: obj.duration,
		src: obj.mp3Url
	};

	//按歌曲信息切换相应组件内容
	$('.player .trackInfo .name').text(args.name);
	$('.player .trackInfo .artist').text(args.artist);
	$('.player .trackInfo .album').text(args.album);
	$('.player .albumPic').css('backgroundImage', 'url(' + args.albumPic + ')');
	$('.player .time .total').text(timeConvert(args.total / 1000)); //因为歌单数据中的播放长度用ms表示的，所以这里 / 1000
	playStatus.musicTotalTime = Math.floor(args.total / 1000);
	$('#audio source').attr('src', args.src); //切换音乐通过修改<source>中的src
}

//播放暂停状态处理
function playMusic() {
	$('.player .controls .play i').attr('class', 'icon-' + (
		playStatus.playStatus
		? 'pause'
		: 'play'));

	if (playStatus.playStatus) {
		//用jquery获取<audio>对象，必须加上[0]，转换为DOM对象
		$('#audio')[0].play();
	} else {
		$('#audio')[0].pause();
	}
}

//当前时间和进度处理
function playTime() {
	$('.player .time .current').text(timeConvert(playStatus.currentTime));
	$('.player .progress').css('width', playStatus.currentTime / playStatus.musicTotalTime * 100 + '%'); //同步进度条
}

//播放器按钮事件监听

//播放暂停
$('.player .controls .play').bind('click', function() {
	playStatus.playStatus = !playStatus.playStatus;
	playMusic();
});

// 上一曲控制
$('.player .controls .previous').bind('click', function() {
	if (playStatus.musicIndex - 1 < 0) {
		alert('已经是第一首了');
	} else {
		playStatus.musicIndex--;
	}
	$('#audio').remove();
	$('.player').append('<audio id="audio"><source src=""></audio>');
	trackInfo();
	playMusic();
});

//下一曲
$('.player .controls .next').bind('click', function() {
	if (playStatus.musicIndex + 1 >= playStatus.musicList) {
		alert('已经是最后一首了');
	} else {
		playStatus.musicIndex++;
	}
	$('#audio').remove();
	$('.player').append('<audio id="audio"><source src=""></audio>');
	trackInfo();
	playMusic();
});
//加载页面重置歌曲状态
$().ready(function() {
	$('#audio').remove();
	$('.player').append('<audio id="audio"><source src=""></audio>');
	trackInfo();
	setInterval(function(){
		playStatus.currentTime =  $('#audio')[0].currentTime;
		 playTime();
		if(playStatus.currentTime >=playStatus.musicTotalTime ){
			$('.player .controls .next').click();
		}
	},300);
});
