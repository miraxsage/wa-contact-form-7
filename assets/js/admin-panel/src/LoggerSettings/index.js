import { React, useState } from "react";
import "./index.scss";
import WaInfo from "../WaInfo";
import FormLoggerSettings from "./LoggerFormSettings";
import { generateId } from "../services";

function checkFormAddingAvailability(addedForms) {
    if (!Array.isArray(addedForms) || typeof wacf7Forms == "undefined") return false;
    const template = wacf7Forms
        .map((f) => f.id)
        .sort()
        .join(",.*?");
    const rex = new RegExp(template);
    return !rex.test(
        addedForms
            .map((f) => f.id)
            .sort()
            .join(","),
    );
}

export default function LoggerSettings({ config, onChange }) {
    const forms = config ?? [];

    const [formAdding, setFormAdding] = useState(false);
    const [formAddingAvailable, setFormAddingAvailable] = useState(() => checkFormAddingAvailability(forms));
    const updateFormAddingAvailavility = (newForms) => {
        setFormAddingAvailable(checkFormAddingAvailability(newForms ?? forms));
    };

    const addForm = () => {
        setFormAdding(true);
    };

    if (typeof wacf7Forms == "undefined") {
        return (
            <WaInfo type="error">
                Не удалось обнаружить ни одной формы CF7, возможно не установлен плагин ContactForm7 для Wordpress
            </WaInfo>
        );
    }

    return (
        <div className="logger-settings">
            {forms && (forms.length > 0 || formAdding) ? (
                <>
                    <div className="toolbar">
                        <button
                            disabled={formAdding || !formAddingAvailable}
                            className="button"
                            style={{ marginBottom: "5px" }}
                            onClick={addForm}
                        >
                            Добавить форму
                        </button>
                        {!formAddingAvailable && (
                            <WaInfo style={{ marginBottom: "5px" }}>Все существующие формы CF7 залогированы</WaInfo>
                        )}
                    </div>
                    {formAdding && (
                        <FormLoggerSettings
                            key="newForm"
                            className="form-adding"
                            config={{ id: "newForm" }}
                            formsToAdd={wacf7Forms.filter((f) => forms.every((ff) => ff.id != f.id))}
                            style={{ marginBottom: forms.length > 0 ? "5px" : "0px" }}
                            onDelete={() => setFormAdding(false)}
                            onChange={(newFormConfig) => {
                                setFormAdding(false);
                                const newForms = [newFormConfig, ...forms];
                                updateFormAddingAvailavility(newForms);
                                onChange(newForms);
                            }}
                        />
                    )}
                    {forms.map((f, i) => (
                        <FormLoggerSettings
                            key={f.id ?? generateId()}
                            config={f}
                            style={{ marginBottom: i < forms.length - 1 ? "5px" : "0px" }}
                            onDelete={() => {
                                const newForms = forms.filter((ff) => ff.id != f.id);
                                updateFormAddingAvailavility(newForms);
                                onChange(newForms);
                            }}
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
