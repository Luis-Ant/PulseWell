# PulseWell — Especificación de API

## 1. Propósito

Este documento define los contratos de API del MVP de **PulseWell**, una plataforma SaaS de inteligencia de bienestar organizacional. Su objetivo es guiar la implementación backend, alinear el producto con privacidad por diseño y dejar criterios verificables para ingeniería, QA y producto.

La API se implementará con **Next.js 15 App Router Route Handlers**, **TypeScript strict**, **Supabase Auth**, **Supabase PostgreSQL** y **Prisma 7** usando `prisma.config.ts`.

## 2. Alcance

### 2.1 Incluido en el MVP

- Autenticación de sesión mediante Supabase Auth.
- Control de acceso por rol: `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`.
- Gestión administrativa de equipos y usuarios demo.
- Encuesta pulse activa con preguntas numéricas de 1 a 5.
- Registro de respuestas sin aceptar `userId` ni `teamId` desde el cliente.
- Cálculo y consulta de métricas agregadas por equipo.
- Generación y consulta de alertas y recomendaciones.
- Datos demo para validar el flujo completo del prototipo.
- Protección de privacidad por umbral mínimo de respuestas.

### 2.2 Fuera del MVP

- Integraciones reales con Slack, Microsoft Teams u otros HRIS.
- Análisis de sentimiento con NLP.
- Modelos predictivos de Machine Learning en producción.
- Diagnóstico clínico, evaluación psicológica individual o scoring individual de salud mental.
- Cumplimiento normativo completo para ambientes productivos.
- API pública multi-tenant para terceros.

## 3. Principios de diseño

1. **Server-side first**: toda decisión sensible debe resolverse en backend.
2. **No trust in client data**: el cliente nunca define `userId`, `role`, `teamId`, métricas finales ni permisos.
3. **Role-based access control**: todo endpoint privado valida sesión y rol.
4. **Team-level privacy**: los dashboards solo exponen inteligencia agregada por equipo.
5. **Privacy threshold**: no se devuelven métricas, alertas ni recomendaciones si el conjunto tiene menos de 5 respuestas.
6. **Predictable responses**: todas las respuestas usan una envoltura común.
7. **Validation before persistence**: ningún dato se persiste sin validación de contrato y reglas de negocio.
8. **MVP demonstrability**: los endpoints deben ser simples, trazables y suficientes para demostrar valor de negocio.

## 4. Convenciones generales

### 4.1 Base path

```text
/api
```

### 4.2 Formato de datos

- Request y response body: `application/json`.
- Fechas: ISO 8601 en UTC, por ejemplo `2026-04-27T10:00:00.000Z`.
- Periodos semanales: formato `YYYY-Www`, por ejemplo `2026-W04`.
- Identificadores: string estable generado por backend o base de datos.

### 4.3 Envoltorio de respuesta exitosa

```ts
type ApiSuccess<T> = {
  success: true
  data: T
  message?: string
  meta?: PaginationMeta
}
```

### 4.4 Envoltorio de error

```ts
type ApiError = {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: unknown
  }
}
```

`details` solo debe incluir información segura para cliente. No debe exponer stack traces, queries, tokens, IDs internos sensibles ni detalles de infraestructura.

### 4.5 Paginación

Los endpoints de listado deben soportar paginación cuando el volumen pueda crecer. En MVP es obligatoria para `GET /api/users` y recomendada para listados administrativos.

Query params estándar:

| Parámetro | Tipo | Default | Regla |
| --- | --- | --- | --- |
| `page` | number | `1` | Entero mayor o igual a 1 |
| `pageSize` | number | `20` | Entero entre 1 y 100 |

```ts
type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}
```

### 4.6 Filtros estándar

| Filtro | Uso | Validación |
| --- | --- | --- |
| `teamId` | Filtrar por equipo | Debe existir y respetar permisos del usuario |
| `period` | Filtrar por semana | Formato `YYYY-Www` |
| `role` | Filtrar usuarios | Uno de `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE` |
| `status` | Filtrar métricas | Uno de `EXCELLENT`, `STABLE`, `AT_RISK`, `CRITICAL`, `SEVERE` |

## 5. Autenticación y autorización

### 5.1 Modelo de sesión

