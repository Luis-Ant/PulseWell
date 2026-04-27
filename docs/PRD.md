# PulseWell — Product Requirements Document (PRD)

**Producto:** PulseWell  
**Categoría:** SaaS MVP de *Organizational Wellbeing Intelligence*  
**Audiencia:** producto, diseño, ingeniería, QA, negocio, demo e inversionistas  
**Stack base:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui, Supabase/PostgreSQL, Prisma 7 con `prisma.config.ts`, Bun y Vercel.  
**Estado:** documento final sintetizado desde README y especificaciones de producto, arquitectura, datos, API, seguridad, UX, analítica, testing, roadmap y narrativa de demo.

---

## 1. Executive Summary

PulseWell es una plataforma SaaS de inteligencia de bienestar organizacional que transforma señales agregadas de encuestas pulse en métricas explicables, alertas tempranas y recomendaciones accionables para Recursos Humanos, managers y liderazgo.

El MVP valida una tesis concreta: las organizaciones pueden detectar señales tempranas de burnout, sobrecarga, desconexión y riesgo de rotación antes de que escalen a pérdida de talento, ausentismo o caída de productividad. Para lograrlo, PulseWell usa datos simulados, dashboards por rol, un motor analítico basado en reglas y una narrativa de privacidad por diseño.

El MVP **no** es un sistema clínico, no diagnostica condiciones médicas o psicológicas y no evalúa la salud mental individual de empleados. Su valor está en entregar inteligencia organizacional agregada, preventiva y comprensible.

Regla central del producto: **PulseWell analiza equipos, no personas**.

---

## 2. Problem Statement

Las organizaciones suelen detectar el desgaste laboral demasiado tarde: cuando ya hay renuncias, baja productividad, ausentismo, conflictos, sobrecarga o deterioro del clima. Los mecanismos tradicionales —encuestas anuales, feedback manual o reportes aislados— son lentos, reactivos y poco accionables.

El problema central es que las empresas no pueden gestionar preventivamente aquello que no miden de forma continua, confiable y respetuosa de la privacidad.

### Dolor principal

- Recursos Humanos necesita evidencia para decidir dónde intervenir.
- Managers necesitan acciones concretas, no solo reportes.
- Dirección necesita conectar bienestar con productividad, retención y riesgo operativo.
- Employees necesitan confiar en que sus respuestas no serán usadas en su contra.
- IT y Legal necesitan límites claros de privacidad, seguridad y uso no clínico.

---

## 3. Product Vision

Construir un futuro donde el trabajo no desgaste a las personas, sino que las potencie mediante sistemas inteligentes, decisiones responsables y una cultura organizacional más humana.

PulseWell busca convertirse en una capa de inteligencia preventiva para organizaciones que quieren entender el bienestar de sus equipos sin exponer innecesariamente a las personas.

### Posicionamiento

Para organizaciones en México que quieren reducir riesgos de burnout, rotación y desconexión, PulseWell ofrece una plataforma de analítica agregada que detecta señales tempranas y recomienda acciones preventivas sin convertir el bienestar en vigilancia individual.

### Qué es PulseWell

- Una plataforma SaaS B2B de inteligencia de bienestar organizacional.
- Un sistema preventivo de alertas y recomendaciones.
- Un MVP con datos simulados para validación técnica, comercial y narrativa.
- Una experiencia privacy-first basada en agregación por equipo.

### Qué no es PulseWell

- No es una herramienta clínica.
- No diagnostica condiciones médicas o psicológicas.
- No evalúa salud mental individual.
- No monitorea conversaciones privadas, mensajes ni productividad individual.
- No reemplaza liderazgo humano, acompañamiento profesional ni cumplimiento legal formal.

---

## 4. Goals and Success Metrics

### Objetivos del MVP

1. Validar la viabilidad técnica de PulseWell como plataforma fullstack.
2. Demostrar analítica organizacional agregada a partir de encuestas pulse.
3. Mostrar una narrativa convincente de prevención de riesgos organizacionales.
4. Entregar una demo end-to-end estable, comprensible y honesta.
5. Defender privacidad por diseño como ventaja central del producto.

