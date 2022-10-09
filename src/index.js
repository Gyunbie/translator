import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Redux store and persistor
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";

// Main Sass stylesheet
import "./stylesheets/_main.sass";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
