import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MainBox from "./Components/MainBox";
import MapContainer from "./Components/MapContainer";

const App = () => {
  return (
    <div className="App">
      <div className="heading">
        <h1>Effortless Towing Solutions Tailored to Your Budget</h1>
        <p>
          Introducing the Discount Auto Towing Calculator: Navigate Costs, Save
          Big, and Get Back on the Road with Ease
        </p>
      </div>
      <MapContainer />
      <MainBox />
    </div>
  );
};

export default App;
