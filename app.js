"use strict";

const STORAGE_KEY = "diarioNutricional";
const VERSION = 2;

const MEALS = [
  { id: "desayuno", nombre: "Desayuno" },
  { id: "almuerzo", nombre: "Almuerzo" },
  { id: "merienda", nombre: "Merienda" },
  { id: "cena", nombre: "Cena" },
];

const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const KCAL_PER_GRAM = { proteinas: 4, carbohidratos: 4, grasas: 9 };

const MACRO_DEFS = [
  { key: "proteinas", label: "Proteínas", color: "protein" },
  { key: "carbohidratos", label: "Carbohidratos", color: "carbs" },
  { key: "grasas", label: "Grasas", color: "fat" },
];

// Base de alimentos precargada para usuarios nuevos.
// Valores de referencia según USDA FoodData Central (alimentos cocidos donde
// corresponde, que es como habitualmente se pesan y consumen). Son valores
// promedio orientativos: el usuario puede editarlos o eliminarlos libremente,
// igual que a cualquier alimento cargado a mano.
const DEFAULT_ALIMENTOS = [
  { id: "seed-pollo-pechuga", nombre: "Pechuga de pollo (cocida)", unidad: "g", calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6, azucares: 0, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-carne-roja", nombre: "Carne roja magra (cocida)", unidad: "g", calorias: 173, proteinas: 25, carbohidratos: 0, grasas: 8, azucares: 0, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-pescado", nombre: "Pescado magro (cocido)", unidad: "g", calorias: 128, proteinas: 26, carbohidratos: 0, grasas: 2.7, azucares: 0, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-arroz", nombre: "Arroz blanco (cocido)", unidad: "g", calorias: 130, proteinas: 2.7, carbohidratos: 28.2, grasas: 0.3, azucares: 0.1, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-fideos", nombre: "Fideos / pasta (cocidos)", unidad: "g", calorias: 157, proteinas: 5.8, carbohidratos: 30.7, grasas: 0.9, azucares: 0.6, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-papa", nombre: "Papa (hervida)", unidad: "g", calorias: 87, proteinas: 1.9, carbohidratos: 20.1, grasas: 0.1, azucares: 0.9, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-lentejas", nombre: "Lentejas (cocidas)", unidad: "g", calorias: 116, proteinas: 9, carbohidratos: 20.1, grasas: 0.4, azucares: 1.8, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-huevo", nombre: "Huevo (unidad, hervido)", unidad: "u", calorias: 78, proteinas: 6.3, carbohidratos: 0.6, grasas: 5.3, azucares: 0.6, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-leche", nombre: "Leche entera", unidad: "ml", calorias: 62, proteinas: 3.3, carbohidratos: 4.7, grasas: 3.4, azucares: 5.4, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-pan", nombre: "Pan blanco", unidad: "g", calorias: 266, proteinas: 7.6, carbohidratos: 50.6, grasas: 3.3, azucares: 4.3, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-avena", nombre: "Avena (cruda)", unidad: "g", calorias: 389, proteinas: 16.9, carbohidratos: 66.3, grasas: 6.9, azucares: 1, etiquetas: ["desayuno"] },
  { id: "seed-yogur", nombre: "Yogur natural entero", unidad: "g", calorias: 63, proteinas: 5.3, carbohidratos: 7, grasas: 1.6, azucares: 7, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-banana", nombre: "Banana (unidad mediana)", unidad: "u", calorias: 105, proteinas: 1.3, carbohidratos: 27, grasas: 0.4, azucares: 14.4, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-manzana", nombre: "Manzana", unidad: "g", calorias: 52, proteinas: 0.3, carbohidratos: 13.8, grasas: 0.2, azucares: 10.4, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-queso", nombre: "Queso duro (tipo cheddar)", unidad: "g", calorias: 403, proteinas: 25, carbohidratos: 1.3, grasas: 33, azucares: 0.5, etiquetas: ["almuerzo", "merienda", "cena"] },
  { id: "seed-arroz-crudo", nombre: "Arroz blanco (crudo)", unidad: "g", calorias: 365, proteinas: 7.1, carbohidratos: 80, grasas: 0.6, azucares: 0.1, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-fideos-secos", nombre: "Fideos / pasta (secos, crudos)", unidad: "g", calorias: 371, proteinas: 13, carbohidratos: 74.7, grasas: 1.5, azucares: 2.7, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-palta", nombre: "Palta", unidad: "g", calorias: 160, proteinas: 2, carbohidratos: 8.5, grasas: 14.7, azucares: 0.7, etiquetas: ["almuerzo", "cena", "merienda"] },
  { id: "seed-tomate", nombre: "Tomate", unidad: "g", calorias: 18, proteinas: 0.9, carbohidratos: 3.9, grasas: 0.2, azucares: 2.6, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-cebolla", nombre: "Cebolla", unidad: "g", calorias: 40, proteinas: 1.1, carbohidratos: 9.3, grasas: 0.1, azucares: 4.2, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-zanahoria", nombre: "Zanahoria", unidad: "g", calorias: 41, proteinas: 0.9, carbohidratos: 9.6, grasas: 0.2, azucares: 4.7, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-choclo", nombre: "Choclo (maíz, cocido)", unidad: "g", calorias: 96, proteinas: 3.4, carbohidratos: 21, grasas: 1.5, azucares: 4.5, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-poroto-negro", nombre: "Poroto negro (cocido)", unidad: "g", calorias: 132, proteinas: 8.9, carbohidratos: 23.7, grasas: 0.5, azucares: 0.3, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-dulce-de-leche", nombre: "Dulce de leche", unidad: "g", calorias: 315, proteinas: 6.8, carbohidratos: 55.4, grasas: 7.4, azucares: 50, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-manteca", nombre: "Manteca", unidad: "g", calorias: 717, proteinas: 0.9, carbohidratos: 0.1, grasas: 81, azucares: 0.1, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-aceite-oliva", nombre: "Aceite de oliva", unidad: "ml", calorias: 884, proteinas: 0, carbohidratos: 0, grasas: 100, azucares: 0, etiquetas: ["almuerzo", "cena"] },
  { id: "seed-azucar", nombre: "Azúcar", unidad: "g", calorias: 387, proteinas: 0, carbohidratos: 100, grasas: 0, azucares: 100, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-harina", nombre: "Harina de trigo", unidad: "g", calorias: 364, proteinas: 10.3, carbohidratos: 76.3, grasas: 1, azucares: 0.3, etiquetas: ["desayuno", "merienda"] },
  { id: "seed-ricota", nombre: "Ricota", unidad: "g", calorias: 174, proteinas: 11.3, carbohidratos: 3, grasas: 13, azucares: 0.3, etiquetas: ["almuerzo", "cena", "merienda"] },
  { id: "seed-jamon-cocido", nombre: "Jamón cocido", unidad: "g", calorias: 105, proteinas: 18, carbohidratos: 1, grasas: 3.5, azucares: 0.5, etiquetas: ["almuerzo", "merienda", "cena"] },
  { id: "seed-milanesa-carne", nombre: "Milanesa de carne (frita)", unidad: "g", calorias: 265, proteinas: 18, carbohidratos: 12, grasas: 16, azucares: 0.5, etiquetas: ["almuerzo", "cena"] },
];

function cloneDefaultAlimentos() {
  return DEFAULT_ALIMENTOS.map((a) => ({ ...a, etiquetas: a.etiquetas.slice() }));
}

let state = loadState();

let selectedDate = todayKey();
let weekOffset = 0;
let foodFilter = "todos";
let foodSearch = "";
let historyRangeDias = 7;

let modalDateKey = null;
let modalMealId = null;
let modalConsumoId = null;
let modalFoodSearch = "";

let presetItemsDraft = [];
let modalPresetDateKey = null;
let modalPresetMealId = null;

function defaultObjetivos() {
  return { calorias: 2000, proteinas: 0, carbohidratos: 0, grasas: 0, azucares: 0 };
}

function loadState() {
  let data = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    data = raw ? JSON.parse(raw) : null;
  } catch (e) {
    data = null;
  }

  if (!data || typeof data !== "object" || data.version !== VERSION) {
    const objetivos = data && data.objetivos ? data.objetivos : defaultObjetivos();
    const platosPrevios = data && Array.isArray(data.platos) ? data.platos : [];
    const esInstalacionNueva = !data;
    return {
      version: VERSION,
      alimentos: esInstalacionNueva ? cloneDefaultAlimentos() : [],
      semanas: {},
      objetivos: objetivos,
      platos: platosPrevios,
    };
  }

  return {
    version: VERSION,
    alimentos: Array.isArray(data.alimentos) ? data.alimentos : [],
    semanas: data.semanas && typeof data.semanas === "object" ? data.semanas : {},
    objetivos: data.objetivos || defaultObjetivos(),
    platos: Array.isArray(data.platos) ? data.platos : [],
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const aviso = document.getElementById("storageWarning");
    if (aviso) aviso.classList.add("hidden");
    return true;
  } catch (e) {
    mostrarAvisoAlmacenamiento();
    return false;
  }
}

function mostrarAvisoAlmacenamiento() {
  const aviso = document.getElementById("storageWarning");
  if (aviso) aviso.classList.remove("hidden");
}

let saveStatusTimeout = null;

document.getElementById("btnGuardarManual").addEventListener("click", function () {
  const ok = saveState();
  const statusEl = document.getElementById("saveStatus");

  statusEl.textContent = ok ? "Guardado ✓" : "No se pudo guardar (ver aviso arriba)";
  statusEl.classList.toggle("guardado-error", !ok);
  statusEl.classList.remove("hidden");

  if (saveStatusTimeout) clearTimeout(saveStatusTimeout);
  saveStatusTimeout = setTimeout(function () {
    statusEl.classList.add("hidden");
  }, 3000);
});

/* ---------- Exportar / Importar datos ---------- */

function exportarDatos() {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "diario-nutricional-" + todayKey() + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById("btnExportar").addEventListener("click", exportarDatos);

document.getElementById("btnImportar").addEventListener("click", function () {
  document.getElementById("importFileInput").click();
});

document.getElementById("importFileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    let data;
    try {
      data = JSON.parse(ev.target.result);
    } catch (err) {
      alert("El archivo no es un JSON válido.");
      e.target.value = "";
      return;
    }

    if (!data || typeof data !== "object" || !Array.isArray(data.alimentos) || typeof data.semanas !== "object") {
      alert("El archivo no tiene el formato esperado de un backup de Mi Diario Nutricional.");
      e.target.value = "";
      return;
    }

    const confirmado = confirm(
      "Esto reemplazará TODOS los datos actuales en este navegador (alimentos, historial, objetivos y comidas predeterminadas) por los del archivo importado. Esta acción no se puede deshacer. ¿Continuar?"
    );
    if (!confirmado) {
      e.target.value = "";
      return;
    }

    state = {
      version: VERSION,
      alimentos: Array.isArray(data.alimentos) ? data.alimentos : [],
      semanas: data.semanas && typeof data.semanas === "object" ? data.semanas : {},
      objetivos: data.objetivos || defaultObjetivos(),
      platos: Array.isArray(data.platos) ? data.platos : [],
    };

    const ok = saveState();

    fillObjetivosForm();
    renderHistoryFilter();
    weekOffset = 0;
    selectedDate = todayKey();
    render();

    e.target.value = "";
    alert(ok ? "Datos importados correctamente." : "Los datos se importaron pero no se pudieron guardar en este navegador (ver aviso arriba).");
  };
  reader.readAsText(file);
});

/* ---------- Apariencia / Tema ---------- */

const TEMA_KEY = "diarioNutricionalTema";

const PALETA_COLORES = [
  { nombre: "Verde", primary: "#2f7d5c", primaryDark: "#25604a" },
  { nombre: "Azul", primary: "#2f6fa8", primaryDark: "#255a87" },
  { nombre: "Violeta", primary: "#6a4fa0", primaryDark: "#523c7d" },
  { nombre: "Naranja", primary: "#c96a2e", primaryDark: "#a5551f" },
  { nombre: "Rosa", primary: "#b8497a", primaryDark: "#953c63" },
  { nombre: "Gris azulado", primary: "#4a6572", primaryDark: "#39505b" },
];

function loadTema() {
  const tema = { modo: "predeterminado", color: null };
  try {
    const raw = localStorage.getItem(TEMA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (["predeterminado", "oscuro", "personalizado"].includes(parsed.modo)) {
          tema.modo = parsed.modo;
        }
        if (parsed.color && parsed.color.primary && parsed.color.primaryDark) {
          tema.color = parsed.color;
        }
      }
    }
  } catch (e) {
    // si falla la lectura, se usa el tema predeterminado
  }
  if (!tema.color) tema.color = PALETA_COLORES[0];
  return tema;
}

