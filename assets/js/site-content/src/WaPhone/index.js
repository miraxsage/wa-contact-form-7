import { React, useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./index.scss";
import auto_locale from "./auto-locale.json";
import ru_locale from "react-phone-input-2/lang/ru.json";

export default function WaPhone({ name, require, locale, country, ...props }) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState();
    const [showUnvalid, setShowUnvalid] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const rootRef = useRef();
    let localization = undefined;
    if (locale) {
        if (locale == "ru") localization = ru_locale;
        if (locale == "auto") localization = auto_locale;
    }
    if (typeof country != "string" || !country) country = undefined;
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
        <div className="wa-phone-container" ref={rootRef}>
            <input type="hidden" name={name} value={isValid ? phone : ""} />
            <PhoneInput
                enableSearch={true}
                value={phone}
                isValid={(value, country) => {
                    const targetDigits = Math.min(15, (country.format.match(/\./g) || []).length);
                    const newIsValid = value.length == targetDigits;
                    setIsValid(newIsValid);
                    if (newIsValid) setError(undefined);
                    return showUnvalid && require ? newIsValid : true;
                }}
                countryCodeEditable={false}
                onChange={(phone) => {
                    setShowUnvalid(true);
                    setPhone(phone);
                }}
                localization={localization}
                country={country}
                {...props}
            />
            {error && <span className="wpcf7-not-valid-tip">{error}</span>}
        </div>
    );
}
