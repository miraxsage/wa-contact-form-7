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
    const previousInputValRef = useRef();
    const useSilentBlurRef = useRef(false);
    const optionalDataRef = useRef([]);

    const [selectedIds, setSelectedIds] = useState(() => initialData.filter((d) => d.defaultSelected).map((d) => d.id));
    optionalDataRef.current = optionalDataRef.current.filter((d) => selectedIds.find((id) => d.id == id));

    let data = [...initialData, ...(allowNotPresent ? optionalDataRef.current : [])];

    useEffect(() => {
        renderedDataRef.current = JSON.stringify(data);
        const determLastClickTarget = (e) => (lastClickTargetRef.current = e.target);
        document.addEventListener("mousedown", determLastClickTarget);
        return () => document.removeEventListener("mousedown", determLastClickTarget);
    });

    let [inputVal, setInputValState] = useState(() =>
        multiple ? "" : data.find((d) => d.defaultSelected)?.name ?? "",
    );
    const setInputVal = (newVal, prevVal) => {
        previousInputValRef.current = prevVal === undefined ? inputVal : prevVal;
        setInputValState(newVal);
    };
    const [areSuggsShown, setAreSuggsShown] = useState(false);
    const suggestions = data.filter((d) => !inputVal || d.name.toLowerCase().includes(inputVal.toLowerCase()));
    const [invalid, setInvalid] = useState(false);
    const [inputHeight, setInputHeight] = useState();
    const [itemsFocusIndex, setItemsFocusIndex] = useState(-1);
    const [, rerender] = useState();

    let selectedVal = null;
    if (!multiple && selectedIds.length > 0) selectedVal = data.find((d) => d.id == selectedIds[0]);
    let inputWidth = "auto";
    if (rootRef.current)
        inputWidth = getTextWidth(inputVal ? inputVal : pholder, rootRef.current.querySelector("input")) + 22 + "px";

    const commitInput = ({ closeSuggs, considerFocusedItem } = {}) => {
        if (itemsFocusIndex >= 0 && considerFocusedItem) selectIds(suggestions[itemsFocusIndex].id);
        else {
            let inputItem = data.find((d) => d.name == inputVal);

            let alreadySelectedItem = false;
            if (inputItem && selectedIds.includes(inputItem.id)) {
                inputItem = null;
                alreadySelectedItem = true;
            }

            if (!inputItem && inputVal) {
                if (allowNotPresent) {
                    if (alreadySelectedItem || optionalDataRef.current.find((d) => d.name == inputVal))
                        inputItem = null;
                    else {
                        inputItem = { id: generateId(), name: inputVal };
                        optionalDataRef.current.push(inputItem);
                        data = [...initialData, ...optionalDataRef.current];
                    }
                    if (multiple) setInputVal("");
                }
            }
            const newInputVal = multiple ? (inputItem || alreadySelectedItem ? "" : inputVal) : inputVal;
            setInputVal(newInputVal);
            setInvalid(inputVal && inputItem === undefined && !allowNotPresent);
            if (inputItem) selectIds(multiple ? [...selectedIds, inputItem.id] : inputItem.id);
        }
        if (typeof closeSuggs == "boolean") setAreSuggsShown(!closeSuggs);
    };
    const onChangeNative = (e) => {
        const val = (typeof e == "string" ? e : e?.target?.value) ?? "";
        if (val == inputVal) return;
        if (!multiple) {
            let newSelectedItem = data.filter((d) => val && d.name == val);
            newSelectedItem = newSelectedItem.length > 0 ? newSelectedItem[0].id : null;
            selectIds(newSelectedItem ?? []);
        }
        setInputVal(val);
        if (onChange) onChange(val);
    };

    const refocusInput = (focus = true) =>
        setTimeout(() => rootRef.current?.querySelector("input")[focus ? "focus" : "blur"]());

    const itemsByIds = (ids) => {
        if (Array.isArray(ids)) return data.filter((d) => ids.includes(d.id));
        return data.find((d) => ids && d.id == ids);
    };

    const blurInput = () => {
        lastClickTargetRef.current = null;
        rootRef.current.querySelector("input").blur();
    };

    const blurInputSilently = () => {
        useSilentBlurRef.current = true;
        blurInput();
    };

    const selectIds = (ids) => {
        if (!ids || ids == "none") return;

        if (Array.isArray(ids)) {
            if (multiple || ids.length == 0) {
                if (ids.toString() == selectedIds.toString()) return;
                setSelectedIds(ids);
                setInputVal("");
                if (onSelected) onSelected(!multiple && ids.length == 0 ? null : itemsByIds(ids));
                return;
            } else ids = ids[0];
        }

        const id = ids;

        const selectedItem = data.find((d) => d.id == id);
        const isDeselect = multiple && selectedIds.includes(id);
        const newSelectedIds = multiple
            ? isDeselect
                ? selectedIds.filter((s) => s != id)
                : [...selectedIds, id]
            : [id];
        if (newSelectedIds.toString() == selectedIds.toString()) return;
        setSelectedIds(newSelectedIds);
        setInputVal(multiple ? "" : selectedItem.name);
        if (onSelected) onSelected(itemsByIds(multiple ? newSelectedIds : id));
    };

    useEffect(() => {
        if (!rootRef.current) {
            rerender();
            return;
        }
        if (itemsFocusIndex >= 0) {
            const suggsContainer = rootRef.current.querySelector(".wa-autocomplete-suggestions");
            const targetSugg = suggsContainer.querySelector(
                ".wa-suggestion-item:nth-child(" + (itemsFocusIndex + 1) + ")",
            );
            const suggMinScrollPos = Math.max(
                0,
                targetSugg.offsetTop + targetSugg.clientHeight - suggsContainer.clientHeight,
            );
            const suggMaxScrollPos = targetSugg.offsetTop;
            if (suggsContainer.scrollTop < suggMinScrollPos) suggsContainer.scrollTop = suggMinScrollPos;
            else if (suggsContainer.scrollTop > suggMaxScrollPos) suggsContainer.scrollTop = suggMaxScrollPos;
        }
        const newRenderedData = JSON.stringify(data);
        if (selectedIds.some((id) => data.every((d) => d.id != id))) {
            setSelectedIds(selectedIds.filter((id) => data.some((d) => d.id == id)));
            setInputVal("");
            setInvalid(false);
            renderedDataRef.current = newRenderedData;
            return;
        }
        if (renderedDataRef.current != newRenderedData) {
            let newInputVal = inputVal,
                newInvalid = invalid,
                newSelectedIds = selectedIds;
            if (inputVal) {
                const inputItem = multiple
                    ? data.find((d) => d.name == inputVal)
                    : selectedIds?.length > 0
                      ? data.find((d) => d.id == selectedIds[0])
                      : data.find((d) => d.name == inputVal);
                if (multiple) {
                    if (inputItem) {
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
                                  <span className="dashicons dashicons-plus-alt2" onClick={() => selectIds(id)}></span>
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
                        setAreSuggsShown(true);
                        setInvalid(false);
                    }}
                    onBlur={(e) => {
                        if (!lastClickTargetRef.current?.closest("#" + id)) {
                            setItemsFocusIndex(-1);
                            if (useSilentBlurRef.current) {
                                useSilentBlurRef.current = false;
                                return;
                            }
                            commitInput({ closeSuggs: true });
                        } else refocusInput();
                    }}
                    onKeyDown={(e) => {
                        if (e.code == "Tab") {
                            lastClickTargetRef.current = null;
                        }
                        if (e.code == "Escape") e.preventDefault();
                        let newFocusIndex = null;
                        if (e.code == "ArrowDown")
                            newFocusIndex =
                                itemsFocusIndex < 0
                                    ? 0
                                    : itemsFocusIndex == suggestions.length - 1
                                      ? -1
                                      : itemsFocusIndex + 1;
                        if (e.code == "ArrowUp")
                            newFocusIndex =
                                itemsFocusIndex < 0
                                    ? suggestions.length - 1
                                    : itemsFocusIndex == 0
                                      ? -1
                                      : itemsFocusIndex - 1;
                        if (newFocusIndex !== null) setItemsFocusIndex(newFocusIndex);
                        else if (!e.code.match("Escape|Enter|ArrowUp|ArrowDown|Tab")) setItemsFocusIndex(-1);
                    }}
                    onKeyUp={(e) => {
                        if (e.code == "Tab") return;
                        if (e.code.match("Escape|Enter|Tab")) {
                            if (e.code.match("Escape|Tab")) {
                                if (itemsFocusIndex >= 0) setItemsFocusIndex(-1);
                                else blurInput();
                            } else {
                                if (!multiple) {
                                    commitInput({ closeSuggs: true, considerFocusedItem: true });
                                    blurInputSilently();
                                } else commitInput({ considerFocusedItem: true });
                            }
                        }
                        if (e.code == "Backspace" && !previousInputValRef.current) selectIds(selectedIds.slice(0, -1));
                        if (!inputVal && previousInputValRef.current) previousInputValRef.current = inputVal;
                    }}
                />
                <div
                    className="input-empty-tail"
                    onClick={() => {
                        let input = rootRef.current?.querySelector("input");
                        if (!input) return;
                        input.focus();
                        input.selectionStart = input.selectionEnd = input.value.length;
                    }}
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
                ).map((sugg, i) => (
                    <div
                        onClick={() => {
                            selectIds(sugg.id);
                            if (!multiple) {
                                setAreSuggsShown(false);
                                blurInputSilently();
                            }
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        key={sugg.id}
                        className={classes("wa-suggestion-item", {
                            active: selectedIds.includes(sugg.id),
                            none: sugg.id == "none",
                            focused: i == itemsFocusIndex,
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
