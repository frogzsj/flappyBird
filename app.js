$(document).ready(function() {

	var screenHeight = parseInt($(".screen").css("height"), 10);
	var screenWidth = parseInt($(".screen").css("width"), 10);
	
	var numOfObs = 0;
	var obsHoleHeight = 150;
	var obsWidth = parseInt($(".obsTop").css("width"), 10);
	var obsArray = [ ];
	var obsSpacing = 200;
	
	var birdInitialPos = parseInt($('.bird').css('bottom'), 10);
  var birdObj = {
	  bottomMargin: birdInitialPos,
		lastJump: 0
	};
	var birdHeight = parseInt($('.bird').css('height'), 10);
	
	var gameStatus = {
	  running: false
	}

	var intervalId;

	var gameLoop = function() {
    gameUpdateData();
    gameMoveThings();
	}

	var gameUpdateData = function() {
	  updateBird();
    updateObstacles();
	}

	var gameMoveThings = function() {
    //take info from objects, animate them
		moveBird();
    moveObstacles();
	}
	
	var updateBird = function() {
		var timeSinceJump = birdObj.lastJump + 1;
    var curBottom = birdObj.bottomMargin;
		var newBottom = curBottom - (timeSinceJump * 0.02);

		birdObj.lastJump = timeSinceJump;
		birdObj.bottomMargin = newBottom;
		
	}

  $(document).keypress(function(event) {
  	var curBottom = birdObj.bottomMargin;
  	
	  if (event.which === 32) {
		  birdObj.bottomMargin = curBottom + 75;
			birdObj.lastJump = 0;
		}

		if (birdObj.bottomMargin >= (screenHeight - birdHeight)) {
			gameOver();
		}
	});
	
	var updateObstacles = function() {
	  var curRight;
		var newRight;

		if (obsArray[0] === undefined) {
			addObstacle();
		}
    //get objects of obstacles, move them to the left 1px (don't animate yet)
    obsArray.forEach(function(curValue, index) {
      curRight = curValue.rightMargin;
      //console.log(curValue.rightMargin);
      newRight = curRight +  1;

    	if (newRight > screenWidth) {
    		removeObstacle(index);
    	} else {
    		curValue.rightMargin = newRight;
    	}
    });

    if (obsArray[obsArray.length - 1].rightMargin > obsSpacing) {
    	addObstacle();
    }
	}

	var moveBird = function() {
	  var bottomPropVal = birdObj.bottomMargin + "px";
		
		$('.bird').css('bottom', bottomPropVal);
		
		if (birdObj.bottomMargin <= 0) {
		  gameOver();
		}
  }
	
  var moveObstacles = function() {
  	var rightPropVal;
		
  	for (var key = 0; key < obsArray.length; key++) {
    if (obsArray[key].rightMargin === 0) {
    	$("#" + obsArray[key].Id).show();
    }
    if (obsArray[key].rightMargin === (screenWidth - obsWidth)) {
    	$("#" + obsArray[key].Id).hide();
    }
		
		rightPropVal = obsArray[key].rightMargin + "px";

    $("#" + obsArray[key].Id).find(".obsTop").css("right", rightPropVal);
    $("#" + obsArray[key].Id).find(".obsBottom").css("right", rightPropVal);
    }
  }
	function Obstacle(lastObs) {
		this.Id = "obs" + (lastObs + 1);
		numOfObs += 1; 

		var obsHolePosition = Math.random() * screenHeight;    // if <40 or >710, re-try
		while ((obsHolePosition < 80) || (obsHolePosition > 595)) {
			obsHolePosition = Math.random() * screenHeight;
		};

		this.TopHeight = screenHeight - obsHolePosition - (obsHoleHeight / 2);
		this.BottomHeight = screenHeight - this.TopHeight - obsHoleHeight; 
    this.rightMargin = -obsWidth;
		//alert(this.rightMargin);
	}

	var addObstacle = function() {
    var newestObs = new Obstacle(numOfObs);

    obsArray.push(newestObs);

    //adding div's for the obstacles
	  $(".screen").append("<div class=obs id=" + newestObs.Id + "></div>");
	  $("#" + newestObs.Id).append("<div class=obsTop></div>");
   	$("#" + newestObs.Id).append("<div class=obsBottom></div>");

    //setting heights of both pieces of the obstacle
    $("#" + newestObs.Id).find(".obsTop").css("height", newestObs.TopHeight + "px");
    $("#" + newestObs.Id).find(".obsBottom").css("height", newestObs.BottomHeight + "px");

    $("#" + newestObs.Id).find(".obsTop").css("right", newestObs.rightMargin + "px");
    $("#" + newestObs.Id).find(".obsBottom").css("right", newestObs.rightMargin + "px");

    $("#" + newestObs.Id).hide();
	};

	var removeObstacle = function(firstObs) {
	  $('#' + obsArray[firstObs].Id).remove();
    obsArray.shift();
	}

	var gameOver = function() {
	  gameStatus.running = false;
		alert("Game Over...");
		clearInterval(intervalId);
		for (var key = obsArray.length - 1; key >= 0; key--) {
		  $('#' + obsArray[key].Id).remove();
			obsArray.pop();
		}
	}

	$("#start").click(function() {
	  if (!gameStatus.running) {
      birdObj.bottomMargin = birdInitialPos;
			birdObj.lastJump = 0;
			gameStatus.running = true;
    }
		
		//console.log("array", obsArray);
		if (intervalId !== undefined) {
			clearInterval(intervalId);
		}
		intervalId = setInterval(gameLoop, 5);
		//have to clear interval Id, but don't know how yet? 
  });

  $("#stop").click(function() {
  	gameOver();
  });
});