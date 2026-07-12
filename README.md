# 🎮 Rivalsito — Marvel Rivals Drafter

Sorteo táctico de héroes y roles para **Marvel Rivals**. Arma equipos balanceados, sortea héroes con animación de revelación y comparte los resultados con tu squad.

## 📥 Descargar (usuarios)

**No necesitas instalar nada.** Descarga `Rivalsito.exe` desde la página de
[**Releases**](https://github.com/RXDG2908/rivalsito/releases/latest) y ábrelo con doble clic.

- ✅ App portable: un solo archivo, sin instalación
- 🔔 Avisa automáticamente cuando hay una **actualización disponible** (consulta este repositorio al iniciar)
- 💾 Recuerda los jugadores que usas en cada PC (panel "Jugadores Recientes")

> Windows SmartScreen puede mostrar un aviso la primera vez por ser un ejecutable sin firma:
> haz clic en **"Más información" → "Ejecutar de todas formas"**.

## ✨ Funciones

| Modo | Descripción |
|------|-------------|
| **1 Equipo** | Sorteo estándar con roles balanceados (tanques / daño / soporte) |
| **2 Equipos** | Versus completo de hasta 12 jugadores con roles balanceados por equipo |
| **Mezclar Jugadores** | Reparte a todos los jugadores entre ambos equipos al azar |
| **Modo Party** | Todos el mismo héroe, solo tanques, solo daño, solo soporte o aleatorio total |

Además: equipos de 2, 4 o 6 jugadores, roles fijos por jugador, deshabilitar héroes del pool, pegado masivo de nombres, arrastrar y soltar, tema claro/oscuro y copia de resultados al portapapeles.

## 🛠️ Desarrollo

**Requisitos:** Node.js 18+

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (puerto 3000)
npm run lint      # verificación de tipos
npm run build     # build web de producción (dist/)
npm run app       # abrir la app de escritorio (Electron)
npm run dist:exe  # generar release/Rivalsito.exe portable
```

### Estructura del proyecto

```
├── electron/            # proceso principal de Electron (ventana + auto-update check)
├── build/               # recursos de empaquetado (ícono)
├── public/
│   ├── heroes/          # logos de héroes (PNG)
│   ├── roles/           # íconos de rol (Vanguard / Duelist / Strategist)
│   └── branding/        # logo, fondos y marcas
└── src/
    ├── components/      # RoleIcon, HeroRevealCard, PlayerSlot
    ├── data/            # roster de héroes
    ├── utils/           # audio, roles, jugadores recientes (localStorage)
    ├── types.ts
    ├── App.tsx
    └── main.tsx
```

### Publicar una nueva versión

1. Sube el número de versión en `package.json` (ej. `1.1.0`)
2. `npm run dist:exe` y toma `release/Rivalsito.exe`
3. Crea un Release en GitHub con tag `v1.1.0` y adjunta el `.exe`

Los usuarios con versiones anteriores verán el aviso **"Actualización disponible"** al abrir la app.

---

Hecho con React + Vite + Tailwind + Electron • © Renzuky Apps
