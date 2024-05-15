import "./index.scss";
import { dashIconByType } from "../services";
import classes from "classnames";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function IconButton({
    type,
    onClick,
    tooltip,
    tooltipPos = "top",
    active,
    inheritColor,
    dragHandleProps = {},
    className = "",
    onMouseEnter,
    onMouseLeave,
    ...props
}) {
    const btnRef = useRef();

    const [tooltipShown, setTooltipShown] = useState(false);

    const toggleTooltip = (show) => {
        if (!tooltip) return () => {};
        if (show === undefined) show = !tooltipShown;
        return () => setTooltipShown(show);
    };

    const onClickHere = function (e) {
        if (onClick) onClick(e);
    };

    let tooltipCoords = {};

    if (btnRef.current) {
        let coords = btnRef.current.getBoundingClientRect();
        let w = coords.right - coords.left;
        let h = coords.bottom - coords.top;
        let left =
            tooltipPos == "top"
                ? coords.left + w / 2
                : (tooltipPos == "left" ? coords.left - 5 : coords.right + 5) + "px";
        let top = tooltipPos == "top" ? coords.top - 5 : coords.top + h / 2 + "px";
        tooltipCoords = { left, top };
    }

    return (
        <>
            <div
                ref={btnRef}
                onMouseEnter={() => {
                    toggleTooltip(true)();
                    onMouseEnter && onMouseEnter();
                }}
                onMouseLeave={() => {
                    toggleTooltip(false)();
                    onMouseLeave && onMouseLeave();
                }}
                className={classes(
                    "wa-icon-button",
                    {
                        active: active,
                        "inherit-color": inheritColor,
                    },
                    ...className.split(" "),
                )}
                onClick={onClickHere}
                {...props}
                {...dragHandleProps}
            >
                {tooltip
                    ? createPortal(
                          <div
                              style={{ ...tooltipCoords }}
                              onMouseEnter={toggleTooltip(false)}
                              className={classes("wa-tooltip", tooltipPos, {
                                  visible: tooltipShown,
                              })}
                          >
                              {tooltip}
                          </div>,
                          document.body,
                      )
                    : ""}
                <span class={classes("dashicons", dashIconByType(type))}></span>
            </div>
        </>
    );
}
