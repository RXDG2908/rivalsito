# Función: Team-Up aleatorio en el sorteo (diseño — pendiente de implementar)

## Idea

Nueva opción del sorteo: **"Asignar Team-Up"**. Si está activa, cada jugador además de su
héroe recibe uno de los team-ups de ese héroe al azar, y el **ícono personalizado del
team-up** aparece en la **esquina inferior derecha de la tarjeta** de revelación.

Ejemplo: si toca **Hulk**, sus team-ups son 2 (con Wolverine y con Captain America);
se elige uno al azar y su logo aparece en la tarjeta.

## Datos (ya recolectados)

- `assets/heroes-data/heroes.json` → `heroes[].teamups[]`:
  - `name` — nombre del team-up (ej. "COSMIC CYCLONE")
  - `icon` — PNG del logo personalizado (ej. `img/hulk/teamup-gamma-fastball.png`)
  - `baseEffect` / `enhancedEffect` — descripción y stats oficiales
- `assets/teamups/` — arte adicional de la sección Team-Up del sitio

Para integrarlo a la app: copiar los íconos de team-up necesarios a
`public/teamups/` y generar `src/data/teamups.ts` con el mapa
`heroId → [{ name, icon, partners }]` (mapeando los slugs del JSON a los ids
de `src/data/heroes.ts`).

## Cambios previstos en el código

1. **`src/types.ts`**: agregar `TeamUp { name, icon, partnerHeroIds? }` y
   `PlayerAssignment.teamUp?: TeamUp`.
2. **`src/data/teamups.ts`** (nuevo): mapa `heroId → TeamUp[]`.
3. **`App.tsx`**:
   - Estado `assignTeamUps: boolean` + toggle en la pantalla de configuración
     (junto a "Nombres ON/OFF").
   - En `startDraft`, tras elegir héroe: `teamUp = pick(TEAMUPS[hero.id])`.
4. **`HeroRevealCard.tsx`**: si `assignment.teamUp`, renderizar badge en la esquina
   inferior derecha de la tarjeta (encima del ícono de rol):
   ```tsx
   <img src={teamUp.icon} title={teamUp.name}
        className="absolute bottom-2 right-2 w-9 h-9 rounded-lg border border-white/20
                   bg-black/60 backdrop-blur-md p-1 shadow-lg" />
   ```
   Revelarlo junto con el héroe (mismo timing del sonido final).

## Mejora opcional (v2)

En vez de 100% azar, priorizar team-ups **activables**: si el compañero del team-up
también salió sorteado en el mismo equipo, elegir ese team-up; si no, azar normal.
Requiere `partnerHeroIds` en los datos (se puede completar manualmente con
`heroes.json`, donde cada ficha indica sus compañeros).

## Notas

- Héroes ancla vs. compañeros: el ícono que ve el jugador es el del team-up en su
  propia ficha (cada héroe lista sus team-ups con su ícono en el JSON).
- Los íconos oficiales son PNG con transparencia, se ven bien a 36–40 px.
