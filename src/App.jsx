import { useEffect, useRef, useState } from "react";
import { whitelist as initialList } from "./whitelistData";
import "./App.css";

import ScanInput from "./components/ScanInput";
import HistoryPanel from "./components/HistoryPanel";
import ResultPanel from "./components/ResultPanel";
import ToolBar from "./components/ToolBar";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("scanHistory");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [whitelist, setWhitelist] = useState(initialList);
  const [watchPath, setWatchPath] = useState(null);

  const inputRef = useRef(null);
  const okAudioRef = useRef(null);
  const ngAudioRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("scanHistory", JSON.stringify(history));
  }, [history]);

  const normalize_code = (raw) => raw.trim();

  const handle_submit = (event) => {
    event.preventDefault();
    const value = normalize_code(code);
    if (!value) return;

    const matched = whitelist.find((item) => item.code === value);
    const allowed = Boolean(matched);

    const scanResult = {
      code: value,
      allowed,
      name: matched?.name ?? "",
      time: new Date().toLocaleTimeString(),
    };

    setResult(scanResult);
    setHistory((prev) => [scanResult, ...prev]);

    if (allowed) {
      okAudioRef.current?.play();
    } else {
      ngAudioRef.current?.play();
    }

    setCode("");
  };

  const handle_clear_history = () => {
    if (!window.confirm("確定要清空歷史紀錄嗎？")) return;
    setHistory([]);
  };

  const handle_delete_one = (index) => {
    const list = [...history];
    list.splice(index, 1);
    setHistory(list);
  };

  return (
    <div className="app-root">
      <section className="theme-section">
        <header className="app-header">
          <h1>白名單掃描器</h1>
        </header>

        <ScanInput
          code={code}
          setCode={setCode}
          onSubmit={handle_submit}
          inputRef={inputRef}
        />
        <ResultPanel result={result} />

        <ToolBar
          whitelist={whitelist}
          history={history}
          setWhitelist={setWhitelist}
          setWatchPath={setWatchPath}
        />
      </section>
      <section className="theme-section">
        <header className="app-header">
          <h1>掃描歷史紀錄</h1>
        </header>
        <HistoryPanel
          history={history}
          clearHistory={handle_clear_history}
          deleteOne={handle_delete_one}
        />
      </section>
      <audio ref={okAudioRef} src="/success.mp3" />
      <audio ref={ngAudioRef} src="/fail.mp3" />
    </div>
  );
}

export default App;
