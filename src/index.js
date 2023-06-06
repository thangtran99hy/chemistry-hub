import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthContextProvider from "./providers/AuthProvider";
import moment from "moment";
import 'moment/locale/vi';
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import { localization } from "survey-creator-core";

moment.locale('vi');

localization.currentLocale = "vi";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
