import React, { useState } from "react";

/* 主题色 */
const theme = {
  bg: "#FFF5F9",
  btn: "#FF86C8",
  btnTxt: "#fff",
  card: "#FFFFFFCC",
  gridLine: "#FFB3DA",
  link: "#FF4FA0",
};

export default function App() {
  const [result, setResult] = useState(null);
  const [rowsText, setRowsText] = useState("");
  const [colsText, setColsText] = useState("");

  /* ---------- 上传 ---------- */
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("http://127.0.0.1:8000/solve", {
      method: "POST",
      body: fd,
    });
    setResult(await res.json());
  };

  /* ---------- 手动求解 ---------- */
  const handleManual = async () => {
    if (!rowsText.trim() || !colsText.trim()) return;
    const rows = rowsText.trim().split("\n").map((l) => l.trim().split(/\s+/).map(Number));
    const cols = colsText.trim().split("\n").map((l) => l.trim().split(/\s+/).map(Number));
    const res = await fetch("http://127.0.0.1:8000/solve_manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows, cols }),
    });
    setResult(await res.json());
  };

  /* ---------- 画网格 ---------- */
  const renderGrid = () =>
    result?.grid?.length ? (
      <div style={{ marginTop: 50, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${result.grid[0].length}, 24px)`,
            gap: 2,
            background: theme.gridLine,
            padding: 2,
            borderRadius: 6,
          }}
        >
          {result.grid.flat().map((c, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                background: c === "■" ? "#000" : "#fff",
              }}
            />
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        fontFamily: "Nunito, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
      }}
    >
      {/* 渐变标题 */}
      <h1
        style={{
          background: "linear-gradient(90deg,#FF86C8 0%,#FFCE62 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: 30,
        }}
      >
        Nonogram Solver
      </h1>

      {/* 卡片容器 */}
      <div
        style={{
          background: theme.card,
          boxShadow: "0 6px 16px #ffb3da55",
          borderRadius: 16,
          padding: 30,
        }}
      >
        {/* 上传按钮 */}
        <label
          style={{
            display: "inline-block",
            background: theme.btn,
            color: theme.btnTxt,
            padding: "8px 22px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          选择文件
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>

        {/* 手动区域标题 */}
        <h3 style={{ marginTop: 25, marginBottom: 12 }}>手动贴行 / 列提示：</h3>

        {/* 文本框行列 */}
        <div style={{ display: "flex", gap: 20 }}>
          <textarea
            rows={8}
            cols={18}
            placeholder="行：2 3 2 4"
            value={rowsText}
            onChange={(e) => setRowsText(e.target.value)}
            style={{
              resize: "vertical",
              border: "1px solid #FFB3DA",
              borderRadius: 8,
              padding: 6,
              fontFamily: "monospace",
            }}
          />
          <textarea
            rows={8}
            cols={18}
            placeholder="列：4 4 1 2"
            value={colsText}
            onChange={(e) => setColsText(e.target.value)}
            style={{
              resize: "vertical",
              border: "1px solid #FFB3DA",
              borderRadius: 8,
              padding: 6,
              fontFamily: "monospace",
            }}
          />
        </div>

        {/* 手动求解按钮 */}
        <button
          onClick={handleManual}
          style={{
            marginTop: 16,
            background: theme.btn,
            color: theme.btnTxt,
            border: "none",
            padding: "8px 26px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          手动求解
        </button>

        {/* 折叠 JSON */}
        {result && (
          <details
            style={{
              marginTop: 24,
              maxHeight: 150,
              overflow: "auto",
            }}
          >
            <summary style={{ cursor: "pointer", color: theme.link }}>
              ▶ 查看原始 JSON
            </summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        )}
      </div>

      {/* 网格图 */}
      {renderGrid()}
    </div>
  );
}