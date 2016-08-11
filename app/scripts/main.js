

$(document).ready(function() {

  // A utility function to draw a rectangle with rounded corners.
  function roundedRect(ctx,x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.arcTo(x,y+height,x+radius,y+height,radius);
  ctx.lineTo(x+width-radius,y+height);
  ctx.arcTo(x+width,y+height,x+width,y+height-radius,radius);
  ctx.lineTo(x+width,y+radius);
  ctx.arcTo(x+width,y,x+width-radius,y,radius);
  ctx.lineTo(x+radius,y);
  ctx.arcTo(x,y,x,y+radius,radius);
  ctx.stroke();
  }

  // A function to draw background-layer
  function drawBackground() {
    var canvas = document.getElementById('background-layer');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      roundedRect(ctx,1,1,448,448,15);
      ctx.beginPath();
      ctx.moveTo(150,0);
      ctx.lineTo(150,450);
      ctx.moveTo(300,0);
      ctx.lineTo(300,450);
      ctx.moveTo(0,150);
      ctx.lineTo(450,150);
      ctx.moveTo(0,300);
      ctx.lineTo(450,300);
      ctx.stroke();
    }
  }

  //A function to draw game-layer
  function draw() {
    var canvas = document.getElementById('game-layer');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(150,0);
        ctx.lineTo(150,450);
        ctx.moveTo(300,0);
        ctx.lineTo(300,450);
        ctx.moveTo(0,150);
        ctx.lineTo(450,150);
        ctx.moveTo(0,300);
        ctx.lineTo(450,300);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(175,25);
        ctx.lineTo(275,125);
        ctx.moveTo(275,25);
        ctx.lineTo(175,125);
        ctx.stroke();

        ctx.beginPath();
        //ctx.moveTo(125,75);
        ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
        ctx.moveTo(110,75);
        ctx.arc(75,75,35,0,Math.PI,false);  // Mouth (clockwise)
        ctx.moveTo(65,65);
        ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
        ctx.moveTo(95,65);
        ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
        ctx.stroke();




      /*
      var ctx = canvas.getContext('2d');
      var raf;

      var ball = {
      x: 100,
      y: 100,
      vx: 5,
      vy: 2,
      radius: 25,
      color: 'blue',
      draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      }
      };

      function draw() {
      //ctx.clearRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ball.draw();
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy *= .99;
      ball.vy += .25;

      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
      ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
      ball.vx = -ball.vx;
      }



      raf = window.requestAnimationFrame(draw);
      }

      canvas.addEventListener('mouseover', function(e){
      raf = window.requestAnimationFrame(draw);
      });

      canvas.addEventListener("mouseout",function(e){
      window.cancelAnimationFrame(raf);
      });

      ball.draw();
      */


    }
  }


  // A  Chess Model
  var Chess =Backbone.Model.extend({
    defaults: {
      "board":  [0,0,0
                ,0,0,0
                ,0,0,0]
    }
  });

  // A Chess View
  var ChessView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing canvas of
    // the App already present in the HTML
    el: $("#game-layer"),

    events: {
      "click": "userPlay",
      "touchstart ": "userPlay"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    // Rerender the #game-layer canvas
    render: function() {
      var canvas = this.el;
      var ctx = canvas.getContext('2d');
      var board = this.model.get("board");

      ctx.clearRect(0,0, canvas.width, canvas.height);

      board.forEach(function(val, index) {
        if (val === 0)
          return;
        ctx.save();
        ctx.translate(150 * (index % 3), 150 * (Math.floor(index / 3) % 3));
        if (val ===1) {
          // draw X
          ctx.beginPath();
          ctx.moveTo(25,25);
          ctx.lineTo(125,125);
          ctx.moveTo(125,25);
          ctx.lineTo(25,125);
          ctx.stroke();
        } else if(val === 10) {
          // draw O
          ctx.beginPath();
          ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
          ctx.moveTo(110,75);
          ctx.arc(75,75,35,0,Math.PI,false);  // Mouth (clockwise)
          ctx.moveTo(65,65);
          ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
          ctx.moveTo(95,65);
          ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
          ctx.stroke();
        }
        ctx.restore();
      });

      // Todo: if has a winner , draw a line
    },

    // User click or touch the chessboard, update the model
    userPlay: function(e) {
      var offset = this.$el.offset();
      var x = e.pageX  - offset.left;
      var y = e.pageY - offset.top;
      var pos = Math.floor(x / 150) + Math.floor(y / 150) *3;

      var board = _.clone(this.model.get("board"));

      if (board[pos] === 0) {
        // can play
        board[pos] = myGame.playerSide;
        this.model.set('board', board);
      }

      //if userWins,set this.model final = "You win"
      // and return

      //computer play
      //if computer wins, set this.model.final = "You lose"
//      this.model.set('board', newBoard);
      // and return

    }
  });

  var myGame = {
    playerSide: 1 // 1 for X, 10 for O
  }

  var OptionsView = Backbone.View.extend({
    el: $("#myModal"),
    events: {
      "hidden.bs.modal" : "chooseSide"
    },
    initialize: function() {
      this.$el.modal();
    },
    chooseSide: function() {
      myGame.playerSide = parseInt(this.$("input[type='radio']:checked").val());
      if (myGame.playerSide === 1) {
        // wait player move
      } else {
        // computer take the first move
      }

    }
  });



  // Main Program
  drawBackground();

  var chessView = new ChessView({
    model: new Chess
  });
  chessView.render();
  var optionsView = new OptionsView();
  //draw();
});