function guardarTema() {
  try {
    localStorage.setItem(TEMA_KEY, JSON.stringify(tema));
  } catch (e) {
    // preferencia de apariencia no crítica: si falla el guardado, se ignora
  }
}

let tema = loadTema();

function aplicarTema() {
  const root = document.documentElement;

  if (tema.modo === "oscuro") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  if (tema.modo === "personalizado" && tema.color) {
    root.style.setProperty("--primary", tema.color.primary);
    root.style.setProperty("--primary-dark", tema.color.primaryDark);
  } else {
    root.style.removeProperty("--primary");
    root.style.removeProperty("--primary-dark");
  }
}

function renderThemeUI() {
  const modos = [
    { id: "predeterminado", label: "Predeterminado" },
    { id: "oscuro", label: "Oscuro" },
    { id: "personalizado", label: "Personalizado" },
  ];

  document.getElementById("themeModes").innerHTML = modos
    .map((m) => {
      const active = tema.modo === m.id ? " active" : "";
      return '<button type="button" class="btn btn-secondary' + active + '" onclick="setTemaModo(\'' + m.id + '\')">' + m.label + "</button>";
    })
    .join("");

  const swatchesEl = document.getElementById("themeSwatches");
  if (tema.modo === "personalizado") {
    swatchesEl.classList.remove("hidden");
    swatchesEl.innerHTML = PALETA_COLORES.map((c) => {
      const active = tema.color && tema.color.primary === c.primary ? " active" : "";
      return (
        '<button type="button" class="theme-swatch' + active + '" title="' + c.nombre + '" style="background:' + c.primary +
        '" onclick="setTemaColor(\'' + c.primary + '\',\'' + c.primaryDark + '\')" aria-label="' + c.nombre + '"></button>'
      );
    }).join("");
  } else {
    swatchesEl.classList.add("hidden");
    swatchesEl.innerHTML = "";
  }
}

