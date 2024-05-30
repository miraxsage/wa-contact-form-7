import Container from "./Container";
import { useState, useLayoutEffect, useRef } from "react";
import classes from "classnames";
import { Base64 } from "./services";
import WaTabs from "./WaTabs";
import LoggerSettings from "./LoggerSettings";

const defaultConfig = {
    logForms: [],
};

export default function WaCF7Panel() {
    const initialConfig = useRef();
    try {
        if (!initialConfig.current) {
            initialConfig.current = JSON.parse(Base64.decode(wacf7Config));
            if (!initialConfig) throw new Error();
        }
    } catch {
        initialConfig.current = defaultConfig;
    }
    const [config, setConfig] = useState(initialConfig.current);
    const [status, setStatus] = useState({ status: "normal" });

    const onChangeHandler = (newConfig) => {
        setStatus({ status: "normal" });
        setConfig(newConfig);
        return;
    };

    const onSaveHandler = async () => {
        setStatus({ status: "loading" });
        const response = await fetch("/wp-admin/admin-ajax.php?action=wacf7", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: Base64.encode(JSON.stringify(config)),
        });
        if (!response.ok) {
            setStatus({ status: "error", message: "Некорректный ответ сервера" });
            return;
        }
        let json = null;
        try {
            json = await response.json();
        } catch (exc) {
            setStatus({ status: "error", message: "Некорректный ответ сервера" });
            return;
        }
        if (!json || typeof json != "object" || !json.success)
            setStatus({
                status: "error",
                message: json.message ? json.message : "Некорректный ответ сервера",
            });
        else setStatus({ status: "success", message: "Настройки успешно сохранены" });
    };
    return (
        <div className="wacf7-container">
            <WaTabs>
                {{
                    "Визуальные настройки": "HTML-справка",
                    "CSV-логирование сообщений": (
                        <LoggerSettings
                            config={config.logForms}
                            onChange={(newConfig) => setConfig({ ...config, logForms: newConfig })}
                        />
                    ),
                }}
            </WaTabs>
            <Container title="Сохранение" style={{ minWidth: "200px", maxWidth: "300px", flexGrow: 0 }}>
                <button
                    onClick={onSaveHandler}
                    className={classes("button button-primary", {
                        "success-button": status.status == "success",
                    })}
                    style={{ width: "100%" }}
                >
                    {status.status == "loading" && <span className="button-loader">Сохранение...</span>}
                    {status.status == "success" && "Сохранено"}
                    {(status.status == "error" || status.status == "normal") && "Сохранить"}
                </button>
                {status.status == "success" && (
                    <div className="wa-success-message" style={{ maxWidth: "171px" }}>
                        {status.message}
                    </div>
                )}
                {status.status == "error" && (
                    <div className="wa-error-message" style={{ maxWidth: "171px" }}>
                        {status.message}
                    </div>
                )}
            </Container>
        </div>
    );
}
