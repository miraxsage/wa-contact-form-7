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
    data: initialData,
    pholder,
    multiple = false,
    allowNotPresent = false,
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
    const optionalDataRef = useRef([]);

    const [selectedIds, setSelectedIds] = useState(() => initialData.filter((d) => d.defaultSelected).map((d) => d.id));
    optionalDataRef.current = optionalDataRef.current.filter((d) => selectedIds.find((id) => d.id == id));

    const data = [...initialData, ...(allowNotPresent ? optionalDataRef.current : [])];

    useEffect(() => {
        renderedDataRef.current = JSON.stringify(data);
        const determLastClickTarget = (e) => (lastClickTargetRef.current = e.target);
        document.addEventListener("mousedown", determLastClickTarget);
        return () => document.removeEventListener("mousedown", determLastClickTarget);
    });

    const [suggestions, setSuggestions] = useState(data);
    const [areSuggsShown, setAreSuggsShown] = useState(false);
    const [inputVal, setInputValState] = useState(() =>
        multiple ? "" : data.find((d) => d.defaultSelected)?.name ?? "",
    );
    const setInputVal = (newVal, prevVal) => {
        previousInputVal.current = prevVal === undefined ? inputVal : prevVal;
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
            let newData = data;
            let inputItem = newData.find((d) => d.name == inputVal);
            if (!multiple && selectedIds.length > 0 && selectedIds[0] == inputItem.id) inputItem = null;
            setAreSuggsShown(false);
            if (!inputItem && allowNotPresent && multiple) {
                if (optionalDataRef.current.find((d) => d.name == inputVal)) inputItem = null;
                else {
                    inputItem = { id: generateId(), name: inputVal };
                    optionalDataRef.current.push(inputItem);
                    newData = [...initialData, ...optionalDataRef.current];
                }
                setInputVal("");
            }
            const newInputVal = multiple ? (inputItem ? "" : inputVal) : inputVal;
            if (newInputVal) setInputVal(newInputVal);
            setInvalid(inputItem === undefined && !allowNotPresent);
            if (inputItem) {
                const newSelectedIds = [...selectedIds, inputItem.id];
                setSelectedIds(newSelectedIds);
                if (onSelected)
                    onSelected(
                        multiple
                            ? newData.filter((d) => newSelectedIds.includes(d.id))
                            : newData.find((d) => d.id == inputItem.id),
                    );
            }
        } else if (areSuggsShown != show) {
            setAreSuggsShown(show);
            setInvalid(false);
        }
    };
    const onChangeNative = (e) => {
        let val = typeof e == "string" ? e : e?.target?.value;
        val = val ?? "";
        let newSelectedId = multiple ? undefined : data.filter((d) => val && d.name == val);
        if (newSelectedId)
            if (newSelectedId.length > 0) newSelectedId = newSelectedId[0].id;
            else newSelectedId = null;
        if (
            newSelectedId
                ? selectedIds.length > 0 && selectedIds[0] == newSelectedId
                : newSelectedId === null
                  ? (!allowNotPresent ? true : !val && !previousInputVal.current) && selectedIds.length == 0
                  : undefined
        )
            newSelectedId = undefined;
        setAreSuggsShown(true);
        setInputVal(val, !val && allowNotPresent ? "" : undefined);
        setSuggestions(
            !val || (!multiple && data.find((d) => d.name == val))
                ? data
                : data.filter((d) => d.name.startsWith(e.target.value)),
        );
        if (newSelectedId) setSelectedIds([newSelectedId]);
        if (newSelectedId === null) setSelectedIds([]);
        if (onChange && val != inputVal) onChange(val);
        if (!multiple && onSelected && newSelectedId !== undefined) {
            const selectedItem = newSelectedId
                ? data.find((d) => d.id == newSelectedId)
                : val && allowNotPresent
                  ? { id: "newItem", name: val }
                  : null;
            onSelected(selectedItem);
        }
    };
    const refocusInput = (focus = true) =>
        setTimeout(() => rootRef.current?.querySelector("input")[focus ? "focus" : "blur"]());
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
        let newSuggestions = data;
        const optionalItem = optionalDataRef.current.find((d) => id == d.id);
        if (allowNotPresent && optionalItem && isDeselect)
            newSuggestions = [...initialData, ...optionalDataRef.current.filter((d) => id != d.id)];
        setSuggestions(newSuggestions);
        setAreSuggsShown(saveFocus);
        refocusInput(saveFocus);
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
                    onKeyDown={(e) => {
                        if (e.code == "Escape") e.preventDefault();
                    }}
                    onKeyUp={(e) => {
                        if (e.code == "Escape" || e.code == "Enter") {
                            lastClickTargetRef.current = null;
                            e.target.blur();
                            if (e.code == "Enter" && allowNotPresent && multiple) refocusInput();
                        }
                        if (e.code == "Backspace" && !previousInputVal.current) {
                            const lastId = selectedIds.at(-1);
                            const newSelectedIds = selectedIds.slice(0, -1);
                            setSelectedIds(newSelectedIds);
                            const newOptionalData = optionalDataRef.current.filter((d) => d.id != lastId);
                            if (allowNotPresent && optionalDataRef.current.length != newOptionalData.length)
                                setSuggestions([...initialData, ...newOptionalData]);
                        }
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
