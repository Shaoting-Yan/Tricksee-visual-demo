import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "./ArrowCurtain.css";
import * as util from "./util";


function App(props) {
  return (
    <div>
      <div className="u-fill layer0">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{zHeight:-500,hasBlack:false}}
        />
      </div>
      <div className="u-fill layer1">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{zHeight:-200,hasBlack:false}}
        />
      </div>
      <div className="u-fill layer2">
        <ReactP5Wrapper 
          sketch={sketch} 
          misc={{zHeight:0,hasBlack:true}}
        />
      </div>
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
  let wrapper = document.getElementById("VisualWindow");
  p5.setup = function(){
    p5.pixelDensity(1);
    p5.vw = wrapper.clientWidth;
    p5.vh = wrapper.clientHeight;
    p5.createCanvas(p5.vw,p5.vh,p5.WEBGL); 
    //view variables
    p5.camHeight = p5.vh/2/p5.tan(p5.PI/6);
    p5.viewSize = p5.camHeight*Math.PI*2.5;
    //motion parameter
    p5.he = 3;
    p5.sw = 3;
    p5.su = 2;
    p5.da = 1;
    p5.thickness = 50;
    p5.offset = 200;
    p5.shift = Math.random()*p5.offset;
    p5.space = 3;
    p5.size = p5.int(p5.viewSize/p5.offset);
    p5.arrows = [];
    p5.tagged = util.random1D(p5.size,p5.size/2,p5.space);
    for(let i = 0;i<p5.tagged.length;i++){
      let length = p5.random(p5.vh*0.5,p5.vh*0.95);
      if(p5.tagged[i] && p5.hasBlack){
        p5.arrows.push(new ArrowCurve(-200,0,length*(2/5),length*(3/5),length,p5.thickness,"black"));
      }else{
        p5.arrows.push(new ArrowCurve(-200,0,length*(2/5),length*(3/5),length,p5.thickness,"#DE3D83"));
      }
    }
  }
  p5.draw = function(){
    let rotation = util.getEulerAngles(util.getRotationMatrix(p5.rotationZ,p5.rotationX,p5.rotationY));
    p5.Rz = Math.PI-rotation[0];
    p5.Ry = rotation[2];
    p5.Rx = rotation[1];  
    p5.clear();
    p5.background(255);
    p5.push();
    let currX = p5.camHeight*p5.Ry; 
    p5.translate(currX,0,0);
    p5.factor = (Math.abs(p5.zHeight)+p5.camHeight)/p5.camHeight;
    p5.scale(p5.factor,p5.factor);
    p5.translate(-p5.viewSize/2,-p5.vh/2-200,p5.zHeight); 
    for(let i = 0;i<(p5.arrows.length);i++){
      p5.push();
      p5.translate(i*p5.offset+p5.shift,0);
      let curr = p5.arrows[i];
      curr.display(p5,p5.Rz,p5.factor);
      p5.pop();
    }
    p5.pop();
    p5.push();
    p5.imageMode(p5.CENTER);
    p5.noStroke();
    p5.translate(0,0,0);
    p5.pop();
    p5.moveCamera();
  }
  p5.moveCamera = util.moveCamera.bind(p5);
  class ArrowCurve{
    constructor(_prev,_start,_tangent,_curvature,_length,_thickness,_color){
      this.prev = new p5.constructor.Vector(0,_prev);
      this.start = new p5.constructor.Vector(0,_start);
      this.tangent = new p5.constructor.Vector(0,_tangent);
      this.curvature = new p5.constructor.Vector(0,_curvature);
      this.mid = new p5.constructor.Vector(0,(_length-_start)/2);
      this.offset = new p5.constructor.Vector(0,(_length-_start)/2);
      this.thickness = _thickness;
      this.color = _color;
      this.arrowSize = _thickness*2.5;
      this.arrowBody1 = new p5.constructor.Vector.fromAngle(Math.PI*0.75,this.arrowSize);
      this.arrowBody2 = new p5.constructor.Vector.fromAngle(Math.PI*1.25,this.arrowSize);
    }
    display(p,Rz,f){
      this.offset.setHeading(Rz);
      let arrowPoint = p.constructor.Vector.add(this.mid,this.offset);
      p.push();
      p.noFill();
      p.stroke(this.color);
      p.strokeWeight(this.thickness*f);
      p.strokeCap(p.SQUARE);
      p.translate(-this.prev.x,-this.prev.y);
      p.line(this.prev.x,this.prev.y,this.start.x,this.start.y);
      p.beginShape();
        p.vertex(arrowPoint.x,arrowPoint.y);
        p.bezierVertex(this.curvature.x,this.curvature.y,this.tangent.x,this.tangent.y,
                          this.start.x,this.start.y);
      p.endShape();
      let tangent = p.constructor.Vector.sub(arrowPoint,this.curvature);
      let heading = tangent.heading();
      p.translate(arrowPoint.x,arrowPoint.y);
      p.rotate(heading);
      p.strokeCap(p.PROJECT);
      p.line(0,0,this.arrowBody1.x,this.arrowBody1.y);
      p.line(0,0,this.arrowBody2.x,this.arrowBody2.y);
      p.pop();
    }
  }
}

export default App;