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
import { useState } from "react";
// import DeviceDetector from "device-detector-js";
import {
  isMobile,
  isIE,
  browserName,
  mobileVendor,
  isAndroid,
  parseUserAgent,
} from "react-device-detect";
function App() {
  var userAgent = navigator.userAgent;
  // const deviceDetector = new DeviceDetector();
  // const device = deviceDetector.parse(userAgent);
  const parser = UAParser(userAgent);
  const [log, setLog] = useState([]);

  const isHuawei = () => {
    // console.log("mobileVendor", mobileVendor);
    // console.log("isAndroid", isAndroid);
    // console.log('parseUserAgent',parseUserAgent(userAgent))
    if (isMobile) {
      alert("isHuawei");
    } else {
      alert("not isHuawei");
    }
    // if (isIE) {
    //   alert("isIE");
    // } else {
    //   alert("not isIE");
    // }
    // if (isAndroid) {
    //   alert("isAndroid");
    // } else {
    //   alert("not isAndroid");
    // }
    // if (
    //   parser.device.hasOwnProperty("vendor") &&
    //   parser.device.vendor !== undefined &&
    //   parser.device.vendor.toLowerCase().includes("huawei")
    // ) {
    //   return 'Huawei normal';
    // }
    // if(/Android 8.1.0/i.test(userAgent)){
    //   return 'FireFox Huawei';
    // }
    // if (
    //   parser.device.hasOwnProperty("vendor") &&
    //   parser.device.vendor !== undefined
    // ) {
    //   if (parser.device.vendor.toLowerCase().includes("huawei")) {
    //     // huawei
    //     return true;
    //   }
    // } else {
    //   // firefox
    //   return true;
    // }
    // return false;
  };
  isHuawei();
  // function getMobileType() {
  //   console.log(navigator);
  //   if (navigator.userAgentData && navigator.userAgentData.mobile) {
  //     const brand = navigator.userAgentData.mobile.brand;
  //     const model = navigator.userAgentData.mobile.model;
  //     if (brand === "Apple") {
  //       return "iPhone";
  //     } else if (brand === "Samsung") {
  //       return "Samsung";
  //     } else if (brand === "Huawei") {
  //       return "Huawei";
  //     } else {
  //       return "Unknown";
  //     }
  //   } else {
  //     return "Unknown";
  //   }
  // }
  // function getMobileType() {
  //   const platform = navigator.platform;
  //   if (/(iPhone|iPod)/i.test(platform)) {
  //     return "iPhone";
  //   } else if (/Android/i.test(platform)) {
  //     return "Samsung"; // this assumes that the user is using the default Android browser, which is typically preinstalled on Samsung devices
  //   } else if (/Linux.*Android/i.test(platform)) {
  //     return "Huawei"; // this assumes that the user is using the Huawei browser, which typically includes "Linux; Android" in the user agent string
  //   } else {
  //     return "Unknown";
  //   }
  // }
  function getMobileType() {
    const firefoxAgent =
      "Mozilla/5.0 (Android 8.1.0;Mobile;rv:109.0) Gecko/111.0 Firefox/111.0";
    const chromeAgent =
      "Mozilla/5.0 (Linux; Android 8.1.0; DUB-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36";
    console.log("firefox", /Android 8.1.0/i.test(firefoxAgent));
    console.log("chrome", /Linux.*Android/i.test(chromeAgent));
    return;
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const width = window.innerWidth;

    if (/iPad/i.test(userAgent)) {
      return "iPad";
    } else if (/(iPhone|iPod)/i.test(userAgent)) {
      return "iPhone";
    } else if (/Android/i.test(userAgent)) {
      if (width >= 768) {
        return "Samsung Tablet"; // this assumes that the user is using a Samsung tablet
      } else {
        return "Samsung Phone"; // this assumes that the user is using a Samsung phone
      }
    } else if (/Linux.*Android 8.1/i.test(userAgent)) {
      return "Huawei"; // this assumes that the user is using the Huawei browser, which typically includes "Linux; Android" in the user agent string
    } else if (/Windows Phone/i.test(userAgent)) {
      return "Windows Phone";
    } else if (/BlackBerry/i.test(userAgent)) {
      return "BlackBerry";
    } else if (/BB10/i.test(userAgent)) {
      return "BlackBerry 10";
    } else if (/webOS|TouchPad/i.test(userAgent)) {
      return "HP TouchPad";
    } else if (/Kindle/i.test(userAgent)) {
      return "Kindle";
    } else if (/Silk/i.test(userAgent)) {
      return "Fire Tablet"; // this assumes that the user is using an Amazon Fire tablet
    } else if (/PlayBook/i.test(userAgent)) {
      return "BlackBerry PlayBook";
    } else if (/Symbian/i.test(userAgent) || /S60/i.test(userAgent)) {
      return "Symbian";
    } else if (/Opera Mini/i.test(userAgent)) {
      return "Opera Mini";
    } else if (/Opera Mobi/i.test(userAgent)) {
      return "Opera Mobile";
    } else if (/Firefox/i.test(userAgent) && /Mobile/i.test(userAgent)) {
      return "Firefox Mobile";
    } else if (/IEMobile/i.test(userAgent)) {
      return "Internet Explorer Mobile";
    } else {
      // check for tablets
      if (/Tablet|iPad/i.test(userAgent)) {
        return "Tablet";
      }
      // check for desktops/laptops
      else if (/Windows|Macintosh/i.test(platform)) {
        return "Desktop";
      }
      // if all else fails, assume it's a phone
      else {
        return "Phone";
      }
    }
  }

  return (
    <>
      <div className="container">
        {/* <p>{JSON.stringify(parseUserAgent(userAgent))}</p> */}
        {/* <h1>{browserName}</h1>
        <h1>{isAndroid ? "Android" : "Other"}</h1>
        <h1>{mobileVendor}</h1>
        <p>{JSON.stringify(log)}</p> */}
        {/* <p>Error</p>
        <p>Error</p>
        <p>{JSON.stringify(parser)}</p>
        <p>{JSON.stringify(device)}</p> */}
        <p>{JSON.stringify(userAgent)}</p>
        {/* <h1>{isHuawei() ? "Huawei" : "Other"}</h1> */}
        {/* <h1>{getMobileType()}</h1> */}
      </div>
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
      <Loader />
    </>
  );
}

export default App;
