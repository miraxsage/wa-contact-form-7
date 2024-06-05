import React from "react";
import ReactDOM from "react-dom";
import WaPhone from "./WaPhone";
import WaCountry from "./WaCountry";

window.useWaPhone = (root, props) => {
    ReactDOM.createRoot(root).render(<WaPhone {...props} />);
};
window.useWaCountry = (root, props) => {
    ReactDOM.createRoot(root).render(<WaCountry {...props} />);
};
