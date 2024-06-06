import { React, useState, useLayoutEffect, useRef, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./index.scss";
import en_locale from "../WaPhone/en-locale.json";
import ru_locale from "react-phone-input-2/lang/ru.json";
import auto_locale from "../WaPhone/auto-locale.json";
import { combineLocalesSources } from "../WaPhone";

export default function WaCountry({ name, require, locale: localeCode, country: initialCountry, ...props }) {
    const [country, setCountry] = useState(initialCountry);
    const rootRef = useRef();
    const localization = useMemo(() => {
        if (localeCode) {
            if (localeCode == "en") return en_locale;
            if (localeCode == "ru") return ru_locale;
            if (localeCode == "auto") return auto_locale;
            if (localeCode.match(/(ru|en|auto)_(ru|en|auto)/))
                return combineLocalesSources(localeCode.split("_")[0], localeCode.split("_")[1]);
            return undefined;
        }
    }, localeCode);
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
            countryNameBlock.addEventListener("mousedown", () => {
                countryNameBlock.setAttribute(
                    "data-allow-opening",
                    !!rootRef.current.querySelector(".country-list") ? false : true,
                );
            });
            countryNameBlock.addEventListener("click", () => {
                if (countryNameBlock.getAttribute("data-allow-opening") == "true")
                    rootRef.current.querySelector(".flag-dropdown .selected-flag").click();
            });
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
        <div className="wa-cf7-country-container" ref={rootRef}>
            <input type="hidden" name={name} value={localization[country]} />
            <PhoneInput
                enableSearch={true}
                onChange={(val, { countryCode }) => {
                    if (countryCode && countryCode != country) setCountry(countryCode);
                }}
                localization={localization}
                country={initialCountry}
                {...props}
            />
        </div>
    );
}
