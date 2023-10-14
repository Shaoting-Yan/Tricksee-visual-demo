import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import * as util from "./util";


function App(props) {
  return (
    <div>
      <div className="u-fill">
        <ReactP5Wrapper 
          sketch={sketch} 
        />
      </div>
    </div>
  )
}

function sketch(p5){
  //motion parameter
  p5.he = 3;
  p5.sw = 3;
  p5.su = 2;
  p5.da = 15;
  let thickness = 80;
  let offset = thickness*2.25;
  let wrapper = document.getElementById("VisualWindow");
  p5.setup = function(){
      p5.pixelDensity(1);
      p5.vw = wrapper.clientWidth;
      p5.vh = wrapper.clientHeight;
      p5.createCanvas(p5.vw,p5.vh); 
      //view variables
      p5.camHeight = p5.vh/2/p5.tan(p5.PI/6);
      p5.viewSize = p5.camHeight*Math.PI*2;
      p5.matrixSize = p5.int(p5.viewSize/offset);
      //controlPoints
      p5.midPoint = {x:0,y:p5.vh*(2/5)};
      p5.controlPoint = {x:0,y:p5.vh*(3/5)};
      p5.radius = p5.vh-p5.midPoint.y-thickness/2;
  }
  p5.draw = function(){
      let rotation = util.getEulerAngles(util.getRotationMatrix(p5.rotationZ,p5.rotationX,p5.rotationY));
      p5.Rz = rotation[0];
      p5.Ry = rotation[2];
      p5.Rx = rotation[1];  
      //camera move due to up and down
      let Ay = p5.accelerationY;
      let Ax = p5.accelerationX;
      let dy = p5.he*Math.sign(Ay)*(Math.abs(Ay)**1.5);
      p5.accY = p5.accY == null ? 0 : p5.accY+dy;
      if (p5.accY != 0){                                        
      p5.accY -= p5.accY/p5.da; //damping
      }
      p5.clear();
      p5.push();
      p5.translate(p5.width/2,p5.vh/2);
      p5.rotate(Math.PI/2-p5.Rz);
      p5.translate(-p5.viewSize/2,0);//get to center of the view
      let currX = p5.camHeight*p5.Ry;
      p5.translate(currX,0);//for yaw rotation
      //tiling buffer
      p5.blendMode(p5.MULTIPLY);
      for(let i=0;i<p5.matrixSize;i++){
      p5.push();
      p5.translate(i*offset,0);
      drawWire(p5,thickness);
      p5.pop();
      }
      p5.pop();
  }
  function drawWire(p5,thickness){
    p5.push();
    p5.translate(p5.width/2,-p5.vh/2);
    p5.noFill();
    p5.stroke('#2677BB');
    p5.strokeWeight(thickness);
    p5.beginShape();
      p5.vertex(p5.cos(p5.Rz)*p5.radius,p5.midPoint.y+p5.sin(p5.Rz)*p5.radius);
      p5.quadraticVertex(p5.controlPoint.x,p5.controlPoint.y,p5.midPoint.x,p5.midPoint.y);
      p5.vertex(0,-100);  
    p5.endShape();
    p5.stroke('#DE3D83');
    p5.line(p5.midPoint.x,p5.midPoint.y+p5.accY,p5.midPoint.x,p5.vh+100);
    p5.pop();
  }
  p5.moveCamera = util.moveCamera.bind(p5);
  p5.moveObject = util.moveObject.bind(p5);
}

export default App;