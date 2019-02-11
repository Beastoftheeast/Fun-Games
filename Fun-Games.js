/*
    Author: Seth Neds
      Date: 6/16/18
*/

/* ------ Variables ------- */

// Game Screen
 var cvs = document.getElementById('canvas');
 var ctx = cvs.getContext("2d");

// Game images
var imgWorkerR          = new Image();
var imgWorkerL          = new Image();
var imgWorkerLHit       = new Image();
var imgWorkerRHit       = new Image();
var imgWorkerLLowHit    = new Image();
var imgWorkerRLowHit    = new Image();
var imgWorkerLInvisible = new Image();
var imgWorkerRInvisible = new Image();
var imgBackground       = new Image();
var imgBrick            = new Image();
var imgStart            = new Image();
var imgLevel2           = new Image();
var imgGameOver         = new Image();

// Set the image source
imgWorkerR.src          = "images/workerRight.png";
imgWorkerL.src          = "images/workerLeft.png";
imgWorkerRHit.src       = "images/workerRightHit.png";
imgWorkerLHit.src       = "images/workerLeftHit.png";
imgWorkerRLowHit.src    = "images/workerRightLowHit.png";
imgWorkerLLowHit.src    = "images/workerLeftLowHit.png";
imgWorkerLInvisible.src = "images/workerLeftInvisible.png";
imgWorkerRInvisible.src = "images/workerRightInvisible.png";
imgBackground.src       = "images/background.png";
imgBrick.src            = "images/brick.png";
imgStart.src            = "images/start.png";
imgLevel2.src           = "images/level2.png";
imgGameOver.src         = "images/gameOver.png";

// Game Settings
 var score = 0;
 var LEFT_LIMIT = 0;
 var RIGHT_LIMIT = cvs.width;
 var workerManX = 290;
 var heightOfHead = 20;
 var workerManSpeed = 20;
 var brickDelay = 40;
 var walkingDirection = "right";
 var isGameOver = false;
 var isInvisible = false;
 var invisibilityLength = 10;
 var invisibilityLeft = 1; // Limits invisibility to one use per game.
 var injuryType = "";
 var signWidth = 300;
 var level = 1;


// Audio files
// var audioMove  = new Audio();
// var audioScore = new Audio();

// audioMove.src  = "sounds/fly.mp3";
// audioScore.src = "sounds/score.mp3";

// Create your game controller
document.addEventListener("keydown", (event) => {

    event.preventDefault();
    // Figure out what key was pressed
    var key = event.key || event.keyCode || event.which;

    // Restart the game when any key is pressed
    if (isGameOver) {
        if (event.key == "Enter") {
			window.location.hash = "#canvas";
            location.reload();
        }
    }
    else if (key == "i" || key == 105) // The letter "i"
    {
        if (invisibilityLeft > 0) {
            isInvisible = true;
        }
    }   
    else
    {
        switch (key) {
            case "37":
            case "Left": // Microsoft Edge
            case "ArrowLeft":
                // Move worker man left
                if (workerManX - workerManSpeed > LEFT_LIMIT) {
                    walkingDirection = "left";
                    workerManX -= workerManSpeed;

                }
                break;

            case "39":
            case "Right": // Microsoft Edge
            case "ArrowRight":
                // Move worker man right
                if (workerManX + imgWorkerR.width + workerManSpeed < RIGHT_LIMIT) {
                    walkingDirection = "right";
                    workerManX += workerManSpeed;
                }
                break;
        }
    }
      
});

// Arrays
var brick = [];
brick [0] = {
    x : 290,
    y : 0
}

// Function to make sure images
function draw(ctx,image,imageX,imageY){
    // Check to see if the image is loaded
    if (!image.complete){
        setTimeout(function(){
            draw(ctx,image,imageX,imageY);
        }, 50);
        return;
    }
    else {
        // Once the image is loaded, draw onto the canvas  
        ctx.drawImage(image, imageX, imageY);
    }
    
}