Todos los endpoints privados deben resolver la sesión con Supabase Auth en backend. El usuario autenticado se mapea a un usuario interno de PulseWell antes de aplicar autorización.

```ts
type UserRole = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE"

type CurrentUser = {
  id: string
  email: string
  role: UserRole
  teamId: string | null
}
```

### 5.2 Permisos por rol

| Rol | Alcance |
| --- | --- |
| `ADMIN` | Administra usuarios, equipos, datos demo y consulta toda la información agregada. |
| `HR` | Consulta métricas, alertas y recomendaciones organizacionales; puede recalcular analítica. |
| `MANAGER` | Consulta únicamente información agregada de su propio equipo. |
| `EMPLOYEE` | Consulta encuesta activa y envía su propia respuesta. |

### 5.3 Helpers obligatorios

| Helper | Responsabilidad | Resultado esperado |
| --- | --- | --- |
| `getCurrentUser()` | Resolver sesión y usuario interno | `CurrentUser | null` |
| `requireAuth()` | Bloquear requests sin sesión | `401 UNAUTHORIZED` |
| `requireRole(roles)` | Validar rol permitido | `403 FORBIDDEN` |
| `requireTeamAccess(teamId)` | Validar alcance de equipo | `403 TEAM_ACCESS_DENIED` |
| `privacyGuard(responseCount)` | Bloquear analítica con menos de 5 respuestas | `INSUFFICIENT_DATA` |

Regla de acceso por equipo:

| Rol | Acceso a equipos |
| --- | --- |
| `ADMIN` | Cualquier equipo |
| `HR` | Cualquier equipo |
| `MANAGER` | Solo `currentUser.teamId` |
| `EMPLOYEE` | Sin acceso a métricas, alertas ni recomendaciones |

## 6. Privacidad y seguridad de datos

### 6.1 Datos prohibidos en endpoints de dashboard

Los endpoints de métricas, alertas y recomendaciones no deben devolver:

- Email de empleados.
- Respuestas individuales.
- `userId` asociado a respuestas.
- Historial individual.
- Riesgo individual.
- Datos clínicos o diagnósticos.
- Texto privado de conversaciones, mensajes o documentos.

### 6.2 Datos permitidos en dashboards

- `teamId`.
- `teamName`.
- `responseCount`.
- Promedios agregados.
- Índices calculados.
- Alertas por equipo.
- Recomendaciones por equipo.

### 6.3 Umbral de privacidad

Para exponer analítica de un equipo y periodo se requieren al menos 5 respuestas válidas. Si no se cumple el umbral:

- `GET /api/metrics` debe omitir el equipo o devolver el estado bloqueado sin métricas sensibles.
- `POST /api/metrics/recalculate` debe marcar el equipo como omitido.
- `GET /api/alerts` y `GET /api/recommendations` no deben devolver elementos derivados de ese conjunto.

## 7. Códigos HTTP y errores estándar

| HTTP | Código | Uso |
| --- | --- | --- |
| 200 | `OK` | Consulta o acción exitosa |
| 201 | `CREATED` | Recurso creado |
| 400 | `VALIDATION_ERROR` | Body, query params o reglas de negocio inválidas |
| 401 | `UNAUTHORIZED` | Sesión ausente o inválida |
| 403 | `FORBIDDEN` | Rol sin permiso |
| 403 | `TEAM_ACCESS_DENIED` | Manager intenta acceder a otro equipo |
| 404 | `NOT_FOUND` | Recurso inexistente |
| 409 | `CONFLICT` | Estado duplicado o incompatible |
| 409 | `SURVEY_ALREADY_SUBMITTED` | Usuario ya respondió la encuesta |
| 429 | `RATE_LIMITED` | Límite de requests excedido |
| 500 | `INTERNAL_ERROR` | Error no controlado |

Ejemplo:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

## 8. Rate limiting

El MVP debe definir límites conservadores para prevenir abuso accidental. Si no se implementa un middleware dedicado en la primera iteración, debe quedar registrado como deuda técnica antes de abrir el producto fuera de demo.

| Endpoint | Límite sugerido |
| --- | --- |
| `POST /api/responses` | 10 requests por usuario por minuto |
| `POST /api/demo/seed` | 3 requests por admin por hora |
| `DELETE /api/demo/reset` | 3 requests por admin por hora |
| `POST /api/metrics/recalculate` | 10 requests por usuario por hora |
| Listados y consultas | 60 requests por usuario por minuto |