### Métricas de éxito de producto

| Métrica | Criterio de éxito MVP |
| --- | --- |
| Comprensión de valor | Inversionistas/evaluadores entienden el valor en menos de 5 minutos. |
| Claridad HR | HR identifica equipos prioritarios en menos de 30 segundos. |
| Acción Manager | Manager entiende una acción recomendada en menos de 1 minuto. |
| Encuesta Employee | Employee completa encuesta en menos de 1 minuto. |
| Demo | Demo completa en 7–10 minutos sin intervención técnica crítica. |
| Privacidad | 0 respuestas individuales expuestas en UI o APIs analíticas. |
| Privacy Guard | 100% de métricas bloqueadas cuando hay menos de 5 respuestas válidas. |
| Explicabilidad | Cada alerta puede explicarse por reglas, variables y umbrales. |

### Métricas futuras de piloto

- Tasa de respuesta semanal superior a 60%.
- Utilidad percibida por HR y managers.
- Porcentaje de recomendaciones revisadas o accionadas.
- Tiempo de HR para identificar equipos prioritarios.
- Confianza percibida por colaboradores.
- Interés en piloto pagado o suscripción.

---

## 5. Non-Goals

El MVP no busca:

- Operar como SaaS empresarial productivo completo.
- Maximizar escalabilidad para grandes volúmenes.
- Implementar modelos de Machine Learning productivos.
- Hacer NLP o análisis de sentimiento sobre mensajes, conversaciones o texto libre.
- Integrarse realmente con Slack, Microsoft Teams, HRIS o correo.
- Diagnosticar burnout, ansiedad, depresión u otra condición clínica.
- Evaluar salud mental, productividad o desempeño individual.
- Emitir rankings individuales.
- Automatizar decisiones laborales, disciplinarias o legales.
- Cumplir formalmente NOM-035, LFPDPPP, GDPR, SOC 2 o ISO 27001.
- Implementar billing, planes comerciales, SSO empresarial, MFA o auditoría avanzada.
- Crear app móvil nativa.

---

## 6. Target Users, Personas, and Stakeholders

### Roles del producto

| Rol | Tipo | Necesidad principal | Visibilidad |
| --- | --- | --- | --- |
| Admin | Operación/demo | Gestionar usuarios, equipos, seed y configuración demo. | Configuración y agregados; nunca respuestas individuales en dashboards. |
| HR Analyst | Usuario principal | Ver bienestar global, riesgos por equipo y recomendaciones. | Organización y equipos agregados. |
| Manager | Usuario operativo | Entender el estado de su equipo y qué acción tomar. | Solo equipo asignado. |
| Employee | Participante | Responder encuesta breve con confianza. | Encuesta y confirmación; sin analytics. |

### Personas principales

**Mariana Torres — HR Analyst / HR Business Partner**  
Necesita saber dónde intervenir antes de que el problema escale. Valora dashboards claros, OWI, riesgos, tendencias, alertas priorizadas y recomendaciones explicables.

**Carlos Méndez — Manager / Líder de equipo**  
Necesita entender qué cambió esta semana y qué acción concreta tomar sin acceder a datos individuales ni convertir el dashboard en evaluación punitiva.

**Ana Ruiz — Employee / Colaboradora**  
Necesita responder en menos de un minuto y confiar en que sus respuestas individuales no serán mostradas a managers ni RH.

### Stakeholders ampliados

- Dirección / C-Level: evalúa impacto en productividad, rotación, continuidad operativa y ROI.
- IT / Seguridad: valida autenticación, permisos, despliegue, variables y gobernabilidad.
- Legal / Compliance: valida límites de privacidad, no diagnóstico y uso no punitivo.
- Finanzas / Procurement: evalúa valor, costo futuro y viabilidad comercial.
- Inversionistas: validan mercado, diferenciación, escalabilidad y riesgos controlados.

---

## 7. MVP Scope

### Incluido

