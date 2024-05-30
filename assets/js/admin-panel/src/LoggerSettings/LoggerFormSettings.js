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

function getFormTitle(formId) {
    if (typeof wacf7Forms == "undefined") return "Форма #" + formId;
    const form = wacf7Forms.find((f) => f.id == formId);
    if (!form) return "Форма #" + formId;
    return `Форма "${form.title}"`;
}

export default function FormLoggerSettings({
    config,
    config: { id },
    style,
    className,
    onDelete,
    onChange,
    formsToAdd,
}) {
    let formsToAddVariants = [];
    if (Array.isArray(formsToAdd))
        formsToAddVariants = formsToAdd.map((f) => ({
            id: f.id,
            name: f.title,
        }));
    const fieldsVariants = [
        ...standartFields,
        { id: "1", name: "your_name", iconClass: "dashicons dashicons-editor-textcolor" },
        { id: "2", name: "your_email", iconClass: "dashicons dashicons-editor-textcolor" },
        { id: "3", name: "your_answer", iconClass: "dashicons dashicons-editor-textcolor" },
    ];
    fieldsVariants.forEach((f) => (f.iconClass = classes(f.iconClass, "icon-size-16 fix-logger-acmp-icon")));
    return (
        <Container
            className={className}
            title={id == "newForm" ? "Добавление формы для логирования" : getFormTitle(id)}
            titleButtons={[
                ...(id == "newForm"
                    ? [["cross", onDelete, "Отменить создание формы"]]
                    : [
                          ["download", () => {}, "Скачать лог"],
                          ["trash", onDelete, "Удалить лог и форму"],
                          ["welcome-view-site", () => {}, "Просмотреть лог"],
                      ]),
            ]}
            style={style}
        >
            {id == "newForm" ? (
                <>
                    <WaInfo>Выберите форму, сконфигурированную в CF7</WaInfo>
                    <WaAutoComplete
                        multiple={false}
                        inherit={true}
                        data={formsToAddVariants}
                        onSelected={(v) => {
                            if (v) onChange({ id: v.id });
                        }}
                    />
                </>
            ) : (
                <>
                    <WaInfo>Укажите поля формы, которые будут сохраняться в файле логов при каждой отправке</WaInfo>
                    <WaAutoComplete
                        inherit={true}
                        data={fieldsVariants}
                        multiple={true}
                        allowNotPresent={true}
                        onSelected={(e) => console.log(e)}
                    />
                </>
            )}
        </Container>
    );
}