function setTemaModo(modo) {
  tema.modo = modo;
  guardarTema();
  aplicarTema();
  renderThemeUI();
}

function setTemaColor(primary, primaryDark) {
  tema.color = { primary: primary, primaryDark: primaryDark };
  guardarTema();
  aplicarTema();
  renderThemeUI();
}

function abrirPanelTema() {
  document.getElementById("themePanel").classList.remove("hidden");
  document.getElementById("btnTema").setAttribute("aria-expanded", "true");
}

function cerrarPanelTema() {
  document.getElementById("themePanel").classList.add("hidden");
  document.getElementById("btnTema").setAttribute("aria-expanded", "false");
}

document.getElementById("btnTema").addEventListener("click", function (e) {
  e.stopPropagation();
  const panel = document.getElementById("themePanel");
  if (panel.classList.contains("hidden")) {
    abrirPanelTema();
  } else {
    cerrarPanelTema();
  }
});

document.getElementById("themePanel").addEventListener("click", function (e) {
  e.stopPropagation();
});

document.addEventListener("click", function () {
  cerrarPanelTema();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") cerrarPanelTema();
});

aplicarTema();

function pad(n) {
  return String(n).padStart(2, "0");
}

function dateKeyFrom(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function todayKey() {
  return dateKeyFrom(new Date());
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDate(iso) {
  const parts = iso.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function weekDates(offset) {
  const now = new Date();
  const day = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  monday.setDate(monday.getDate() + offset * 7);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    dates.push({ key: dateKeyFrom(d), date: d, weekday: WEEKDAY_SHORT[d.getDay()] });
  }
  return dates;
}

function getDay(dateKey) {
  if (!state.semanas[dateKey]) {
    state.semanas[dateKey] = { desayuno: [], almuerzo: [], merienda: [], cena: [] };
  }
  return state.semanas[dateKey];
}

function nutritionFor(alimento, cantidad) {
  const base = alimento.unidad === "u" ? 1 : 100;
  const factor = cantidad / base;
  return {
    calorias: alimento.calorias * factor,
    proteinas: alimento.proteinas * factor,
    carbohidratos: alimento.carbohidratos * factor,
    grasas: alimento.grasas * factor,
    azucares: (alimento.azucares || 0) * factor,
  };
}

function dayTotals(dateKey) {
  const day = getDay(dateKey);
  const totals = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, azucares: 0, alimentos: 0 };
  MEALS.forEach((m) => {
    day[m.id].forEach((c) => {
      const al = state.alimentos.find((a) => a.id === c.alimentoId);
      if (!al) return;
      const n = nutritionFor(al, c.cantidad);
      totals.calorias += n.calorias;
      totals.proteinas += n.proteinas;
      totals.carbohidratos += n.carbohidratos;
      totals.grasas += n.grasas;
      totals.azucares += n.azucares;
      totals.alimentos++;
    });
  });
  return totals;
}

// Igual que dayTotals, pero sin crear/guardar una entrada vacía en
// state.semanas para el día consultado. Se usa en el historial, que puede
// recorrer muchos días hacia atrás que nunca tuvieron actividad.
function dayTotalsSoloLectura(dateKey) {
  const day = state.semanas[dateKey];
  const totals = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, azucares: 0, alimentos: 0 };
  if (!day) return totals;
  MEALS.forEach((m) => {
    (day[m.id] || []).forEach((c) => {
      const al = state.alimentos.find((a) => a.id === c.alimentoId);
      if (!al) return;
      const n = nutritionFor(al, c.cantidad);
      totals.calorias += n.calorias;
      totals.proteinas += n.proteinas;
      totals.carbohidratos += n.carbohidratos;
      totals.grasas += n.grasas;
      totals.azucares += n.azucares;
      totals.alimentos++;
    });
  });
  return totals;
}

function round(n) {
  return Math.round(n * 10) / 10;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Alimentos ---------- */

const foodForm = document.getElementById("foodForm");

document.getElementById("unidad").addEventListener("change", function () {
  updateUnidadNota();
});

function updateUnidadNota() {
  const unidad = document.getElementById("unidad").value;
  document.getElementById("unidadNota").textContent =
    unidad === "u" ? "Valores por 1 unidad" : "Valores por 100 g / 100 ml";
}

foodForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const editingId = document.getElementById("editingId").value;
  const data = readFoodForm();

  if (editingId) {
    const food = state.alimentos.find((a) => a.id === editingId);
    if (food) Object.assign(food, data);
  } else {
    state.alimentos.push({ id: nextId(), ...data });
  }

  saveState();
  resetFoodForm();
  render();
});

document.getElementById("btnCancelarEdicion").addEventListener("click", function () {
  resetFoodForm();
});

document.getElementById("btnCargarBasicos").addEventListener("click", function () {
  const existentes = new Set(state.alimentos.map((a) => a.id));
  const faltantes = cloneDefaultAlimentos().filter((a) => !existentes.has(a.id));

  if (faltantes.length === 0) {
    alert("Ya tenés cargados todos los alimentos básicos.");
    return;
  }

  state.alimentos = state.alimentos.concat(faltantes);
  saveState();
  render();
  alert("Se agregaron " + faltantes.length + " alimento(s) básico(s).");
});

function readFoodForm() {
  const tags = Array.from(document.querySelectorAll(".tag-check"))
    .filter((c) => c.checked)
    .map((c) => c.value);

  return {
    nombre: document.getElementById("nombre").value.trim(),
    unidad: document.getElementById("unidad").value,
    calorias: parseFloat(document.getElementById("calorias").value) || 0,
    proteinas: parseFloat(document.getElementById("proteinas").value) || 0,
    carbohidratos: parseFloat(document.getElementById("carbohidratos").value) || 0,
    grasas: parseFloat(document.getElementById("grasas").value) || 0,
    azucares: parseFloat(document.getElementById("azucares").value) || 0,
    etiquetas: tags,
  };
}

function resetFoodForm() {
  foodForm.reset();
  document.getElementById("editingId").value = "";
  document.getElementById("formTitle").textContent = "Agregar alimento";
  document.getElementById("btnGuardar").textContent = "Agregar alimento";
  document.getElementById("btnCancelarEdicion").classList.add("hidden");
  updateUnidadNota();
}

