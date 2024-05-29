import classes from "classnames";
import Container from "../Container";
import WaAutoComplete from "../WaAutocomplete";
import WaInfo from "../WaInfo";

const standartFields = [
    {
        id: "submit_time",
        name: "Время отправки",
        iconClass: "dashicons dashicons-clock icon-size-16 fix-logger-acmp-icon",
    },
    {
        id: "ip_address",
        name: "IP адрес",
        iconClass: "dashicons dashicons-location icon-size-16 fix-logger-acmp-icon",
    },
];

export default function FormLoggerSettings({ config, config: { id }, style, onDelete }) {
    const fieldsVariants = [
        ...standartFields,
        { id: "1", name: "your_name", iconClass: "dashicons dashicons-editor-textcolor" },
        { id: "2", name: "your_email", iconClass: "dashicons dashicons-editor-textcolor" },
        { id: "3", name: "your_answer", iconClass: "dashicons dashicons-editor-textcolor" },
    ];
    fieldsVariants.forEach((f) => (f.iconClass = classes(f.iconClass, "icon-size-16 fix-logger-acmp-icon")));
    return (
        <Container
            title={`Форма ${id}`}
            titleButtons={[
                ["download", () => {}, "Скачать лог"],
                ["trash", onDelete, "Удалить лог и форму"],
                ["welcome-view-site", () => {}, "Просмотреть лог"],
            ]}
            style={style}
        >
            <WaInfo>Укажите поля формы, которые будут сохраняться в файле логов при каждой отправке</WaInfo>
            <WaAutoComplete multiple={true} inherit={true} data={fieldsVariants} />
        </Container>
    );
}