Respuesta esperada:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later."
  }
}
```

## 9. Mapa de endpoints

| Endpoint | Método | Rol | MVP | Responsabilidad |
| --- | --- | --- | --- | --- |
| `/api/auth/me` | GET | Todos | Sí | Devolver usuario autenticado |
| `/api/teams` | GET | `ADMIN`, `HR` | Sí | Listar equipos |
| `/api/teams` | POST | `ADMIN` | Sí | Crear equipo |
| `/api/users` | GET | `ADMIN` | Sí | Listar usuarios demo |
| `/api/users` | POST | `ADMIN` | Sí | Crear usuario demo |
| `/api/surveys` | GET | Todos | Sí | Obtener encuesta activa |
| `/api/surveys` | POST | `ADMIN` | Sí | Crear encuesta demo |
| `/api/responses` | POST | `EMPLOYEE` | Sí | Registrar respuesta propia |
| `/api/metrics` | GET | `ADMIN`, `HR`, `MANAGER` | Sí | Consultar métricas agregadas |
| `/api/metrics/recalculate` | POST | `ADMIN`, `HR` | Sí | Recalcular métricas |
| `/api/alerts` | GET | `ADMIN`, `HR`, `MANAGER` | Sí | Consultar alertas agregadas |
| `/api/alerts/generate` | POST | `ADMIN`, `HR` | Sí | Generar alertas manualmente |
| `/api/recommendations` | GET | `ADMIN`, `HR`, `MANAGER` | Sí | Consultar recomendaciones |
| `/api/demo/seed` | POST | `ADMIN` | Sí | Generar datos demo |
| `/api/demo/reset` | DELETE | `ADMIN` | Sí | Reiniciar datos demo |

## 10. Contratos de dominio

### 10.1 Encuesta activa

```ts
type SurveyQuestionKey = "stress" | "energy" | "workload" | "belonging" | "clarity"

type SurveyQuestionDTO = {
  key: SurveyQuestionKey
  label: string
  minLabel: string
  maxLabel: string
}

type SurveyDTO = {
  id: string
  title: string
  active: boolean
  questions: SurveyQuestionDTO[]
}
```

### 10.2 Respuesta de encuesta

```ts
type SurveyResponseInput = {
  surveyId: string
  stress: number
  energy: number
  workload: number
  belonging: number
  clarity: number
}
```

Todos los valores numéricos deben ser enteros entre 1 y 5.

### 10.3 Métricas de equipo

```ts
type TeamMetricsDTO = {
  teamId: string
  teamName: string
  wellbeingIndex: number
  burnoutRisk: number
  attritionRisk: number
  productivityHealth: number
  projectedNextOWI: number
  trendDirection: "IMPROVING" | "STABLE" | "DECLINING"
  responseCount: number
  status: "EXCELLENT" | "STABLE" | "AT_RISK" | "CRITICAL" | "SEVERE"
}
```

### 10.4 Alerta

```ts
type AlertDTO = {
  id: string
  teamId: string
  teamName: string
  type: "BURNOUT" | "ATTRITION" | "WELLBEING" | "TREND" | "PRODUCTIVITY"
  severity: "LOW" | "MEDIUM" | "HIGH"
  title: string
  message: string
  recommendation: string
  metricValue: number
  period: string
  createdAt: string
}
```

### 10.5 Recomendación

```ts
type RecommendationDTO = {
  id: string
  teamId: string
  teamName: string
  category: "Workload" | "Belonging" | "Energy" | "Clarity" | "Burnout" | "Retention"
  priority: "LOW" | "MEDIUM" | "HIGH"
  title: string
  description: string
  linkedAlertType?: AlertDTO["type"]
  period: string
}
```

## 11. Endpoints

### 11.1 Obtener usuario actual

```http
GET /api/auth/me
```

Roles: `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`.

Responsabilidad: devolver el usuario autenticado ya mapeado al dominio interno.

Response `200`:

```json
{
  "success": true,
  "data": {
    "id": "usr_001",
    "email": "hr@pulsewell.demo",
    "role": "HR",
    "teamId": null
  }
}
```

Errores: `401 UNAUTHORIZED`, `404 NOT_FOUND` si existe sesión pero no usuario interno.

### 11.2 Listar equipos

```http
GET /api/teams?page=1&pageSize=20
```

Roles: `ADMIN`, `HR`.

Responsabilidad: listar equipos con conteo de miembros, sin respuestas ni métricas sensibles.

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "team_engineering",
      "name": "Engineering",
      "memberCount": 5
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 11.3 Crear equipo

```http
POST /api/teams
```

Roles: `ADMIN`.

Request body:

```json
{
  "name": "Engineering"
}
```

Validaciones:

| Campo | Regla |
| --- | --- |
| `name` | Requerido, string, trim, 2 a 80 caracteres, único por organización demo |

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "team_engineering",
    "name": "Engineering",
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
}
```

