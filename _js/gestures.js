//Public Functions
var gestures = {};

//Public Screen Variable
var currentScreen = "topic"; 

$(document).ready(function() {
		
	//GESTURE ROUTERS
	
	gestures.swipeLeft  = function() {
		if (currentScreen === "topic") {
			topic.change('left')
			return;
		};
		if (currentScreen === "shareOptions") {
			topic.showEmail();
			return;
		};
		if (currentScreen === "shareText") {
			topic.hideText();
			return;
		};
		if (currentScreen === "article") {
			// this could go to the next in the queue. 
			return;
		}; 
	};
	
	gestures.swipeRight = function() {
		if (currentScreen === "home") {
			home.transition("home-topic");
			return;
		};
		if (currentScreen === "topic") {
			topic.change('right');
			return;
		};
		if (currentScreen === "shareOptions") {
			topic.showText();
			return;
		};
		if (currentScreen === "shareEmail") {
			topic.hideEmail();
			return;
		};
		if (currentScreen === "article") {
			// this could go to the previous item in the queue.
			return;
		}; 
	};
	
	gestures.swipeUp = function() {
		if (currentScreen === "topic") {
			topic.change('up');
			return;
		};
		if (currentScreen === "article") {
			article.pageUp();
			return;
		};
	};
	
	gestures.swipeDown = function() {
		if (currentScreen === "home") {
			home.transition("home-list");
			return;
		};
		if (currentScreen === "topic") {
			topic.change('down');
			return;
		};
		if (currentScreen === "shareEmail") {
			topic.shareEmail();
			return;
		};
		if (currentScreen === "shareText") {
			topic.shareText();
			return;
		};
		if (currentScreen === "article") {
			article.pageDown();
			return;
		};
	};

	gestures.pinchOut = function() {
		if (currentScreen === "topic") {
			topic.expandArticle();
			return;
		};
	};
	
	gestures.pinchIn = function() {
		if (currentScreen === "article") {
			topic.shrinkArticle();
			return;
		};
	};
	
	gestures.point = function() {
		if (currentScreen === "topic") {
			topic.showShareOptions();
			return;
		};
	};
	
	gestures.unpoint = function() {
		if (currentScreen === "shareOptions") {
			topic.hideShareOptions();
			return;
		};
	};
	
		
});

