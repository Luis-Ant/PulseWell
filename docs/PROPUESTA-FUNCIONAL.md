# PulseWell — Propuesta de Evolución Funcional

> **Documento**: Plan maestro para transformar el MVP demo en una plataforma funcional  
> **Fecha**: Junio 2026  
> **Audiencia**: Producto, Ingeniería, Inversión

---

## 1. Diagnóstico Actual

### Lo que funciona (MVP demo)
- ✅ Auth con 4 roles (Supabase SSR)
- ✅ Seed data con narrativa predefinida
- ✅ Dashboard HR con métricas, alertas, recomendaciones, proyección
- ✅ Dashboard Manager con vista de equipo único
- ✅ Motor analítico con 75 tests unitarios
- ✅ Alert engine dinámico con 6 tipos de alerta
- ✅ Landing page con propuesta de valor

### Lo que NO funciona (bloqueantes para uso real)
- 🔴 **La encuesta es inusable**: el seed crea respuestas para TODAS las semanas incluyendo la actual. El empleado siempre ve "¡Gracias por responder!" porque ya "respondió" este período.
- 🔴 **Admin dashboard es un stub**: 11 líneas placeholder. El rol ADMIN no tiene ninguna utilidad real.
- 🟡 **No hay CRUD de equipos/usuarios/encuestas**: Todo viene del seed. No se pueden crear, editar ni eliminar entidades desde la UI.
- 🟡 **Landing no muestra evolución**: Un inversionista no ve hacia dónde va el producto.

---

## 2. Visión del Producto Funcional

### Flujo de onboarding real

```
1. ADMIN crea la organización
2. ADMIN crea equipos (Engineering, Sales, etc.)
3. ADMIN crea usuarios y asigna roles:
   - HR Analysts (con acceso cross-equipo)
   - Managers (asignados a un equipo)
   - Employees (asignados a un equipo)
4. ADMIN crea/activa una encuesta pulse semanal
5. EMPLOYEES responden la encuesta (5 preguntas, escala 1-5)
6. El motor analítico procesa las respuestas
7. HR y MANAGERS ven dashboards con métricas reales
8. El sistema genera alertas y recomendaciones automáticamente
```

### Diferencias clave vs MVP actual

| Aspecto | MVP Demo | Propuesta Funcional |
|---------|----------|---------------------|
| Datos | Precargados por seed, estáticos | Creados por el admin, dinámicos |
| Encuesta | Inusable (siempre "ya respondiste") | Funcional: responde la semana actual |
| Admin | Stub inservible | Dashboard completo con CRUD |
| Equipos | Fijos (4) | Creables/editables por admin |
| Usuarios | Fijos (20) | Creables por admin, asignables a equipos |
| Encuestas | 1 hardcodeada | Creables/activables por admin |
| Demo | Guion fijo con datos narrativos | Demo real: admin crea todo y muestra el flujo |

---

## 3. Plan de Implementación por Fases

### Fase 10 — Fix Crítico + Admin Core

**Objetivo**: Desbloquear la encuesta y darle utilidad al rol ADMIN.

| # | Entregable | Descripción |
|---|---|---|
| 10.1 | **Fix seed**: semanas pasadas | `getRecentWeeks()` debe generar solo semanas ANTERIORES, no la actual. El empleado debe poder responder HOY. |
| 10.2 | **Admin dashboard funcional** | Reemplazar stub con panel de control: resumen de la org, contadores, acciones |
| 10.3 | **Admin: regenerar datos** | Botones para regenerar seed data y regenerar alertas desde métricas actuales |
| 10.4 | **Admin: vista de equipos** | Tabla/listado de equipos con contadores (usuarios, OWI, riesgo) |

**Criterios de salida**:
- Employee puede loguearse y ver el FORMULARIO de encuesta (no la confirmación)
- Employee puede responder las 5 preguntas y ver confirmación REAL
- Admin dashboard muestra datos útiles y acciones funcionales

---

### Fase 11 — Admin CRUD: Equipos y Usuarios

