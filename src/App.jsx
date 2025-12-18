import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isInsideGenesys, setIsInsideGenesys] = useState(false);

  useEffect(() => {
    // 1️⃣ Detectar si estamos dentro de Genesys
    const urlParams = new URLSearchParams(window.location.search);
    const gcHostOrigin = urlParams.get("gcHostOrigin");

    if (!gcHostOrigin) {
      console.warn("La página NO está cargada dentro de Genesys");
      return;
    }

    // Estamos dentro de Genesys
    setIsInsideGenesys(true);

    // 2️⃣ Cargar Genesys Messenger SOLO dentro de Genesys
    if (window.Genesys) return;

    const script = document.createElement("script");
    script.src =
      "https://apps.sae1.pure.cloud/genesys-bootstrap/genesys.min.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      window.Genesys("boot", {
        environment: "prod-sae1",
        deploymentId: "b417cc0e-fd1e-4867-8dc4-51ee0f79550f"
      });
    };

    document.head.appendChild(script);
  }, []);

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

        {isInsideGenesys ? (
          <p>
            Bienvenido al chat para asistencia interna de Sistecrédito.
            Para iniciar, presiona el icono en la parte inferior.
          </p>
        ) : (
          <p style={{ color: "red" }}>
            Esta página solo puede utilizarse desde Genesys Cloud.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