- Aplicación web con Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4 y shadcn/ui.
- Backend mediante Route Handlers de Next.js.
- Supabase Auth o flujo demo compatible para login por rol.
- Supabase PostgreSQL y Prisma 7 con `prisma.config.ts`.
- Datos simulados/demo restaurables.
- Una organización demo con 4 equipos y 20 empleados simulados.
- 4 semanas de respuestas sintéticas.
- Roles: Admin, HR Analyst, Manager y Employee.
- Encuesta pulse con 5 preguntas fijas en escala 1–5: `stress`, `energy`, `workload`, `belonging`, `clarity`.
- Cálculo de OWI en escala 0–100.
- Burnout Risk, Attrition Risk y Productivity Health basados en reglas.
- Tendencias semanales y proyección simulada del siguiente OWI.
- Alertas por umbrales y tendencias.
- Recomendaciones accionables, preventivas y no clínicas.
- Dashboards HR y Manager.
- Vista Employee para encuesta.
- Landing page recomendada para narrativa comercial.
- Privacy Guard obligatorio.

### Estado del scaffold actual

El scaffold actual está organizado con:

```text
app/          # Next.js App Router
components/   # Componentes reutilizables de UI
lib/          # Utilidades, servicios y lógica de negocio
prisma/       # Esquema y configuración de base de datos
styles/       # Estilos globales
public/       # Assets estáticos
```

El esquema Prisma actual contiene: `Organization`, `Team`, `User`, `SurveyResult` y `WellbeingScore`.

---

## 8. Future Scope / Post-MVP Roadmap

### v0.2 — Piloto controlado

- Multi-organización básico.
- Encuestas configurables.
- Consentimiento explícito.
- Historial por periodos.
- Export CSV agregado.
- Registro básico de intervenciones.

### v0.3 — Cumplimiento y confianza

- Módulo demostrativo avanzado de NOM-035.
- Políticas de privacidad y consentimiento revisadas.
- Auditoría básica de accesos.
- Registro de acciones tomadas por managers.
- Métricas antes/después de intervención.

### v0.4 — Integraciones iniciales

- Import CSV de usuarios y equipos.
- Metadata integration con Slack y Microsoft Teams.
- Indicadores agregados de carga por calendario.
- Webhooks internos.

### v0.5 — Madurez analítica e IA

- Experimentos offline de detección de anomalías.
- Modelos predictivos entrenables con datasets autorizados.
- Evaluación de precisión, sesgo y falsos positivos.
- Recomendaciones adaptativas.
- NLP solo sobre respuestas abiertas explícitamente consentidas.

### v1.0 — SaaS comercial

- Multi-tenant robusto.
- Billing y planes comerciales.
- SSO y MFA.
- Roles avanzados.
- Auditoría completa.
- SLA básico.
- Hardening legal, operativo y de infraestructura.

---

## 9. Core User Journeys

### Journey 1 — HR detecta riesgo organizacional

1. HR inicia sesión.
2. Accede a `/dashboard/hr`.
3. Revisa OWI global, Burnout Risk, Attrition Risk y Productivity Health.
4. Identifica equipos en riesgo.
5. Revisa tendencia y proyección simulada.
6. Lee alerta y drivers.
7. Comparte recomendación preventiva con manager o dirección.

### Journey 2 — Manager actúa sobre su equipo

1. Manager inicia sesión.
2. Accede a `/dashboard/manager`.
3. Ve solo su equipo asignado.
4. Revisa estado, tendencia y alerta prioritaria.
5. Ejecuta una recomendación concreta para la semana.

### Journey 3 — Employee responde encuesta

1. Employee accede a `/survey`.
2. Lee aviso de privacidad.
3. Responde 5 preguntas en escala 1–5.
4. Envía respuestas.
5. Recibe confirmación y reaseguro de confidencialidad.

### Journey 4 — Demo inversionista

