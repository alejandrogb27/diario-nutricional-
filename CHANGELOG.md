# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa [Semantic Versioning](https://semver.org/lang/es/) (MAJOR.MINOR.PATCH).

La versión actual se define en una sola constante centralizada: `APP_VERSION` en `app.js`.
Se actualiza ahí, y se documenta el cambio acá.

## [1.0.0] - 2026-09-05

Primera versión formalmente versionada del proyecto. En este punto la app ya contaba
con todas las funcionalidades principales en producción:

### Agregado
- Base de alimentos con 41 alimentos precargados, editable/eliminable por el usuario.
- Calendario semanal con 4 comidas por día (desayuno, almuerzo, merienda, cena).
- Comidas predeterminadas ("platos") personalizadas y 9 sugerencias precargadas
  (3 por desayuno/almuerzo/cena), con filtro por etiqueta.
- Resumen diario de calorías y macronutrientes, con objetivos configurables.
- Historial de 7/14/30 días comparado contra objetivos.
- Exportación e importación de datos en formato JSON (backup completo).
- Personalización de apariencia (claro, oscuro, paletas de color personalizadas).
- Botón "Actualizar" en la cabecera para cargar en un solo clic todo el contenido
  nuevo (alimentos y comidas sugeridas) sin duplicar ni tocar datos existentes.
- Indicador de versión de la app (`v1.0.0`) visible junto al botón "Actualizar".

### Notas técnicas
- `APP_VERSION` (Semantic Versioning) es independiente de `VERSION`, que versiona
  el esquema de datos de `localStorage` y gestiona migraciones en `loadState()`.
