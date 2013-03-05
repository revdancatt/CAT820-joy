void setup() 
{
  size(640, 640);  // Size should be the first statement
  frameRate(24);

  middle = {
    top: height / 100 * 24,
    bottom: height - (height / 100 * 21),
    left: width / 100 * 27,
    right: width - (width / 100 * 27)
  };

  smooth();
  stroke(255);
  strokeWeight(1);

  fill(16, 16, 16);
  if (control.happy) {
    fill(0, 0, 6);
  }
}


void draw() 
{
  
  if (control.paused == false) {

    //  set the colour mode
    if (control.happy) {
      colorMode(HSB, 100);
      background(0, 0, 6);   // Set the background to black
    } else {
      stroke(255);
      colorMode(RGB, 255);
      background(16, 16, 16);   // Set the background to black
    }

    //  we'll be using these in a moment
    var newTop = 0;
    var newLeft = 0;
    var noiseTop = 0;

    //  go down each of the lines starting at the top and
    //  working down.
    for (var i = 0; i < control.lines; i++) {

      //  if we are happy set the stroke colour
      if (control.happy) {
        stroke(i/control.lines*100, 100, 100);
      }

      //  work out how far down this line should be drawn
      newTop = (((middle.bottom - middle.top) / control.lines) * i) + middle.top;


      //  draw it
      beginShape();

      curveVertex(middle.left, newTop);
      curveVertex(middle.left, newTop);

      //  If we are being all random do the 1st option, but if we are
      //  tracking music, then do the 2nd option which is tracking the
      //  music
      if (!control.audioPlaying) {
        for (var x = 1; x < control.subdivisions; x++) {

          //  draw the line, dampening it according to our great plan.
          newLeft = middle.left + ((middle.right - middle.left) / control.subdivisions * x);
          noiseTop = noise(newLeft, newTop+control.offset) * 100 * control.dampen[x-1];
          curveVertex(newLeft, newTop - noiseTop);

        }
      } else {
        for (var x = 1; x < control.subdivisions; x++) {

          //  pull the (already dampened) data from the line data
          //  that has been stored based on the spectrum stuff.
          newLeft = middle.left + ((middle.right - middle.left) / control.subdivisions * x);
          noiseTop = control.lineData[i][x-1];
          curveVertex(newLeft, newTop - noiseTop);

        }

      }

      //  finish off the shape.
      curveVertex(middle.right, newTop);
      curveVertex(middle.right, newTop);

      endShape();

    }

    //  move all the lines down
    if (control.audioPlaying) {
      control.popLines();
    }
    
    //  adjust the offset which *wiggles* the random lines.
    control.offset+=0.1;
    
  }

}

