import { React, useState, useEffect } from "react";
import "./index.scss";
import WaTab from "./WaTab";

export default function WaTabs({ children, selectedTab, style, header, footer }) {
    const [activeTab, setActiveTab] = useState(Object.keys(children)[0]);

    const onActiveTabChange = (newActiveTab) => {
        newActiveTab = newActiveTab.replace("_", " ");
        if (newActiveTab !== activeTab) setActiveTab(newActiveTab);
    };

    const updateTab = () => {
        if (typeof selectedTab == "number") {
            const selectedTab = Number(selectedTab);
            const tabNames = Object.keys(children);
            if (selectedTab >= 0 && Number(props.selectedTab) <= tabNames.length && activeTab != tabNames[selectedTab])
                setActiveTab(tabNames[selectedTab]);
        }
        if (typeof selectedTab == "string" && selectedTab in children && selectedTab != activeTab)
            setActiveTab(selectedTab);
    };

    useEffect(() => {
        updateTab();
    }, selectedTab);

    return (
        <div
            style={style ?? {}}
            class="wa-tabs cf-container cf-container-carbon_fields_container_wa_common_settings cf-container-theme-options cf-container--tabbed cf-container--tabbed-horizontal"
        >
            <div class="cf-container__tabs cf-container__tabs--tabbed-horizontal">
                <ul class="cf-container__tabs-list">
                    {Object.keys(children).map((k) => (
                        <WaTab title={k} active={k == activeTab} onClick={onActiveTabChange} />
                    ))}
                </ul>
            </div>
            <div class="cf-container__fields">
                {Object.keys(children).map((k) => (
                    <div
                        style={{
                            display: k == activeTab ? "block" : "none",
                            position: "relative",
                        }}
                        class="cf-field__body"
                    >
                        {typeof children[k] === "function" ? children[k]({ onActiveTabChange }) : children[k]}
                    </div>
                ))}
            </div>
        </div>
    );
}
