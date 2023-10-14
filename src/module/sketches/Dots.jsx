import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "./Dots.css";
import * as util from "./util";

function App(props) {
  return (
    <div>
      <div className="u-fill layer2">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{turnMag:0,accMag:0,zHeight:0,
                 col:'#DE3D83',elementRatio:1.75}}
        />
      </div>
      <div className="u-fill layer1">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{turnMag:60,accMag:1.5,zHeight:-30,
                 col:'#2677BB',elementRatio:2}}
        />
      </div>
      <div className="u-fill layer0">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{turnMag:40,accMag:1,zHeight:-60,
                 col:'#00B8B8',elementRatio:2.25}}
        />
      </div>
    </div>
  )
}

function sketch(p5){
  p5.turnMag = 0;
  p5.accMag = 0; 
  p5.zHeight = 0;
  p5.col = 0;
  p5.gridRatio = 5;
  p5.elementRatio = 0;
  p5.updateWithProps = props => {
    if(props.misc){
      p5.turnMag = props.misc.turnMag;
      p5.accMag = props.misc.accMag; 
      p5.zHeight = props.misc.zHeight;
      p5.col = props.misc.col;
      p5.elementRatio = props.misc.elementRatio;
    }
  }
  let wrapper = document.getElementById("VisualWindow");
  p5.moveCamera = util.moveCamera.bind(p5);
  p5.moveObject = util.moveObject.bind(p5);
  p5.setup = function(){
    p5.pixelDensity(1);
    p5.vw = wrapper.clientWidth;
    p5.vh = wrapper.clientHeight;
    p5.createCanvas(p5.vw,p5.vh,p5.WEBGL); 
    //view variables
    p5.camHeight = p5.height/2/p5.tan(p5.PI/6);
    p5.viewSize = p5.camHeight*Math.PI*2;
    //motion parameter
    p5.he = 3;
    p5.sw = 3;
    p5.su = 2;
    p5.da = 10;
    //grid sizing
    p5.offset = p5.width/p5.gridRatio;
    p5.size = p5.int(p5.viewSize/p5.offset);
  }
  
  p5.draw = function(){
    let rotation = util.getEulerAngles(util.getRotationMatrix(p5.rotationZ,p5.rotationX,p5.rotationY));
    p5.Rz = rotation[0];
    p5.Ry = rotation[2];
    p5.Rx = rotation[1];  
    p5.clear();
    // p5.ortho();
    p5.moveCamera();
    p5.turnV = p5.createVector(Math.cos(p5.noise(p5.frameCount/500)*2*Math.PI),
                            Math.sin(p5.noise(p5.frameCount/500)*2*Math.PI)).setMag(p5.turnMag);//turning
    p5.accV = p5.createVector(p5.accX,p5.accY).mult(p5.accMag);
    p5.moveObject();
    p5.push();
    // p5.imageMode(p5.CENTER);
    p5.sumV = p5.constructor.Vector.add(p5.accV, p5.turnV);
    p5.translate(-p5.viewSize/2,-p5.viewSize/2,p5.zHeight);
    for(let i = 0;i<p5.size;i++){
      for(let j = 0;j<p5.size;j++){
        p5.push();
        p5.noStroke();
        p5.fill(p5.col);
        p5.translate(i*p5.offset+p5.sumV.x,j*p5.offset+p5.sumV.y);
        p5.circle(0,0,p5.offset/p5.elementRatio);
        p5.pop();
      }
    }
    p5.pop();
  }
}

export default App;
