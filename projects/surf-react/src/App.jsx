import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login"
import SpotCard from "./components/SpotCard";
import "./App.css"
import { client } from "./supabase/client";
import Spotsdb from "./supabase/Spotsdb";

function App() {
  return (
    
    <>
      <Navbar/>
      <h2>Surf spots populares</h2>
      <SpotCard/>
      <Spotsdb/>
    </>
  )
}

export default App;