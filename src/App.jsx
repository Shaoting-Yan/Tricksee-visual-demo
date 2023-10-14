import { useState } from 'react'
import './App.css'
import ArrowCurtain from "./module/sketches/ArrowCurtain"
import ArrowMatrix from "./module/sketches/ArrowMatrix"
import Dots from "./module/sketches/Dots"
import Strokes from "./module/sketches/Strokes"
import Car from "./module/sketches/Car"

function App() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const handleClick=()=>{
    setCount((count+1)%4);
  }
  const handleClickCar=()=>{
    setShow(!show);
  }
  const visuals = [<ArrowCurtain/>,<ArrowMatrix/>,<Dots/>,<Strokes/>]
  return (
    <>
      <div id="VisualWindow" className="u-fill" onClick={handleClick}>
        {visuals[count]}
      </div>
      <div id="CarWindow" onClick={handleClickCar}>
        {show?<Car/>:<></>}
      </div >
    </>
  )
}

export default App
