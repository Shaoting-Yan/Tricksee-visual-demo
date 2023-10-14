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
  //Arrow sizing
  p5.arrowSize = 70;
  p5.arrowWeight = 21;
  p5.gap = 70;
  p5.offset = p5.arrowSize + p5.gap;
  let wrapper = document.getElementById("VisualWindow");
  p5.setup = function(){
      p5.pixelDensity(1);
      p5.vw = wrapper.clientWidth;
      p5.vh = wrapper.clientHeight;
      p5.createCanvas(p5.vw,p5.vh,p5.WEBGL); 
      //view variables
      p5.camHeight = p5.height/2/p5.tan(p5.PI/6);
      p5.viewSize = p5.camHeight*Math.PI*2;
      p5.matrixSize = p5.int(p5.viewSize/p5.offset);
      //some buffer
      p5.fixedBoard = p5.createGraphics(p5.viewSize,p5.viewSize,p5.WEBGL);
      //Arrow instances
      p5.blueArrow = new Arrow(p5.arrowSize,p5.arrowWeight,p5.color('#2677BB'));
      p5.greenArrow = new Arrow(p5.arrowSize,p5.arrowWeight,p5.color('#457C39'));
      p5.flagged = util.random2D(p5.matrixSize,p5.matrixSize**2/5,2.5);
      p5.fixedBoard.translate(-p5.fixedBoard.width/2,-p5.fixedBoard.height/2);
      for(let i = 0;i < p5.matrixSize; i++){
      for(let j = 0;j < p5.matrixSize; j++){
          if(!p5.flagged[i][j]){
          p5.fixedBoard.push();
          p5.fixedBoard.translate(i*p5.offset,j*p5.offset);
          p5.blueArrow.display(p5.fixedBoard);
          p5.fixedBoard.pop();
          }
      }
      }
  }
  p5.draw = function(){
      let rotation = util.getEulerAngles(util.getRotationMatrix(p5.rotationZ,p5.rotationX,p5.rotationY));
      p5.Rz = rotation[0];
      p5.Ry = rotation[2];
      p5.Rx = rotation[1];  
      p5.clear();
      p5.moveObject();
      for(let i = 0;i < p5.matrixSize; i++){
      for(let j = 0;j < p5.matrixSize; j++){
          if(p5.flagged[i][j]){
          p5.push();
          p5.translate(-p5.viewSize/2+i*p5.offset,-p5.viewSize/2+j*p5.offset);
          p5.rotate(p5.Rz-p5.currRz-Math.PI/4);
          p5.greenArrow.display(p5);
          p5.pop();
          }
      }
      }
      p5.imageMode(p5.CENTER);
      p5.image(p5.fixedBoard,0,0);
      p5.moveCamera();
  }
  p5.moveCamera = util.moveCamera.bind(p5);
  p5.moveObject = util.moveObject.bind(p5);
  class Arrow {
    constructor(_size,_weight,_color){
      this.size = _size;
      this.weight = _weight;
      this.color = _color;
    }
    display(p5){
      p5.push();
      p5.translate(-this.size/2,-this.size/2);
      p5.strokeWeight(this.weight);
      p5.stroke(this.color);
      p5.strokeCap(p5.SQUARE);
      p5.strokeJoin(p5.MITER);
      p5.noFill();
      p5.line(0,0,0,this.size+this.weight/2);
      p5.line(-this.weight/2,this.size,this.size,this.size);
      p5.line(0,this.size,this.size,0);
      p5.pop();
    }
  }
}

export default App;