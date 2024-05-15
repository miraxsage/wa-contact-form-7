import { React } from "react";
import "./index.scss";
import Container from "../Container";
import WaInfo from "../WaInfo";
import FormLoggerSettings from "./FormLoggerSettings";

export default function LoggerSettings() {
    return (
        <div className="logger-settings">
            <button className="button" style={{ marginBottom: "5px" }}>
                Добавить форму
            </button>
            <FormLoggerSettings />
        </div>
    );
}
