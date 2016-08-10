$(document).ready(function() {
  function draw(){
        var canvas = document.getElementById('canvas1');
        if (canvas.getContext){
          var ctx = canvas.getContext('2d');
          //roundedRect(ctx,1,1,448,448,15);
          /*
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
*/




ctx.translate(100,100);
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(200,0);
ctx.moveTo(0,0);
ctx.lineTo(0,200);
ctx.stroke();
drawStar(ctx,30);




        }
  }


  function drawStar(ctx,r){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r,0);
    for (var i=0;i<9;i++){
      ctx.rotate(Math.PI/5);
      if(i%2 === 0) {
        ctx.lineTo((r/0.525731)*0.200811,0);
      } else {
        ctx.lineTo(r,0);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }



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

  draw();
});
