import { React, useState, useEffect, useRef, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./index.scss";
import en_locale from "./en-locale.json";
import ru_locale from "react-phone-input-2/lang/ru.json";
import auto_locale from "./auto-locale.json";

export function retrieveLocaleSource(localeCode) {
    if (localeCode == "ru") return ru_locale;
    if (localeCode == "en") return en_locale;
    if (localeCode == "auto") return auto_locale;
}
export function combineLocalesSources(localeACode, localeBCode) {
    const localeA = retrieveLocaleSource(localeACode);
    const localeB = retrieveLocaleSource(localeBCode);
    const resultLocale = Object.fromEntries(
        Object.keys(localeA).map((key) => [
            key,
            localeA[key] == localeB[key] ? localeA[key] : `${localeA[key]} (${localeB[key]})`,
        ]),
    );
    return resultLocale;
}

export default function WaPhone({ name, require, locale: localeCode, country, ...props }) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState();
    const [showUnvalid, setShowUnvalid] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const rootRef = useRef();
    const localization = useMemo(() => {
        if (localeCode) {
            if (localeCode == "en") return en_locale;
            if (localeCode == "ru") return ru_locale;
            if (localeCode == "auto") return auto_locale;
            if (localeCode.match(/(ru|en|auto)_(ru|en|auto)/))
                return combineLocalesSources(localeCode.split("_")[0], localeCode.split("_")[1]);
        }
    }, localeCode);
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
