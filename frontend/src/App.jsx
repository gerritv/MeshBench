import { useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_BASE;

function App() {
  const [health, setHealth] = useState(null);
  const [thread, setThread] = useState(null);
  const [routers, setRouters] = useState([]);
  const [logs, setLogs] = useState([]);
  const [updated, setUpdated] = useState("");
  const [children, setChildren] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [pingTarget, setPingTarget] = useState("");
  const [pingResult, setPingResult] = useState([]);
  const [dataset, setDataset] = useState({});
  const [showDataset, setShowDataset] = useState(false);
  const prevChildrenRef = useRef({});
  const initializedRef = useRef(false);
  const [toast, setToast] = useState("");

  const runPing = async () => {
    try {
      const r = await fetch(
        `${API}/api/thread/ping?target=${encodeURIComponent(pingTarget)}`
      );

      const json = await r.json();
      setPingResult(json.rows || []);
    } catch (err) {
      console.error(err);
    }
  };
  const loadData = async () => {
    try {
      const h = await fetch(`${API}/api/health`);
      const s = await fetch(`${API}/api/thread/state`);
      const r = await fetch(`${API}/api/thread/router-table`);
      const l = await fetch(`${API}/api/logs/otbr`);
      const c = await fetch(`${API}/api/thread/child-table`);
      const n = await fetch(`${API}/api/thread/neighbor-table`);
      const d = await fetch(`${API}/api/thread/dataset`);

      // Retrieve Dataset      
      const datasetJson = await d.json();
      setDataset(datasetJson.dataset || {});

      // Retrieve Neighbours
      const neighborJson = await n.json();

      const parsedNeighbors = (neighborJson.rows || [])
        .filter(line => line.includes("|"))
        .map(line =>
          line.split("|").map(x => x.trim()).filter(x => x !== "")
        )
        .filter(cols => cols.length > 2);

      setNeighbors(parsedNeighbors);

      // Retrieve Children
      const childJson = await c.json();

      const parsedChildren = (childJson.rows || [])
        .filter((line) => line.includes("|"))
        .map((line) =>
          line.split("|").map((x) => x.trim()).filter((x) => x !== "")
        )
        .filter((cols) => cols.length > 2);

      setChildren(parsedChildren);

      // Need at least header row
      if (parsedChildren.length > 0) {
        const header = parsedChildren[0];

        // Find useful columns dynamically
        const ageIndex = header.findIndex(
          (col) => col.toLowerCase() === "age"
        );

        const macIndex = header.findIndex(
          (col) =>
            col.toLowerCase().includes("ext") ||
            col.toLowerCase().includes("mac")
        );

        const childRows = parsedChildren.slice(1);

        const current = {};

        childRows.forEach((row) => {
          const mac =
            macIndex >= 0
              ? row[macIndex]
              : row[row.length - 1];

          const age =
            ageIndex >= 0
              ? parseInt(row[ageIndex], 10)
              : 0;

          if (mac) {
            current[mac] = isNaN(age) ? 0 : age;
          }
        });

        const previous = prevChildrenRef.current;

        // Skip notifications on very first load
        if (initializedRef.current) {
          const joined = Object.keys(current).filter(
            (mac) => !(mac in previous)
          );

          const left = Object.keys(previous).filter(
            (mac) => !(mac in current)
          );

          const rejoined = Object.keys(current).filter(
            (mac) =>
              mac in previous &&
              current[mac] < previous[mac]
          );

          if (joined.length > 0) {
            setToast(
              `New child joined: ${joined[0].slice(0, 8)}...`
            );
          } else if (left.length > 0) {
            setToast(
              `Child left: ${left[0].slice(0, 8)}...`
            );
          } else if (rejoined.length > 0) {
            setToast(
              `Child rejoined: ${rejoined[0].slice(0, 8)}...`
            );
          }
        }

        // Save current snapshot for next poll
        prevChildrenRef.current = current;
        initializedRef.current = true;
      }

      // Set Health of OTBR (isit alive)
      setHealth(await h.json());

      // Set Thread OTBR Role
      setThread(await s.json());

      // Router List
      const routerJson = await r.json();
      const parsed = (routerJson.rows || [])
        .filter(line => line.includes("|"))
        .map(line =>
          line.split("|").map(x => x.trim()).filter(x => x !== "")
        )
        .filter(cols => cols.length > 2);

      setRouters(parsed);

      // Logs
      const logJson = await l.json();
      setLogs(logJson.logs || []);

      // Show time to re-assure user things are actively updating
      setUpdated(new Date().toLocaleTimeString());

    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Log updates
  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  // Timeout for Join/Rejoin notification
  useEffect(() => {
    if (!toast) return;

    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);


  return (


    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>MeshBench</div>
          <div style={styles.sub}>Updated {updated || "..."}</div>
        </div>
        <button style={styles.button} onClick={loadData}>Refresh</button>
      </div>
      {toast && (
        <div style={styles.toast}>
          {toast}
        </div>
      )}
      <div style={styles.topGrid}>
        <Card title="Backend" value={health?.status || "..."} />
        <Card title="Thread Role" value={thread?.state || "..."} />
        <Card title="Children" value={Math.max(children.length - 1, 0)} />
        <Card title="Matter" value="Pending" />
      </div>

      <div style={styles.card}>
        <div style={styles.section}>Router Table</div>
        <table style={styles.table}>
          <tbody>
            {routers.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={i === 0 ? styles.headCell : styles.cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.card}>
        <div style={styles.section}>Child Table</div>

        <table style={styles.table}>
          <tbody>
            {children.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={i === 0 ? styles.headCell : styles.cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>Neighbor Table</div>

        <table style={styles.table}>
          <tbody>
            {neighbors.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={i === 0 ? styles.headCell : styles.cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <div
          style={styles.sectionClickable}
          onClick={() => setShowDataset(!showDataset)}
        >
          {(dataset.network_name || "Unknown")}
          {" | Ch "}
          {(dataset.channel || "?")}
          {" | PAN "}
          {(dataset.pan_id || "?")}
          {" "}
          {showDataset ? "▲" : "▼"}
        </div>

        {showDataset && (
          <table style={styles.table}>
            <tbody>
              {Object.entries(dataset).map(([key, value]) => (
                <tr key={key}>
                  <td
                    style={{
                      ...styles.headCell,
                      color:
                        key === "network_key" || key === "pskc"
                          ? "#caa85a"
                          : styles.headCell.color
                    }}
                  >
                    {key.replaceAll("_", " ")}
                  </td>
                  <td style={styles.cell}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.section}>Ping Tool</div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            value={pingTarget}
            onChange={(e) => setPingTarget(e.target.value)}
            placeholder="fdxx::1234"
            style={styles.input}
          />

          <button style={styles.button} onClick={runPing}>
            Ping
          </button>
        </div>

        <pre style={styles.logs}>
          {pingResult.join("\n")}
        </pre>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>OTBR Logs</div>
        <pre style={styles.logs}>
          {logs.join("\n")}
        </pre>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{title}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  page: {
    background: "#0a0a0a",
    color: "#eee",
    minHeight: "100vh",
    padding: "14px",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold"
  },

  sub: {
    fontSize: "12px",
    color: "#999"
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "10px"
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#1f7a1f",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
    zIndex: 1000,
    fontSize: "13px"
  },
  card: {
    background: "#171717",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "10px"
  },

  label: {
    fontSize: "11px",
    color: "#888",
    textTransform: "uppercase"
  },

  value: {
    fontSize: "20px",
    marginTop: "6px"
  },

  section: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px"
  },

  button: {
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "13px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px"
  },

  headCell: {
    padding: "6px",
    borderBottom: "1px solid #555",
    color: "#8fd3ff",
    fontWeight: "bold"
  },

  cell: {
    padding: "6px",
    borderBottom: "1px solid #2d2d2d"
  },

  sectionClickable: {
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    color: "#d8e6ff",
    marginBottom: "8px"
  },
  notice: {
    fontSize: "11px",
    color: "#caa85a",
    marginBottom: "8px"
  },
  input: {
    flex: 1,
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "8px"
  },

  logs: {
    background: "#0c0c0c",
    padding: "10px",
    borderRadius: "8px",
    maxHeight: "220px",
    overflowY: "auto",
    fontSize: "11px",
    textAlign: "left",
    fontFamily: "Consolas, monospace",
    color: "#8df58d"
  }
};

export default App;