function startEditFood(id) {
  const food = state.alimentos.find((a) => a.id === id);
  if (!food) return;

  document.getElementById("editingId").value = food.id;
  document.getElementById("nombre").value = food.nombre;
  document.getElementById("unidad").value = food.unidad;
  document.getElementById("calorias").value = food.calorias;
  document.getElementById("proteinas").value = food.proteinas;
  document.getElementById("carbohidratos").value = food.carbohidratos;
  document.getElementById("grasas").value = food.grasas;
  document.getElementById("azucares").value = food.azucares || "";

  document.querySelectorAll(".tag-check").forEach((c) => {
    c.checked = food.etiquetas && food.etiquetas.includes(c.value);
  });

  document.getElementById("formTitle").textContent = "Editar alimento";
  document.getElementById("btnGuardar").textContent = "Guardar cambios";
  document.getElementById("btnCancelarEdicion").classList.remove("hidden");
  updateUnidadNota();
  document.getElementById("nombre").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteFood(id) {
  const food = state.alimentos.find((a) => a.id === id);
  if (!food) return;

  const usages = countFoodUsages(id);
  const msg =
    "¿Eliminar \"" + food.nombre + "\"?" +
    (usages > 0 ? " Se quitarán " + usages + " consumo(s) que lo usan de la semana." : "");

  if (!confirm(msg)) return;

  state.alimentos = state.alimentos.filter((a) => a.id !== id);
  Object.keys(state.semanas).forEach((dk) => {
    MEALS.forEach((m) => {
      state.semanas[dk][m.id] = state.semanas[dk][m.id].filter((c) => c.alimentoId !== id);
    });
  });

  saveState();
  resetFoodForm();
  render();
}

function countFoodUsages(id) {
  let count = 0;
  Object.keys(state.semanas).forEach((dk) => {
    MEALS.forEach((m) => {
      count += state.semanas[dk][m.id].filter((c) => c.alimentoId === id).length;
    });
  });
  return count;
}

/* ---------- Comidas predeterminadas (platos) ---------- */

function nutritionForPlato(plato) {
  const totals = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, azucares: 0 };
  plato.items.forEach((it) => {
    const al = state.alimentos.find((a) => a.id === it.alimentoId);
    if (!al) return;
    const n = nutritionFor(al, it.cantidad);
    totals.calorias += n.calorias;
    totals.proteinas += n.proteinas;
    totals.carbohidratos += n.carbohidratos;
    totals.grasas += n.grasas;
    totals.azucares += n.azucares;
  });
  return totals;
}

function renderPresetItemsList() {
  const container = document.getElementById("presetItemsList");
  if (presetItemsDraft.length === 0) {
    container.innerHTML = '<p class="empty-list">Agregá al menos un ingrediente con "+ Agregar ingrediente".</p>';
    return;
  }

  const alimentosOrdenados = state.alimentos
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));

  container.innerHTML = presetItemsDraft
    .map((item, i) => {
      const options = alimentosOrdenados
        .map((a) => '<option value="' + a.id + '"' + (a.id === item.alimentoId ? " selected" : "") + '>' + escapeHtml(a.nombre) + "</option>")
        .join("");
      return (
        '<div class="preset-item-row">' +
        '<select class="preset-item-alimento" onchange="updatePresetItemAlimento(' + i + ', this.value)">' +
        '<option value="">Elegí un alimento</option>' + options + "</select>" +
        '<input type="number" class="preset-item-cantidad" min="0" step="any" placeholder="Cantidad" value="' +
        (item.cantidad === "" || item.cantidad == null ? "" : item.cantidad) +
        '" oninput="updatePresetItemCantidad(' + i + ', this.value)">' +
        '<button type="button" class="icon-btn del" title="Quitar ingrediente" onclick="removePresetItemRow(' + i + ')">✕</button>' +
        "</div>"
      );
    })
    .join("");
}

function addPresetItemRow() {
  presetItemsDraft.push({ alimentoId: "", cantidad: "" });
  renderPresetItemsList();
}

function removePresetItemRow(i) {
  presetItemsDraft.splice(i, 1);
  renderPresetItemsList();
}

function updatePresetItemAlimento(i, value) {
  if (presetItemsDraft[i]) presetItemsDraft[i].alimentoId = value;
}

function updatePresetItemCantidad(i, value) {
  if (presetItemsDraft[i]) presetItemsDraft[i].cantidad = value;
}

document.getElementById("btnAgregarIngrediente").addEventListener("click", function () {
  addPresetItemRow();
});

function showPresetError(msg) {
  const el = document.getElementById("presetError");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hidePresetError() {
  document.getElementById("presetError").classList.add("hidden");
}

document.getElementById("presetForm").addEventListener("submit", function (e) {
  e.preventDefault();
  hidePresetError();

  const nombre = document.getElementById("platoNombre").value.trim();
  const items = presetItemsDraft
    .filter((it) => it.alimentoId && parseFloat(it.cantidad) > 0)
    .map((it) => ({ alimentoId: it.alimentoId, cantidad: parseFloat(it.cantidad) }));

  if (!nombre) {
    showPresetError("Ingresá un nombre para la comida.");
    return;
  }
  if (items.length === 0) {
    showPresetError("Agregá al menos un ingrediente con una cantidad válida.");
    return;
  }

  const editingId = document.getElementById("editingPlatoId").value;
  if (editingId) {
    const plato = state.platos.find((p) => p.id === editingId);
    if (plato) {
      plato.nombre = nombre;
      plato.items = items;
    }
  } else {
    state.platos.push({ id: nextId(), nombre: nombre, items: items });
  }

  saveState();
  resetPresetForm();
  renderPlatos();
});

document.getElementById("btnCancelarPlato").addEventListener("click", function () {
  resetPresetForm();
});

function resetPresetForm() {
  document.getElementById("presetForm").reset();
  document.getElementById("editingPlatoId").value = "";
  document.getElementById("presetFormTitle").textContent = "Crear comida predeterminada";
  document.getElementById("btnGuardarPlato").textContent = "Guardar comida predeterminada";
  document.getElementById("btnCancelarPlato").classList.add("hidden");
  hidePresetError();
  presetItemsDraft = [{ alimentoId: "", cantidad: "" }];
  renderPresetItemsList();
}

function startEditPlato(id) {
  const plato = state.platos.find((p) => p.id === id);
  if (!plato) return;

  document.getElementById("editingPlatoId").value = plato.id;
  document.getElementById("platoNombre").value = plato.nombre;
  presetItemsDraft = plato.items.map((it) => ({ alimentoId: it.alimentoId, cantidad: it.cantidad }));
  renderPresetItemsList();

  document.getElementById("presetFormTitle").textContent = "Editar comida predeterminada";
  document.getElementById("btnGuardarPlato").textContent = "Guardar cambios";
  document.getElementById("btnCancelarPlato").classList.remove("hidden");
  hidePresetError();
  document.getElementById("platoNombre").focus();

  const card = document.getElementById("presetsCard");
  if (!card.open) card.open = true;
  window.scrollTo({ top: card.offsetTop - 10, behavior: "smooth" });
}

function deletePlato(id) {
  const plato = state.platos.find((p) => p.id === id);
  if (!plato) return;

  if (!confirm('¿Eliminar la comida predeterminada "' + plato.nombre + '"? Esto no afecta los consumos que ya cargaste en el calendario.')) return;

  state.platos = state.platos.filter((p) => p.id !== id);
  saveState();
  resetPresetForm();
  renderPlatos();
}

function renderPlatos() {
  const container = document.getElementById("platoList");

  if (state.platos.length === 0) {
    container.innerHTML = '<p class="empty-list">Todavía no creaste comidas predeterminadas.</p>';
    return;
  }

  const platosOrdenados = state.platos
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));

  let html = '<div class="food-list">';
  platosOrdenados.forEach((p) => {
    const n = nutritionForPlato(p);
    const ingredientesTxt = p.items
      .map((it) => {
        const al = state.alimentos.find((a) => a.id === it.alimentoId);
        if (!al) return null;
        return escapeHtml(al.nombre) + " (" + round(it.cantidad) + (al.unidad === "u" ? " u" : " " + al.unidad) + ")";
      })
      .filter(Boolean)
      .join(", ") || "Sin ingredientes válidos";

    html +=
      '<div class="food-card">' +
      '<div class="food-card-head"><div>' +
      '<div class="food-name">' + escapeHtml(p.nombre) + "</div>" +
      '<div class="food-unit">' + ingredientesTxt + "</div>" +
      "</div></div>" +
      '<div class="food-nutri">' +
      '<div><strong>' + round(n.calorias) + "</strong><span>kcal</span></div>" +
      '<div><strong>' + round(n.proteinas) + "</strong><span>Prot</span></div>" +
      '<div><strong>' + round(n.carbohidratos) + "</strong><span>Carb</span></div>" +
      '<div><strong>' + round(n.grasas) + "</strong><span>Grasas</span></div>" +
      '<div><strong>' + round(n.azucares) + "</strong><span>Azúc.</span></div>" +
      "</div>" +
      '<div class="food-actions">' +
      '<button type="button" class="btn-danger" onclick="startEditPlato(\'' + p.id + '\')">Editar</button>' +
      '<button type="button" class="btn-danger" onclick="deletePlato(\'' + p.id + '\')">Eliminar</button>' +
      "</div>" +
      "</div>";
  });
  html += "</div>";

  container.innerHTML = html;
}