1. Landing presenta problema y promesa.
2. Login demo como HR.
3. HR Dashboard muestra datos simulados.
4. Engineering aparece con riesgo alto de burnout.
5. Se explica tendencia y predicción simulada.
6. Se muestra recomendación accionable.
7. Se refuerza privacidad y límites éticos.
8. Se cierra con oportunidad SaaS y roadmap.

---

## 10. Functional Requirements

### FR-01 — Autenticación y acceso

El sistema debe permitir login y redirección por rol. Las rutas privadas deben requerir sesión activa.

### FR-02 — Autorización por rol

El sistema debe restringir vistas, endpoints y datos según `ADMIN`, `HR_ANALYST`, `MANAGER` y `EMPLOYEE`.

### FR-03 — Gestión demo de usuarios y equipos

Admin debe poder operar usuarios, equipos y dataset demo cuando se implemente la superficie administrativa o seed/reset.

### FR-04 — Encuesta pulse

Employee debe responder una encuesta activa con valores enteros entre 1 y 5 para `stress`, `energy`, `workload`, `belonging` y `clarity`.

### FR-05 — Una respuesta por ciclo

El sistema debe impedir respuestas duplicadas por usuario y encuesta/período activo.

### FR-06 — Agregación privada

El sistema debe agregar respuestas por equipo y período antes de mostrar métricas.

### FR-07 — Privacy Guard

El sistema debe bloquear métricas, alertas, tendencias y recomendaciones cuando el equipo, período o filtro seleccionado tenga menos de 5 respuestas válidas.

### FR-08 — Cálculo de OWI

El sistema debe calcular OWI normalizado 0–100 con variables positivas e invertidas negativas.

### FR-09 — Riesgos y productividad saludable

El sistema debe calcular Burnout Risk, Attrition Risk y Productivity Health mediante reglas explicables.

### FR-10 — Tendencias y proyección simulada

El sistema debe mostrar tendencias semanales cuando haya al menos dos períodos comparables y proyección simulada cuando haya al menos tres períodos elegibles.

### FR-11 — Alertas

El sistema debe generar alertas por burnout, attrition, wellbeing, trend, productivity o predictive cuando se crucen umbrales definidos.

### FR-12 — Recomendaciones

Toda alerta accionable debe tener una recomendación preventiva, no clínica y ejecutable por HR o managers.

### FR-13 — Dashboard HR

HR debe ver OWI global, métricas agregadas, comparación por equipo, tendencias, alertas y recomendaciones.

### FR-14 — Dashboard Manager

Manager debe ver únicamente métricas, alertas y recomendaciones de su equipo asignado.

### FR-15 — Experiencia Employee

Employee debe acceder a encuesta y confirmación; no debe acceder a analytics.

### FR-16 — Estados de UI

El sistema debe mostrar estados de loading, empty, error, datos insuficientes y demo data claramente identificados.

---

## 11. Non-Functional Requirements

### Privacidad

- Nunca exponer respuestas individuales.
- Nunca exponer emails, `userId`, historial individual, riesgo individual o ranking individual en dashboards.
- Mostrar analítica solo por equipo, organización o grupo permitido.
- Bloquear métricas si `responseCount < 5`.

### Seguridad

- Validación server-side de sesión, rol, equipo e input.
- No confiar en `userId`, `teamId`, `role`, métricas ni `responseCount` enviados por frontend.
- Variables privadas como `DATABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` nunca deben exponerse al cliente.
- RLS es recomendado para defensa adicional y obligatorio si se consulta Supabase directamente desde cliente en tablas sensibles.

### Rendimiento y demo

- Landing/Login deberían cargar en menos de 2.5 s p75.
- Dashboards deberían estar interactivos en menos de 3 s p75 con dataset MVP.
- APIs críticas deberían responder en rangos compatibles con demo.
- La demo debe ser estable en Vercel.

### Mantenibilidad

- TypeScript strict.
- Módulos separados para auth, db, surveys, analytics, alerts, recommendations, validation y UI.
- Lógica analítica fuera de componentes React.
- Comandos con Bun: `bun install`, `bun dev`, `bun test`, `bun run lint`, `bunx playwright test`.

