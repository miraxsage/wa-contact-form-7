export default function Container({title, children, ...props}){
    return <div className="wa-container" {...props}>
        {title && <div className="wa-container-title">{title}</div>}
        {children}
    </div>
}