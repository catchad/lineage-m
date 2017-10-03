$(document).ready(function() {

	$("header .nav-switch").on('click', function(event) {
		$("header nav").addClass('nav--active');
	});

	$("header nav .close").on('click', function(event) {
		$("header nav").removeClass('nav--active');
	});

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

