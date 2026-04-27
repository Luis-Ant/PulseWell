# PulseWell — Especificación de Arquitectura

## 1. Propósito

Este documento define la arquitectura técnica del MVP de **PulseWell**, una plataforma SaaS de inteligencia de bienestar organizacional. Su objetivo es guiar decisiones de producto e ingeniería: estructura del sistema, límites de módulos, flujo de datos, seguridad, despliegue, restricciones del MVP y camino de escalabilidad.

La arquitectura debe mantenerse coherente con el README: PulseWell transforma respuestas simuladas y agregadas en métricas, alertas y recomendaciones preventivas, sin exponer resultados individuales ni prometer diagnóstico clínico.

## 2. Principios arquitectónicos

| Principio | Implicación técnica |
| --- | --- |
| Privacidad por diseño | No se exponen respuestas individuales; la analítica se muestra solo a nivel equipo y con al menos 5 respuestas. |
| Server-side first | Autorización, validación, cálculo de métricas y persistencia ocurren en servidor. |
| MVP demostrable | Se priorizan flujos completos, datos simulados y despliegue simple sobre infraestructura compleja. |
| Modularidad interna | La aplicación vive en un monolito Next.js, pero organizada por dominios funcionales. |
| Analítica explicable | El MVP usa fórmulas y reglas deterministas, no modelos de Machine Learning en producción. |
| Evolución SaaS | El diseño deja puntos de extensión para multi-tenant, auditoría, jobs, integraciones y cumplimiento futuro. |

## 3. Estilo arquitectónico seleccionado

**Arquitectura:** monolito fullstack modular con Next.js App Router.

PulseWell se implementa como una sola aplicación Next.js que contiene UI, Route Handlers, Server Actions donde aporten valor, lógica de negocio, motor analítico y acceso a datos. La separación no se hace por repositorios, sino por capas y módulos internos.

### Justificación

- Reduce complejidad operativa para un MVP con equipo pequeño.
- Permite desplegar rápido en Vercel.
- Evita mantener frontend y backend separados antes de validar el producto.
- Sigue siendo escalable a corto plazo si los límites de dominio se respetan.
- Facilita una demo coherente con datos simulados, dashboards por rol y analítica explicable.

### Alternativas descartadas

| Alternativa | Motivo de descarte para el MVP |
| --- | --- |
| Frontend y backend separados | Mayor costo de coordinación, despliegue y contratos prematuros. |
| Microservicios | Sobrediseño para un prototipo; no hay volumen ni equipos que lo justifiquen. |
| Backend externo dedicado | Útil a futuro, pero innecesario para validar propuesta, métricas y demo. |
| ML real desde el inicio | Reduce explicabilidad y aumenta tiempo, datos requeridos y riesgo ético. |

## 4. Stack tecnológico

| Área | Decisión | Uso en PulseWell |
| --- | --- | --- |
| Runtime y package manager | Bun | Instalación y ejecución local del proyecto. |
| Framework | Next.js 15 App Router | Aplicación fullstack, rutas, páginas, Route Handlers y server rendering. |
| UI | React 19 | Componentes de interfaz y dashboards. |
| Lenguaje | TypeScript strict | Tipado de contratos, servicios y lógica analítica. |
| Estilos | Tailwind CSS 4 | Sistema visual rápido y consistente. |
| Componentes | shadcn/ui + Radix UI | Base de componentes accesibles y extensibles. |
| Visualización | Recharts | Gráficas de métricas, tendencias y comparaciones. |
| Auth | Supabase Auth | Login email/password y sesión de usuario. |
| Base de datos | Supabase PostgreSQL | Persistencia relacional. |
| ORM | Prisma 7 con `prisma.config.ts` | Modelo, migraciones, cliente tipado y seed demo. |
| Hosting | Vercel | Preview deployments y producción del MVP. |
| Control de versiones | GitHub | Repositorio fuente e integración con Vercel. |

## 5. Estado actual del scaffold

El repositorio ya contiene una base compatible con esta arquitectura:

