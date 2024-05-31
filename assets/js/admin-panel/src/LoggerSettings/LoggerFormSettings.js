import classes from "classnames";
import { useMemo } from "react";
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
    {
        id: "ip_address1",
        name: "IP адрес1",
        iconClass: "dashicons dashicons-location icon-size-16 fix-logger-acmp-icon",
    },
    {
        id: "ip_address2",
        name: "IP адрес2",
        iconClass: "dashicons dashicons-location icon-size-16 fix-logger-acmp-icon",
    },
];

function getForm(formId) {
    if (typeof wacf7Forms == "undefined") return null;
    const form = wacf7Forms.find((f) => f.id == formId);
    if (!form) return null;
    return form;
}

function getFormTitle(formId) {
    const form = getForm(formId);
    if (!form) return "Форма #" + formId;
    return `Форма "${form.title}"`;
}

function getFormTags(formId) {
    const form = getForm(formId);
    if (!form) return [];
    return form.tags;
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

    const fieldsVariants = useMemo(() => {
        const variants = [
            ...standartFields,
            ...getFormTags(id)
                .filter((t) => t.raw_name && t.name)
                .map((t) => ({
                    id: t.raw_name,
                    name: t.name,
                    iconClass: "dashicons dashicons-editor-textcolor",
                })),
        ];
        variants.forEach(
            (f) =>
                (f.iconClass = classes(f.iconClass, {
                    "icon-size-16": !f.iconClass.includes("icon-size-16"),
                    "fix-logger-acmp-icon": !f.iconClass.includes("fix-logger-acmp-icon"),
                })),
        );
        return variants;
    }, [id]);

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
