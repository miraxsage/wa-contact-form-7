import classes from "classnames";
import "./index.scss";
import { dashIconByType } from "../services";

export default function WaInfo({ type = "info", children, ...props }) {
    return (
        <div style={{ margin: "0px" }} className={classes("wa-info", "wa-info-" + type)} {...props}>
            <span className={classes("dashicons", dashIconByType(type))}></span>
            <span className="wa-info-text">{children}</span>
        </div>
    );
}
