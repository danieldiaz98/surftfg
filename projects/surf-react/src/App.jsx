import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login"
import SpotCard from "./components/SpotCard";
import "./App.css"

function App() {
  return (
    <>
      <Navbar/>
      <h2>Surf spots populares</h2>
      <SpotCard/>
    </>
  )
}

export default App;