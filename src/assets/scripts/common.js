$(document).ready(function() {

	$("header .nav-switch").on('click', function(event) {
		$("header nav").addClass('nav--active');
	});

	$("header nav .close").on('click', function(event) {
		$("header nav").removeClass('nav--active');
	});
	
	if(navigator.userAgent.match(/Line/i)) {
		alertTextClose("<p>建議使用Chrome瀏覽</p><p>以利最佳網頁體驗</p>");
	}

	var isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i);
	if(isSamsungBrowser) {
		$("#ieAlert p").html('本站不支援本瀏覽器，建議使用Chrome以利最佳體驗');
		$("#ieAlert").addClass('active');
	}

	// 螢幕旋轉
	var orientation = window.orientation;
	if( orientation == 90 || orientation == -90 ) {
		$("#mobileLandscapeAlert").addClass('active');
	} else {
		$("#mobileLandscapeAlert").removeClass('active');
	}
	$(window).on("orientationchange", function(){
	    orientation = window.orientation;
	    if( orientation == 90 || orientation == -90 ) {
	    	$("#mobileLandscapeAlert").addClass('active');
	    } else {
	    	$("#mobileLandscapeAlert").removeClass('active');
	    }
	});

	// 音樂
	if( device.desktop() ) {
		var isAudioPlay;
		window.localStorage.getItem("isAudioPlay") == null ? isAudioPlay = true : isAudioPlay = (window.localStorage.getItem("isAudioPlay") == 'true');
		window.localStorage.setItem("isAudioPlay", isAudioPlay);
		var audio = new Audio('assets/audios/music.mp3');
		if (typeof audio.loop == 'boolean')	{
		    audio.loop = true;
		} else {
		    audio.addEventListener('ended', function() {
		        this.currentTime = 0;
		        this.play();
		    }, false);
		}

		if( isAudioPlay ) {
			audio.play();
		} else {
			$(".nav .audio-switch").addClass("off");
		}

		$(".audio-switch").on('click', function(event) {
			TweenMax.killTweensOf(audio);
			if( !isAudioPlay) {
				isAudioPlay = true;
				audio.play();
				TweenMax.to(audio, 0.5, {volume:1});
				$(".nav .audio-switch").removeClass("off");
			} else {
				isAudioPlay = false;				
				$(".nav .audio-switch").addClass("off");
				TweenMax.to(audio, 0.5, {volume:0, onComplete:function() {
					audio.pause();
				}});				
			}
			window.localStorage.setItem("isAudioPlay", isAudioPlay);
		});
	} else {
		$(".nav .audio").remove();
	}
});

function alertTextClose(text) {
	$(".alert-text").html(text);
	$("#alert").css("background-color","rgba(0,0,0,0.8)");
	$("#alert").addClass('active');
	$("#alert .close").addClass('active');
	$("#alert .close").on("click", function() {
		$("#alert").removeClass('active');
	})
}

//alert
function alertText(text,onComplete) {
	$(".alert-text").html(text);
	$("#alert").addClass('active');
	setTimeout(function() {
		$("#alert").removeClass('active');
		if(onComplete) onComplete();
	},700);
}

