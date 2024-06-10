export default function VisualSettingsManual() {
    return (
        <div>
            <br />
            <span className="wrong-text">fieldname</span> - передается на почту
            <br />
            <br />
            <b>Выпадающий список стран:</b>
            <br />
            <span className="info-text">[wa_country* fieldname]</span>
            <br />
            <br />
            <b>Маска для номера телефона:</b>
            <br />
            <span className="info-text">[wa_tel* fieldname]</span>
            <br />
            <br />
            <span className="proper-text">top_countries:ru.us.gb</span> - выводит в топе списка указанные страны
            <br />
            <span className="proper-text">locale:en_ru</span> - подпись стран (опционально:{" "}
            <span className="proper-text">en_ru</span>, <span className="proper-text">ru</span>,{" "}
            <span className="proper-text">en</span>, <span className="proper-text">ru_en</span>)
            <br />
            <span className="proper-text">country:auto</span> - автоматический выбор страны на основе языка браузера
            <br />
            <br />
            <b>Пример заполнения:</b>
            <br />
            [wa_country* <span className="wrong-text">fieldname</span>{" "}
            <span className="proper-text">top_countries:ru.us.gb</span>{" "}
            <span className="proper-text">locale:en_ru</span> <span className="proper-text">country:auto</span>]
            <br />
            <br />
            <b>Кнопки выбора:</b>
            <br />
            <span className="info-text">[wa_pick* fieldname "Выбор 1" "Выбор 2" "Выбор 3"]</span>
            <br />
            <br />
            <span className="proper-text">multiple:3</span> - количество одновременно доступных к выбору кнопок (без
            использования <span className="proper-text">multiple</span> доступно выбрать только одну)
            <br />
            <span className="proper-text">"Текст кнопки;https://ссылка_на_икнонку.png;selected"</span> - опция выбора
            (текст кнопки передается на почту)
            <br />
            Необязательный параметр <span className="proper-text">selected</span> отмечает, выделена ли кнопка
            изначально
            <br />
            <span className="proper-text">"https://ссылка_на_икнонку.png;Текст кнопки"</span> - иконка может быть
            размещена до и после текста (png\svg)
            <br />
            <br />
            <span className="wrong-text">*</span>адрес ссылки обязан быть полным
            <br />
            <br />
            <b>Пример заполнения:</b>
            <br />
            [wa_pick* <span className="wrong-text">fieldname</span> <span className="proper-text">multiple:3</span>{" "}
            <span className="proper-text">"Var A;https://ссылка_на_иконку.png"</span>{" "}
            <span className="proper-text">"https://ссылка_на_иконку.png;Var B"</span>{" "}
            <span className="proper-text">"Var C"</span>]
        </div>
    );
}
