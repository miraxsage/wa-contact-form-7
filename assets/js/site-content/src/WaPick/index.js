import { React, useState, useEffect, useRef } from "react";
import "./index.scss";

function Icon({ src }) {
    return <img src={src} alt="" />;
}

export default function WaPick({ name, require, variants, multiple = 1, ...props }) {
    const [checkedVariants, setCheckedVariants] = useState([]);
    const rootRef = useRef();
    const [error, setError] = useState();
    const onChecked = (hash) => {
        const isChecking = !checkedVariants.includes(hash);
        const currentVariants =
            typeof multiple == "number"
                ? multiple > 1
                    ? checkedVariants.slice(-(multiple - (isChecking ? 1 : 0)))
                    : []
                : checkedVariants;
        if (isChecking) setCheckedVariants([...currentVariants, hash]);
        else setCheckedVariants(currentVariants.filter((h) => h != hash));
        setError(undefined);
    };
    useEffect(() => {
        const form = rootRef.current?.closest("form");
        const action = form.getAttribute("action");
        document.addEventListener("wpcf7invalid", function (event) {
            if (!action.includes(event.detail.apiResponse.into)) return;
            for (let invalid of event.detail.apiResponse.invalid_fields) {
                if (invalid.field == name) {
                    setError(invalid.message);
                    break;
                }
            }
        });
    }, []);
    return (
        <>
            <div ref={rootRef} className="wa-pick-container">
                <input type="hidden" name={name} value={checkedVariants.join(";")} />
                {variants.map(({ name, nameHash, icon, iconSide }) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                checked={checkedVariants.includes(nameHash)}
                                onChange={() => onChecked(nameHash)}
                                id={nameHash}
                            />
                            <label for={nameHash}>
                                {icon && iconSide == "left" && <Icon src={icon} />}
                                {name}
                                {icon && iconSide == "right" && <Icon src={icon} />}
                            </label>
                        </>
                    );
                })}
            </div>
            {error && <span className="wpcf7-not-valid-tip">{error}</span>}
        </>
    );
}