### Accesibilidad y usabilidad

- Contraste suficiente.
- Navegación por teclado.
- Labels accesibles.
- Survey usable desde mobile.
- Estados no dependientes solo del color.

---

## 12. Analytics and AI Requirements

### Restricción crítica

El MVP usa analítica rule-based y explicable. No hay Machine Learning productivo en el MVP.

### Entradas

Todas las respuestas usan escala 1–5:

- `stress`: mayor es peor.
- `energy`: mayor es mejor.
- `workload`: mayor es peor.
- `belonging`: mayor es mejor.
- `clarity`: mayor es mejor.

### OWI

El OWI debe normalizarse a 0–100. El modelo documentado recomienda pesos:

```text
OWI =
  EnergyScore * 0.25 +
  BelongingScore * 0.20 +
  ClarityScore * 0.20 +
  StressScore * 0.20 +
  WorkloadScore * 0.15
```

Donde `StressScore` y `WorkloadScore` son variables invertidas normalizadas.

### Burnout Risk

Reglas base:

- `avgStress >= 4.0` suma riesgo.
- `avgWorkload >= 4.0` suma riesgo.
- `avgEnergy <= 2.5` suma riesgo.
- `avgClarity <= 2.5` suma riesgo.

### Attrition Risk

Debe considerar baja pertenencia, baja energía, alta carga, alto estrés y declive consecutivo de OWI.

### Productivity Health

Debe conectar claridad, energía, carga equilibrada y pertenencia sin medir productividad individual.

### Proyección simulada

Si existen al menos 3 períodos elegibles, el sistema puede proyectar el próximo OWI usando tendencia lineal simple. La UI debe etiquetar la salida como simulada.

### Lenguaje obligatorio

Usar: “indicadores elevados asociados con riesgo de burnout”.  
No usar: “este equipo tiene burnout”.

---

## 13. Data and Database Requirements

### Entidades actuales del schema Prisma

| Entidad | Propósito |
| --- | --- |
| `Organization` | Empresa o tenant demo. |
| `Team` | Unidad mínima de agregación y privacidad. |
| `User` | Identidad interna con email, rol, organización y equipo opcional. |
| `SurveyResult` | Respuestas pulse individuales sensibles usadas solo para cálculo interno. |
| `WellbeingScore` | Métrica agregada por equipo. |

### Reglas de datos

- `SurveyResult` es dato sensible interno.
- Dashboards deben alimentarse desde agregados o DTOs seguros.
- `teamId` se conserva en respuestas para contexto histórico.
- El período MVP es semanal; si no existe campo `period`, se deriva desde `createdAt`.
- Futuro recomendado: agregar `period` o `weekStartDate` para unicidad e índices.

### Seed demo requerido

- 1 organización demo.
- 4 equipos: Engineering, Sales, Operations y Customer Success.
- 20 empleados simulados, 5 por equipo.
- 4 semanas de respuestas.
- 1 encuesta activa.
- Al menos 3 alertas y 3 recomendaciones.
- Engineering con riesgo alto de burnout.
- Sales con señal de riesgo de rotación.
- Operations estable.
- Customer Success en mejora.

### Gaps conocidos

- No existe entidad formal `Survey` en el schema actual.
- Alertas y recomendaciones pueden generarse runtime o persistirse en futuro.
- `attritionRisk` no está persistido actualmente.
- Falta unicidad estricta por usuario/período en base.
- Faltan constraints 1–5 e índices compuestos recomendados.
- Falta carpeta de migraciones versionadas antes de ambientes compartidos.

---

## 14. API Requirements

### Convención de respuesta

```ts
type ApiSuccess<T> = {
  success: true
  data: T
  message?: string
  meta?: PaginationMeta
}

type ApiError = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}
```

### Endpoints MVP

