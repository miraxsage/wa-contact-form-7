import Container from "../Container";

export default function FormLoggerSettings() {
    return (
        <Container
            title="Форма lsdkf"
            titleButtons={[
                ["download", () => {}, "Скачать лог"],
                ["trash", () => {}, "Удалить лог и форму"],
                ["welcome-view-site", () => {}, "Просмотреть лог"],
            ]}
        >
            <button className="button" style={{ marginBottom: "5px" }}>
                Добавить поле
            </button>
        </Container>
    );
}
