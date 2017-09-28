$(document).ready(function() {

	$("header .nav-switch").on('click', function(event) {
		$("header nav").addClass('nav--active');
	});

	$("header nav .close").on('click', function(event) {
		$("header nav").removeClass('nav--active');
	});

	// $(window).on('resize', function(event) {
	// 	alert( screen.orientation.angle );
	// 	// if( screen.width > screen.height && screen.width < 768 ) {
	// 	// 	alert("landscape");

	// 	// }
	// });

	$(window).on("orientationchange", function(){
	    var orientation = window.orientation;
	    if( orientation == 90 || orientation == -90 ) {
	    	$("#mobileLandscapeAlert").addClass('active');
	    } else {
	    	$("#mobileLandscapeAlert").removeClass('active');
	    }
	});

	// 音樂
	if( device.desktop() ) {
		var isAudioPlay = (window.localStorage.getItem("isAudioPlay") == 'true');
		console.log( isAudioPlay );

		if( isAudioPlay == null ) {
			isAudioPlay = true;
			window.localStorage.setItem("isAudioPlay", true);
		}

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
			console.log("play");
		} else {
			$(".nav .audio-switch").addClass("off");
		}

		// var isAudioPlay = true;
		

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