| Endpoint | Método | Roles | Responsabilidad |
| --- | --- | --- | --- |
| `/api/auth/me` | GET | Todos | Devolver usuario autenticado interno. |
| `/api/teams` | GET/POST | ADMIN, HR / ADMIN | Listar o crear equipos demo. |
| `/api/users` | GET/POST | ADMIN | Listar o crear usuarios demo. |
| `/api/surveys` | GET/POST | Todos / ADMIN | Obtener o crear encuesta demo. |
| `/api/responses` | POST | EMPLOYEE | Registrar respuesta propia. |
| `/api/metrics` | GET | ADMIN, HR_ANALYST, MANAGER | Consultar métricas agregadas. |
| `/api/metrics/recalculate` | POST | ADMIN, HR_ANALYST | Recalcular métricas. |
| `/api/alerts` | GET | ADMIN, HR_ANALYST, MANAGER | Consultar alertas agregadas. |
| `/api/alerts/generate` | POST | ADMIN, HR_ANALYST | Generar alertas. |
| `/api/recommendations` | GET | ADMIN, HR_ANALYST, MANAGER | Consultar recomendaciones. |
| `/api/demo/seed` | POST | ADMIN | Generar datos demo. |
| `/api/demo/reset` | DELETE | ADMIN | Reiniciar datos demo. |

### Reglas API obligatorias

- Toda API privada valida sesión.
- Toda API sensible valida rol.
- Manager no puede consultar otro `teamId`.
- Employee no puede consultar métricas, alertas ni recomendaciones.
- Ninguna API analítica devuelve `userId`, email, respuestas individuales, historial individual ni datos clínicos.
- Si `responseCount < 5`, debe retornar estado de datos insuficientes o bloquear el equipo.

---

## 15. Security and Privacy Requirements

### Privacy Guard obligatorio

Nunca exponer métricas de equipo si el equipo, período o filtro seleccionado tiene menos de 5 respuestas válidas.

```ts
if (responseCount < 5) {
  return {
    status: "INSUFFICIENT_DATA",
    message: "Datos insuficientes para proteger la confidencialidad. Se requieren al menos 5 respuestas para generar analítica de equipo."
  }
}
```

### Datos prohibidos en dashboards y APIs analíticas

- Respuestas individuales.
- Email o nombre asociado a una respuesta.
- `userId` asociado a respuestas.
- Historial individual.
- Riesgo individual.
- Ranking individual.
- Texto libre sensible.
- Datos clínicos, biométricos o médicos.
- Mensajes privados o conversaciones.

### Controles mínimos

- Supabase Auth con email/password o flujo demo compatible.
- Middleware para rutas privadas.
- Validación server-side en Route Handlers.
- Separación de variables públicas y privadas.
- Auditoría mínima de eventos críticos sin guardar respuestas individuales.
- Lenguaje no clínico, no punitivo y orientado a prevención.

### Mensajes obligatorios de privacidad

- Login: “Ambiente demo. Los datos utilizados son simulados, anonimizados o sintéticos.”
- Survey: “Tus respuestas ayudan a comprender el bienestar del equipo. PulseWell solo muestra resultados agregados cuando existen al menos 5 respuestas.”
- HR Dashboard: “Insights basados en datos agregados a nivel equipo. Las respuestas individuales nunca se muestran.”
- Manager Dashboard: “Este dashboard muestra señales agregadas del equipo. No identifica colaboradores individuales.”
- Datos insuficientes: “Datos insuficientes para proteger la confidencialidad. Se requieren al menos 5 respuestas para generar analítica de equipo.”

---

## 16. UX/UI Requirements

### Principios UX

- Claridad sobre densidad.
- Privacidad visible.
- Acción sobre observación.
- Confianza visual.
- Lenguaje preventivo, no clínico.

### Rutas principales

| Ruta | Estado MVP | Propósito |
| --- | --- | --- |
| `/` | Opcional recomendado | Landing para propuesta de valor. |
| `/auth/login` | Requerido | Acceso y selector demo por rol. |
| `/dashboard/hr` | Requerido | Dashboard global para HR. |
| `/dashboard/manager` | Requerido | Vista de equipo asignado. |
| `/dashboard/admin` | Opcional | Gestión básica de demo. |
| `/survey` | Requerido | Encuesta Employee. |

