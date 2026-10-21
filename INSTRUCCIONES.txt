CONTROL DE AUSENTISMO v37 - PESTAÑA CAPACITACIÓN Y MÓDULOS POR USUARIO
======================================================================

1. PESTAÑA USUARIOS (Google Sheet)
   a) Agrega una columna nueva con el encabezado exacto:  modulos
      (en la primera columna libre, después de "ultimoAcceso").
   b) En tu fila (hramos) escribe en modulos:  *
   c) Agrega la fila de Karla:
        usuario: karlah | nombre: Karla Hernández | rol: edicion | activo: SI
        claveTemporal: (una clave provisional que le pases) | modulos: *
   d) Los demás usuarios: deja "modulos" vacío para que vean todo menos Capacitación,
      o escribe solo las pestañas que deben ver, separadas por coma.

   Claves de las pestañas (para la columna modulos):
     dashboard        Dashboard Ausentismo
     cumpleanos       Dashboard Cumpleañeros
     registro         Registrar ausencia (además requiere rol edicion)
     historial        Historial
     empleados        Empleados
     kpis-semanales   Kpis ausentismo semanal
     revision-nomina  Revisión nómina
     capacitacion     Capacitación (SIRCE / DC-3)  -> solo con * o si se escribe
     supervisores     Supervisores
     conexion         Conexión (además requiere rol edicion)
   Ejemplo:  dashboard, historial, cumpleanos

2. APPS SCRIPT
   Pega el "Codigo.gs" nuevo -> Ctrl+S -> Implementar -> Administrar implementaciones ->
   lápiz -> Versión: "Nueva versión" -> Implementar. (La URL /exec no cambia.)

3. GITHUB
   Sube index.html y revision-nomina.html a la misma carpeta de siempre.

4. PRIMERA VEZ EN LA PESTAÑA CAPACITACIÓN (en cada computadora)
   Dentro de la pestaña sale "Falta configurar la conexión": entra a "Configuración" de la
   app de capacitación y pega su URL y su clave, igual que cuando la abres por separado.
   El navegador guarda aparte la configuración de la app dentro del dashboard.

NOTAS
- Un cambio en "modulos" o en "rol" se aplica la próxima vez que esa persona abra o recargue la app.
- "modulos" solo oculta pestañas. Lo que cada quien puede guardar lo sigue controlando el rol
  (edicion / lectura) en el Apps Script.
- Los datos de Capacitación siguen en su propia Google Sheet, protegidos por su propia clave.
