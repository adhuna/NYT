var ws;

// Support both the WebSocket and MozWebSocket objects
if ((typeof(WebSocket) == 'undefined') &&
    (typeof(MozWebSocket) != 'undefined')) {
  WebSocket = MozWebSocket;
}

// Create the socket with event handlers
function init() {
  //Create and open the socket
  ws = new WebSocket("ws://localhost:6437/");
  
  // On successful connection
  ws.onopen = function(event) {
    /* If we want to do anything when we know we have successfully connected, do it here */
  };
  
  // Constant for storing frames (how many frames back do we store in the queue?
  var NUM_STORED_FRAMES = 15;
  // Global var that stores previous frames
  var frameQ = [];
  
  var PINCH_FRAMES = 5;
  
  // Global var for gesture end
  var gestureEnd = 0;       // timestamp of end of last gesture
  
  // Constants for swiping
  var SPEED_TRIGGER = 400;
  var PUNCH_SPEED_TRIGGER = 750;
  var MIN_SWIPE_POWER = 5000;
  var SWIPE_REST_TIME = 150000;
  var VERT_MULTIPLIER = 1.1;
  var MAX_PT_VDIFF = 1000;
  
  // Global vars for swiping
  var swiping = false;      // true if user is currently swiping
  var swipeStarted = false; // true if user has started a swipe-like motion
  var swipeDir = "";        // direction of swipe ("left", "right", "up", or "down")
  
  var swipeTurns = 0;
  var swipePower = 0;
  
  checkForPinch = function(obj) {
  	if (obj.timestamp - gestureEnd > SWIPE_REST_TIME) {
		if (obj.hands) {
			if (obj.pointables && Array.prototype.slice.call(obj.pointables).length >= 3) {
				for (var i = 1; i < PINCH_FRAMES; i++) {
					var oldHands = frameQ[NUM_STORED_FRAMES - i].hands;
					if (oldHands) {
						var oldPointables = Array.prototype.slice.call(frameQ[NUM_STORED_FRAMES - i].pointables);
						if (oldPointables.length <= 1) {
							document.getElementById("swipes").innerHTML += "<p>pinch out</p>";
							swipeStarted = false;
							swiping = false;
							gestureEnd = obj.timestamp;
							break;
						}
					}
				}
			} else {
				for (var i = 1; i < PINCH_FRAMES; i++) {
					var oldHands = frameQ[NUM_STORED_FRAMES - i].hands;
					if (oldHands) {
						var oldPointables = Array.prototype.slice.call(frameQ[NUM_STORED_FRAMES - i].pointables);
						if (oldPointables.length >= 3) {
							document.getElementById("swipes").innerHTML += "<p>pinch in</p>";
							swipeStarted = false;
							swiping = false;
							gestureEnd = obj.timestamp;
							break;
						}
					}
				}
			}
		}
	}
  };
  
  checkForSwipe = function(obj) {
  	if (!obj.hands && !obj.pointables) {
		return;
  	}
  	
  	var pointables = Array.prototype.slice.call(obj.pointables);
  	if (pointables.length > 0) {
  		var totXVelo = 0;
  		var totYVelo = 0;
  		for (var i = 0; i < pointables.length; i++) {
  			totXVelo += pointables[i].tipVelocity[0];
  			totYVelo += pointables[i].tipVelocity[1];
  		}
  		var avgXVelo = totXVelo / pointables.length;
  		var avgYVelo = totYVelo / pointables.length;
  		
  		if (avgXVelo > SPEED_TRIGGER) {
			if (swipeStarted && swipeDir == "right") {
				swipePower += Math.abs(avgXVelo);
				swipeTurns++;
				if (!swiping && swipePower > MIN_SWIPE_POWER) {
					swiping = true;
					/* Call swipe right */
				}
			} else if (obj.timestamp - gestureEnd > SWIPE_REST_TIME) {
				swipeStarted = true;
				swipePower = avgXVelo;
				swipeDir = "right";
				swipeStart = obj.timestamp;
			}
  		} else if (/*xVeloDiff < MAX_PT_VDIFF &&*/ avgXVelo < -1 * SPEED_TRIGGER) {
			if (swipeStarted && swipeDir == "left") {
				swipePower += Math.abs(avgXVelo);
				swipeTurns++;
				if (!swiping && swipePower > MIN_SWIPE_POWER) {
					swiping = true;
					/* Call swipe left */
				}
			} else if (obj.timestamp - gestureEnd > SWIPE_REST_TIME) {
				swipeStarted = true;
				swipePower = avgXVelo;
				swipeDir = "left";
				swipeStart = obj.timestamp;
			}
  		} else if (Math.abs(avgYVelo) > VERT_MULTIPLIER * Math.abs(avgXVelo)) {
			if (avgYVelo > SPEED_TRIGGER) {
				if (swipeStarted && swipeDir == "up") {
					swipePower += Math.abs(avgYVelo);
					swipeTurns++;
					if (!swiping && swipePower > MIN_SWIPE_POWER) {
						swiping = true;
						/* Call swipe up */
					}
				} else if (obj.timestamp - gestureEnd > SWIPE_REST_TIME) {
					swipeStarted = true;
					swipePower = avgYVelo;
					swipeDir = "up";
					swipeStart = obj.timestamp;
				}
			} else if (avgYVelo < -1 * SPEED_TRIGGER) {
				if (swipeStarted && swipeDir == "down") {
					swipePower += Math.abs(avgYVelo);
					swipeTurns++;
					if (!swiping && swipePower > MIN_SWIPE_POWER) {
						swiping = true;
						/* Call swipe down */
					}
				} else if (obj.timestamp - gestureEnd > SWIPE_REST_TIME) {
					swipeStarted = true;
					swipePower = avgYVelo;
					swipeDir = "down";
					swipeStart = obj.timestamp;
				}
			}
  		} else {
  			swipeStarted = false;
  			swiping = false;
  			swipePower = 0;
  			swipeTurns = 0;
  			swipeStart = 0;
  			swipeDir = "";
  		}
  	}
  };
  
  // Constants for pointing
  var PIXELS_PER_MM = 4.468;
  var Y_CORRECTION = 100;
  var Z_DIST_FROM_SCREEN = 300;
  
  /* Calculates position on screen that finger is pointing - place any pointing calls in here */
  updatePointers = function(obj) {
  
  	if (!obj.pointables) return;
  	
	var pointables = Array.prototype.slice.call(obj.pointables);
	
	if (!swiping) {
		if (pointables.length == 1) {
			var ptable = pointables[0];
			var px = $(window).width() / 2 - (PIXELS_PER_MM * ptable.tipPosition[0]);
			var py = $(window).height() - (PIXELS_PER_MM * (ptable.tipPosition[1] - Y_CORRECTION));
			var pz = PIXELS_PER_MM * (ptable.tipPosition[2] + Z_DIST_FROM_SCREEN);
			var dx = Math.tan(ptable.direction[0] * Math.PI / 4) * pz;
			var dy = Math.tan(ptable.direction[1] * Math.PI / 4) * pz;
			
			var sx = px - dx;
			var sy = py - dy;
		}
	}
	/*	
  	// Using finger angle
  	for (var i = 0; i < pointables.length; i++) {
  		var ptable = pointables[i];
  		var px = $(window).width() / 2 - (PIXELS_PER_MM * ptable.tipPosition[0]);
  		var py = $(window).height() - (PIXELS_PER_MM * (ptable.tipPosition[1] - Y_CORRECTION));
  		var pz = PIXELS_PER_MM * (ptable.tipPosition[2] + Z_DIST_FROM_SCREEN);
  		var dx = Math.tan(ptable.direction[0] * Math.PI / 4) * pz;
  		var dy = Math.tan(ptable.direction[1] * Math.PI / 4) * pz;
  		
  		// LOCATION OF FINGER POINT ON SCREEN IS (px - dx, py - dy)
  	}
  	*/
  };
  
  // On message received
  ws.onmessage = function(event) {
    var obj = JSON.parse(event.data);
    frameQ.push(obj);
    checkForPinch(obj);
    checkForSwipe(obj);
    //updatePointers(obj);
    if (frameQ.length > NUM_STORED_FRAMES) {
    	frameQ.shift();
    }
  };
  
  // On socket close
  ws.onclose = function(event) {
    ws = null;
    /* if we want to let user know that connection is closed, do it here */
  };
  
  //On socket error
  ws.onerror = function(event) {
    /* if we want to let user know that an error occurred, do it here */
  };
}

$(function() {
	init();
})