### Componentes clave

- `MetricCard` para KPIs.
- `RiskBadge` para riesgo.
- `AlertCard` para señales agregadas.
- `RecommendationCard` para acciones.
- `SurveyScale` para escala 1–5.
- `PrivacyBanner` para mensajes de confianza.

### Requisitos visuales

- UI dark minimalista, profesional y sobria.
- Tokens semánticos compatibles con Tailwind CSS 4 y shadcn/ui.
- Charts simples con Recharts: línea, barra, distribución, radar o cards.
- No depender solo del color para comunicar estados.
- Survey mobile-friendly y completada en menos de 1 minuto.

---

## 17. Testing and Acceptance Criteria

### Estrategia de testing

| Nivel | Prioridad | Cobertura esperada |
| --- | --- | --- |
| Unitarias | Alta | Analytics, normalización, OWI, riesgos, tendencias, recomendaciones. |
| API | Alta | Auth, roles, privacidad, validación y errores. |
| Integración | Alta | Route Handlers + Prisma + reglas de negocio. |
| E2E | Media-alta | HR, Manager y Employee. |
| Accesibilidad | Media | Survey, login, dashboards y focus states. |
| Demo QA | Crítica | Flujo completo, datos demo y narrativa. |

### Comandos esperados

```bash
bun install
bun dev
bun test
bun run lint
bunx playwright test
```

Para CI o release se espera `bun run build`, aunque esta tarea de documentación no ejecuta builds.

### Acceptance criteria global

- [ ] HR puede iniciar sesión y ver métricas agregadas de todos los equipos elegibles.
- [ ] Manager solo ve su equipo asignado.
- [ ] Employee solo responde encuesta y no accede a dashboards.
- [ ] Survey acepta únicamente enteros 1–5.
- [ ] No se permite respuesta duplicada por ciclo.
- [ ] OWI se calcula en 0–100.
- [ ] Burnout Risk, Attrition Risk y Productivity Health son determinísticos.
- [ ] Alertas y recomendaciones se generan desde reglas explicables.
- [ ] Equipos con menos de 5 respuestas no muestran métricas.
- [ ] UI y APIs no exponen respuestas individuales.
- [ ] Mensajes de privacidad están visibles.
- [ ] Demo se completa sin errores críticos.

---

## 18. Demo and Investor Narrative Requirements

### Mensaje principal

PulseWell ayuda a las empresas a actuar antes de perder talento.

### Arco narrativo

```text
Problema → Señal → Riesgo → Predicción simulada → Recomendación → Valor de negocio
```

### Secuencia de demo recomendada

1. Abrir landing y explicar problema.
2. Login demo como HR Analyst.
3. Mostrar HR Dashboard con datos simulados.
4. Explicar OWI.
5. Comparar equipos.
6. Enfocar Engineering como equipo de riesgo.
7. Mostrar tendencia histórica.
8. Mostrar proyección simulada.
9. Mostrar alerta.
10. Mostrar recomendación.
11. Mostrar Manager Dashboard.
12. Mostrar Employee Survey.
13. Cerrar con privacidad, prevención y productividad saludable.

### Claims permitidos

- “El MVP usa reglas explicables y datos simulados.”
- “PulseWell identifica señales agregadas por equipo.”
- “La proyección muestra qué podría pasar si la tendencia continúa.”

### Claims prohibidos

- “Diagnosticamos burnout.”
- “Sabemos quién va a renunciar.”
- “Evaluamos salud mental individual.”
- “La IA ya predice con precisión clínica.”

---

## 19. Implementation Readiness Checklist

### Producto

- [ ] Scope MVP cerrado y comunicado.
- [ ] Datos simulados definidos.
- [ ] Narrativa de demo validada.
- [ ] Disclaimers de privacidad y no diagnóstico aprobados.

### Ingeniería

