import classes from "classnames";
import IconButton from "./IconButton";

export default function Container({ title, children, titleButtons, className, ...props }) {
    let titleButtonsContent = [];
    if (Array.isArray(titleButtons)) {
        titleButtonsContent = titleButtons.map(
            ([icon, onClick, tooltip]) =>
                icon &&
                onClick && (
                    <IconButton style={{ marginLeft: "10px" }} type={icon} onClick={onClick} tooltip={tooltip} />
                ),
        );
    }
    return (
        <div className={classes("wa-container", className)} {...props}>
            {title && (
                <div className="wa-container-title">
                    <span>{title}</span>
                    {titleButtonsContent}
                </div>
            )}
            {children}
        </div>
    );
}
