//TREX GAme by Zaara using JS

//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var cactus, cactusGroup, cactusImage1, cactusImage2, cactusImage3, cactusImage4, cactusImage5, cactusImage6;
var PLAY, END, GAMESTATE;
var gameOver, overImage;
var restartIcon, iconImage;
var score, highScore, displayHS;
var jumpSound , dieSound, checkPointSound;

var newImage;
//Create Media library and load to use it during the course of the software //executed only once at the start of the program

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  cactusImage1 = loadImage("obstacle1.png");
  cactusImage2 = loadImage("obstacle2.png");
  cactusImage3 = loadImage("obstacle3.png");
  cactusImage4 = loadImage("obstacle4.png");
  cactusImage5 = loadImage("obstacle5.png");
  cactusImage6 = loadImage("obstacle6.png");

 overImage = loadImage("gameOver.png");
 iconImage = loadImage("restart.png");
  
  jumpSound =loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}
//define the initial environment of the software(before it is used) //by defining the declared variables with default values //executed only once at the start of the program
function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = true;
  trex.setCollider("circle",0,0,54);
  
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = createGroup();
  cactusGroup = createGroup();

  PLAY = 1;
  END = 0;
  GAMESTATE = PLAY;
  gameOver = createSprite(300,70,300,30);
  gameOver.addImage("overImage", overImage);
  gameOver.scale = 0.7;
  
  restartIcon = createSprite(300,130,20,20);
  restartIcon.addImage("restart", iconImage);
  restartIcon.scale = 0.5;
  
  score = 0;
  highScore = 0;
  displayHS = false;
}
//All commands to be executed and checked, continuously or applied throughout the program are written inside function draw. //function draw is executed for every frame created since the start of the program.
function draw() {
  background(250);

  if (GAMESTATE == PLAY) {
    
    //score calculation
    score = score +(Math.round(getFrameRate()/60)); 
    //condition to display high score
    if (displayHS == true) {
      text("High Score: "+highScore,450,70);
    }
    if(score%100 === 0){
      checkPointSound.play();
    }
    
    gameOver.visible = false;
    restartIcon.visible = false;
    
    //trex behavior
    trex.velocityY = trex.velocityY + 0.8
    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -10;
      jumpSound.play(); 
    }
 
    //ground behavior
    ground.velocityX = -(4+3*score/100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;    
    }
    //functionCall to create and give motion to clouds
    spawnClouds();

    //functionCall to create and give motion to cactus
    spawnCactus();
    
    //detecting collision between trex and cactus
    if (cactusGroup.isTouching(trex)){
     GAMESTATE = END;
      dieSound.play();  
     // trex.velocityY = -10;
     // jumpSound.play();    
    }

  } else if (GAMESTATE == END) {
    
    
    if(score > highScore ){
      highScore = score;
    }
    text("High Score: "+highScore,450,80);
    
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    ground.velocityX = 0;

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    
    cactusGroup.setVelocityXEach(0);
    cactusGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restartIcon.visible = true;
    if(mousePressedOver(restartIcon)){
      GAMESTATE = PLAY;
      cloudsGroup.destroyEach();
      cactusGroup.destroyEach();
      trex.changeAnimation("running", trex_running);
      displayHS = true;
    }
  }

  //display of score
  text(score,500,100)
  trex.collide(invisibleGround);

  drawSprites();

}

//functionDefinition to create and give motion to clouds
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage("cloudImage",cloudImage);
    cloud.y = Math.round(random(10, 60));
    cloud.scale = 0.5;
    cloud.velocityX = -3;


    //assigning lifetime to the variable
    cloud.lifetime = -(width / cloud.velocityX);

    //adjust the depth
    cloud.depth = trex.depth;   
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);

  }
}

//functionDefinition to create and give motion to cactus
function spawnCactus() {
  //write code here to spawn the cactus
  if (frameCount % 80 === 0) {
    cactus = createSprite(600, 160, 10, 40);
    cactus.velocityX = -(4+3*score/100);  
    switch (Math.round(random(1, 7))) {
      case 1:
        cactus.addImage("cactusImage1", cactusImage1);
        cactus.scale = 0.81;
        break;
      case 2:
        cactus.addImage("cactusImage2", cactusImage2);
        cactus.scale = 0.81;
        break;
      case 3:
        cactus.addImage("cactusImage3", cactusImage3);
        cactus.scale = 0.81;
        break;
      case 4:
        cactus.addImage("cactusImage4", cactusImage4);
        cactus.scale = 0.65;
        break;
      case 5:
        cactus.addImage("cactusImage5", cactusImage5);
        cactus.scale = 0.65;
        break;
      case 6:
        cactus.addImage("cactusImage6", cactusImage6);
        cactus.scale = 0.65;
        break;
      default:
        cactus.addImage("cactusImage1", cactusImage1);
        cactus.scale = 0.81;
        break;

    }


    //assigning lifetime to the variable
    cactus.lifetime = -(width / cactus.velocityX);
    cactusGroup.add(cactus);


  }
}