var clipboard = new Clipboard('#btn-copy');
clipboard.on('success', function(e) {
    e.clearSelection();
    $("#invite-link").addClass('copyed');
    setTimeout(function() {
    	$("#invite-link").removeClass('copyed');
    },800);
});

// debug用
$(".debug button").on("click", function(){
	toPage($(this).data("to"));
})

$(".btn-login").on("click", function() {
	toPage(2);
})

$(".btn-info").on("click", function() {
	$(".lightbox").addClass('active');
	$("html, body").animate({ scrollTop: 0 }, "fast");
})

$(".lightbox .close").on("click", function() {
	$(".lightbox").removeClass('active');
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