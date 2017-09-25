$(document).ready(function() {

	$("header .nav-switch").on('click', function(event) {
		$("header nav").addClass('nav--active');
	});

	$("header nav .close").on('click', function(event) {
		$("header nav").removeClass('nav--active');
	});

});