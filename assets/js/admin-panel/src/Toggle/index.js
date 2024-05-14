import { useState, useEffect } from "react";
import "./index.scss";

export default function Toggle({
    value = false,
    label = "",
    id,
    description = "",
    style,
    name = "",
    onChange,
} = {}) {
    const [spareId] = useState(Math.random().toString(36).slice(2));
    if (!id) id = spareId;
    let [checked, setChecked] = useState(value);
    useEffect(() => {
        if (value != checked) setChecked(value);
    });

    return (
        <div className="wa-toggle" style={style}>
            <div className="wa-toggle_header">
                <label style={{ margin: "0px", padding: "1px 0px 0px 0px" }}>{label}</label>
                <div class="wa-toggle_control__container">
                    <input
                        type="checkbox"
                        className="wa-toggle_control__input"
                        id={id}
                        name={name}
                        checked={checked}
                        onChange={(e) => {
                            setChecked(e.target.checked);
                            if (e.target.checked != value && onChange)
                                onChange(id, e.target.checked);
                        }}
                    />
                    <label class="wa-toggle_control__toggler" for={id}>
                        <span></span>
                        <span></span>
                    </label>
                </div>
            </div>
            {description ? <em className="wa-toggle_description">{description}</em> : ""}
        </div>
    );
}