/* ---------- Modal: agregar comida predeterminada a un día/comida ---------- */

function openPresetModal(dateKey, mealId) {
  modalPresetDateKey = dateKey;
  modalPresetMealId = mealId;

  const meal = MEALS.find((m) => m.id === mealId);
  document.getElementById("presetModalTitle").textContent = "Agregar comida predeterminada a " + meal.nombre;
  document.getElementById("presetModalInfo").textContent = formatDate(dateKey);

  const container = document.getElementById("presetModalList");
  if (state.platos.length === 0) {
    container.innerHTML =
      '<p class="empty-list">Todavía no creaste comidas predeterminadas. Podés crearlas en la sección "Comidas predeterminadas".</p>';
  } else {
    const platosOrdenados = state.platos
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));

    container.innerHTML = platosOrdenados
      .map((p) => {
        const n = nutritionForPlato(p);
        return (
          '<div class="preset-modal-item">' +
          "<div>" +
          '<div class="food-name">' + escapeHtml(p.nombre) + "</div>" +
          '<div class="food-unit">' + round(n.calorias) + " kcal · P " + round(n.proteinas) +
          " · C " + round(n.carbohidratos) + " · G " + round(n.grasas) + "</div>" +
          "</div>" +
          '<button type="button" class="btn btn-primary" onclick="addPlatoToMeal(\'' + p.id + '\')">Agregar</button>' +
          "</div>"
        );
      })
      .join("");
  }

  document.getElementById("presetModalOverlay").classList.remove("hidden");
}

function closePresetModal() {
  document.getElementById("presetModalOverlay").classList.add("hidden");
  modalPresetDateKey = null;
  modalPresetMealId = null;
}

function addPlatoToMeal(platoId) {
  const plato = state.platos.find((p) => p.id === platoId);
  if (!plato || !modalPresetDateKey || !modalPresetMealId) return;

  const day = getDay(modalPresetDateKey);
  let agregados = 0;
  plato.items.forEach((it) => {
    const al = state.alimentos.find((a) => a.id === it.alimentoId);
    if (!al) return;
    day[modalPresetMealId].push({ id: nextId(), alimentoId: it.alimentoId, cantidad: it.cantidad });
    agregados++;
  });

  if (agregados === 0) {
    alert("No se pudo agregar: los alimentos de esta comida predeterminada ya no existen en la base.");
    return;
  }

  saveState();
  closePresetModal();
  render();
}

document.getElementById("presetModalCancelar").addEventListener("click", closePresetModal);
document.getElementById("presetModalOverlay").addEventListener("click", function (e) {
  if (e.target === this) closePresetModal();
});

/* ---------- Objetivos ---------- */

document.getElementById("objetivosForm").addEventListener("submit", function (e) {
  e.preventDefault();
  state.objetivos = {
    calorias: parseFloat(document.getElementById("objCalorias").value) || 0,
    proteinas: parseFloat(document.getElementById("objProteinas").value) || 0,
    carbohidratos: parseFloat(document.getElementById("objCarbohidratos").value) || 0,
    grasas: parseFloat(document.getElementById("objGrasas").value) || 0,
    azucares: parseFloat(document.getElementById("objAzucares").value) || 0,
  };
  saveState();
  render();
});

function fillObjetivosForm() {
  const obj = state.objetivos;
  document.getElementById("objCalorias").value = obj.calorias > 0 ? obj.calorias : "";
  document.getElementById("objProteinas").value = obj.proteinas > 0 ? obj.proteinas : "";
  document.getElementById("objCarbohidratos").value = obj.carbohidratos > 0 ? obj.carbohidratos : "";
  document.getElementById("objGrasas").value = obj.grasas > 0 ? obj.grasas : "";
  document.getElementById("objAzucares").value = obj.azucares > 0 ? obj.azucares : "";
}

/* ---------- Modal de consumo ---------- */

function rebuildModalSelect(query) {
  const meal = MEALS.find((m) => m.id === modalMealId);
  if (!meal) return;

  const select = document.getElementById("modalAlimento");
  const prevValue = select.value;

  const q = normalizarTexto((query || "").trim());

  let foods = state.alimentos.slice().sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
  if (q) {
    foods = foods.filter((a) => normalizarTexto(a.nombre).includes(q));
  }

  const tagged = foods.filter((a) => a.etiquetas && a.etiquetas.includes(modalMealId));
  const untagged = foods.filter((a) => !(a.etiquetas && a.etiquetas.includes(modalMealId)));

  let html = "";
  if (!q) {
    // sin búsqueda: grupos separados
    if (tagged.length > 0) {
      html += '<optgroup label="Suele usarse en ' + meal.nombre + '">';
      html += tagged.map((a) => optionHtml(a)).join("");
      html += "</optgroup>";
    }
    if (untagged.length > 0) {
      html += '<optgroup label="Otros alimentos">';
      html += untagged.map((a) => optionHtml(a)).join("");
      html += "</optgroup>";
    }
  } else {
    // con búsqueda: lista plana sin grupos
    if (foods.length === 0) {
      html = '<option value="" disabled>Sin resultados</option>';
    } else {
      html = foods.map((a) => optionHtml(a)).join("");
    }
  }

  select.innerHTML = html;

  // restaurar selección previa si sigue disponible
  if (prevValue) select.value = prevValue;

  updateModalPreview();
}

