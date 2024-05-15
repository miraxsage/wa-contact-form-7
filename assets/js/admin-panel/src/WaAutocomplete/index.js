import React, { useRef, useState, useEffect } from "react";
import classes from "classnames";
import "./index.scss";
import { generateId, getTextWidth } from "../services";

/* type WaAutoCompleteProps = { 
    multiple: boolean, 
    data: [{ id:string, name:string, descr:string, iconClass: string }],
    className,
    style, 
    onChange,
    onSelected,
} */

export default function WaAutocomplete({
    data,
    pholder,
    multiple = false,
    className,
    style,
    minWidth,
    onChange,
    onSelected,
}) {
    const rootRef = useRef();
    const [id] = useState("wa-autocomplete-" + generateId());
    const lastClickTargetRef = useRef();
    const renderedDataRef = useRef();
    const previousInputVal = useRef();

    useEffect(() => {
        renderedDataRef.current = JSON.stringify(data);

        const determLastClickTarget = (e) => (lastClickTargetRef.current = e.target);
        document.addEventListener("mousedown", determLastClickTarget);
        return () => document.removeEventListener("mousedown", determLastClickTarget);
    });

    const [suggestions, setSuggestions] = useState(data);
    const [areSuggsShown, setAreSuggsShown] = useState(false);
    const [selectedIds, setSelectedIds] = useState(data.filter((d) => d.defaultSelected).map((d) => d.id));
    const [inputVal, setInputValState] = useState(
        multiple ? "" : props.data.find((d) => d.defaultSelected)?.name ?? "",
    );
    const setInputVal = (newVal) => {
        previousInputVal.current = inputVal;
        setInputValState(newVal);
    };
    const [invalid, setInvalid] = useState(false);
    const [inputHeight, setInputHeight] = useState();
    const [, rerender] = useState();

    let selectedVal = null;
    if (!multiple && selectedIds.length > 0) selectedVal = data.find((d) => d.id == selectedIds[0]);
    let inputWidth = "auto";
    if (rootRef.current)
        inputWidth = getTextWidth(inputVal ? inputVal : pholder, rootRef.current.querySelector("input")) + 22 + "px";

    const suggsVisibility = (show) => {
        if (!show && inputVal) {
            const inputItem = data.find((d) => d.name == inputVal);
            setAreSuggsShown(false);
            setSelectedIds(inputItem ? [...selectedIds, inputItem.id] : selectedIds);
            setInputVal(multiple ? (inputItem ? "" : inputVal) : inputVal);
            setInvalid(!inputItem);
        } else if (areSuggsShown != show) {
            setAreSuggsShown(show);
            setInvalid(false);
        }
    };
    const onChangeNative = (e) => {
        const val = typeof e == "string" ? e : e?.target?.value;
        const newSelectedIds = multiple ? selectedIds : data.filter((d) => val && d.name == val).map((d) => d.id);
        setAreSuggsShown(true);
        setInputVal(val ?? "");
        setSuggestions(
            !val || (!multiple && data.find((d) => d.name == val))
                ? data
                : data.filter((d) => d.name.startsWith(e.target.value)),
        );
        setSelectedIds(newSelectedIds);
        if (onChange) onChange(val);
        if (!multiple && onSelected) {
            const addedId = newSelectedIds.some((id) => !selectedIds.includes(id));
            onSelected(addedId ? data.find((d) => d.id == addedId) : null);
        }
    };
    const onSelectedNative = (id) => {
        if (id == "none") return;
        const selectedItem = data.find((d) => d.id == id);
        const isDeselect = multiple && selectedIds.includes(id);
        const saveFocus = multiple && areSuggsShown;
        const newSelectedIds = multiple
            ? isDeselect
                ? selectedIds.filter((s) => s != id)
                : [...selectedIds, id]
            : [id];
        setSelectedIds(newSelectedIds);
        setInputVal(multiple ? "" : selectedItem.name);
        setSuggestions(data);
        setAreSuggsShown(saveFocus);
        setTimeout(() => rootRef.current?.querySelector("input")[saveFocus ? "focus" : "blur"]());
        if (onSelected)
            onSelected(multiple ? data.filter((d) => newSelectedIds.includes(d.id)) : data.find((d) => d.id == id));
    };
    useEffect(() => {
        if (!rootRef.current) {
            rerender();
            return;
        }
        const newRenderedData = JSON.stringify(data);
        if (selectedIds.some((id) => data.every((d) => d.id != id))) {
            setSelectedIds([]);
            setInputVal("");
            setSuggestions(data);
            setInvalid(false);
            renderedDataRef.current = newRenderedData;
            return;
        }
        if (renderedDataRef.current != newRenderedData) {
            let newSuggestions = data,
                newInputVal = inputVal,
                newInvalid = invalid,
                newSelectedIds = selectedIds;
            if (inputVal) {
                const inputItem = multiple
                    ? data.find((d) => d.name == inputVal)
                    : selectedIds?.length > 0
                      ? data.find((d) => d.id == selectedIds[0])
                      : data.find((d) => d.name == inputVal);
                if (multiple) {
                    if (!inputItem) {
                        newSuggestions = data.filter((d) => d.name == inputVal);
                    } else {
                        if (!rootRef.current.querySelector("input").matches(":focus")) {
                            newInputVal = "";
                            if (!newSelectedIds.includes(inputItem.id))
                                newSelectedIds = [...newSelectedIds, inputItem.id];
                            newInvalid = false;
                        }
                    }
                } else {
                    if (inputItem) {
                        newInputVal = inputItem.name;
                        if (!newSelectedIds.includes(inputItem.id)) newSelectedIds = [inputItem.id];
                    } else {
                        newSelectedIds = [];
                        newInvalid = !rootRef.current.querySelector("input").matches(":focus");
                    }
                }
            }
            setSuggestions(newSuggestions);
            setSelectedIds(newSelectedIds);
            setInputVal(newInputVal);
            setInvalid(newInvalid);
            renderedDataRef.current = newRenderedData;
            return;
        }
        const inputHeight = rootRef.current.querySelector(".wa-autocomplete-control").getBoundingClientRect().height;
        if (inputHeight && inputHeight != inputHeight) setInputHeight(inputHeight);
    });

    return (
        <div
            className={classes("wa-autocomplete", {
                "wa-autocomplete-focused": areSuggsShown,
                className,
            })}
            style={style}
            id={id}
            ref={rootRef}
        >
            <div
                className={classes("wa-autocomplete-control", {
                    "wa-autocomplete-control_invalid": invalid,
                    "wa-autocomplete-control_multiple": multiple,
                })}
            >
                {multiple
                    ? selectedIds.map((id) => {
                          const item = data.find((d) => d.id == id);
                          if (!item) return;
                          return (
                              <span className={classes("wa-autocomplete-tag")} key={item.name}>
                                  {item.iconClass && <span className={item.iconClass}></span>}
                                  {item.name}
                                  <span
                                      className="dashicons dashicons-plus-alt2"
                                      onClick={() => onSelectedNative(id)}
                                  ></span>
                              </span>
                          );
                      })
                    : selectedVal?.iconClass && <span className={selectedVal.iconClass}></span>}
                <input
                    placeholder={pholder}
                    type="search"
                    value={inputVal}
                    style={{ minWidth, width: inputWidth }}
                    onChange={onChangeNative}
                    onFocus={(e) => {
                        if (!e.target.value) onChangeNative();
                        else suggsVisibility(true);
                    }}
                    onBlur={(e) => {
                        if (!lastClickTargetRef.current?.closest("#" + id)) suggsVisibility(false);
                    }}
                    onKeyUp={(e) => {
                        if (e.code == "Escape" || e.code == "Enter") e.target.blur();
                        if (e.code == "Backspace" && !previousInputVal.current)
                            setSelectedIds(selectedIds.slice(0, -1));
                        if (!inputVal && previousInputVal.current) previousInputVal.current = inputVal;
                    }}
                />
                <div
                    className="input-empty-tail"
                    onClick={() => rootRef.current?.querySelector("input")?.focus()}
                ></div>
            </div>
            <div
                className="wa-autocomplete-suggestions"
                style={{
                    display: !areSuggsShown ? "none" : "block",
                    top: inputHeight - 1 + "px",
                }}
            >
                {(suggestions.length > 0
                    ? suggestions
                    : [
                          {
                              id: "none",
                              name: "Нет совпадений",
                              iconClass: "dashicons dashicons-info-outline icon-size-16",
                          },
                      ]
                ).map((sugg) => (
                    <div
                        onClick={() => onSelectedNative(sugg.id)}
                        onMouseDown={(e) => e.preventDefault()}
                        key={sugg.id}
                        className={classes("wa-suggestion-item", {
                            active: selectedIds.includes(sugg.id),
                            none: sugg.id == "none",
                        })}
                    >
                        <div
                            className={classes("wa-suggestion-item-title", {
                                "wa-suggestion-item-title-bold": !!sugg.descr,
                            })}
                        >
                            {sugg.iconClass && <span className={sugg.iconClass}></span>}
                            {sugg.name}
                        </div>
                        {sugg.descr && (
                            <div className="wa-suggestion-item-descr">
                                {"id: " + sugg.id + (sugg.descr ? ", " : "") + sugg.descr}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
