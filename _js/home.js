var home = {};

$(document).ready(function() {

	//HOME PAGE TRANSITIONS
	home.transition = function(view) {
		currentScreen = "topic";
		arrowAnimations(view);
		pageAnimations(view);
	};
		
	function arrowAnimations(view) {
		view = "#" + view;
		$(view +  " .home-yellow").addClass('active');
		$(view +  " .home-yellow img").addClass('active');
		$(view +  " h1").addClass('active');
		$(view +  " .home-arrow").addClass('active');
	};
	
	function pageAnimations(view) {
		var viewID = "#" + view.slice(5);
		setTimeout(function() {
			$("#home").addClass('hidden');
			resetHome();
			setTimeout(function() {
				$(viewID).css('display', 'block');
				setTimeout(function () {
					$(viewID).addClass('active');	
				}, 50);
			}, 1000);
		}, 1000);
	};
		
	function resetHome() {
		$(".home-yellow").removeClass('active');
		$(".home-yellow img").removeClass('active');
		$("h1").removeClass('active');
		$(".home-arrow").removeClass('active');
	};
		
});

