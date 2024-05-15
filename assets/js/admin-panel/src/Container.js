import IconButton from "./IconButton";

export default function Container({ title, children, titleButtons, ...props }) {
    let titleButtonsContent = [];
    if (Array.isArray(titleButtons)) {
        titleButtonsContent = titleButtons.map(
            ([icon, onClick, tooltip]) =>
                icon && onClick && <IconButton type={icon} onClick={onClick} tooltip={tooltip} />,
        );
    }
    return (
        <div className="wa-container" {...props}>
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
