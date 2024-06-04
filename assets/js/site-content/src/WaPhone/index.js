import { React, useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./index.scss";
import auto_locale from "./auto-locale.json";
import ru_locale from "react-phone-input-2/lang/ru.json";

export default function WaPhone({ locale, country, ...props }) {
    const [curPhone, setPhone] = useState("");
    let localization = undefined;
    if (locale) {
        if (locale == "ru") localization = ru_locale;
        if (locale == "auto") localization = auto_locale;
    }
    if (typeof country != "string" || !country) country = undefined;
    return (
        <div className="wa-phone-container">
            <input type="hidden" />
            <PhoneInput
                enableSearch={true}
                value={curPhone}
                countryCodeEditable={false}
                onChange={(phone) => setPhone(phone)}
                localization={localization}
                country={country}
                {...props}
            />
        </div>
    );
}