function startGame(){
    // Draw the background
    draw(ctx,imgBackground,0,0);

    if (isGameOver)
    {
        for (var i = 0; i < brick.length; i++)
        {
            // Draw the bricks
			draw(ctx,imgBrick,brick[i].x,brick[i].y);
        }
        switch (walkingDirection){
            case "right":
                if (injuryType == "head"){
				draw(ctx,imgWorkerRHit,workerManX, cvs.height - imgWorkerR.height);
                }
                else{
				draw(ctx,imgWorkerRLowHit,workerManX, cvs.height - imgWorkerR.height);
                }
            break;
    
            case "left":
                if (injuryType == "head"){
				draw(ctx,imgWorkerLHit,workerManX, cvs.height - imgWorkerL.height);
                }
                else{
				draw(ctx,imgWorkerLLowHit,workerManX, cvs.height - imgWorkerL.height);
                }
            break;
        }


    }
    else
    {
        switch (walkingDirection){
            case "right":
                if (!isInvisible)
                {
					draw(ctx,imgWorkerR,workerManX,cvs.height - imgWorkerR.height);
                }
                else
                {
					draw(ctx,imgWorkerRInvisible,workerManX,cvs.height - imgWorkerR.height);
                }
            break;
    
            case "left":
                if (!isInvisible)
                {
					draw(ctx,imgWorkerL,workerManX,cvs.height - imgWorkerL.height);
                }
                else
                {
					draw(ctx,imgWorkerLInvisible,workerManX,cvs.height - imgWorkerL.height);
                }
            break;
        }
    
        draw(ctx,imgBrick,brick[0].x,brick[0].y);
        
        for (var i = 0; i < brick.length; i++)
        {
            // Draw the bricks
            draw(ctx,imgBrick,brick[i].x,brick[i].y);
    
            brick[i].y++;
    
            if (brick[i].y == brickDelay)
            {
                brick.push({
                    x : Math.floor(Math.random() * (cvs.width - imgBrick.width)),
                    y : 0
                });
    
            }

            if (brick[i].y == canvas.height)
            {
                score += 1;
				//score++;
				
                // Invisibility Timer based on Bricks
                if (isInvisible && invisibilityLength > 0)
                {
                    invisibilityLength--;
                }

                // Disable Invisibility
                if (isInvisible && invisibilityLength <= 0 && invisibilityLeft <= 0)
                {
                    isInvisible = false;
                }
				else if(isInvisible && invisibilityLength <= 0 && invisibilityLeft > 0){
					invisibilityLength = 10;
					invisibilityLeft--;
				}
				
				// New level
				if (score == 15){
					brickDelay -= 38;
					level++;
					invisibilityLeft = level;
				}
				
                //audioScore.play();
            }

            if (!isInvisible) {
                // Detect Collision
                if ((brick[i].y + imgBrick.height >= cvs.height - imgWorkerR.height && brick[i].y + imgBrick.height <= cvs.height - 20)
                    && (brick[i].x >= workerManX && brick[i].x <= workerManX + imgWorkerR.width)
                    && (brick[i].x + imgBrick.width >= workerManX && brick[i].x <= workerManX + imgWorkerR.width)
                ) {
                    if (brick[i].y + imgBrick.height >= cvs.height - imgWorkerR.height && brick[i].y + imgBrick.height <= cvs.height - (imgWorkerR.height - heightOfHead)) {
                        injuryType = "head";
                    }

                    isGameOver = true;
                }
            }
        }
    }

    // Draw the scoreboard
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score: " + score,20,40);
	
	// Draw the Levels
	ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Level: " + level,cvs.width - 100,40);

    requestAnimationFrame(startGame);
}

function loadSplashScreen(){
    draw(ctx, imgBackground, 0, 0);
    draw(ctx, imgStart, Math.floor((cvs.width / 2) - (signWidth/2)),0);
}
 
function buttonStart()
{
	document.getElementById("btnStart").style.visibility = "hidden";
	document.getElementById("btnStart").disabled = true;
    loadSplashScreen();
    setTimeout(function(){
        startGame();
    },2000);
}

if(location.hash == "#canvas")
{
	buttonStart();
}