- [ ] Next.js 15 App Router listo.
- [ ] React 19 y TypeScript strict activos.
- [ ] Tailwind CSS 4 y shadcn/ui configurados.
- [ ] Prisma 7 usa `prisma.config.ts`.
- [ ] Supabase/PostgreSQL configurado.
- [ ] Variables `.env` y `.env.example` documentadas sin secretos reales.
- [ ] Seed demo implementado o planificado.
- [ ] Auth y RBAC implementados.
- [ ] Privacy Guard implementado en API y UI.
- [ ] Analytics separada de UI.
- [ ] Alertas y recomendaciones rule-based.

### QA / Demo

- [ ] Cuentas demo probadas.
- [ ] Engineering aparece en riesgo alto.
- [ ] Sales aparece con riesgo de rotación.
- [ ] Operations aparece estable.
- [ ] Customer Success aparece mejorando.
- [ ] Mensajes de privacidad visibles.
- [ ] No hay datos individuales visibles.
- [ ] Plan B de demo con capturas o video.

---

## 20. Risks and Mitigations

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Percepción de vigilancia | Alto | Mensajes claros, agregación, umbral mínimo y ausencia de datos individuales. |
| Sobreprometer IA | Alto | Comunicar reglas explicables y proyección simulada. |
| Claims clínicos involuntarios | Alto | Lenguaje de indicadores, disclaimers y revisión de copy. |
| Datos demo poco creíbles | Alto | Diseñar escenarios narrativos y seed reproducible. |
| Scope creep | Alto | Mantener MoSCoW y priorizar HR Dashboard + Analytics + Privacidad + Demo Story. |
| Exposición accidental individual | Alto | DTOs agregados, Privacy Guard, pruebas de privacidad y revisión API. |
| Manager interpreta como evaluación personal | Medio | Recomendaciones enfocadas en condiciones de trabajo, no culpa. |
| Auth o Supabase consumen demasiado tiempo | Medio | Usar flujo demo controlado si el plazo lo exige, documentando deuda. |
| Inconsistencia schema/spec | Medio | Declarar equivalencias y migrar incrementalmente. |
| Demo falla por configuración | Alto | Seed/reset, checklist pre-demo y plan B. |
| Confusión con NOM-035 | Medio | Presentar NOM-035 como roadmap/contexto, no cumplimiento MVP. |

---

## 21. Open Questions

1. ¿El login final del MVP usará Supabase Auth real o selector demo controlado?
2. ¿Las alertas y recomendaciones se persistirán o se generarán on-demand desde métricas agregadas?
3. ¿Se mantendrán `SurveyResult` y `WellbeingScore` o se migrarán nombres hacia `SurveyResponse` y `Metrics`?
4. ¿El período semanal se modelará con `period`/`weekStartDate` o seguirá derivado desde `createdAt` para la demo?
5. ¿La encuesta Employee será parte activa de la demo principal o funcionará principalmente con seed data?
6. ¿Admin Dashboard entra en el MVP o queda reemplazado por seed scripts?
7. ¿Qué texto legal final de consentimiento y privacidad verá Employee antes de responder?
8. ¿Preview y production usarán bases Supabase separadas desde el inicio?
9. ¿El umbral mínimo de 5 respuestas será configurable post-MVP?
10. ¿Qué nivel de auditoría mínima es obligatorio para presentar frente a IT/Seguridad?
11. ¿La UI final será español, inglés o bilingüe para demo?
12. ¿Cómo se comunicará NOM-035 sin crear expectativa de cumplimiento formal?

---

## Decisiones clave consolidadas

- El MVP usa datos simulados/demo; no datos reales de empleados.
- La analítica es rule-based, determinística y explicable; no hay ML productivo en MVP.
- PulseWell no es clínico, no diagnostica y no evalúa salud mental individual.
- La unidad mínima de visualización es el equipo, nunca la persona.
- El Privacy Guard exige al menos 5 respuestas válidas por equipo/período/filtro antes de mostrar métricas.
- El stack objetivo es monolito fullstack modular con Next.js App Router, Supabase/PostgreSQL y Prisma 7.
- La demo debe priorizar HR Dashboard, Analytics, Privacidad y Demo Story.
