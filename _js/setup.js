var info;

$(document).ready(function() {

	info = {
		// array of all topics for easy switching
		'topics' : [],
		// string to keep track of the current topic
		'topic' : '',
		// object with number of articles and current index for each topic
		'indexes' : {},
		// integer to keep track of the current index
		'index' : 0
	};  

	(function setupInfo() {
		setupTopics();
		setupIndexes();
		setupCurrentTopic();
		setupCurrentIndex();					
		setupTopicNav();
	})();
	
	// add all topics
	function setupTopics() {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				info.topics.push(key);
			};
		};
	};
	
	// set the indexes for topics 
	function setupIndexes() {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				info.indexes[key] = {};	
				for (var i = 0; i < data[key].length; i++) {
					info.indexes[key].index = 0;
					info.indexes[key].max = data[key].length - 1;
				};
			};
		};
	};
	
	function setupCurrentTopic() {
			
		// edge cases
		if (info.topics.length === 0) {
			return;
		};
		if (info.topics.length === 1) { 
			info.topic = info.topics[0];
			return;
		};
		
		// default case
		if (info.topics.length % 2) { // odd 
			info.topic = info.topics[ (info.topics.length - 1) / 2 ];	
		} else { // even
			info.topic = info.topics[ (info.topics.length / 2) - 1 ];
		};
	
	};
	
	function setupCurrentIndex() {
		info.index = 0;
	};
	
	//add navigation menu based on structure
	function setupTopicNav() {
		addTopicNavElements();
		addTopicNavClasses();	
	}
	
	function addTopicNavElements() {
		for (var i = 0; i < info.topics.length; i++) {
			$("#navigation").append('<div class="nav"><p>' + info.topics[i] + '</p></div>');
		};
	};

	function addTopicNavClasses() {
		
		// edge cases
		if (info.topics.length === 0) {
			return;
		};
		if (info.topics.length === 1) { 
			$('.nav').addClass('current');
			return;
		};
		
		var currentNavIndex;
	
		// add current
		if (info.topics.length % 2) { // odd 
			currentNavIndex = (((info.topics.length - 1) / 2) + 1); 
		} else { // even
			currentNavIndex = ((info.topics.length / 2));
		};
		$(".nav:nth-child(" + (currentNavIndex) + ")").addClass('current');
		
		// add below
		if (currentNavIndex < $(".nav").length) {
			$(".nav:nth-child(" + (currentNavIndex + 1) + ")").addClass('below');	
		};
		
		// add above	
		if ((currentNavIndex) > 1) {
			$(".nav:nth-child(" + (currentNavIndex - 1) + ")").addClass('above');	
		};
		
		// add hidden-below
		var hiddenBelowCounter = currentNavIndex + 2;
		while (hiddenBelowCounter <= $(".nav").length) {
			$(".nav:nth-child(" + (hiddenBelowCounter) + ")").addClass('hidden-below');
			hiddenBelowCounter++;
		};
		
		// add hidden-above
		var	hiddenAboveCounter = currentNavIndex - 2;
		while (hiddenAboveCounter >= 0) {
			$(".nav:nth-child(" + (hiddenAboveCounter) + ")").addClass('hidden-above');
			hiddenAboveCounter--;
		};
			
	};		
	
	// NEED AN UPDATE INFO FUNCTION
	
});