Errores: `400 VALIDATION_ERROR`, `409 CONFLICT`.

### 11.4 Listar usuarios demo

```http
GET /api/users?page=1&pageSize=20&role=EMPLOYEE&teamId=team_engineering
```

Roles: `ADMIN`.

Responsabilidad: administrar usuarios demo. No debe utilizarse para dashboards ni exposición de bienestar.

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "usr_002",
      "email": "employee01@pulsewell.demo",
      "role": "EMPLOYEE",
      "teamId": "team_engineering"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 11.5 Crear usuario demo

```http
POST /api/users
```

Roles: `ADMIN`.

Request body:

```json
{
  "email": "employee21@pulsewell.demo",
  "role": "EMPLOYEE",
  "teamId": "team_engineering"
}
```

Validaciones:

| Campo | Regla |
| --- | --- |
| `email` | Requerido, email válido, único |
| `role` | Uno de `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE` |
| `teamId` | Requerido si `role` es `MANAGER` o `EMPLOYEE`; debe existir |

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "usr_021",
    "email": "employee21@pulsewell.demo",
    "role": "EMPLOYEE",
    "teamId": "team_engineering"
  }
}
```

### 11.6 Obtener encuesta activa

```http
GET /api/surveys
```

Roles: `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`.

Responsabilidad: devolver la encuesta activa. Para `EMPLOYEE`, es el contrato principal para responder.

Response `200`:

```json
{
  "success": true,
  "data": {
    "id": "survey_week_04",
    "title": "Weekly Pulse Survey",
    "active": true,
    "questions": [
      {
        "key": "stress",
        "label": "How would you rate your current stress level?",
        "minLabel": "Very low",
        "maxLabel": "Very high"
      },
      {
        "key": "energy",
        "label": "How would you rate your current energy level?",
        "minLabel": "Very low",
        "maxLabel": "Very high"
      },
      {
        "key": "workload",
        "label": "How heavy does your workload feel this week?",
        "minLabel": "Very light",
        "maxLabel": "Very heavy"
      },
      {
        "key": "belonging",
        "label": "How connected do you feel with your team?",
        "minLabel": "Not connected",
        "maxLabel": "Very connected"
      },
      {
        "key": "clarity",
        "label": "How clear are your goals and priorities?",
        "minLabel": "Not clear",
        "maxLabel": "Very clear"
      }
    ]
  }
}
```

Errores: `404 NOT_FOUND` si no existe encuesta activa.

### 11.7 Crear encuesta demo

```http
POST /api/surveys
```

Roles: `ADMIN`.

Request body:

```json
{
  "title": "Weekly Pulse Survey",
  "active": true
}
```

Validaciones:

| Campo | Regla |
| --- | --- |
| `title` | Requerido, string, 2 a 120 caracteres |
| `active` | Boolean opcional; si es `true`, solo debe quedar una encuesta activa |

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "survey_week_05",
    "title": "Weekly Pulse Survey",
    "active": true,
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
}
```

### 11.8 Enviar respuesta de encuesta

```http
POST /api/responses
```

Roles: `EMPLOYEE`.

Responsabilidad: registrar la respuesta del usuario autenticado para una encuesta activa o válida. El backend debe resolver `userId` y `teamId` desde la sesión.

Request body:

```json
{
  "surveyId": "survey_week_04",
  "stress": 4,
  "energy": 2,
  "workload": 5,
  "belonging": 3,
  "clarity": 3
}
```

