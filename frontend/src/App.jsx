import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState(null);
  const [thread, setThread] = useState(null);
  const [routers, setRouters] = useState([]);

  const loadData = async () => {
    try {
      const h = await fetch("http://192.168.1.71:8000/api/health");
      const s = await fetch("http://192.168.1.71:8000/api/thread/state");
      const r = await fetch("http://192.168.1.71:8000/api/thread/router-table");

      setHealth(await h.json());
      setThread(await s.json());

      const routerJson = await r.json();
      setRouters(routerJson.rows || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background:"#111", color:"#eee", minHeight:"100vh" }}>
      <h1>MeshBench</h1>

      <button onClick={loadData}>Refresh</button>

      <h2>Status</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>

      <h2>Thread State</h2>
      <pre>{JSON.stringify(thread, null, 2)}</pre>

      <h2>Router Table</h2>
      <pre>{routers.join("\n")}</pre>
    </div>
  );
}

export default App;