**Objetivo**: Permitir que el admin cree y gestione la estructura organizacional.

| # | Entregable | Descripción |
|---|---|---|
| 11.1 | **API: CRUD de equipos** | `POST/PUT/DELETE /api/admin/teams` — crear, editar, eliminar equipos |
| 11.2 | **API: CRUD de usuarios** | `POST/PUT/DELETE /api/admin/users` — crear, editar, eliminar usuarios con rol y equipo |
| 11.3 | **UI: Gestión de equipos** | Formulario para crear/editar equipos, tabla con acciones |
| 11.4 | **UI: Gestión de usuarios** | Formulario con email, nombre, rol, equipo. Tabla con filtros |
| 11.5 | **UI: Panel de admin con pestañas** | Navegación interna: Resumen, Equipos, Usuarios, Encuestas |

**Criterios de salida**:
- Admin puede crear un equipo "Marketing" con 3 empleados
- Admin puede crear un HR Analyst, un Manager, y empleados
- Los nuevos usuarios pueden loguearse y ver sus dashboards correspondientes
- Manager del nuevo equipo solo ve SU equipo

---

### Fase 12 — Admin CRUD: Encuestas + Landing Roadmap

**Objetivo**: Completar el ciclo de gestión y comunicar la visión del producto.

| # | Entregable | Descripción |
|---|---|---|
| 12.1 | **API: CRUD de encuestas** | `POST /api/admin/surveys` — crear/activar/desactivar encuestas |
| 12.2 | **UI: Gestión de encuestas** | Formulario para crear encuesta, toggle activar/desactivar |
| 12.3 | **Landing: Roadmap section** | Timeline visual con fases del producto (MVP → Piloto → SaaS) |
| 12.4 | **Landing: Features futuras** | Sección "Lo que viene" con cards de features planeadas |
| 12.5 | **Integración final** | Probar flujo completo: admin crea todo → empleado responde → HR ve dashboard |

**Criterios de salida**:
- Demo funcional de punta a punta sin depender del seed narrativo
- Admin puede crear una organización desde cero
- Landing page comunica la evolución del producto
- Inversionista entiende el roadmap en 30 segundos

---

## 4. Arquitectura Técnica

### Nuevos archivos a crear

```
Fase 10:
├── scripts/seed.ts                   # [MODIFIED] getRecentWeeks → solo pasadas
├── app/(protected)/admin/
│   ├── page.tsx                      # [REWRITE] Dashboard funcional
│   ├── loading.tsx                   # [NEW] Skeleton
│   └── error.tsx                     # [NEW] Error boundary

Fase 11:
├── app/api/admin/
│   ├── teams/route.ts                # [NEW] GET + POST
│   ├── teams/[id]/route.ts           # [NEW] PUT + DELETE
│   ├── users/route.ts                # [NEW] GET + POST
│   └── users/[id]/route.ts           # [NEW] PUT + DELETE
├── components/admin/
│   ├── TeamForm.tsx                  # [NEW] Formulario crear/editar equipo
│   ├── UserForm.tsx                  # [NEW] Formulario crear/editar usuario
│   ├── TeamTable.tsx                 # [NEW] Tabla de equipos
│   └── UserTable.tsx                 # [NEW] Tabla de usuarios
├── app/(protected)/admin/
│   ├── teams/page.tsx                # [NEW] Página de gestión de equipos
│   └── users/page.tsx                # [NEW] Página de gestión de usuarios

Fase 12:
├── app/api/admin/
│   └── surveys/route.ts              # [NEW] GET + POST survey mgmt
├── components/admin/
│   └── SurveyForm.tsx                # [NEW] Formulario crear/activar encuesta
├── app/(protected)/admin/
│   └── surveys/page.tsx              # [NEW] Página de gestión de encuestas
├── components/landing/
│   └── RoadmapSection.tsx            # [NEW] Timeline visual de roadmap
├── app/(public)/page.tsx             # [MODIFIED] Agregar RoadmapSection
```

