var topic = {};

$(document).ready(function() {
			
	topic.change = function(direction) {	
		switch (direction) { 
		    case 'left': 
		    	updateInfo('left');
		        preview('left', 'right');
		        break;
		    case 'right': 
		        updateInfo('right');
		        preview('right', 'left');
		        break;
		    case 'up': 
		        updateInfo('up');
		    	navigation('up');
		        preview('up', 'down');
		        break;
		    case 'down': 
		        updateInfo('down');
		    	navigation('down');
		        preview('down', 'up');
		        break;
		    default:
		        break;
		};
	};
	
	function updateInfo(direction) {
	
		if (direction === "left") { 
			if (info.indexes[info.topic].index === info.indexes[info.topic].max) {
				info.indexes[info.topic].index = 0;
			} else {
				info.indexes[info.topic].index++;
			};	
		};
		
		if (direction === "right") {
			if (info.indexes[info.topic].index === 0) { 
				info.indexes[info.topic].index = info.indexes[info.topic].max;
			} else {	
				info.indexes[info.topic].index--;
			};	
		};
		
		if (direction === "up") {
			if ( (jQuery.inArray(info.topic, info.topics) + 1) !== info.topics.length ) {
				info.topic = info.topics[(jQuery.inArray(info.topic, info.topics) + 1)];
			} else {
				info.topic = info.topics[0];
			};		
		};
		
		if (direction === "down") {
			if ( (jQuery.inArray(info.topic, info.topics) - 1) !== -1 ) {
				info.topic = info.topics[(jQuery.inArray(info.topic, info.topics) - 1)];
			} else {
				info.topic = info.topics[info.topics.length - 1];
			};	
		};
						
	};
	
	
	function navigation(direction) {
	
		var navArray = [];
		$(".nav").each(function() {
			var navClass = $(this).classes();
			navArray.push(navClass[0]);
		});
		
		var navLength = $(".nav").length;
		
		$(".nav").each(function() {
			var newClass;
			if (direction === "up") {
				var index = $(this).index() - 1;
				if (index >= 0) {
					newClass = navArray[index];	
				} else {
					newClass = navArray[navArray.length - 1];
				};	
			};
			if (direction === "down") {
				var index = $(this).index() + 1;
				if (index < navLength) {
					newClass = navArray[index];	
				} else {
					newClass = navArray[0];
				};	
			};
			$(this).removeClass().addClass('nav ' + newClass);
		});
		
	};
	
	
	var animation;	
	function preview(class_out, class_in) {
		
		// stops all prior animation
		clearTimeout(animation);
			
		// exits the old article(s)
		var oldArticle = $(".article-preview");
		oldArticle.addClass(class_out);
		
		// adds new article
		var newArticle = data[info.topic][info.indexes[info.topic].index];
		
		$("#topic").append('<div class="article-preview ' + class_in + '"><img src="' + newArticle.image + '" /><div class="article-preview-description"><p>' + newArticle.title + '</p></div><div class="article-preview-time"><p>' + newArticle.time + '</p></div></div>');
			 
		// removes old article(s) & enters the new article
		// If I can pass context all is good
		animation = setTimeout(function() {
			oldArticle.remove();
			$(".article-preview").removeClass(class_in);
		}, 400);
		
	};
	
	//FULL ARTICLE VIEW
	
	topic.expandArticle = function() {
		currentScreen = "article";
		article.setup();
		$("#topic").removeClass('active').addClass('hidden');
		setTimeout(function() {
			$('#article').css('display', 'block');
			$('#article-nav').css('display', 'block');
			setTimeout(function () {
				$("#article").removeClass('hidden').addClass('active');	
			}, 50);
			setTimeout(function () {
				$("#article-nav").removeClass('hidden').addClass('active');
			}, 1000);
		}, 1000);
	};
	
	topic.shrinkArticle = function() {
		currentScreen = "topic";
		$("#article").removeClass('active').addClass('hidden');
		$("#article-nav").removeClass('active').addClass('hidden');
		setTimeout(function() {
			$('#topic').css('display', 'block');
			setTimeout(function () {
				$("#topic").removeClass('hidden').addClass('active');	
			}, 50);
		}, 1000);
	};
	
	topic.showShareOptions = function() {
		currentScreen = "shareOptions";
		$('#navigation, #article-preview-arrow-down, #article-preview-arrow-up').fadeTo(500, 0); 
		$('#share-options-container').css('display', 'block');
		setTimeout(function() {
			$('#share-options-container').addClass('active');	
		}, 50);
	};
		
	topic.hideShareOptions = function() {
		currentScreen = "topic";
		$('#navigation, #article-preview-arrow-down, #article-preview-arrow-up').fadeTo(500, 1);
		$('#share-options-container').removeClass('active');
	};
	
	topic.showText = function() {
		currentScreen = "shareText";
		$('#article-preview-arrow-left').fadeTo(500, 0); 
		
		$('#share-options-container').removeClass('active');
		$('.article-preview').addClass('text');
		$('#share-text-container').css('display', 'block');
		setTimeout(function() {
			$('#share-text-container').addClass('active');	
		}, 50);
	};
	
	topic.hideText = function() {
		currentScreen = "shareOptions";
		$('#article-preview-arrow-left').fadeTo(500, 1); 
		
		$('#share-text-container').removeClass('active');
		setTimeout(function() {
			$('#share-text-container').css('display', 'none');	
		}, 700);
		$('.article-preview').removeClass('text');
		$('#share-options-container').addClass('active');
	};
	
	topic.showEmail = function() {
		currentScreen = "shareEmail";
		$('#article-preview-arrow-right').fadeTo(500, 0);
		
		$('#share-options-container').removeClass('active');
		$('.article-preview').addClass('email');
		
		$('#share-email-container').css('display', 'block');
		setTimeout(function() {
			$('#share-email-container').addClass('active');	
		}, 50);
	};
	
	topic.hideEmail = function() {
		currentScreen = "shareOptions";
		$('#article-preview-arrow-right').fadeTo(500, 1);
		
		$('#share-email-container').removeClass('active');
		setTimeout(function() {
			$('#share-email-container').css('display', 'none');	
		}, 700);
		$('.article-preview').removeClass('email');
		$('#share-options-container').addClass('active');
	};
	
	topic.shareText = function() {
		$('#share-text-container').addClass('sent');
			 
		setTimeout(function() {	
			currentScreen = "topic";
			$('#article-preview-arrow-left, #navigation, #article-preview-arrow-down, #article-preview-arrow-up').fadeTo(500, 1);
			$('#share-text-container').removeClass('active');
			setTimeout(function() {
				$('#share-text-container').css('display', 'none');	
				$('#share-text-container').removeClass('sent');
			}, 700);
			$('.article-preview').removeClass('text');
			$('#share-options-container').removeClass('active');
		}, 1000);
	};
	
	topic.shareEmail = function() {
		var name = "You've been recommended an article from the NYT";
		var email = $('#share-email-input').val();
		var link = data[info.topic][info.indexes[info.topic].index].image;
		var varData = 'name=' + name + '&email=' + email + '&link=' + link;
		
		//Should replace this with a loading screen
		$('#share-email-container').addClass('sent');
		setTimeout(function() {	
			currentScreen = "topic";
			$('#article-preview-arrow-right, #navigation, #article-preview-arrow-down, #article-preview-arrow-up').fadeTo(500, 1);
			$('#share-email-container').removeClass('active');
			setTimeout(function() {
				$('#share-email-container').css('display', 'none');	
				$('#share-email-container').removeClass('sent');
			}, 700);
			$('.article-preview').removeClass('email');
			$('#share-options-container').removeClass('active');
		}, 1000);		
		
		$.ajax({
			type: "POST",
			url:'mail.php',
			data: varData,
			success: function() {
				// should have the above function here	
			},
			error: function() {
				//$('#share-email-container').addClass('error'); 				
			}
		});
	};
});

// adds function .classes() to elements
(function($){
    $.fn.classes = function(f) {
        var c = [];
        $.each(this, function(i, v) {
            var _ = v.className.split(/\s+/);
            for(var j in _)
                '' === _[j] || c.push(_[j]);
        });
        c = $.unique(c);
        if ("function" === typeof f)
            for(var j in c)
                f(c[j]);
        return c;
    };
})(jQuery);

