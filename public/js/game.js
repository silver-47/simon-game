let gamePattern = [];
let userPattern = [];

let started = false;
let level = 0;

$(".game h4").click(function() {
  $(".rules").show();
  $(".game").hide();
});

$(".rules button").click(function() {
  $(".rules").hide();
  $(".game").show();
});

$(".btn").click(function() {
  if (!started) {
    $(".game h1").hide();
    $("#level-title").css('font-size', '50px').text("Level 1");
    setTimeout(function() {nextSequence();}, 500);
    started = true;
  } else {
    const userChosenColour = $(this).attr("id");
    userPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userPattern.length - 1);
  }
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userPattern[currentLevel]) {
    if (userPattern.length === gamePattern.length)
      setTimeout(function() {nextSequence();}, 1000);
  } else {
    $(".btn").unbind();
    $("#level-title").text("Game Over");
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {$("body").removeClass("game-over");}, 500);
    setTimeout(function() {$("#level-title").text("Game Over");}, 500);
    setTimeout(function() {$("#level-title").text("Game Over");}, 1000);
    $.post(window.location.pathname, {score: level-1});
  }
}


function nextSequence() {
  userPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  let randomChosenColour = 'red';
  switch (Math.floor(Math.random() * 4) + 1) {
    case 1: randomChosenColour='green'; break;
    case 2: randomChosenColour='red'; break;
    case 3: randomChosenColour='yellow'; break;
    case 4: randomChosenColour='blue'; break;};
  gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {$("#" + currentColor).removeClass("pressed");}, 100);
}

function playSound(name) {
  new Audio("/assets/sounds/" + name + ".mp3").play();
}
