var isAjaxing = false;

var clipboard = new Clipboard('.btn-copy');
clipboard.on('success', function(e) {
    e.clearSelection();
    $(".copy-complete").removeClass('hidden');
    $(".copy-complete").addClass('copyed');
    setTimeout(function() {
    	$(".copy-complete").removeClass('copyed');
    	setTimeout(function() {
    		$(".copy-complete").addClass('hidden');
    	},500);
    },800);
});

$(".btn-login").on("click", function() {
	var phone = $(".tel-input").val();
	if ($(".tel-header-selecter").val() == "TW") {
	    if (!/((?=(09))[0-9]{10})$/g.test(String(phone))) {
	        if (!/((?=(9))[0-9]{9})$/g.test(String(phone))) {
	            alertText("手機號碼格式不正確");
	            return;
	        }
	    }
	} else if ($(".tel-header-selecter").val() == "HK") {
	    if (!/([0-9]{8})$/g.test(String(phone))) {
	        alertText("手機號碼格式不正確");
	        return;
	    }
	} else {
	    if (!/([0-9]{8})$/g.test(String(phone))) {
	        alertText("手機號碼格式不正確");
	        return;
	    }
	}

	var APIurl = "";
	var data = "";


	var isRegistered;
	//call api
	isAjaxing = true;
	$.ajax({
	    url: APIurl,
	    type: 'POST',
	    headers: {
	        apikey: $("#apikey").val()
	    },
	    contentType: 'application/json; charset=UTF-8',
	    dataType: 'json',
	    data: JSON.stringify(data)
	})
	.always(function (response) {
		isAjaxing = false;

		if (response.data == undefined) {
			//假資料
			isRegistered = true;
		} else {
		    if (response.code == "0000") {
		    	//do something...
		    } else {
		        alertText(response.message);
		        return;
		    }
		}

		if(isRegistered) {
			//已參加事前登錄
			toPage(2);
		} else {
			//未參加事前登錄
			alertTextClose("<p>尚未參與「事前登錄」</p><p>請先參與「事前登錄」後，</p><p>重新點擊好友分享的連結進入。</p>");
		}
	});
})

$(".info").on("click", function() {
	$(".info-box").addClass('active');
	$("html, body").animate({ scrollTop: 0 }, "fast");
})

$(".info-box .close").on("click", function() {
	$(".info-box").removeClass('active');
	$("html, body").animate({ scrollTop: 0 }, "fast");
})


// debug用
$(".debug button").on("click", function(){
	toPage($(this).data("to"));
})
// change page
function toPage(pageIndex) {
	$(".show").removeClass("show");
	$("#page"+pageIndex).addClass("show");
	$(".debug button.selected").removeClass("selected");
	$(".debug button[data-to="+pageIndex+"]").addClass("selected");
	$("html, body").animate({ scrollTop: 0 }, "fast");
}