Validaciones:

| Campo | Regla |
| --- | --- |
| `surveyId` | Requerido, debe existir |
| `stress` | Entero entre 1 y 5 |
| `energy` | Entero entre 1 y 5 |
| `workload` | Entero entre 1 y 5 |
| `belonging` | Entero entre 1 y 5 |
| `clarity` | Entero entre 1 y 5 |

Reglas de negocio:

- No se acepta `userId` ni `teamId` desde el body.
- El usuario debe pertenecer a un equipo.
- Solo se permite una respuesta por usuario por encuesta.
- La respuesta no debe devolver valores individuales persistidos.
- El recalculo de métricas puede ejecutarse de forma síncrona simple en MVP o diferirse explícitamente.

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "resp_001",
    "surveyId": "survey_week_04",
    "submitted": true
  },
  "message": "Survey response submitted successfully."
}
```

Errores: `400 VALIDATION_ERROR`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 SURVEY_ALREADY_SUBMITTED`.

### 11.9 Obtener métricas

```http
GET /api/metrics?teamId=team_engineering&period=2026-W04
```

Roles: `ADMIN`, `HR`, `MANAGER`.

Responsabilidad: consultar métricas agregadas por periodo, respetando permisos por equipo y umbral de privacidad.

Reglas por rol:

| Rol | Resultado |
| --- | --- |
| `ADMIN` | Puede consultar métricas globales y por equipo |
| `HR` | Puede consultar métricas globales y por equipo |
| `MANAGER` | Solo puede consultar su equipo; si envía otro `teamId`, se responde `403` |
| `EMPLOYEE` | No permitido |

Response `200` para `ADMIN` o `HR`:

```json
{
  "success": true,
  "data": {
    "period": "2026-W04",
    "global": {
      "wellbeingIndex": 68,
      "burnoutRisk": 42,
      "attritionRisk": 38,
      "productivityHealth": 71,
      "trend": -4,
      "responseCount": 20
    },
    "teams": [
      {
        "teamId": "team_engineering",
        "teamName": "Engineering",
        "wellbeingIndex": 35,
        "burnoutRisk": 85,
        "attritionRisk": 55,
        "productivityHealth": 41,
        "projectedNextOWI": 29,
        "trendDirection": "DECLINING",
        "responseCount": 5,
        "status": "CRITICAL"
      }
    ],
    "blockedTeams": []
  }
}
```

Response `200` para `MANAGER`:

```json
{
  "success": true,
  "data": {
    "period": "2026-W04",
    "team": {
      "teamId": "team_engineering",
      "teamName": "Engineering",
      "wellbeingIndex": 35,
      "burnoutRisk": 85,
      "attritionRisk": 55,
      "productivityHealth": 41,
      "projectedNextOWI": 29,
      "trendDirection": "DECLINING",
      "responseCount": 5,
      "status": "CRITICAL"
    }
  }
}
```

Si un equipo no alcanza el umbral, puede incluirse únicamente como bloqueado:

```json
{
  "teamId": "team_design",
  "teamName": "Design",
  "responseCount": 3,
  "blockedReason": "INSUFFICIENT_DATA"
}
```

### 11.10 Recalcular métricas

```http
POST /api/metrics/recalculate
```

Roles: `ADMIN`, `HR`.

Request body para un equipo:

```json
{
  "period": "2026-W04",
  "teamId": "team_engineering"
}
```

Request body para todos los equipos:

```json
{
  "period": "2026-W04"
}
```

Responsabilidad:

1. Validar rol.
2. Validar periodo y equipo opcional.
3. Obtener respuestas agregables por equipo.
4. Aplicar umbral mínimo de 5 respuestas.
5. Calcular OWI, burnout risk, attrition risk, productivity health, tendencia y proyección.
6. Persistir métricas agregadas.
7. Generar o actualizar alertas y recomendaciones derivadas.

Response `200`:

```json
{
  "success": true,
  "data": {
    "period": "2026-W04",
    "processedTeams": 3,
    "skippedTeams": 1,
    "skipped": [
      {
        "teamId": "team_design",
        "reason": "INSUFFICIENT_DATA",
        "responseCount": 3
      }
    ],
    "generatedAlerts": 2,
    "generatedRecommendations": 2
  },
  "message": "Metrics recalculated successfully."
}
```