- `app/page.tsx`: landing/dashboard demo inicial con métricas sintéticas.
- `components/`: componentes UI y dashboard reutilizables.
- `lib/analytics.ts`: cálculo inicial de OWI y riesgo de burnout.
- `lib/mock-data.ts`: datos sintéticos para la demo actual.
- `lib/prisma.ts`: instancia singleton de Prisma para evitar múltiples conexiones en desarrollo.
- `lib/supabase.ts`: cliente Supabase basado en `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- `prisma/schema.prisma`: entidades iniciales `Organization`, `Team`, `User`, `SurveyResult` y `WellbeingScore`.
- `prisma.config.ts`: configuración Prisma 7 usando `DATABASE_URL`.

La arquitectura objetivo amplía este scaffold hacia encuestas, métricas, alertas, recomendaciones y control de acceso por rol sin romper la base actual.

## 6. Vista de sistema

```text
Usuario
  │
  ▼
Next.js App Router ─────────────────────────────────────────────┐
  │                                                             │
  ├─ UI por rol: landing, login, survey, dashboards             │
  ├─ Middleware: sesión, redirección y protección de rutas       │
  ├─ Route Handlers / Server Actions: API y mutaciones seguras   │
  ├─ Servicios de dominio: auth, surveys, analytics, alerts      │
  └─ Data access layer: Prisma                                  │
        │                                                       │
        ▼                                                       │
Supabase Auth + Supabase PostgreSQL                             │
        │                                                       │
        ▼                                                       │
