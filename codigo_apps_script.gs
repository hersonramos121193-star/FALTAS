/**
 * CONTROL DE AUSENTISMO - GRUPO METELMEX
 * Backend en Google Apps Script conectado a Google Sheets.
 *
 * INSTRUCCIONES:
 * 1. Crea una hoja de cálculo nueva en Google Drive.
 * 2. Ve a Extensiones -> Apps Script.
 * 3. Borra el código de ejemplo (Code.gs) y pega TODO este archivo.
 * 4. Guarda (icono de disquete).
 * 5. Implementar -> Nueva implementación -> Tipo: Aplicación web.
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Autoriza los permisos que pida Google.
 * 7. Copia la URL que termina en /exec y pégala en la app, en "Conexión".
 *
 * Este script crea automáticamente las pestañas "Ausencias" y
 * "Supervisores" dentro de tu hoja la primera vez que se use.
 */

const HOJA_AUSENCIAS = 'Ausencias';
const HOJA_SUPERVISORES = 'Supervisores';

const COLUMNAS_AUSENCIAS = [
  'id', 'codigo', 'nombre', 'depto', 'puesto', 'supervisor',
  'fecha', 'motivo', 'carta', 'fechaCarta', 'notas', 'creado'
];
const COLUMNAS_SUPERVISORES = ['depto', 'supervisor'];

/* ---------------------------------------------------------
   ENTRADA: GET (lectura) y POST (escritura)
   --------------------------------------------------------- */
function doGet(e) {
  const accion = e.parameter.action;
  try {
    if (accion === 'list') return responder(obtenerAusencias());
    if (accion === 'listSup') return responder(obtenerSupervisores());
    return responder({ error: 'Acción no reconocida: ' + accion });
  } catch (err) {
    return responder({ error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const accion = body.action;

    if (accion === 'add') {
      agregarAusencia(body.registro);
      return responder({ ok: true });
    }
    if (accion === 'delete') {
      eliminarAusencia(body.id);
      return responder({ ok: true });
    }
    if (accion === 'saveSup') {
      guardarSupervisores(body.supervisores || {});
      return responder({ ok: true });
    }
    return responder({ error: 'Acción no reconocida: ' + accion });
  } catch (err) {
    return responder({ error: String(err) });
  }
}

function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------------------------------------------------
   UTILIDAD: obtener o crear hoja
   --------------------------------------------------------- */
function obtenerHoja(nombre, encabezados) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(nombre);
  if (!hoja) {
    hoja = ss.insertSheet(nombre);
    hoja.appendRow(encabezados);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function formatearFecha(valor) {
  if (!valor) return '';
  if (Object.prototype.toString.call(valor) === '[object Date]') {
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(valor);
}

/* ---------------------------------------------------------
   AUSENCIAS
   --------------------------------------------------------- */
function obtenerAusencias() {
  const hoja = obtenerHoja(HOJA_AUSENCIAS, COLUMNAS_AUSENCIAS);
  const datos = hoja.getDataRange().getValues();
  if (datos.length <= 1) return [];
  const encabezados = datos.shift();
  return datos
    .filter(fila => fila[0] !== '') // ignora filas vacías
    .map(fila => {
      const obj = {};
      encabezados.forEach((h, i) => { obj[h] = fila[i]; });
      obj.codigo = String(obj.codigo);
      obj.carta = (obj.carta === true || obj.carta === 'TRUE' || obj.carta === 'true');
      obj.fecha = formatearFecha(obj.fecha);
      obj.fechaCarta = obj.fechaCarta ? formatearFecha(obj.fechaCarta) : '';
      return obj;
    });
}

function agregarAusencia(r) {
  if (!r || !r.codigo || !r.fecha) throw new Error('Registro incompleto');
  const hoja = obtenerHoja(HOJA_AUSENCIAS, COLUMNAS_AUSENCIAS);
  hoja.appendRow([
    r.id, r.codigo, r.nombre, r.depto, r.puesto, r.supervisor,
    r.fecha, r.motivo, r.carta, r.fechaCarta || '', r.notas || '', r.creado
  ]);
}

function eliminarAusencia(id) {
  const hoja = obtenerHoja(HOJA_AUSENCIAS, COLUMNAS_AUSENCIAS);
  const datos = hoja.getDataRange().getValues();
  for (let i = 1; i < datos.length; i++) {
    if (String(datos[i][0]) === String(id)) {
      hoja.deleteRow(i + 1);
      break;
    }
  }
}

/* ---------------------------------------------------------
   SUPERVISORES
   --------------------------------------------------------- */
function obtenerSupervisores() {
  const hoja = obtenerHoja(HOJA_SUPERVISORES, COLUMNAS_SUPERVISORES);
  const datos = hoja.getDataRange().getValues();
  if (datos.length <= 1) return {};
  datos.shift();
  const mapa = {};
  datos.forEach(fila => {
    if (fila[0]) mapa[fila[0]] = fila[1];
  });
  return mapa;
}

function guardarSupervisores(mapa) {
  const hoja = obtenerHoja(HOJA_SUPERVISORES, COLUMNAS_SUPERVISORES);
  hoja.clearContents();
  hoja.appendRow(COLUMNAS_SUPERVISORES);
  Object.keys(mapa).forEach(depto => {
    hoja.appendRow([depto, mapa[depto]]);
  });
}
