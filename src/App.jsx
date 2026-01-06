import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isInsideGenesys, setIsInsideGenesys] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | outside | ready | error

  useEffect(() => {
    /* ======================================================
       Detectar si la página está cargada desde Genesys
       ====================================================== */
    const params = new URLSearchParams(window.location.search);
    const gcHostOrigin = params.get("gcHostOrigin");

    if (!gcHostOrigin) {
      console.warn("Página abierta fuera de Genesys Cloud");
      setStatus("outside");
      return;
    }

    setIsInsideGenesys(true);

    /* ======================================================
       Evitar cargar el chat más de una vez
       ====================================================== */
    if (window.Genesys) {
      setStatus("ready");
      return;
    }

    /* ======================================================
       Cargar Genesys Messenger (bootstrap oficial)
       ====================================================== */
    const script = document.createElement("script");
    script.src =
      "https://apps.sae1.pure.cloud/genesys-bootstrap/genesys.min.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      try {
        window.Genesys("boot", {
          environment: "prod-sae1",
          deploymentId: "b417cc0e-fd1e-4867-8dc4-51ee0f79550f"
        });
        setStatus("ready");
      } catch (err) {
        console.error("Error inicializando Genesys Messenger", err);
        setStatus("error");
      }
    };

    script.onerror = () => {
      console.error("No fue posible cargar genesys.min.js");
      setStatus("error");
    };

    document.head.appendChild(script);
  }, []);

  /* ======================================================
     Render
     ====================================================== */
  return (
    <div className="container-fluid">
      <div className="container-image">
        <img
          src="https://api-cdn.sae1.pure.cloud/response-assets/v2/uploads/88cd0b6e-0f75-4ed4-850b-3315e94fc9b5/59502f0a-dbb7-4511-b3cf-a28bf45fb788.73eb1ade-16f9-48e2-8890-1986c6b64a0c.png"
          alt="Asistencia interna"
        />
      </div>

      <div className="container-body">
        <h3>Asistencia interna Sistecrédito</h3>

        {status === "loading" && <p>Cargando…</p>}

        {status === "ready" && isInsideGenesys && (
          <p>
            Bienvenido al chat para asistencia interna de Sistecrédito.
            Para iniciar, presiona el ícono en la parte inferior.
          </p>
        )}

        {status === "outside" && (
          <p style={{ color: "red" }}>
            Esta página solo puede utilizarse desde Genesys Cloud.
          </p>
        )}

        {status === "error" && (
          <p style={{ color: "red" }}>
            Ocurrió un error al cargar el chat.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
