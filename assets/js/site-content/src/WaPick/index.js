import { React, useState, useEffect, useRef } from "react";
import "./index.scss";
import classes from "classnames";

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
    const formValue =
        checkedVariants.length == 0
            ? ""
            : checkedVariants.map((hash) => variants.find(({ nameHash }) => nameHash == hash).name).join(", ");
    useEffect(() => {
        const form = rootRef.current?.closest("form");
        const action = form.getAttribute("action");
        const abort = new AbortController();
        document.addEventListener(
            "wpcf7invalid",
            function (event) {
                if (!action.includes(event.detail.apiResponse.into)) return;
                for (let invalid of event.detail.apiResponse.invalid_fields) {
                    if (invalid.field == name) {
                        setError(invalid.message);
                        break;
                    }
                }
            },
            { signal: abort.signal },
        );
        document.addEventListener(
            "wpcf7mailsent",
            function (event) {
                if (!action.includes(event.detail.apiResponse.into)) return;
                setCheckedVariants([]);
            },
            { signal: abort.signal },
        );
        return () => abort.abort();
    }, []);
    return (
        <>
            <div ref={rootRef} className={classes("wa-pick-container", { invalid: !!error })}>
                <input type="hidden" name={name} value={formValue} />
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
