

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

    }
  }

  function checkWin(g) { // g for ground
      // -1 unfinished
      // 0 draw  // 1 1win
      // 10 10win
      'use strict';
      var arr = [ g.slice(0, 3),
                  g.slice(3, 6),
                  g.slice(6, 9),
                  [g[0], g[3], g[6]],
                  [g[1], g[4], g[7]],
                  [g[2], g[5], g[8]],
                  [g[0], g[4], g[8]],
                  [g[2], g[4], g[6]]
                ].map(function (e) {
              return e[0] + e[1] + e[2];
          });
      if (arr.includes(3)) {
          return 1;
      }
      if (arr.includes(30)) {
          return 10;
      }
      if (!g.includes(0)) {
          return 0;
      }
      return -1;
  }

  function canWin(g, pos, chess) { // g for ground

      // point g to a copy
      'use strict';
      g = Array.from(g);
      // play the move
      g[pos] = chess;
      //console.log(g);

      var check = checkWin(g),
          nexts = [],
          oppose = chess === 1 ? 10 : 1,
          oppose_AllLose = true,
          i;

      if (check !== -1) {
          return check;
      }

      // unfinished
      g.forEach(function (e, i) {
          if (e === 0) {
              nexts.push(i);
          }
      });

    // oppose's one move can win , oppose win
    // oppose's every move must lose, I win 

      for (i = 0; i < nexts.length; i = i + 1) {
          check = canWin(g, nexts[i], oppose);
         // console.log("check=" + check + " reburn by : canWin " + g + " ," + nexts[i] + " ," + oppose);
          if (check === oppose) {
              return check;
          }
          if (check === 0) {
              oppose_AllLose = false;
          }
      }
      if (oppose_AllLose === true) {
          return chess;
      }

      // or draw
      return 0;
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

      var check = checkWin(board);
      if (check != -1) {
        alert("Result: " + check);
        this.model.set('board',[0,0,0,0,0,0,0,0,0]);
        myGame.playerSide = myGame.playerSide === 1 ? 10 :1;
        myGame.computerSide = myGame.playerSide === 1 ? 10 : 1;
        if (myGame.computerSide === 1) {
          var pos = Math.floor(Math.random()*9);
          var board = _.clone(this.model.get("board"));

          board[pos] = myGame.computerSide;
          this.model.set('board', board);
        }
      }
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
    playerSide: 1, // 1 for X, 10 for O
    computerSide: 10
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
      myGame.computerSide = myGame.playerSide === 1 ? 10 : 1;

      if (myGame.playerSide === 1) {
        // do nothing, just wait player move
      } else {
        // computer take the first move
        var pos = Math.floor(Math.random()*9);
        var board = _.clone(this.model.get("board"));

        board[pos] = myGame.computerSide;
        this.model.set('board', board);
      }

    }
  });



  // Main Program
  drawBackground();

  var chess = new Chess;
  var chessView = new ChessView({
    model: chess
  });
  
  var optionsView = new OptionsView({
    model: chess
  });
  
  
});
