import { React, useState, useEffect } from "react";
import "./index.scss";
import WaInfo from "../WaInfo";
import "./index.scss";

function LogsPaginator({ current, total, onChange }) {
    const [currentPage, setCurrentPage] = useState(current);
    const [lastValidPage, setLastValidPage] = useState(current);
    const incrementPage = (delta) => () => {
        let newPage = lastValidPage + delta;
        if (newPage < 1) newPage = 1;
        if (newPage > total) newPage = total;
        setCurrentPage(newPage);
        setLastValidPage(newPage);
    };
    useEffect(() => {
        if (onChange) onChange(lastValidPage);
    }, [lastValidPage]);
    return (
        <div className="logs-paginator">
            <button disabled={lastValidPage == 1} onClick={incrementPage(1)}>
                Назад
            </button>
            <span>Страница</span>
            <input
                type="number"
                value={currentPage}
                className={lastValidPage != currentPage ? "invalid" : ""}
                onChange={(e) => {
                    let val = e.target.value;
                    let valid = val.match(/^\d$/) && Number(val) <= total && Number(val) >= 1;
                    setLastValidPage(!valid ? lastValidPage : Number(val));
                    setCurrentPage(
                        valid ? Number(val) : e.target == document.activeElement ? Number(val) : lastValidPage,
                    );
                }}
                onBlur={() => {
                    if (lastValidPage != currentPage) setCurrentPage(lastValidPage);
                }}
            />
            <span>из {total}</span>
            <button disabled={lastValidPage == total} onClick={incrementPage(-1)}>
                Вперед
            </button>
        </div>
    );
}

function LogsTable({ data }) {
    if (!data || !Array.isArray(data)) return;
    return (
        <table className="logs-table">
            <thead>
                <tr>
                    {data[0].map((d) => (
                        <th>{d}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((d, i) =>
                    i == 0 ? (
                        ""
                    ) : (
                        <tr>
                            {d.map((field) => (
                                <td>{field}</td>
                            ))}
                        </tr>
                    ),
                )}
            </tbody>
        </table>
    );
}

export default function LogsViewer({ formId }) {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("loading");
    const [data, setData] = useState();

    useEffect(async () => {
        setStatus("loading");
        let result;
        try {
            result = await (
                await fetch("/wp-admin/admin-ajax.php?action=wacf7_logs&form=" + formId + "&page=" + page)
            ).json();
        } catch {
            setStatus("error");
            setData("В процессе запроса произошла ошибка");
            return;
        }
        if (!result.success) {
            setStatus("error");
            setData("Ошибка: " + result.message);
            return;
        }
        setStatus("loaded");
        setData(result.data);
        setTotalPages(result.totalPages);
    }, [page]);

    if (status == "error") return <WaInfo type="error">{data}</WaInfo>;
    return (
        <div className="logs-viewer">
            {status == "loading" ? (
                "Загрузка..."
            ) : (
                <div className="logs-viewer-content">
                    <LogsPaginator current={page} total={totalPages} onChange={(newPage) => setPage(newPage)} />
                    <LogsTable data={data} />
                </div>
            )}
        </div>
    );
}

LogsViewer.renderInto = (root, props) => {
    if (!root) return;
    root.innerHTML = "";
    ReactDOM.createRoot(root).render(<LogsViewer {...props} />);
};
