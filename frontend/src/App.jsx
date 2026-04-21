import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState(null);
  const [thread, setThread] = useState(null);
  const [routers, setRouters] = useState([]);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    try {
      const h = await fetch("http://192.168.1.71:8000/api/health");
      const s = await fetch("http://192.168.1.71:8000/api/thread/state");
      const r = await fetch("http://192.168.1.71:8000/api/thread/router-table");
      const l = await fetch("http://192.168.1.71:8000/api/logs/otbr");
      const logJson = await l.json();
      setLogs(logJson.logs || []);

      setHealth(await h.json());
      const threadJson = await s.json();
      setThread(threadJson);

      const routerJson = await r.json();

      const parsed = (routerJson.rows || [])
        .filter(line => line.includes("|"))
        .map(line =>
          line
            .split("|")
            .map(x => x.trim())
            .filter(x => x !== "")
        )
        .filter(cols => cols.length > 2);

      setRouters(parsed);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  const role = thread?.state || "unknown";

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <h1 style={styles.title}>MeshBench</h1>
        <button onClick={loadData} style={styles.button}>
          Refresh
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.label}>Backend</div>
          <div style={badge(health?.status === "ok" ? "green" : "red")}>
            {health?.status || "loading"}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Thread Role</div>
          <div style={badge(roleColor(role))}>{role}</div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Router Table</div>

        <table style={styles.table}>
          <tbody>
            {routers.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={i === 0 ? styles.headerCell : styles.cell}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>OTBR Logs</div>

        <pre style={styles.logBox}>
          {logs.join("\n")}
        </pre>
      </div>
    </div>
  );
}

function roleColor(role) {
  if (role === "leader") return "green";
  if (role === "router") return "blue";
  if (role === "child") return "orange";
  if (role === "detached") return "red";
  return "gray";
}

function badge(color) {
  const colors = {
    green: "#1f7a1f",
    blue: "#2457d6",
    orange: "#c97a12",
    red: "#a52727",
    gray: "#555"
  };

  return {
    display: "inline-block",
    background: colors[color],
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
    marginTop: "10px",
    minWidth: "90px",
    textAlign: "center"
  };
}

const styles = {
  page: {
    background: "#0a0a0a",
    color: "#eaeaea",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },
  title: {
    fontSize: "52px",
    margin: 0
  },
  button: {
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px"
  },
  card: {
    background: "#171717",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 10px rgba(0,0,0,0.35)"
  },
  label: {
    fontSize: "14px",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "14px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  headerCell: {
    padding: "10px",
    borderBottom: "2px solid #555",
    fontWeight: "bold",
    color: "#9fd3ff"
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #333"
  },
  logBox: {
    background: "#0c0c0c",
    padding: "15px",
    borderRadius: "10px",
    maxHeight: "300px",
    overflowY: "auto",
    color: "#7CFC90",
    fontSize: "13px",
    textAlign: "left",
    fontFamily: "Consolas, monospace"
  }
};

export default App;