function openModal(dateKey, mealId, consumoId) {
  modalDateKey = dateKey;
  modalMealId = mealId;
  modalConsumoId = consumoId || null;
  modalFoodSearch = "";
  hideModalError();

  const meal = MEALS.find((m) => m.id === mealId);
  document.getElementById("modalTitle").textContent =
    (modalConsumoId ? "Editar consumo · " : "Agregar a ") + meal.nombre;

  const searchEl = document.getElementById("modalFoodSearch");
  searchEl.value = "";

  rebuildModalSelect("");

  if (modalConsumoId) {
    const c = getDay(dateKey)[mealId].find((x) => x.id === modalConsumoId);
    if (c) {
      document.getElementById("modalAlimento").value = c.alimentoId;
      document.getElementById("modalCantidad").value = c.cantidad;
      updateModalPreview();
    }
  } else {
    document.getElementById("modalCantidad").value = "";
  }

  document.getElementById("modalOverlay").classList.remove("hidden");
  searchEl.focus();
}

function optionHtml(al) {
  return '<option value="' + al.id + '">' + escapeHtml(al.nombre) + "</option>";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  modalDateKey = null;
  modalMealId = null;
  modalConsumoId = null;
}

function updateModalPreview() {
  const select = document.getElementById("modalAlimento");
  const al = state.alimentos.find((a) => a.id === select.value);
  const cantidad = parseFloat(document.getElementById("modalCantidad").value) || 0;

  const infoEl = document.getElementById("modalAlimentoInfo");
  if (!al) {
    infoEl.textContent = "";
    document.getElementById("modalPreview").textContent = "";
    return;
  }

  const ref = al.unidad === "u" ? "por unidad" : "por 100 " + (al.unidad === "ml" ? "ml" : "g");
  infoEl.textContent =
    al.nombre + " · " + al.calorias + " kcal · " + al.proteinas + " g prot · " +
    al.carbohidratos + " g carb · " + al.grasas + " g grasas" +
    (al.azucares ? " · " + al.azucares + " g azúcares" : "") + " (" + ref + ")";

  const label = document.getElementById("modalCantidadLabel");
  label.textContent = "Cantidad consumida (" + (al.unidad === "u" ? "unidades" : al.unidad) + ")";

  if (cantidad <= 0 || !al) {
    document.getElementById("modalPreview").textContent = "Ingresá una cantidad para ver el cálculo.";
    return;
  }

  const n = nutritionFor(al, cantidad);
  document.getElementById("modalPreview").innerHTML =
    "<strong>" + round(cantidad) + " " + (al.unidad === "u" ? "u" : al.unidad) + "</strong> &rarr; " +
    "<strong>" + round(n.calorias) + " kcal</strong> &middot; " +
    round(n.proteinas) + " g prot &middot; " +
    round(n.carbohidratos) + " g carb &middot; " +
    round(n.grasas) + " g grasas &middot; " +
    round(n.azucares) + " g azúcares";
}

document.getElementById("modalFoodSearch").addEventListener("input", function () {
  modalFoodSearch = this.value;
  rebuildModalSelect(modalFoodSearch);
  hideModalError();
});

document.getElementById("modalAlimento").addEventListener("change", function () {
  hideModalError();
  updateModalPreview();
});
document.getElementById("modalCantidad").addEventListener("input", function () {
  hideModalError();
  updateModalPreview();
});
document.getElementById("modalCancelar").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

function showModalError(msg) {
  const el = document.getElementById("modalError");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideModalError() {
  document.getElementById("modalError").classList.add("hidden");
}

document.getElementById("consumoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const alimentoId = document.getElementById("modalAlimento").value;
  if (!alimentoId) {
    showModalError("Elegí un alimento de la lista.");
    return;
  }

  const cantidadRaw = document.getElementById("modalCantidad").value;
  const cantidad = parseFloat(cantidadRaw);
  if (cantidadRaw === "" || isNaN(cantidad) || cantidad <= 0) {
    showModalError("Ingresá una cantidad mayor a 0.");
    return;
  }

  hideModalError();

  const day = getDay(modalDateKey);

  if (modalConsumoId) {
    const c = day[modalMealId].find((x) => x.id === modalConsumoId);
    if (c) {
      c.alimentoId = alimentoId;
      c.cantidad = cantidad;
    }
  } else {
    day[modalMealId].push({ id: nextId(), alimentoId: alimentoId, cantidad: cantidad });
  }

  saveState();
  closeModal();
  render();
});

/* ---------- Navegación de semana ---------- */

document.getElementById("btnSemanaAnt").addEventListener("click", function () {
  weekOffset--;
  adjustSelectedDate();
  render();
});

document.getElementById("btnSemanaSig").addEventListener("click", function () {
  weekOffset++;
  adjustSelectedDate();
  render();
});

document.getElementById("btnHoy").addEventListener("click", function () {
  weekOffset = 0;
  selectedDate = todayKey();
  render();
});

function adjustSelectedDate() {
  const week = weekDates(weekOffset);
  const today = todayKey();
  if (week.some((d) => d.key === today)) {
    selectedDate = today;
  } else {
    selectedDate = week[0].key;
  }
}

/* ---------- Render ---------- */

function render() {
  renderDaySummary();
  renderFoods();
  renderTagFilter();
  renderWeek();
  renderHistory();
  renderPlatos();
}

