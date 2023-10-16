import { useState } from 'react'
import './App.css'
import Visual from "./module/sketches/Visual"

function App() {
  return (
    <>
      <div id="VisualWindow" className="u-fill">
        <Visual/>
      </div>
    </>
  )
}

export default App
