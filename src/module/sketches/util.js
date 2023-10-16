export function getRotationMatrix( alpha, beta, gamma ) {
  const degtorad = Math.PI / 180; // Degree-to-Radian conversion
  var cX = Math.cos( beta  * degtorad );
  var cY = Math.cos( gamma * degtorad );
  var cZ = Math.cos( alpha * degtorad );
  var sX = Math.sin( beta  * degtorad );
  var sY = Math.sin( gamma * degtorad );
  var sZ = Math.sin( alpha * degtorad );

  var m11 = cZ * cY - sZ * sX * sY;
  var m12 = - cX * sZ;
  var m13 = cY * sZ * sX + cZ * sY;

  var m21 = cY * sZ + cZ * sX * sY;
  var m22 = cZ * cX;
  var m23 = sZ * sY - cZ * cY * sX;

  var m31 = - cX * sY;
  var m32 = sX;
  var m33 = cX * cY;
  return [
    m13, m12, m11,
    m23, m22, m21,
    m33, m32, m31
  ];
}
  
export function getEulerAngles( matrix ) {
  var radtodeg = 180 / Math.PI; // Radian-to-Degree conversion
  var sy = Math.sqrt(matrix[0] * matrix[0] +  matrix[3] * matrix[3] );

  var singular = sy < 1e-6; // If

  if (!singular) {
      var x = Math.atan2(matrix[7] , matrix[8]);
      var y = Math.atan2(-matrix[6], sy);
      var z = Math.atan2(matrix[3], matrix[0]);
  } else {
      var x = Math.atan2(-matrix[5], matrix[4]);
      var y = Math.atan2(-matrix[6], sy);
      var z = 0;
  }
  return [x, y, z];
}

export function moveObject(){
  let currX = this.camHeight*this.Ry;   //for left right rotation
  this.rotateZ(Math.PI/2-this.Rz);        //tilting
  this.translate(currX,0,0);     
  //for arrow turning
  this.currRz = typeof this.currRz == 'undefined' ? this.Rz : this.currRz;
  if (this.currRz != this.Rz){
    this.currRz += (this.Rz-this.currRz)/15; //Ease back
  }
}

export function moveCamera(){
  let Ax = this.accelerationX;
  let Ay = this.accelerationY;
  let Az = this.accelerationZ;
  
  //camera move due to acceleration and brake
  let dz = this.su*Math.sign(Az)*(Math.abs(Az)**1.5);
  this.accZ = typeof this.accZ == 'undefined' ? this.camHeight : this.constrain(this.accZ+dz,-this.camHeight/2,this.camHeight*5);
  if (this.accZ != 0){                                        
    this.accZ -= this.accZ/(Math.abs(this.accZ)**0.5); //damping
  }
  // let camZ = this.camHeight + this.accZ;
  let camZ = this.camHeight

  //camera move due to up and down
  let dy = this.he*Math.sign(Ay)*(Math.abs(Ay)**1.5);
  this.accY = this.accY == null ? 0 : this.accY+dy;
  if (this.accY != 0){                                        
    this.accY -= this.accY/20; //damping
  }
  let camY = this.accY;
  let obY = this.accY;

  //camera move due to left and right
  let dx = this.sw*Math.sign(Ax)*(Math.abs(Ax)**1.5);
  this.accX = typeof this.accX == 'undefined' ? 0 : this.accX+dx;
  if (this.accX != 0){                                        
    this.accX -= this.accX/10; //damping
  }
  // let camX = this.accX;
  // let obX = this.accX;
  let camX = 0;
  let obX = 0;

  //pitch movement
  this.currRx = typeof this.currRx == 'undefined' ? this.Rx : this.currRx;
  if (this.currRx != this.Rx){
    this.currRx += (this.Rx-this.currRx)/this.da; //Ease back
  }
  // obY += -camZ*Math.tan(this.Rx-this.currRx);
  if (this.currRx != this.Rx){
    this.currRx += (this.Rx-this.currRx)/this.da; //Ease back
  }
  // camY -= -camZ*Math.tan(this.Rx-this.currRx);

  this.camera(camX, camY, camZ, obX, obY, 0,0,1,0);
  // perspective(PI / 3.0, width / height, camZ-140, camZ);
}

export function putColor(src,col){
  const w = src.width;
  const h = src.height;
  let tinted = createImage(w,h);
  src.loadPixels();
  tinted.loadPixels();
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      tinted.set(i, j, color(red(col),green(col),blue(col),src.pixels[i*j*4+j*4]));
    }
  }
  tinted.updatePixels();
  return tinted;
}

export function makeArray(w, h, val) {
  var arr = [];
  for(let i = 0; i < h; i++) {
      arr[i] = [];
      for(let j = 0; j < w; j++) {
          arr[i][j] = val;
      }
  }
  return arr;
}

export function random2D(size,count,space){
    let chosed = [];
    let protection = 0;
    let randomInt = function(max) {
      return Math.floor(Math.random() * max);
    }
    let dist = function(x1,y1,x2,y2){
      return Math.sqrt((x2-x1)**2+(y2-y1)**2);
    }
    while (chosed.length < count){
      let curr = {i:randomInt(size),j:randomInt(size)}
      let overlapping = false;
      for(let k = 0; k<chosed.length;k++){
        let other = chosed[k];
        let distance = dist(other.i,other.j,curr.i,curr.j);
        if(distance<space){
          overlapping = true;
        }
      }
      if(!overlapping){
        chosed.push(curr);
      }
      protection++;
      if (protection > count*50){
        break;
      }
    }
    let all = makeArray(size,size,false);
    for(let i =0;i<chosed.length;i++){
      let curr = chosed[i];
      all[curr.i][curr.j] = true;
    }
    return all;
  }

export function random1D(size,count,space){
  let chosed = [];
  let protection = 0;
  let randomInt = function(max) {
    return Math.floor(Math.random() * max);
  }
  while (chosed.length < count){
    let curr = randomInt(size);
    let overlapping = false;
    for(let k = 0; k<chosed.length;k++){
      let other = chosed[k];
      let distance = Math.abs(other-curr);
      if(distance<space){
        overlapping = true;
      }
    }
    if(!overlapping){
      chosed.push(curr);
    }
    protection++;
    if (protection > count*50){
      break;
    }
  }
  let all = Array(size);
  for(let i =0;i<all.length;i++){
    all[i] = false;
  }
  for(let i =0;i<chosed.length;i++){
    let curr = chosed[i];
    all[curr] = true;
  }
  return all;
}