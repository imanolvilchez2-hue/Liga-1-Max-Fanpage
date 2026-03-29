async function cargarTabla() {
    const tablaBody = document.getElementById("tabla-body");
    const actualizacion = document.getElementById("ultima-actualizacion");
    const boton = document.getElementById("actualizar-btn");

    if (!tablaBody) {
        return;
    }

    if (boton) {
        boton.disabled = true;
        boton.textContent = "Actualizando...";
    }

    try {
        const response = await fetch(`tabla.json?ts=${Date.now()}`);
        const data = await response.json();

        if (!data || !data.table || data.table.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="10">No hay datos disponibles.</td>
                </tr>
            `;
            return;
        }

        tablaBody.innerHTML = data.table.map((equipo) => {
            let claseFila = "";

            if (equipo.pos >= 1 && equipo.pos <= 4) {
                claseFila = "libertadores";
            } else if (equipo.pos >= 5 && equipo.pos <= 8) {
                claseFila = "sudamericana";
            } else if (equipo.pos >= 17) {
                claseFila = "descenso";
            }

            return `
                <tr class="${claseFila}">
                    <td>${equipo.pos ?? "-"}</td>
                    <td>${equipo.equipo ?? "-"}</td>
                    <td>${equipo.pj ?? "-"}</td>
                    <td>${equipo.pg ?? "-"}</td>
                    <td>${equipo.pe ?? "-"}</td>
                    <td>${equipo.pp ?? "-"}</td>
                    <td>${equipo.gf ?? "-"}</td>
                    <td>${equipo.gc ?? "-"}</td>
                    <td>${equipo.dg ?? "-"}</td>
                    <td>${equipo.pts ?? "-"}</td>
                </tr>
            `;
        }).join("");

        if (actualizacion) {
            actualizacion.textContent = "Ultima actualizacion: " + (data.actualizado || "sin datos");
        }
    } catch (error) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="10">Error al cargar la tabla.</td>
            </tr>
        `;
        console.error("Error al cargar tabla:", error);
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.textContent = "Actualizar ahora";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();

    const boton = document.getElementById("actualizar-btn");
    if (boton) {
        boton.addEventListener("click", cargarTabla);
    }
});
