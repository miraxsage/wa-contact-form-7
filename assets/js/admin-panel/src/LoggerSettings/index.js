import { React } from "react";
import "./index.scss";
import WaInfo from "../WaInfo";
import FormLoggerSettings from "./LoggerFormSettings";
import { generateId } from "../services";

export default function LoggerSettings({ config, config: { forms } = { forms: [] }, onChange }) {
    forms = forms ?? [];
    const addForm = () => {
        onChange({ ...config, forms: [...forms, { id: generateId(), fields: [] }] });
    };
    return (
        <div className="logger-settings">
            {forms && forms.length > 0 ? (
                <>
                    <button className="button" style={{ marginBottom: "5px" }} onClick={addForm}>
                        Добавить форму
                    </button>
                    {forms.map((f, i) => (
                        <FormLoggerSettings
                            key={f.id ?? generateId()}
                            config={f}
                            style={{ marginBottom: i < forms.length - 1 ? "5px" : "0px" }}
                            onDelete={() => onChange({ ...config, forms: forms.filter((ff) => ff.id != f.id) })}
                        />
                    ))}
                </>
            ) : (
                <>
                    <WaInfo>Пока не добавлено ни одной формы</WaInfo>
                    <br />
                    <button className="button" onClick={addForm}>
                        Добавить
                    </button>
                </>
            )}
        </div>
    );
}
