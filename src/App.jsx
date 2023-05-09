import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateHomeRoute } from "./PrivateHomeRoute";
import { PrivateLoginRoute } from "./PrivateLoginRoute";
import { ToastContainer } from "react-toastify";
import Login from "./templates/login";
import Cards from "./templates/cards";
import Loader from "./components/loader";
import History from "./templates/history";
import Ushare from "./templates/ushare";
import OutCome from "./templates/outcome";
import Den from "./templates/den";
import Prices from "./templates/prices";
import { UAParser } from "ua-parser-js";
import Help from "./templates/help";
import { useState } from "react";
function App() {
  var userAgent = navigator.userAgent;
  const parser = UAParser(userAgent);
  const [showagent, setShowagent] = useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateHomeRoute />}>
            <Route index element={<Cards />} />
            <Route path="/ushare" element={<Ushare />} />
            <Route path="/history" element={<History />} />
            <Route path="/outcome" element={<OutCome />} />
            <Route path="/den" element={<Den />} />
            <Route path="/prices" element={<Prices />} />
          </Route>
          <Route path="/login" element={<PrivateLoginRoute />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="container">
      {showagent &&
          <p onClick={() => setShowagent(false)}>{JSON.stringify(parser)}</p>
      }
      {!showagent &&
        <button className="btn btn-danger" onClick={() => setShowagent(true)}>Agent</button>
      }
      </div>
      <Loader />
    </>
  );
}

export default App;
