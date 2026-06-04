# PulseWell — Encuestas 2.0: Estrategia de Implementación

> **Problema**: La demo actual es deficiente en el aspecto central del producto — la captura de datos de bienestar. Solo hay una encuesta estática, sin sensación de "pulso semanal", sin historial, sin automatización.

---

## 1. Diagnóstico de la Experiencia Actual

| Aspecto | Estado actual | Problema |
|---------|---------------|----------|
| **Encuesta** | 1 hardcodeada, siempre activa | No hay variedad ni personalización |
| **Empleado** | Ve form o confirmación | Sin contexto: ¿ya respondí? ¿cuándo vuelvo? |
| **Periodicidad** | Manual (el empleado entra cuando quiere) | No hay sensación de "pulso semanal" |
| **Historial** | Inexistente | El empleado no ve su progreso |
| **Notificaciones** | Ninguna | No hay recordatorio de encuesta pendiente |
| **Admin** | Solo crear/activar encuestas | Sin estadísticas de participación |

---

## 2. Visión — Cómo debería sentirse

```
LUNES 9:00 AM
├── Employee hace login
├── Ve: "🔔 Tenés una encuesta pendiente esta semana"
├── Responde 5 preguntas (2 min)
├── Ve: "✅ ¡Semana 3 consecutiva! Tu equipo ya tiene 4/5 respuestas."
└── Dashboard HR se actualiza solo (polling)

VIERNES 5:00 PM
├── HR revisa dashboard
├── Engineering: 5/5 respondieron, OWI 38 (bajando)
├── Alerta: "OWI Engineering bajo 3 semanas consecutivas"
└── Recomendación: "Programar check-in de equipo"
```

---

## 3. Plan de Implementación

### Fase A — Employee Home Dashboard

**Impacto**: ALTO | **Complejidad**: MEDIA | **Archivos**: ~6

Rediseñar `/survey` como un verdadero "home" del empleado:

```
/survey (Employee Home)
├── Status Card: ¿Ya respondiste esta semana?
│   ├── Pendiente → "Responder encuesta" (botón prominente)
│   └── Completada → Check verde + "Racha: 3 semanas"
├── Mini historial: últimas 4 semanas con ✅/❌
├── Stats personales: total respondidas, racha actual
└── Privacy banner
```

**Componentes nuevos**:
- `components/survey/EmployeeHome.tsx` — dashboard personal del empleado
- `components/survey/WeekStatus.tsx` — estado de la semana actual
- `components/survey/HistoryStrip.tsx` — mini historial visual

### Fase B — Survey Scheduling + Variedad

**Impacto**: ALTO | **Complejidad**: MEDIA | **Archivos**: ~5

Agregar frecuencia y scheduling al modelo de encuestas:

```prisma
model Survey {
  frequency   SurveyFrequency @default(WEEKLY)
  startDate   DateTime?
  // ... existing fields
}

enum SurveyFrequency {
  WEEKLY
  BIWEEKLY
}
```

**Lógica de scheduling**:
- El sistema calcula automáticamente qué período está "activo"
- El empleado puede responder cualquier día dentro del período (no solo el lunes)
- Si no respondió, al hacer login ve "encuesta pendiente"

**Admin puede**:
- Crear encuestas con frecuencia (semanal, quincenal)
- Ver % de participación por equipo
- Activar/desactivar encuestas

### Fase C — Engagement + Gamificación suave

**Impacto**: MEDIO | **Complejidad**: BAJA | **Archivos**: ~3

- Rachas: "3 semanas consecutivas respondiendo 🔥"
- Badge de participación del equipo: "Tu equipo: 4/5 respondieron"
- Recordatorio visual: navbar con badge de notificación

---

## 4. Lo que NO incluye (post-MVP)

- Email notifications
- Push notifications
- Custom questions (siempre son las 5 del OWI)
- Encuestas anónimas (siempre son trazables al equipo, no al individuo en dashboards)
- Export de respuestas

---

## 5. Estimación

| Fase | Archivos | Líneas | Tiempo |
|------|----------|--------|--------|
| A — Employee Home | ~6 | ~400 | 1 sesión |
| B — Scheduling | ~5 | ~300 | 1 sesión |
| C — Engagement | ~3 | ~200 | 1 sesión |
| **Total** | **~14** | **~900** | **3 sesiones** |

---

## 6. Demo post-implementación

```
1. Admin crea encuesta semanal "Pulse Q3" → activa
2. Employee login → "🔔 Encuesta pendiente" → responde
3. Employee ve: "✅ ¡Respondida! Racha: 1 semana"
4. HR dashboard: 1/5 Engineering respondió (se actualiza con polling)
5. Más empleados responden durante la semana
6. Viernes: HR ve 5/5 participaron, OWI actualizado
7. Lunes siguiente: nueva encuesta automáticamente disponible
```