### 11.11 Obtener alertas

```http
GET /api/alerts?teamId=team_engineering&period=2026-W04
```

Roles: `ADMIN`, `HR`, `MANAGER`.

Responsabilidad: devolver alertas por equipo derivadas de métricas agregadas y seguras para dashboards.

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "alert_001",
      "teamId": "team_engineering",
      "teamName": "Engineering",
      "type": "BURNOUT",
      "severity": "HIGH",
      "title": "Elevated Burnout Risk Indicators",
      "message": "Engineering shows elevated burnout risk indicators driven by high stress, high workload, and low energy.",
      "recommendation": "Reduce non-essential meetings, review workload distribution, and schedule a manager-led team check-in.",
      "metricValue": 85,
      "period": "2026-W04",
      "createdAt": "2026-04-27T10:00:00.000Z"
    }
  ]
}
```

Errores: `403 FORBIDDEN`, `403 TEAM_ACCESS_DENIED`, `400 VALIDATION_ERROR`.

### 11.12 Generar alertas manualmente

```http
POST /api/alerts/generate
```

Roles: `ADMIN`, `HR`.

Request body:

```json
{
  "period": "2026-W04"
}
```

Responsabilidad: generar o regenerar alertas a partir de métricas agregadas existentes. No debe leer respuestas individuales para exponerlas.

Response `200`:

```json
{
  "success": true,
  "data": {
    "period": "2026-W04",
    "generatedAlerts": 3
  },
  "message": "Alerts generated successfully."
}
```

### 11.13 Obtener recomendaciones

```http
GET /api/recommendations?teamId=team_engineering&period=2026-W04
```

Roles: `ADMIN`, `HR`, `MANAGER`.

Responsabilidad: devolver acciones preventivas por equipo vinculadas, cuando aplique, a alertas agregadas.

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "rec_001",
      "teamId": "team_engineering",
      "teamName": "Engineering",
      "category": "Workload",
      "priority": "HIGH",
      "title": "Reduce operational pressure",
      "description": "Reduce non-essential meetings, review workload distribution, and clarify priorities for this week.",
      "linkedAlertType": "BURNOUT",
      "period": "2026-W04"
    }
  ]
}
```

### 11.14 Generar datos demo

```http
POST /api/demo/seed
```

Roles: `ADMIN`.

Responsabilidad: crear o reiniciar datos sintéticos para demostración del MVP.

Request body:

```json
{
  "reset": true
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "teams": 4,
    "users": 24,
    "employees": 20,
    "surveys": 4,
    "responses": 80,
    "metrics": 16,
    "alerts": 3,
    "recommendations": 3
  },
  "message": "Demo data generated successfully."
}
```

### 11.15 Reiniciar datos demo

```http
DELETE /api/demo/reset
```

Roles: `ADMIN`.

Responsabilidad: eliminar o restaurar el dataset demo a estado limpio. Debe estar protegido contra ejecución accidental en ambientes no demo.

Response `200`:

```json
{
  "success": true,
  "message": "Demo data reset successfully."
}
```

## 12. Validaciones globales

| Validación | Regla |
| --- | --- |
| Survey value | Entero entre 1 y 5 |
| Role | `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE` |
| Severity | `LOW`, `MEDIUM`, `HIGH` |
| Alert type | `BURNOUT`, `ATTRITION`, `WELLBEING`, `TREND`, `PRODUCTIVITY` |
| Period | Regex `^\\d{4}-W\\d{2}$` y semana entre `W01` y `W53` |
| Team access | `MANAGER` solo puede operar sobre su propio equipo |
| Privacy threshold | Métricas visibles solo con `responseCount >= 5` |

## 13. Seguridad por endpoint

