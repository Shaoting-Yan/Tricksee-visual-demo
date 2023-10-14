import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "./Car.css";
import * as util from "./util";


function App(props) {
  return (
    <div className="u-fill">
      <ReactP5Wrapper 
        sketch={sketch} 
        misc={{zHeight:0,hasBlack:true}}
      />
    </div>
  )
}

function sketch(p5){
  p5.updateWithProps = props => {
    if(props.misc){
      p5.zHeight = props.misc.zHeight;
      p5.hasBlack = props.misc.hasBlack;
    }
  }
  let wrapper = document.getElementById("CarWindow");
  p5.setup = function(){
    p5.pixelDensity(1);
    p5.vw = wrapper.clientWidth;
    p5.vh = wrapper.clientHeight;
    p5.createCanvas(p5.vw,p5.vh,p5.WEBGL); 
    p5.car = p5.loadModel('car.obj',true);
    //view variables
    p5.camHeight = p5.vh/2/p5.tan(p5.PI/6);
    //motion parameter
    p5.he = 3;
    p5.sw = 3;
    p5.su = 2;
    p5.da = 1;
    p5.accelerateX = 0;
    p5.accelerateY = 0;
    p5.accelerateZ = 0;
  }
  p5.draw = function(){
    let rotation = util.getEulerAngles(util.getRotationMatrix(p5.rotationZ,p5.rotationX,p5.rotationY));
    p5.Rz = Math.PI-rotation[0];
    p5.Ry = rotation[2];
    p5.Rx = rotation[1];  
    p5.motion = p5.HeaveSurgeSway();
    p5.Ax = p5.motion[0];
    p5.Ay = p5.motion[1];
    p5.Az = p5.motion[2];
    p5.clear();
    p5.push();
    p5.ambientMaterial(255);
    p5.noStroke();
    p5.rotateZ(p5.Rz);
    p5.rotateX(p5.Ry);
    p5.rotateZ(p5.Rx);
    p5.rotateX(Math.PI/2);
    p5.directionalLight(200,200,200, -0.5, 2, -1);
    p5.ambientLight(128); 
    p5.translate(p5.Ay,p5.Ax,p5.Az);
    // p5.model(p5.car);
    p5.box(100);
    p5.pop();
    p5.perspective(Math.PI/10, 1, 100, 1000);
    p5.camera(500,-500,500,0,0,0,0,1,0);
  }
  p5.HeaveSurgeSway=util.HeaveSurgeSway.bind(p5);
}

export default App;