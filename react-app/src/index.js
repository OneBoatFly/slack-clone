import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import "./components/LandingLoggedIn.css";
import App from "./App";
import configureStore from "./store";
import { ModalProvider } from "./context/Modal";
import SocketProvider from "./context/SocketContext";
import ReactGA from "react-ga4";

ReactGA.initialize("G-1ME36NLQ2Y");

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