Vercel deployments desde GitHub                                 │
```

## 7. Capas y responsabilidades

| Capa | Ubicación recomendada | Responsabilidad | Reglas |
| --- | --- | --- | --- |
| Presentación | `app/`, `components/` | UI, layouts, formularios y visualizaciones. | No calcular métricas finales ni consultar datos sensibles directamente. |
| API / Acciones servidor | `app/api/**/route.ts`, Server Actions puntuales | Exponer casos de uso al frontend y validar requests. | Toda ruta privada valida sesión, rol y pertenencia a equipo. |
| Dominio | `lib/<module>/` | Reglas de negocio: encuestas, analítica, alertas, recomendaciones. | Funciones puras cuando sea posible; sin depender de UI. |
| Data access | `lib/db/`, `lib/prisma.ts` | Consultas Prisma y transacciones. | No devolver campos individuales a dashboards. |
| Infraestructura | `lib/supabase.ts`, `prisma.config.ts`, Vercel env vars | Clientes externos y configuración. | Separar variables públicas de secretos. |

## 8. Módulos de aplicación

### 8.1 Autenticación y autorización

Responsable de login, logout, resolución del usuario actual, redirección por rol y protección de rutas.

**Roles:** `ADMIN`, `HR_ANALYST`, `MANAGER`, `EMPLOYEE`.

**Reglas:**

- Supabase Auth valida credenciales y sesión.
- La autorización de negocio usa el usuario interno en PostgreSQL.
- El frontend nunca decide `userId`, `teamId` ni `role`.
- Middleware protege rutas privadas; los Route Handlers repiten validaciones server-side.

### 8.2 Usuarios, equipos y organización

Administra la estructura demo: organización, equipos, usuarios y roles. El scaffold actual ya incluye `Organization`, lo cual funciona como límite organizacional inicial. Para el MVP puede existir una organización demo única; multi-tenant real queda fuera de alcance.

### 8.3 Encuestas pulse

Permite que empleados respondan encuestas periódicas con escala numérica de 1 a 5.

**Dimensiones MVP:** estrés, energía, carga de trabajo, pertenencia y claridad. Work-life balance puede quedar como extensión posterior si no complica la demo.

### 8.4 Analítica

Calcula métricas agregadas por equipo: Organizational Wellbeing Index, riesgo de burnout, riesgo de rotación simulado, productividad saludable, tendencia y estado del equipo.

El OWI base se deriva de:

```text
OWI = (Energy + Belonging + Clarity) - (Stress + Workload)
```

Luego se normaliza a una escala 0–100 para presentación.

### 8.5 Alertas

Genera señales preventivas cuando las métricas superan umbrales definidos: burnout, bajo bienestar, tendencia negativa, sobrecarga o baja pertenencia.

### 8.6 Recomendaciones

Mapea alertas y condiciones de equipo a acciones sugeridas. Deben redactarse en lenguaje preventivo y no punitivo.

### 8.7 Dashboards

- **Admin:** configuración demo, usuarios/equipos y vista global agregada.
- **HR Analyst:** vista global, comparación de equipos, tendencias, alertas y recomendaciones.
- **Manager:** métricas, alertas y recomendaciones solo de su equipo.
- **Employee:** encuesta activa y confirmación de envío; sin analítica.

## 9. Estructura de carpetas objetivo

```text
pulsewell/
├── app/
│   ├── page.tsx
│   ├── auth/login/page.tsx
│   ├── dashboard/{admin,hr,manager}/page.tsx
│   ├── survey/page.tsx
│   └── api/
│       ├── auth/me/route.ts
│       ├── teams/route.ts
│       ├── users/route.ts
│       ├── surveys/route.ts
│       ├── responses/route.ts
│       ├── metrics/route.ts
│       ├── metrics/recalculate/route.ts
│       ├── alerts/route.ts
│       └── recommendations/route.ts
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── survey/
│   └── shared/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── surveys/
│   ├── analytics/
│   ├── alerts/
│   ├── recommendations/
│   ├── validation/
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── prisma.config.ts
├── styles/globals.css
└── package.json
```

La estructura actual puede migrar gradualmente desde archivos planos (`lib/analytics.ts`) hacia carpetas por módulo (`lib/analytics/`) cuando el código crezca.

## 10. Rutas y acceso

| Ruta | Tipo | Acceso |
| --- | --- | --- |
| `/` | Pública | Landing o demo inicial. |
| `/auth/login` | Pública | Login email/password. |
| `/dashboard/admin` | Privada | `ADMIN`. |
| `/dashboard/hr` | Privada | `ADMIN`, `HR_ANALYST`. |
| `/dashboard/manager` | Privada | `MANAGER` sobre su equipo. |
| `/survey` | Privada | `EMPLOYEE`; opcionalmente otros roles para demo controlada. |
| `/api/*` | Privada salvo excepción explícita | Validación server-side por endpoint. |

## 11. Contratos de API principales

| Endpoint | Método | Responsabilidad | Roles |
| --- | --- | --- | --- |
| `/api/auth/me` | GET | Devolver usuario actual y rol interno. | Todos autenticados. |
| `/api/surveys` | GET | Obtener encuesta activa. | Todos autenticados. |
| `/api/responses` | POST | Registrar respuesta de encuesta. | `EMPLOYEE`. |
| `/api/metrics` | GET | Obtener métricas agregadas filtradas por rol. | `ADMIN`, `HR_ANALYST`, `MANAGER`. |
| `/api/metrics/recalculate` | POST | Recalcular métricas y disparar alertas. | `ADMIN`, `HR_ANALYST`. |
| `/api/alerts` | GET | Listar alertas visibles por rol/equipo. | `ADMIN`, `HR_ANALYST`, `MANAGER`. |
| `/api/recommendations` | GET | Listar recomendaciones visibles por rol/equipo. | `ADMIN`, `HR_ANALYST`, `MANAGER`. |
| `/api/demo/seed` | POST | Regenerar dataset demo. | `ADMIN`. |

Respuesta estándar:

```ts
type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } }
```

## 12. Flujo de autenticación

```text
Usuario ingresa email/password
  │
  ▼
Supabase Auth valida credenciales
  │
  ▼
Servidor resuelve usuario interno por email/auth id
  │
  ▼
Se obtiene role, organizationId y teamId desde PostgreSQL
  │
  ▼
Middleware/API aplica RBAC y redirección
  │
  ▼
Usuario accede solo a rutas y datos permitidos
```

**Decisión:** la sesión prueba identidad; la base interna decide permisos de producto. Esto evita confiar en claims manipulables desde cliente y permite cambiar roles sin depender de la UI.

## 13. Flujo de datos central

```text
Employee responde encuesta
  │
  ▼
POST /api/responses
  │  valida sesión, rol, equipo, escala 1–5 y duplicados
  ▼
SurveyResult / SurveyResponse
  │
  ▼
Agregación por team + periodo
  │  aplica mínimo 5 respuestas
  ▼
Métricas: OWI, burnout, attrition, trend
  │
  ▼
Alertas por reglas
  │
  ▼
Recomendaciones
  │
  ▼
Dashboards por rol
```

## 14. Modelo de datos arquitectónico

Entidades objetivo del MVP:

| Entidad | Propósito |
| --- | --- |
| `Organization` | Contenedor demo y punto de extensión SaaS futuro. |
| `Team` | Unidad mínima de agregación y privacidad. |
| `User` | Identidad interna, rol, organización y equipo. |
| `Survey` | Ciclo o formulario activo de encuesta. |
| `SurveyResponse` / `SurveyResult` | Respuestas numéricas individuales usadas solo para cálculo interno. |
| `Metrics` / `WellbeingScore` | Snapshot agregado por equipo y periodo. |
| `Alert` | Señal generada desde métricas. |
| `Recommendation` | Acción sugerida vinculada a una alerta o condición. |

El scaffold actual usa `SurveyResult` y `WellbeingScore`. Durante la implementación se debe decidir si se renombran para alinear con los specs (`SurveyResponse`, `Metrics`) o si se documenta una equivalencia clara. Para evitar fricción temprana, la recomendación es evolucionar el schema actual con migraciones pequeñas.

## 15. Privacidad y seguridad

Reglas obligatorias:

- Ningún dashboard muestra respuestas individuales, email asociado a respuesta, riesgo individual o ranking de personas.
- La analítica se bloquea cuando `responseCount < 5`.
- Manager solo consulta su equipo.
- HR y Admin ven agregados; no ven respuestas individuales.
- Las métricas se calculan en backend.
- Los endpoints no aceptan `userId`, `teamId`, `role` ni métricas calculadas desde el cliente.
- Las variables privadas (`DATABASE_URL`, service role keys) nunca se exponen al navegador.
- RLS en Supabase es recomendado como defensa adicional, aunque el control primario del MVP viva en backend.

## 16. Variables de entorno

El scaffold actual usa:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

Si se crea cliente Supabase en navegador, deberán agregarse variables públicas explícitas:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

Variables futuras posibles:

- `SUPABASE_SERVICE_ROLE_KEY` solo para scripts/admin server-side.
- `NEXT_PUBLIC_APP_URL` para callbacks o enlaces absolutos.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` si se habilita OAuth.

## 17. Despliegue y ambientes

| Ambiente | Fuente | Propósito |
| --- | --- | --- |
| Local | Máquina de desarrollo | Implementación y pruebas manuales. |
| Preview | Pull requests o feature branches en Vercel | Revisión funcional y visual. |
| Production | `main` | Demo estable del MVP. |

Flujo recomendado:

```text
GitHub push/PR → Vercel Preview → revisión → merge a main → Vercel Production
```

Prisma debe ejecutarse con `prisma.config.ts` y `DATABASE_URL` configurada en cada ambiente. La base de datos de preview debe separarse de producción si se usan datos persistentes.

## 18. Decisiones arquitectónicas

| ADR | Decisión | Racional |
| --- | --- | --- |
| ADR-01 | Usar Next.js fullstack | Menos infraestructura, despliegue simple y buen encaje con Vercel. |
| ADR-02 | Usar Supabase PostgreSQL | Modelo relacional adecuado para usuarios, equipos, encuestas, métricas y alertas. |
| ADR-03 | Usar Prisma 7 | Cliente tipado, migraciones controladas y configuración moderna con `prisma.config.ts`. |
| ADR-04 | Usar Supabase Auth | Reduce trabajo de autenticación y habilita evolución a OAuth/MFA. |
| ADR-05 | Usar analítica rule-based | Explicable, rápida de implementar y adecuada para demo/inversionistas. |
| ADR-06 | Usar datos simulados | Minimiza riesgo de privacidad y acelera validación del producto. |
| ADR-07 | Mantener monolito modular | Evita sobrediseño sin sacrificar límites internos de dominio. |

## 19. MVP vs alcance futuro

### Incluido en MVP

- Login email/password.
- Roles: Admin, HR Analyst, Manager, Employee.
- Datos simulados y seed demo.
- Encuesta pulse con escala 1–5.
- Agregación por equipo con mínimo 5 respuestas.
- OWI, burnout risk, attrition risk simulado y tendencias.
- Alertas y recomendaciones rule-based.
- Dashboards por rol.
- Deploy en Vercel.

### Fuera del MVP

- Slack/Microsoft Teams reales.
- NLP o análisis de texto libre.
- Machine Learning productivo.
- Pagos y billing.
- Multi-tenant comercial completo.
- MFA, SSO empresarial y certificaciones.
- Cumplimiento NOM-035 completo.
- App móvil.

### Camino de escalabilidad

1. Consolidar schema con `Organization` como tenant boundary real.
2. Agregar snapshots de métricas por periodo e índices por `organizationId`, `teamId` y `period`.
3. Mover recalculos pesados a background jobs o queue.
4. Incorporar auditoría (`AuditLog`) y trazabilidad de acciones sensibles.
5. Activar RLS y políticas más estrictas en tablas sensibles.
6. Agregar integraciones externas con colas y webhooks.
7. Separar servicios solo si el volumen o el equipo lo justifican.

## 20. Restricciones técnicas y de producto

- No ejecutar lógica clínica ni diagnósticos médicos.
- No usar respuestas individuales para dashboards.
- No prometer predicción real si el MVP usa datos sintéticos y reglas.
- Mantener lenguaje de “indicadores de riesgo” y “señales tempranas”.
- Optimizar para demo estable, no para escala masiva inicial.
- Evitar complejidad accidental: jobs, microservicios y ML quedan para después de validar.

## 21. Estrategia de testing

| Capa | Qué validar |
| --- | --- |
| Unit | Fórmulas de OWI, burnout, attrition, tendencias y reglas de recomendaciones. |
| Integration | Route Handlers con auth, RBAC, privacidad y Prisma. |
| E2E | Login por rol, envío de encuesta, dashboards y restricciones de acceso. |
| Security checks | No exposición de respuestas individuales, bloqueo con menos de 5 respuestas y variables privadas. |
| Demo acceptance | Seed reproducible, métricas esperadas, alertas visibles y narrativa de privacidad clara. |

## 22. Criterios de aceptación arquitectónicos

La arquitectura se considera correctamente implementada cuando:

- [ ] La aplicación despliega en Vercel con variables por ambiente.
- [ ] Supabase Auth permite iniciar y cerrar sesión.
- [ ] Middleware y APIs validan sesión y roles.
- [ ] Cada rol accede solo a sus rutas y datos permitidos.
- [ ] Employees pueden enviar una encuesta válida por periodo.
- [ ] Las respuestas se validan con enteros de 1 a 5.
- [ ] El backend previene duplicados por usuario y encuesta.
- [ ] Las métricas se calculan server-side desde datos agregados.
- [ ] No se muestra analítica si hay menos de 5 respuestas por equipo.
- [ ] Dashboards no reciben respuestas individuales ni identificadores sensibles.
- [ ] Alertas y recomendaciones se generan desde reglas explicables.
- [ ] El seed demo reproduce el escenario objetivo: 4 equipos, 20 empleados y 3–4 semanas de datos.
- [ ] La documentación de API, datos, seguridad y arquitectura usa los mismos nombres de roles y entidades o declara equivalencias.

## 23. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Inconsistencia entre specs y schema actual | Retrabajo e implementación ambigua. | Mantener equivalencias claras y migrar incrementalmente. |
| Exposición accidental de datos individuales | Alto riesgo ético y de confianza. | Privacy guard, DTOs agregados y tests específicos. |
| Sobrediseño del MVP | Retraso en demo. | Monolito modular, reglas simples y datos simulados. |
| Claims predictivos exagerados | Riesgo reputacional. | Comunicar “capa predictiva simulada” y reglas explicables. |
| Dependencia de servicios externos | Bloqueos por configuración. | `.env.example`, ambientes separados y seed local. |
| Confusión de variables Supabase públicas/privadas | Fuga de secretos o errores de auth. | Usar `NEXT_PUBLIC_*` solo cuando el cliente navegador lo requiera. |

## 24. Preguntas abiertas

- ¿Se mantendrá `SurveyResult`/`WellbeingScore` o se migrará a `SurveyResponse`/`Metrics` para alinear con los specs?
- ¿El MVP necesita persistir `Alert` y `Recommendation`, o pueden generarse on-demand desde métricas para la primera demo?
- ¿La ruta `/` será landing pública o dashboard demo hasta que exista autenticación completa?
- ¿Los roles no Employee podrán responder encuestas para facilitar demos, o se limitará estrictamente a Employee?
- ¿Preview y producción usarán bases Supabase separadas desde el inicio?

## 25. Resumen ejecutivo

PulseWell debe implementarse como un monolito fullstack modular con Next.js 15, React 19, TypeScript strict, Tailwind CSS 4, Supabase, PostgreSQL, Prisma 7, Bun y Vercel. La prioridad del MVP es demostrar un flujo completo y confiable: autenticación por rol, encuesta pulse, agregación por equipo, métricas explicables, alertas, recomendaciones y dashboards sin exposición individual.

La decisión central es mantener la arquitectura simple, server-side y orientada a privacidad. Esto maximiza velocidad de implementación y claridad para demo, mientras deja una ruta realista hacia una plataforma SaaS más robusta después de validar el producto.
