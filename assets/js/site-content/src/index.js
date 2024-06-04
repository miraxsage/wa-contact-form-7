import React from "react";
import ReactDOM from "react-dom";
import WaPhone from "./WaPhone";

window.useWaPhone = (root, props) => {
    ReactDOM.createRoot(root).render(<WaPhone {...props} />);
};
