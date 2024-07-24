import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register/Register";



//===============================================================

const App = () => {
  return (
    <div className="App">
      <Register/>
      <Routes>
        {/* <Route path={"/"} element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newArticle" element={<NewArticle />} /> */}
      </Routes>
    </div>
  );
};

export default App;