function renderDaySummary() {
  const total = dayTotals(selectedDate);
  const obj = state.objetivos;

  document.getElementById("resumenFecha").textContent = formatDate(selectedDate);
  document.getElementById("totalKcal").textContent = round(total.calorias);
  document.getElementById("totalProteinas").textContent = round(total.proteinas) + " g";
  document.getElementById("totalCarbohidratos").textContent = round(total.carbohidratos) + " g";
  document.getElementById("totalGrasas").textContent = round(total.grasas) + " g";
  document.getElementById("totalAzucares").textContent = round(total.azucares) + " g";

  const kcalGoal = obj.calorias;
  const kcalPct = kcalGoal > 0 ? Math.min(100, (total.calorias / kcalGoal) * 100) : 0;
  document.getElementById("kcalProgressText").textContent =
    round(total.calorias) + " / " + kcalGoal + " kcal";
  const kcalBar = document.getElementById("kcalBar");
  kcalBar.style.width = kcalPct + "%";
  kcalBar.classList.toggle("over", kcalGoal > 0 && total.calorias > kcalGoal);

  const kcalByMacro = {
    proteinas: total.proteinas * KCAL_PER_GRAM.proteinas,
    carbohidratos: total.carbohidratos * KCAL_PER_GRAM.carbohidratos,
    grasas: total.grasas * KCAL_PER_GRAM.grasas,
  };

  const totalMacroKcal = kcalByMacro.proteinas + kcalByMacro.carbohidratos + kcalByMacro.grasas;

  const barsHtml = MACRO_DEFS.map((m) => {
    const kcal = kcalByMacro[m.key];
    const pct = totalMacroKcal > 0 ? (kcal / totalMacroKcal) * 100 : 0;
    return (
      '<div class="bar-item">' +
      '<div class="bar-label"><span>' + m.label + '</span><span>' + Math.round(pct) + "%</span></div>" +
      '<div class="bar-track"><div class="bar-fill ' + m.color + '" style="width:' + pct + '%"></div></div>' +
      "</div>"
    );
  }).join("");

  document.getElementById("macroBars").innerHTML = barsHtml;
  document.getElementById("macroLegend").textContent =
    "Porcentajes aproximados de las calorías aportadas por cada macronutriente (4/4/9 kcal por gramo). Los azúcares ya están incluidos dentro de los carbohidratos.";

  const goalDefs = MACRO_DEFS.concat([{ key: "azucares", label: "Azúcares", color: "sugar" }]);

  let goalsHtml = "";
  goalDefs.forEach((m) => {
    const goal = obj[m.key];
    if (goal <= 0) return;
    const value = total[m.key];
    const pct = Math.min(100, (value / goal) * 100);
    const status = value >= goal ? "goal-ok" : pct >= 75 ? "goal-mid" : "goal-low";
    goalsHtml +=
      '<div class="goal-row">' +
      '<div class="goal-row-head"><span>' + m.label + '</span><span>' + round(value) + " / " + goal + " g</span></div>" +
      '<div class="bar-track"><div class="bar-fill ' + m.color + " " + status + '" style="width:' + pct + '%"></div></div>' +
      "</div>";
  });

  if (goalsHtml) {
    goalsHtml = '<div class="goals-title">Progreso vs. objetivos</div>' + goalsHtml;
  }
  document.getElementById("macroGoals").innerHTML = goalsHtml;
}

/* ---------- Historial ---------- */

function historialTotales(dias) {
  const hoy = new Date();
  const resultado = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - i);
    const key = dateKeyFrom(d);
    resultado.push({
      key: key,
      weekday: WEEKDAY_SHORT[d.getDay()],
      totales: dayTotalsSoloLectura(key),
    });
  }
  return resultado;
}

function renderHistoryFilter() {
  const container = document.getElementById("historyRangeFilter");
  const opciones = [
    { dias: 7, label: "7 días" },
    { dias: 14, label: "14 días" },
    { dias: 30, label: "30 días" },
  ];
  container.innerHTML = opciones
    .map((o) => {
      const active = historyRangeDias === o.dias ? " active" : "";
      return '<button type="button" class="btn btn-secondary' + active + '" onclick="setHistoryRange(' + o.dias + ')">' + o.label + "</button>";
    })
    .join("");
}

function setHistoryRange(dias) {
  historyRangeDias = dias;
  renderHistoryFilter();
  renderHistory();
}

function claseComparacion(valor, objetivo) {
  if (!(objetivo > 0)) return "";
  const pct = (valor / objetivo) * 100;
  if (pct > 110) return "hist-over";
  if (pct >= 90) return "hist-ok";
  return "hist-under";
}

function celdaKcal(kcal, objetivoKcal) {
  const clase = claseComparacion(kcal, objetivoKcal);
  const pct = objetivoKcal > 0 ? " (" + Math.round((kcal / objetivoKcal) * 100) + "%)" : "";
  return '<td class="' + clase + '">' + round(kcal) + pct + "</td>";
}

function renderHistory() {
  const datos = historialTotales(historyRangeDias);
  const obj = state.objetivos;
  const tieneDatos = datos.some((d) => d.totales.alimentos > 0);

  if (!tieneDatos) {
    document.getElementById("historyTable").innerHTML = "";
    document.getElementById("historyEmpty").classList.remove("hidden");
    return;
  }
  document.getElementById("historyEmpty").classList.add("hidden");

  const filas = datos
    .map((d) => {
      const t = d.totales;
      return (
        "<tr>" +
        "<td>" + d.weekday + " " + formatDate(d.key) + "</td>" +
        celdaKcal(t.calorias, obj.calorias) +
        "<td>" + round(t.proteinas) + "</td>" +
        "<td>" + round(t.carbohidratos) + "</td>" +
        "<td>" + round(t.grasas) + "</td>" +
        "<td>" + round(t.azucares) + "</td>" +
        "</tr>"
      );
    })
    .join("");

  const n = datos.length;
  const promedio = datos.reduce(
    (acc, d) => {
      acc.calorias += d.totales.calorias;
      acc.proteinas += d.totales.proteinas;
      acc.carbohidratos += d.totales.carbohidratos;
      acc.grasas += d.totales.grasas;
      acc.azucares += d.totales.azucares;
      return acc;
    },
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, azucares: 0 }
  );
  Object.keys(promedio).forEach((k) => (promedio[k] = promedio[k] / n));

  const filaPromedio =
    '<tr class="history-avg-row">' +
    "<td>Promedio</td>" +
    celdaKcal(promedio.calorias, obj.calorias) +
    "<td>" + round(promedio.proteinas) + "</td>" +
    "<td>" + round(promedio.carbohidratos) + "</td>" +
    "<td>" + round(promedio.grasas) + "</td>" +
    "<td>" + round(promedio.azucares) + "</td>" +
    "</tr>";

  document.getElementById("historyTable").innerHTML =
    "<thead><tr><th>Día</th><th>Kcal" + (obj.calorias > 0 ? " (% obj.)" : "") + "</th><th>Prot (g)</th><th>Carb (g)</th><th>Grasas (g)</th><th>Azúc (g)</th></tr></thead>" +
    "<tbody>" + filas + filaPromedio + "</tbody>";
}

function renderTagFilter() {
  const container = document.getElementById("tagFilter");
  const options = [{ id: "todos", label: "Todos" }].concat(MEALS.map((m) => ({ id: m.id, label: m.nombre })));
  container.innerHTML = options
    .map((o) => {
      const active = foodFilter === o.id ? " active" : "";
      return '<button type="button" class="btn btn-secondary' + active + '" onclick="setFoodFilter(\'' + o.id + '\')">' + o.label + "</button>";
    })
    .join("");
}

function setFoodFilter(f) {
  foodFilter = f;
  renderFoods();
  renderTagFilter();
}

document.getElementById("foodSearch").addEventListener("input", function () {
  foodSearch = this.value;
  renderFoods();
});

