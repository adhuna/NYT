var article = {};

$(document).ready(function() {
	
	// keeping track of the place on the article
	var percentage = 0;
	
	// initial varibles and setup
	var windowHeight = $(window).height();
	var articleNavBoxHeight = ((windowHeight + 40) * .15);
	var cssArticleNavBoxHeight = articleNavBoxHeight + "px";
	$('#article-nav-box').css('height', cssArticleNavBoxHeight);
	
	var articleHeight;
	article.setup = function() {
		// Update HTML
		$('#article-container h1').text(data[info.topic][info.indexes[info.topic].index].title);	
		$('#article-container p').text(data[info.topic][info.indexes[info.topic].index].text);
		$('#article-nav-mini h1').text(data[info.topic][info.indexes[info.topic].index].title);
		$('#article-nav-mini p').text(data[info.topic][info.indexes[info.topic].index].text);
		
		// Need to wait for the dom to update - seems to take 2 seconds
		setTimeout(function() {
			articleHeight = $('#article-container').height();	
		}, 2000);			
	};
	
	// Need to calculate the percentage from the input to this and then carry on as per usual	
	article.scroll = function(distance) {
		// need to determine where on the "line" they are at
		percentage = percentage + (distance / 300);
		if (percentage < 0) {percentage = 0};
		if (percentage > 1) {percentage = 1};
		scrollArticle(percentage);
		scrollNavBox(percentage);
	};
	
	// User manually scrolls
	var leapScroll = false; //global variable to stop issues with leap scroll triggering manual scroll
	$('#article').scroll(function() {
		if (!leapScroll) {
			percentage = ($('#article').scrollTop()/(articleHeight - windowHeight));
			scrollNavBox(percentage);	
		} else {
			leapScroll = false;
		};
	});
	
	// User clicks somewhere on the preview area
	$('#article-nav-mini').click(function(e) {
		percentage = (e.clientY - 50 - (.5 * articleNavBoxHeight)) / (((articleHeight + 70 ) * .15) - articleNavBoxHeight);
		if ((e.clientY - 50) <= (.5 * articleNavBoxHeight) ) {percentage = 0};
		if ((e.clientY - 50) >= ((articleHeight + 70 ) * .15) - (.5 * articleNavBoxHeight)) {percentage = 1}; 
		scrollArticle(percentage);
		scrollNavBox(percentage);
	});
			
	// Scrolls the actual article
	function scrollArticle(percentage) {
		leapScroll = true;
		var newTop = Math.floor(percentage * ((articleHeight + 40) - windowHeight));
		$('#article').scrollTop(newTop);
	};
	
	// Article height is sometimes not set in time. Should find a way around this
	function scrollNavBox(percentage) {
		var newTop = Math.floor(45 + (percentage * (((articleHeight + 70) * .15) - articleNavBoxHeight))) + "px";
		$('#article-nav-box').css('top', newTop);
	};
	
	// Moves the article up a page
	article.pageUp = function() {
		$('#article').animate({
		    scrollTop: - (windowHeight)
		}, 1000); 
	};
	
	// Moves the article down a page
	article.pageDown = function() {
		$('#article').animate({
		    scrollTop: windowHeight
		}, 1000); 
	};
	
	// Updating variables if the screen size changes
	$(window).resize(function() {
		$('#article-nav-box').css('height', ($(window).height() * .15));
		articleNavBoxHeight = $('#article-nav-box').height();
		windowHeight = $(window).height();
	});	
				
});