### APIs a crear

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/admin/teams` | ADMIN | Listar equipos con contadores |
| POST | `/api/admin/teams` | ADMIN | Crear equipo |
| PUT | `/api/admin/teams/[id]` | ADMIN | Editar equipo |
| DELETE | `/api/admin/teams/[id]` | ADMIN | Eliminar equipo (si no tiene usuarios) |
| GET | `/api/admin/users` | ADMIN | Listar usuarios con equipo |
| POST | `/api/admin/users` | ADMIN | Crear usuario (crea auth + prisma) |
| PUT | `/api/admin/users/[id]` | ADMIN | Editar usuario (rol, equipo) |
| DELETE | `/api/admin/users/[id]` | ADMIN | Eliminar usuario |
| POST | `/api/admin/surveys` | ADMIN | Crear/activar encuesta |
| PUT | `/api/admin/surveys/[id]` | ADMIN | Activar/desactivar encuesta |

### Componentes UI nuevos

```
components/admin/
├── AdminNav.tsx        # Navegación interna: Resumen | Equipos | Usuarios | Encuestas
├── StatCard.tsx        # Card de estadística (reutilizable)
├── TeamForm.tsx        # Modal/form para crear/editar equipo
├── UserForm.tsx        # Modal/form para crear/editar usuario  
├── SurveyForm.tsx      # Formulario para crear encuesta
├── TeamTable.tsx       # Tabla de equipos con acciones
├── UserTable.tsx       # Tabla de usuarios con acciones
└── ConfirmDialog.tsx   # Diálogo de confirmación para eliminaciones

components/landing/
└── RoadmapSection.tsx  # Timeline visual de evolución del producto
```

---

## 5. Estimación de Esfuerzo

| Fase | Archivos | Líneas estimadas | Tests | Complejidad |
|------|----------|-----------------|-------|-------------|
| 10 — Fix + Admin Core | ~5 | ~300 | Sí (unit) | Baja |
| 11 — CRUD Equipos/Usuarios | ~12 | ~800 | Sí (unit + E2E) | Media |
| 12 — Encuestas + Landing | ~8 | ~500 | Sí (unit + E2E) | Media |
| **Total** | **~25** | **~1600** | **~30 tests** | Media |

---

## 6. Demo Post-Implementación

### Nuevo flujo de demo (7 minutos)

```
1. ADMIN crea equipo "Marketing" (30 seg)
2. ADMIN crea HR Analyst "María" (30 seg)
3. ADMIN crea Manager "Carlos" para Marketing (30 seg)
4. ADMIN crea 3 empleados para Marketing (30 seg)
5. ADMIN activa encuesta "Weekly Pulse" (30 seg)
6. EMPLEADO "Juan" (Marketing) responde encuesta (1 min)
7. HR "María" ve dashboard con datos REALES de Marketing (1 min)
8. MANAGER "Carlos" ve dashboard de su equipo Marketing (1 min)
9. Cierre: propuesta de valor + roadmap (1 min)
```

---

## 7. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Crear usuarios en Supabase Auth requiere SECRET_KEY | Medio | El seed ya lo hace — reutilizar patrón |
| Eliminar equipo con usuarios causa FK error | Bajo | Validar antes de eliminar, mostrar mensaje |
| Muchas APIs nuevas = mucho código | Medio | Dividir en 3 fases, cada una testeable independientemente |
| El flujo de demo se vuelve muy largo | Bajo | El admin puede pre-crear todo antes de la demo |

---

## 8. Conclusión

Esta propuesta transforma PulseWell de un **prototipo demo con datos estáticos** a una **plataforma funcional** donde un administrador puede crear toda la estructura organizacional, los empleados pueden responder encuestas reales, y los dashboards muestran datos generados por el uso real del sistema.

El plan se ejecuta en **3 fases incrementales**, cada una agregando valor inmediato:

1. **Fase 10**: Desbloquea la encuesta + Admin útil (1 sesión)
2. **Fase 11**: CRUD completo de equipos y usuarios (1-2 sesiones)
3. **Fase 12**: Encuestas gestionables + Landing con roadmap (1 sesión)

¿Procedemos con la Fase 10?
