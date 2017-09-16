$(".debug button").on("click", function(){
	$(".show").removeClass("show");
	$("#"+$(this).data("to")).addClass("show");
	$(".debug button.selected").removeClass("selected");
	$(this).addClass("selected");
})


$(".job-clicker").on("click", function() {
	$(".job.selected").removeClass("selected");
	$("."+$(this).data("job")).addClass("selected");
})

$(".choose-frame").on("click", function() {
	var stat = $(this).data("stat");
	if(stat == "old") {
		$(".new").removeClass("selected").addClass("not-selected");
		$(".old").removeClass("not-selected").addClass("selected");
	} else {
		$(".old").removeClass("selected").addClass("not-selected");
		$(".new").removeClass("not-selected").addClass("selected");
	}
})

$(".quiz-option").on("click", function() {
	$(".quiz-option.selected").removeClass("selected");
	$(this).addClass("selected");
})
