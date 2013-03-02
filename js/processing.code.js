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
  //lines = 90;
  lines = 45;
  subdivisions = 40;

  dampen = [
              0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.06, 0.08, 0.11,
              0.20, 0.35, 0.42, 0.85, 0.95, 1, 1, 0.70, 0.70, 0.70,
              0.55, 0.70, 0.80, 0.55, 0.50, 0.45, 0.35, 0.20, 0.16, 0.11,
              0.11, 0.08, 0.06, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.5
            ]

  smooth();
  stroke(255);
  fill(20, 20, 20);
  strokeWeight(1);
  offset = 0.1;

}


void draw() 
{
  
  if (control.paused == false) {

    
    background(20, 20, 20);   // Set the background to black

    var newTop = 0;
    var newLeft = 0;
    var noiseTop = 0;

    for (var i = 0; i < lines; i++) {

      newTop = (((middle.bottom - middle.top) / lines) * i) + middle.top;

      beginShape();

      curveVertex(middle.left, newTop);
      curveVertex(middle.left, newTop);

      for (var x = 1; x < subdivisions; x++) {

        newLeft = middle.left + ((middle.right - middle.left) / subdivisions * x);

        noiseTop = noise(newLeft, newTop+offset) * 100 * dampen[x-1];

        curveVertex(newLeft, newTop - noiseTop);
      }

      curveVertex(middle.right, newTop);
      curveVertex(middle.right, newTop);

      endShape();

      offset+=0.0025;
      //control.paused = true;

    }
    
  }

}

