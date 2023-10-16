import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "./Visual.css";
import * as util from "./util";

function App(props) {
  return (
    <div>
      <div className="u-fill">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{}}
        />
      </div>
    </div>
  )
}

function sketch(p5){
  p5.updateWithProps = props => {
  }
  let wrapper = document.getElementById("VisualWindow");
  p5.moveCamera = util.moveCamera.bind(p5);
  p5.moveObject = util.moveObject.bind(p5);
  p5.setup = function(){
    p5.pixelDensity(1);
    p5.vw = wrapper.clientWidth;
    p5.vh = wrapper.clientHeight;
    p5.createCanvas(p5.vw,p5.vh,p5.WEBGL); 
    p5.mountain = p5.loadImage("mountain.png");
    //view variables
    p5.camHeight = p5.height/2/p5.tan(p5.PI/6);
    //motion parameter
    p5.he = 3;
    p5.sw = 3;
    p5.su = 2;
    p5.da = 10;
  }
  
  p5.draw = function(){
    let rotation = util.getEulerAngles(util.getRotationMatrix(p5.rotationZ,p5.rotationX,p5.rotationY));
    p5.Rz = rotation[0];
    p5.Ry = rotation[2];
    p5.Rx = rotation[1];  
    p5.clear();
    p5.background("red");
    p5.moveCamera();
    p5.moveObject();
    p5.noStroke();
    p5.box(100);
    p5.image(p5.mountain,0,-100);
  }
}

export default App;