function normalizarTexto(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderFoods() {
  const container = document.getElementById("foodList");
  let foods = state.alimentos;
  if (foodFilter !== "todos") {
    foods = foods.filter((a) => a.etiquetas && a.etiquetas.includes(foodFilter));
  }

  const busqueda = normalizarTexto(foodSearch.trim());
  if (busqueda) {
    foods = foods.filter((a) => normalizarTexto(a.nombre).includes(busqueda));
  }

  foods = foods.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));

  if (foods.length === 0) {
    let mensaje = "Todavía no registraste alimentos. Agregá el primero con el formulario.";
    if (state.alimentos.length > 0) {
      mensaje = busqueda ? "No hay alimentos que coincidan con la búsqueda." : "No hay alimentos con esta etiqueta.";
    }
    container.innerHTML = '<p class="empty-list">' + mensaje + "</p>";
    return;
  }

  const refLabel = (al) => (al.unidad === "u" ? "por unidad" : "por 100 " + (al.unidad === "ml" ? "ml" : "g"));

  let html = '<div class="food-list">';
  foods.forEach((al) => {
    html +=
      '<div class="food-card">' +
      '<div class="food-card-head">' +
      '<div>' +
      '<div class="food-name">' + escapeHtml(al.nombre) + "</div>" +
      '<div class="food-unit">Unidad: ' + (al.unidad === "u" ? "unidad" : al.unidad) + " · " + refLabel(al) + "</div>" +
      "</div>" +
      "</div>" +
      '<div class="food-nutri">' +
      '<div><strong>' + round(al.calorias) + "</strong><span>kcal</span></div>" +
      '<div><strong>' + round(al.proteinas) + "</strong><span>Prot</span></div>" +
      '<div><strong>' + round(al.carbohidratos) + "</strong><span>Carb</span></div>" +
      '<div><strong>' + round(al.grasas) + "</strong><span>Grasas</span></div>" +
      '<div><strong>' + round(al.azucares || 0) + "</strong><span>Azúc.</span></div>" +
      "</div>" +
      '<div class="food-tags">' +
      (al.etiquetas || []).map((t) => {
        const meal = MEALS.find((m) => m.id === t);
        return '<span class="tag-chip">' + (meal ? meal.nombre : t) + "</span>";
      }).join("") +
      "</div>" +
      '<div class="food-actions">' +
      '<button type="button" class="btn-danger" onclick="startEditFood(\'' + al.id + '\')">Editar</button>' +
      '<button type="button" class="btn-danger" onclick="deleteFood(\'' + al.id + '\')">Eliminar</button>' +
      "</div>" +
      "</div>";
  });
  html += "</div>";

  container.innerHTML = html;
}

function renderWeek() {
  const week = weekDates(weekOffset);
  const today = todayKey();

  document.getElementById("weekLabel").textContent =
    "Semana del " + formatDate(week[0].key) + " al " + formatDate(week[6].key);

  const container = document.getElementById("weekGrid");
  let html = "";

  week.forEach((d) => {
    const totals = dayTotals(d.key);
    const classes = [];
    if (d.key === selectedDate) classes.push("selected");
    if (d.key === today) classes.push("today");

    html +=
      '<article class="day-col ' + classes.join(" ") + '" data-date="' + d.key + '">' +
      '<div class="day-head" onclick="selectDate(\'' + d.key + '\')">' +
      '<div class="day-name">' + d.weekday + "</div>" +
      '<div class="day-date">' + formatDate(d.key) + "</div>" +
      "</div>";

    MEALS.forEach((m) => {
      const day = getDay(d.key);
      const cons = day[m.id];

      let consHtml = "";
      if (cons.length === 0) {
        consHtml = '<p class="empty-meal">Sin alimentos</p>';
      } else {
        cons.forEach((c) => {
          const al = state.alimentos.find((a) => a.id === c.alimentoId);
          if (!al) return;
          const n = nutritionFor(al, c.cantidad);
          consHtml +=
            '<div class="consumo">' +
            '<div class="consumo-row1">' +
            '<span class="consumo-name">' + escapeHtml(al.nombre) + "</span>" +
            '<span class="consumo-kcal">' + round(n.calorias) + " kcal</span>" +
            "</div>" +
            '<div class="consumo-macros">' + round(c.cantidad) + " " + (al.unidad === "u" ? "u" : al.unidad) +
            " · P " + round(n.proteinas) + " · C " + round(n.carbohidratos) + " · G " + round(n.grasas) + "</div>" +
            '<div class="consumo-actions">' +
            '<button type="button" class="icon-btn" onclick="editConsumo(\'' + d.key + '\',\'' + m.id + '\',\'' + c.id + '\')">Editar</button>' +
            '<button type="button" class="icon-btn del" onclick="deleteConsumo(\'' + d.key + '\',\'' + m.id + '\',\'' + c.id + '\')">Eliminar</button>' +
            "</div>" +
            "</div>";
        });
      }

      const mealKcal = dayTotalsMeal(d.key, m.id);

      html +=
        '<div class="meal-block">' +
        '<div class="meal-block-head">' +
        '<span class="meal-block-name">' + m.nombre + "</span>" +
        '<span class="meal-block-kcal">' + round(mealKcal) + " kcal</span>" +
        '<button type="button" class="btn-add" title="Agregar comida predeterminada a ' + m.nombre + '" onclick="openPresetModal(\'' + d.key + '\',\'' + m.id + '\')">🍽</button>' +
        '<button type="button" class="btn-add" title="Agregar a ' + m.nombre + '" onclick="openModal(\'' + d.key + '\',\'' + m.id + '\')">+</button>' +
        "</div>" +
        '<div class="consumos">' + consHtml + "</div>" +
        "</div>";
    });

    html +=
      '<div class="day-footer">' +
      "<strong>" + round(totals.calorias) + " kcal</strong>" +
      "<span>P " + round(totals.proteinas) + "</span>" +
      "<span>C " + round(totals.carbohidratos) + "</span>" +
      "<span>G " + round(totals.grasas) + "</span>" +
      "<span>Az " + round(totals.azucares) + "</span>" +
      "</div>" +
      "</article>";
  });

  container.innerHTML = html;
}

function dayTotalsMeal(dateKey, mealId) {
  let kcal = 0;
  getDay(dateKey)[mealId].forEach((c) => {
    const al = state.alimentos.find((a) => a.id === c.alimentoId);
    if (!al) return;
    kcal += nutritionFor(al, c.cantidad).calorias;
  });
  return kcal;
}

function selectDate(dateKey) {
  selectedDate = dateKey;
  render();
}

function editConsumo(dateKey, mealId, consumoId) {
  openModal(dateKey, mealId, consumoId);
}

function deleteConsumo(dateKey, mealId, consumoId) {
  const day = getDay(dateKey);
  const c = day[mealId].find((x) => x.id === consumoId);
  if (!c) return;
  const al = state.alimentos.find((a) => a.id === c.alimentoId);
  if (!confirm("¿Eliminar este consumo" + (al ? " de " + al.nombre : "") + "?")) return;

  day[mealId] = day[mealId].filter((x) => x.id !== consumoId);
  saveState();
  render();
}

/* ---------- Init ---------- */

renderThemeUI();
fillObjetivosForm();
renderHistoryFilter();
presetItemsDraft = [{ alimentoId: "", cantidad: "" }];
renderPresetItemsList();
render();