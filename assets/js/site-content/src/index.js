import React from "react";
import ReactDOM from "react-dom";
import WaPhone from "./WaPhone";
import WaCountry from "./WaCountry";
import WaPick from "./WaPick";

window.useWaPhone = (root, props) => {
    ReactDOM.createRoot(root).render(<WaPhone {...props} />);
};
window.useWaCountry = (root, props) => {
    ReactDOM.createRoot(root).render(<WaCountry {...props} />);
};
window.useWaPick = (root, props) => {
    ReactDOM.createRoot(root).render(<WaPick {...props} />);
};
