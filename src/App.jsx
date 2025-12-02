import { useEffect, useRef, useState } from "react";
import { whitelist } from "./whitelistData";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null); // { code, allowed, name }
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("scanHistory");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef(null);
  const okAudioRef = useRef(null);
  const ngAudioRef = useRef(null);

  // 進入畫面自動 focus 輸入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 每次歷史更新就同步到 localStorage
  useEffect(() => {
    localStorage.setItem("scanHistory", JSON.stringify(history));
  }, [history]);

  // 之後要做全形轉半形、去除前後空白可在這裡改
  const normalize_code = (raw) => raw.trim();

  const handle_submit = (event) => {
    event.preventDefault();
    const value = normalize_code(code);
    if (!value) return;

    const matched = whitelist.find((item) => item.code == value);
    const allowed = Boolean(matched);

    const scanResult = {
      code: value,
      allowed,
      name: matched?.name ?? "",
      time: new Date().toLocaleTimeString(),
    };

    setResult(scanResult);
    setHistory((prev) => [scanResult, ...prev]);

    if (allowed && okAudioRef.current) {
      okAudioRef.current.currentTime = 0;
      okAudioRef.current.play();
    } else if (!allowed && ngAudioRef.current) {
      ngAudioRef.current.currentTime = 0;
      ngAudioRef.current.play();
    }

    setCode("");
    inputRef.current?.focus();
  };

  const handle_clear_history = () => {
    if (!window.confirm("確定要清空歷史紀錄嗎？")) return;
    setHistory([]);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>白名單掃描器</h1>
        <p className="subtitle">
          條碼槍直接對準輸入框掃描即可。
        </p>
      </header>

      <section className="scan-section">
        <form onSubmit={handle_submit} className="scan-form">
          <label className="scan-label">
            條碼 / 代碼
            <input
              ref={inputRef}
              className="scan-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="請掃描或輸入代碼後按 Enter"
            />
          </label>
          <button type="submit" className="scan-button">
            確認
          </button>
        </form>

        <div className="summary">
          <span>白名單數量：{whitelist.length}</span>
          <span>已掃描：{history.length}</span>
        </div>

        <div className="result-panel">
          <h2>掃描結果</h2>
          {result ? (
            <div
              className={`result-card ${
                result.allowed ? "result-ok" : "result-ng"
              }`}
            >
              <p>
                <strong>代碼：</strong>
                {result.code}
              </p>
              <p>
                <strong>狀態：</strong>
                {result.allowed ? "✅ 允許（在白名單內）" : "⛔ 禁止（不在白名單）"}
              </p>
              {result.name && (
                <p>
                  <strong>名稱：</strong>
                  {result.name}
                </p>
              )}
              <p className="result-time">
                <strong>時間：</strong>
                {result.time}
              </p>
            </div>
          ) : (
            <p>尚未掃描任何代碼。</p>
          )}
        </div>
      </section>

      <section className="history-section">
        <div className="history-header">
          <h2>歷史紀錄</h2>
          <button
            type="button"
            onClick={handle_clear_history}
            className="clear-button"
          >
            清空歷史
          </button>
        </div>

        {history.length === 0 ? (
          <p>目前沒有任何紀錄。</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>時間</th>
                  <th>代碼</th>
                  <th>狀態</th>
                  <th>名稱</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, index) => (
                  <tr
                    key={index}
                    className={row.allowed ? "row-ok" : "row-ng"}
                  >
                    <td>{row.time}</td>
                    <td>{row.code}</td>
                    <td>{row.allowed ? "允許" : "禁止"}</td>
                    <td>{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 音效（檔案放在 public/ 資料夾） */}
      <audio ref={okAudioRef} src="/success.mp3" />
      <audio ref={ngAudioRef} src="/fail.mp3" />
    </div>
  );
}

export default App;