| Endpoint | Auth | Role check | Team check | Privacy guard |
| --- | --- | --- | --- | --- |
| `GET /api/auth/me` | Sí | No | No | No |
| `GET /api/teams` | Sí | Sí | No | No |
| `POST /api/teams` | Sí | Sí | No | No |
| `GET /api/users` | Sí | Sí | No | No |
| `POST /api/users` | Sí | Sí | No | No |
| `GET /api/surveys` | Sí | Sí | No | No |
| `POST /api/surveys` | Sí | Sí | No | No |
| `POST /api/responses` | Sí | Sí | Sí | No |
| `GET /api/metrics` | Sí | Sí | Sí | Sí |
| `POST /api/metrics/recalculate` | Sí | Sí | Opcional | Sí |
| `GET /api/alerts` | Sí | Sí | Sí | Sí |
| `POST /api/alerts/generate` | Sí | Sí | No | Sí |
| `GET /api/recommendations` | Sí | Sí | Sí | Sí |
| `POST /api/demo/seed` | Sí | Sí | No | No |
| `DELETE /api/demo/reset` | Sí | Sí | No | No |

## 14. Orden recomendado de implementación

1. `GET /api/auth/me`.
2. `GET /api/surveys`.
3. `POST /api/responses`.
4. `GET /api/metrics`.
5. `POST /api/metrics/recalculate`.
6. `GET /api/alerts`.
7. `GET /api/recommendations`.
8. `POST /api/demo/seed` y `DELETE /api/demo/reset`.
9. `GET /api/users` y `POST /api/users`.
10. `GET /api/teams` y `POST /api/teams`.

## 15. Criterios de aceptación

### 15.1 Autenticación y autorización

- [ ] Todos los endpoints privados validan sesión en backend.
- [ ] Todos los endpoints restringidos validan rol antes de ejecutar lógica de negocio.
- [ ] `MANAGER` solo puede consultar métricas, alertas y recomendaciones de su propio equipo.
- [ ] `EMPLOYEE` solo puede consultar encuesta activa y enviar respuesta propia.
- [ ] El cliente no puede definir ni sobrescribir `userId`, `role` o `teamId`.

### 15.2 Contratos y validación

- [ ] Todas las respuestas usan `ApiSuccess<T>` o `ApiError`.
- [ ] Todos los errores usan códigos estándar documentados.
- [ ] Los endpoints de listado con crecimiento potencial soportan `page` y `pageSize`.
- [ ] Los filtros `teamId`, `period`, `role` y `status` se validan antes de consultar datos.
- [ ] Las respuestas de encuesta aceptan únicamente enteros entre 1 y 5.
- [ ] Se impide una respuesta duplicada por usuario y encuesta.

### 15.3 Privacidad

- [ ] Ningún dashboard recibe respuestas individuales, emails de empleados ni IDs de usuario asociados a respuestas.
- [ ] Las métricas agregadas se bloquean cuando `responseCount < 5`.
- [ ] Alertas y recomendaciones solo se generan desde información agregada elegible.
- [ ] No se exponen stack traces ni detalles internos en errores.

### 15.4 Producto MVP

- [ ] El flujo `Auth → Survey Response → Team Aggregation → Metrics → Alerts → Recommendations → Dashboard` funciona con datos demo.
- [ ] Las métricas calculan OWI, burnout risk, attrition risk, productivity health, tendencia y proyección.
- [ ] Las alertas se generan desde reglas trazables.
- [ ] Las recomendaciones se vinculan a señales de riesgo o alertas.
- [ ] Los endpoints demo están protegidos por rol `ADMIN` y no deben habilitarse accidentalmente fuera de ambiente demo.

## 16. Preguntas abiertas para producto e ingeniería

1. ¿El MVP tendrá una única organización demo o se modelará multi-tenant desde el inicio?
2. ¿El recalculo de métricas después de `POST /api/responses` será síncrono, diferido o manual en la primera entrega?
3. ¿Las preguntas de encuesta serán fijas en el MVP o administrables desde `POST /api/surveys`?
4. ¿Cómo se distinguirán ambientes demo, staging y producción para proteger `/api/demo/*`?
5. ¿Qué proveedor o mecanismo se usará para rate limiting en Vercel?
6. ¿Se requiere auditoría de acciones administrativas en el MVP o queda para roadmap?

## 17. Resumen operativo

La API de PulseWell debe habilitar un prototipo claro y seguro de inteligencia de bienestar organizacional. El contrato central protege la privacidad individual, agrega información por equipo y permite demostrar valor mediante métricas, alertas y recomendaciones accionables.

Regla principal: **nunca exponer respuestas individuales; siempre entregar inteligencia agregada por equipo y sujeta a umbral mínimo de privacidad**.
