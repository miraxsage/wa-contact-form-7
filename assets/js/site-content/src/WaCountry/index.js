import { React, useState, useLayoutEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./index.scss";
import auto_locale from "../WaPhone/auto-locale.json";
import ru_locale from "react-phone-input-2/lang/ru.json";

export default function WaCountry({ name, require, locale, country: initialCountry, ...props }) {
    const [error, setError] = useState();
    const [country, setCountry] = useState(initialCountry);
    const rootRef = useRef();
    let localization = undefined;
    if (locale) {
        if (locale == "ru") localization = ru_locale;
        if (locale == "auto") localization = auto_locale;
    }
    if (typeof initialCountry != "string" || !initialCountry) initialCountry = undefined;
    const replaceInputByCountryRef = useRef();
    replaceInputByCountryRef.current = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
            if (e.target && e.target.blur) e.target.blur();
        }
        const input = rootRef.current.querySelector("input.form-control");
        let countryNameBlock;
        if (input) {
            countryNameBlock = document.createElement("div");
            countryNameBlock.classList.add("form-control");
        } else countryNameBlock = rootRef.current.querySelector("div.form-control");
        const newHtml = country ? localization[country] : "";
        if (countryNameBlock.innerHTML != newHtml) countryNameBlock.innerHTML = newHtml;
        if (input) input.replaceWith(countryNameBlock);
    };
    useLayoutEffect(() => {
        let observer = new MutationObserver(([...args]) => replaceInputByCountryRef?.current(...args));
        observer.observe(rootRef.current, { childList: true, subtree: true, attributes: true });
        replaceInputByCountryRef.current();
        return () => observer.disconnect();
    }, []);
    return (
        <div className="wa-country-container" ref={rootRef}>
            <input type="hidden" name={name} value={country} />
            <PhoneInput
                enableSearch={true}
                onChange={(val, { countryCode }) => {
                    if (countryCode && countryCode != country) setCountry(countryCode);
                }}
                localization={localization}
                country={initialCountry}
                {...props}
            />
            {error && <span className="wpcf7-not-valid-tip">{error}</span>}
        </div>
    );
}
