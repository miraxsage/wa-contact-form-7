import Container from "./Container";
import { useState, useEffect, useRef } from "react";
import classes from "classnames";
import { Base64 } from "./services";
import WaTabs from "./WaTabs";
import LoggerSettings from "./LoggerSettings";
import VisualSettingsManual from "./VisualSettingsManual";

const defaultConfig = {
    logForms: [],
};

//defaultConfig: { logForms: { id: string; tags: string[] }[] };

export default function WaCF7Panel() {
    const initialConfig = useRef();
    const notSavedRef = useRef(false);
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
        notSavedRef.current = true;
        return;
    };

    useEffect(() => {
        const closeHandler = () => {
            if (notSavedRef.current) return confirm("Есть несохранённые изменения. Всё равно уходим?");
        };
        window.onbeforeunload = closeHandler;
        return () => (window.onbeforeunload = undefined);
    }, []);

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
        else {
            setStatus({ status: "success", message: "Настройки успешно сохранены" });
            notSavedRef.current = false;
        }
    };
    return (
        <div className="wacf7-container">
            <WaTabs>
                {{
                    "Визуальные настройки": <VisualSettingsManual />,
                    "CSV-логирование сообщений": (
                        <LoggerSettings
                            config={config.logForms}
                            onChange={(newLogForms) => onChangeHandler({ ...config, logForms: newLogForms })}
                        />
                    ),
                }}
            </WaTabs>
            <Container title="Сохранение" style={{ minWidth: "200px", maxWidth: "300px", flexGrow: 0 }}>
                {notSavedRef.current && (
                    <div className="wa-error-message" style={{ maxWidth: "171px" }}>
                        Изменения не сохранены
                    </div>
                )}
                <button
                    onClick={onSaveHandler}
                    className={classes("button button-primary", {
                        "success-button": status.status == "success",
                    })}
                    disabled={status == "loading"}
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
