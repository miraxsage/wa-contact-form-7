import classes from "classnames";

export default function WaTab({ active = false, title, onClick }) {
    return (
        <li
            class={classes("cf-container__tabs-item", { "cf-container__tabs-item--current": active })}
            tabindex="-1"
            role="tab"
            aria-selected="false"
        >
            <button type="button" onClick={() => onClick(title)}>
                {title}
            </button>
        </li>
    );
}
