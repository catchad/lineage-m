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

// debug用
$(".debug button").on("click", function(){
	toPage($(this).data("to"));
})

$(".btn-login").on("click", function() {
	if($(".tel-input").val().length && /^[09]{2}[0-9]{8}$/.test($(".tel-input").val())) {
		toPage(2);
	} else {
		alert("手機號碼格式不正確");
	}
})

$(".btn-info").on("click", function() {
	$(".info-box").addClass('active');
	$("html, body").animate({ scrollTop: 0 }, "fast");
})

$(".info-box .close").on("click", function() {
	$(".info-box").removeClass('active');
	$("html, body").animate({ scrollTop: 0 }, "fast");
})

// change page
function toPage(pageIndex) {
	$(".show").removeClass("show");
	$("#page"+pageIndex).addClass("show");
	$(".debug button.selected").removeClass("selected");
	$(".debug button[data-to="+pageIndex+"]").addClass("selected");
	$("html, body").animate({ scrollTop: 0 }, "fast");
}