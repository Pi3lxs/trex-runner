var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage;
var ob1,ob2,ob3,ob4,ob5,ob6;
var cloudsGroup,obstaclesGroup;
var gameOver,restart,gameOverIMG,restartIMG
var die, jump, check
var count

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  cloudImage = loadImage("cloud.png");
  gameOverIMG = loadImage("gameOver.png")
  restartIMG = loadImage("restart.png")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  check = loadSound("checkPoint.mp3")
  
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");             
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
                
  groundImage = loadImage("ground2.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = createGroup();
  obstaclesGroup = createGroup();
  
  gameOver = createSprite(300,80,10,10)
  gameOver.addImage(gameOverIMG)
  gameOver.visible = false
  restart = createSprite(300,120,10,10)
  restart.addImage(restartIMG)
  restart.visible = false
  restart.scale = .8
  
  count = 0
}

function draw() {
  background(250);
  textSize(18);
  text("score "+count,500,50);
  
  
  
  if (gameState===PLAY){
    ground.velocityX = -(6+Math.round(count/100))
    count = count+Math.round(getFrameRate()/60)
    //console.log(trex.y)
    
      if((keyDown("space")||keyDown(UP_ARROW)) && trex.y >= 160) {
        trex.velocityY = -13;
        jump.play();
  }
    ground.velocityX = -(6+Math.round(count/100))
    
   trex.velocityY = trex.velocityY + 0.8
  
    if (count%100===0&&count>0){
        check.play();
        }
    
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  
  spawnClouds();
  spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
    gameState = END;
      die.play();
      //trex.velocityY = -12
    }
  }
  else if(gameState===END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided");
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    
    if (mousePressedOver(restart)){
    reset();
  }
  //stop trex from falling down
  
    
    
  }
  trex.collide(invisibleGround);
  drawSprites();
}
function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.addImage(cloudImage)
     
    cloud.lifetime = 220;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6+Math.round(count/100));
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(ob1);break
      case 2: obstacle.addImage(ob2);break
      case 3: obstacle.addImage(ob3);break
      case 4: obstacle.addImage(ob4);break
      case 5: obstacle.addImage(ob5);break
      case 6: obstacle.addImage(ob6);break
      default:break
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 140;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
  function reset(){
  gameState = PLAY;
  gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running");
    cloudsGroup.destroyEach();
    obstaclesGroup.destroyEach();
    count = 0;
}