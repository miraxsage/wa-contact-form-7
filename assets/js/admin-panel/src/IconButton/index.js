import "./index.scss";
import { dashIconByType } from "../services";
import classes from "classnames";
import React, { createRef } from "react";
import { createPortal } from "react-dom";

export default class IconButton extends React.Component {
    constructor(props) {
        super(props);
        this.btnRef = createRef();
        this.state = { tooltipShown: false };
        this.toggleTooltip = this.toggleTooltip.bind(this);
    }
    toggleTooltip(show) {
        if (show === undefined) show = !this.state.tooltipShown;
        if (!this.props.tooltip) return;
        return () => this.setState({ tooltipShown: show });
    }
    componentDidMount() {
        this.setState({ ...this.state });
    }
    render() {
        const {
            type,
            onClick,
            tooltip,
            tooltipPos = "top",
            active,
            dragHandleProps = {},
            className = "",
            onMouseEnter,
            onMouseLeave,
            ...props
        } = this.props;
        const onClickHere = function (e) {
            if (onClick) onClick(e);
        };
        let tooltipCoords = {};
        if (this.btnRef.current) {
            let coords = this.btnRef.current.getBoundingClientRect();
            let w = coords.right - coords.left;
            let h = coords.bottom - coords.top;
            let left =
                tooltipPos == "top"
                    ? coords.left + w / 2
                    : (tooltipPos == "left"
                          ? coords.left - 5
                          : coords.right + 5) + "px";
            let top =
                tooltipPos == "top"
                    ? coords.top - 5
                    : coords.top + h / 2 + "px";
            tooltipCoords = { left, top };
        }
        return (
            <>
                <div
                    ref={this.btnRef}
                    onMouseEnter={() => { 
                        this.toggleTooltip(true)();
                        onMouseEnter && onMouseEnter(); 
                    }}
                    onMouseLeave={() => { 
                        this.toggleTooltip(false)();
                        onMouseLeave && onMouseLeave(); 
                    }}
                    className={classes(
                        "wa-icon-button",
                        {
                            active: active,
                            "inherit-color": this.props.inheritColor,
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
                                  onMouseEnter={this.toggleTooltip(false)}
                                  className={classes("wa-tooltip", tooltipPos, {
                                      visible: this.state.tooltipShown,
                                  })}
                              >
                                  {tooltip}
                              </div>,
                              document.body,
                          )
                        : ""}
                    <span
                        class={classes("dashicons", dashIconByType(type))}
                    ></span>
                </div>
            </>
        );
    }
}
