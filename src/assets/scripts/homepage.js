var mc = new Hammer($(".menu-wrapper")[0]);
mc.on("swipeleft", function(ev) {
	var index = $(".diamondBtn.selected").data("index");
	if(index!=4) {
		$(".homepage__menu").removeClass("focus"+(index+1));
		$(".diamondBtn.selected").removeClass("selected");
		$(".menu-dot.selected").removeClass("selected");
		index++;
		$(".diamondBtn[data-index="+index+"]").addClass("selected");
		$(".menu-dot:nth-child("+(index+1)+")").addClass("selected");
		$(".homepage__menu").addClass("focus"+(index+1));
	}

});
mc.on("swiperight", function(ev) {
	var index = $(".diamondBtn.selected").data("index");
	if(index!=0) {
		$(".homepage__menu").removeClass("focus"+(index+1));
		$(".diamondBtn.selected").removeClass("selected");
		$(".menu-dot.selected").removeClass("selected");
		index--;
		$(".diamondBtn[data-index="+index+"]").addClass("selected");
		$(".menu-dot:nth-child("+(index+1)+")").addClass("selected");
		$(".homepage__menu").addClass("focus"+(index+1));
	}
});