# PulseWell — Especificación de Seguridad, Privacidad y Uso Ético de Datos

## 1. Propósito

Este documento define los requisitos de seguridad, privacidad, confidencialidad, control de acceso y gobierno ético de datos para el MVP de **PulseWell**, una plataforma SaaS de inteligencia de bienestar organizacional.

PulseWell trabaja con señales relacionadas con bienestar laboral. Por eso, desde el diseño, el producto debe evitar cualquier percepción de vigilancia individual, diagnóstico clínico, evaluación médica o uso punitivo. La plataforma debe comunicar una premisa simple: **el bienestar organizacional se analiza a nivel agregado, no individual**.

El MVP es un prototipo funcional con datos simulados. No debe presentarse como cumplimiento empresarial completo ni como solución clínica, pero sí debe demostrar una base sólida para evolucionar hacia una plataforma productiva confiable.

## 2. Principios rectores

| Principio | Implicación para implementación y producto |
| --- | --- |
| Privacidad por diseño | Las reglas de privacidad se implementan en backend, base de datos y UI desde el MVP, no como una capa posterior. |
| Agregación antes que identificación | Los dashboards muestran métricas por equipo o área; nunca respuestas individuales. |
| Mínima recolección de datos | Solo se capturan datos necesarios para autenticación, pertenencia a equipo y cálculo agregado. |
| Transparencia hacia colaboradores | La UI explica qué se recolecta, para qué se usa y qué no se mostrará. |
| Control de acceso por rol | Cada ruta, endpoint y consulta valida sesión, rol y alcance organizacional. |
| Defensa en profundidad | Autenticación, autorización server-side, validación de datos, Prisma, Supabase/PostgreSQL y, cuando aplique, Row Level Security. |
| No uso clínico | PulseWell reporta indicadores organizacionales de riesgo, no diagnósticos médicos o psicológicos. |
| No uso punitivo | Las métricas sirven para prevención y mejora del entorno laboral, no para sancionar personas. |
| Explicabilidad | OWI, burnout risk, alertas y recomendaciones deben ser entendibles y trazables a reglas del MVP. |

La NOM-035-STPS-2018 busca identificar, analizar y prevenir factores de riesgo psicosocial, además de promover entornos organizacionales favorables. PulseWell puede alinearse conceptualmente con esa intención preventiva, pero el MVP **no constituye cumplimiento formal de NOM-035** ni reemplaza procesos legales, médicos o laborales.

## 3. Alcance del MVP

### 3.1 Incluido

- Autenticación por email y contraseña mediante Supabase Auth.
- Protección de rutas privadas en Next.js App Router.
- Control de acceso por roles: `ADMIN`, `HR_ANALYST`, `MANAGER`, `EMPLOYEE`.
- Validación server-side de sesión, rol, pertenencia a equipo y datos de entrada.
- Captura de respuestas numéricas de encuesta pulse en escala 1–5.
- Cálculo backend de OWI, burnout risk, alertas y recomendaciones.
- Visualización de métricas agregadas por equipo o global organizacional.
- Umbral mínimo de agregación antes de mostrar analítica.
- Separación de variables públicas y privadas.
- Datos demo simulados, anonimizados o sintéticos.
- Auditoría mínima de eventos críticos del prototipo.

### 3.2 Fuera del MVP

- MFA/2FA.
- SSO empresarial.
- Multi-tenant productivo con aislamiento contractual completo.
- Certificaciones ISO 27001, SOC 2 u otras certificaciones formales.
- Cifrado personalizado adicional al provisto por plataforma e infraestructura.
- Integraciones reales con Slack, Microsoft Teams u otras fuentes internas.
- Análisis de texto libre, sentimiento o mensajes privados.
- Modelos de Machine Learning productivos.
- Datos clínicos, biométricos o psicológicos individuales.
- Cumplimiento legal completo para producción.

## 4. Clasificación y minimización de datos

### 4.1 Datos permitidos en el MVP

| Tipo de dato | Ejemplo | Uso permitido | Clasificación |
| --- | --- | --- | --- |
| Identificador interno | `user.id`, UUID/cuid | Relación interna y prevención de duplicados | Pseudónimo interno |
| Email | `persona@empresa.com` | Login y gestión demo | Dato personal |
| Nombre | `Ana López` | Gestión demo de usuarios; no se asocia en UI a respuestas | Dato personal |
| Rol | `HR_ANALYST` | Autorización | Dato operacional |
| Organización | `Empresa Demo` | Segmentación del tenant/prototipo | Dato operacional |
| Equipo | `Engineering` | Agregación y autorización de managers | Dato organizacional |
| Respuestas numéricas | `energy=4`, `stress=2` | Cálculo agregado | Señal sensible de bienestar |
| Métricas agregadas | OWI, burnout risk | Dashboards y alertas | Dato agregado |
| Alertas agregadas | Equipo con tendencia de riesgo | Acción preventiva | Dato agregado |
| Audit logs mínimos | Login, cambio de rol | Seguridad y trazabilidad | Dato técnico/operacional |

### 4.2 Datos no permitidos en el MVP

| Tipo de dato | Motivo |
| --- | --- |
| Diagnósticos médicos o psicológicos | Riesgo legal, clínico y ético. |
| Historial clínico | Dato altamente sensible y fuera del alcance del producto. |
| Texto libre emocional | Aumenta el riesgo de reidentificación. |
| Mensajes de Slack/Teams o conversaciones privadas | No necesario para validar el MVP. |
| Evaluaciones individuales de salud mental | Contradice privacidad por diseño. |
| Ranking individual de empleados | Facilita uso punitivo. |
| Datos biométricos | Fuera de alcance. |
| Geolocalización precisa | Innecesaria para analítica organizacional. |
| Datos de desempeño individual | Riesgo de mezclar bienestar con evaluación laboral individual. |

## 5. Modelo de privacidad por diseño

```text
Respuesta individual numérica
        ↓
Validación server-side
        ↓
Almacenamiento pseudonimizado interno
        ↓
Agregación por equipo/organización
        ↓
Privacy guard por umbral mínimo
        ↓
Métricas, alertas y recomendaciones
        ↓
Dashboard por rol
```

El dashboard nunca debe mostrar respuestas individuales, nombres, emails, historiales individuales, riesgos individuales ni recomendaciones individuales.

### 5.1 Umbral mínimo de agregación

El sistema solo puede mostrar analítica de equipo cuando se cumpla:

```ts
responseCount >= 5
```

Si no se cumple, la UI y la API deben retornar un estado explícito:

```ts
{
  status: "INSUFFICIENT_DATA",
  message: "Datos insuficientes para proteger la confidencialidad. Se requieren al menos 5 respuestas para generar analítica de equipo."
}
```

Este umbral aplica a métricas, tendencias, alertas, recomendaciones y cualquier visualización filtrable por equipo. Si un filtro reduce el grupo por debajo del umbral, también debe ocultarse la analítica.

### 5.2 Anonimización y pseudonimización

- **Pseudonimización interna**: la base puede conservar `userId` para autenticación, integridad, prevención de duplicados y auditoría mínima.
- **Anonimización en producto**: la UI y las APIs de dashboard no exponen identidad asociada a respuestas.
- **Datos demo**: deben ser sintéticos o anonimizados; no deben representar empleados reales sin consentimiento y base legal adecuada.
- **Exportaciones**: fuera del MVP. Si se agregan después, solo podrán exportar datos agregados que respeten umbrales de privacidad.

## 6. Roles, permisos y RBAC

### 6.1 Roles canónicos

Los roles canónicos del dominio deben alinearse con Prisma:

| Rol | Propósito |
| --- | --- |
| `ADMIN` | Configuración del prototipo, gestión de usuarios, equipos y parámetros demo. |
| `HR_ANALYST` | Vista global agregada de bienestar organizacional. |
| `MANAGER` | Vista agregada de su equipo asignado. |
| `EMPLOYEE` | Responder encuestas pulse. |

Si la UI usa slugs como `admin` o `hr_analyst`, deben mapearse explícitamente a estos valores canónicos en el borde de la aplicación. No debe existir autorización basada solo en labels del frontend.

### 6.2 Matriz de permisos

| Acción | ADMIN | HR_ANALYST | MANAGER | EMPLOYEE |
| --- | --- | --- | --- | --- |
| Iniciar sesión | Sí | Sí | Sí | Sí |
| Ver dashboard global | Sí | Sí | No | No |
| Ver dashboard de equipo | Sí | Sí | Solo su equipo | No |
| Ver alertas | Sí | Sí | Solo su equipo | No |
| Ver recomendaciones | Sí | Sí | Solo su equipo | No |
| Responder encuesta | Opcional | Opcional | Opcional | Sí |
| Gestionar usuarios demo | Sí | No | No | No |
| Gestionar equipos demo | Sí | No | No | No |
| Recalcular métricas | Sí | Sí | No | No |
| Ver respuestas individuales | No | No | No | No |
| Ver email asociado a respuesta | No | No | No | No |
| Exportar datos individuales | No | No | No | No |

### 6.3 Reglas de autorización

- `ADMIN` puede gestionar entidades demo, pero no debe acceder a respuestas individuales desde UI o endpoints de producto.
- `HR_ANALYST` solo consume datos agregados y no debe recibir campos que permitan reidentificación por respuesta.
- `MANAGER` solo accede a métricas, alertas y recomendaciones de su `teamId`.
- `EMPLOYEE` puede crear su propia respuesta de encuesta y no accede a dashboards.
- Toda autorización debe resolverse server-side; el frontend solo oculta navegación, no protege datos.

## 7. Autenticación y sesiones

### 7.1 Método del MVP

El MVP debe usar **Supabase Auth con email/password**. OAuth con Google, MFA y SSO quedan para fases posteriores.

### 7.2 Reglas obligatorias

- Toda ruta privada requiere sesión activa.
- La sesión se valida del lado servidor en middleware, Server Components, Route Handlers o Server Actions según corresponda.
- El rol y el equipo del usuario se consultan desde base de datos o claims confiables sincronizados; no desde el cliente.
- El logout debe invalidar la sesión y limpiar estado local no sensible.
- No deben persistirse tokens, perfiles completos ni respuestas en `localStorage`.

## 8. Protección de rutas y navegación

### 8.1 Rutas públicas

| Ruta | Acceso |
| --- | --- |
| `/` | Pública |
| `/auth/login` | Pública |

### 8.2 Rutas privadas previstas

| Ruta | Roles permitidos |
| --- | --- |
| `/dashboard/admin` | `ADMIN` |
| `/dashboard/hr` | `ADMIN`, `HR_ANALYST` |
| `/dashboard/manager` | `MANAGER` |
| `/survey` | `EMPLOYEE`, opcionalmente roles internos para demo |
| `/api/*` | Según endpoint, siempre con validación server-side |

### 8.3 Redirección inicial por rol

| Rol | Ruta inicial |
| --- | --- |
| `ADMIN` | `/dashboard/admin` |
| `HR_ANALYST` | `/dashboard/hr` |
| `MANAGER` | `/dashboard/manager` |
| `EMPLOYEE` | `/survey` |

## 9. Seguridad de base de datos

### 9.1 Modelo de datos relevante

El esquema actual contiene `Organization`, `Team`, `User`, `SurveyResult` y `WellbeingScore`. La documentación de implementación debe tratar `SurveyResult` como dato sensible interno y `WellbeingScore` como dato agregado.

### 9.2 Reglas mínimas

- Las consultas deben filtrar por organización y, cuando aplique, por equipo.
- `SurveyResult` no debe exponerse directamente a clientes de dashboard.
- Los cálculos agregados deben ejecutarse en backend o jobs controlados.
- El cliente no envía `userId`, `teamId` ni `role` como fuente de verdad.
- Prisma debe usarse con queries parametrizadas; no SQL dinámico sin sanitización.

### 9.3 Row Level Security

Si se accede a Supabase desde cliente o con anon key, RLS debe estar activo en tablas sensibles. Si todo acceso productivo pasa por backend con Prisma y `DATABASE_URL`, RLS sigue siendo recomendable como defensa adicional.

Políticas objetivo:

| Actor | Política |
| --- | --- |
| EMPLOYEE | Puede insertar su propia respuesta para una encuesta vigente; no puede consultar `SurveyResult`. |
| MANAGER | Puede consultar métricas y alertas agregadas solo de su `teamId`. |
| HR_ANALYST | Puede consultar métricas y alertas agregadas de la organización. |
| ADMIN | Puede gestionar usuarios/equipos demo; no recibe respuestas individuales en superficies de producto. |

## 10. Seguridad backend y API

Cada endpoint o Server Action debe aplicar este orden de controles:

1. Verificar sesión.
2. Resolver usuario actual desde servidor.
3. Verificar rol autorizado.
4. Validar input con esquema estricto.
5. Aplicar autorización por organización/equipo.
6. Ejecutar lógica de negocio en backend.
7. Aplicar privacy guard de agregación.
8. Retornar solo campos permitidos.
9. Registrar evento de auditoría cuando corresponda.

### 10.1 Validación de encuesta

Cada dimensión debe cumplir:

```ts
value >= 1 && value <= 5
```

Campos requeridos del MVP:

- `energy`
- `belonging`
- `clarity`
- `stress`
- `workload`

### 10.2 Protección contra manipulación

El backend no debe aceptar como fuente de verdad:

- `userId` enviado por frontend.
- `teamId` manipulado por cliente.
- `role` definido por cliente.
- Métricas calculadas en cliente.
- `responseCount` enviado por cliente.

### 10.3 Endpoints sensibles

| Endpoint previsto | Riesgo | Control mínimo |
| --- | --- | --- |
| `/api/responses` | Envío fraudulento o duplicado | Sesión, usuario actual, una respuesta por período/encuesta. |
| `/api/metrics` | Fuga de datos agregados | RBAC, filtro por organización/equipo, umbral mínimo. |
| `/api/alerts` | Exposición cruzada entre equipos | RBAC, filtro por alcance, lenguaje no clínico. |
| `/api/admin/users` | Abuso de privilegios | Solo `ADMIN`, auditoría de cambios. |
| `/api/metrics/recalculate` | Manipulación analítica | `ADMIN`/`HR_ANALYST`, validación y auditoría. |

## 11. Seguridad frontend

- Ocultar navegación y componentes no permitidos por rol, sin asumir que eso autoriza acceso.
- Mostrar mensajes de privacidad en login, encuesta y dashboards.
- No renderizar respuestas individuales ni listas que permitan inferencia.
- No guardar datos sensibles en `localStorage`.
- No calcular métricas finales ni risk levels en cliente para datos reales.
- No exponer secretos en bundles del navegador.

Variables públicas permitidas:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Variables privadas que nunca deben exponerse al cliente:

```env
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 12. Retención y eliminación

### 12.1 MVP demo

Los datos simulados pueden mantenerse mientras sean necesarios para demostración, siempre que no correspondan a personas reales identificables.

### 12.2 Producción futura recomendada

| Dato | Retención recomendada | Nota |
| --- | --- | --- |
| Respuestas individuales pseudonimizadas | 6–12 meses | Solo para cálculo, auditoría mínima y mejora agregada. |
| Métricas agregadas | 24 meses | Útiles para tendencias organizacionales. |
| Alertas | 12 meses | Mantener trazabilidad preventiva. |
| Logs técnicos | 30–90 días | Según necesidad operativa y seguridad. |
| Audit logs | 12–24 meses | Según contrato, riesgo y obligación legal. |
| Usuarios inactivos | Según contrato | Debe existir proceso de baja y anonimización. |

La versión productiva debe definir políticas de eliminación, exportación, rectificación y anonimización alineadas con el marco legal aplicable.

## 13. Auditoría mínima

El MVP debe registrar, al menos, eventos relevantes de seguridad y operación:

- Login exitoso.
- Login fallido.
- Logout.
- Envío de encuesta.
- Recalculo de métricas.
- Generación de alertas.
- Cambio de rol.
- Creación, edición o desactivación de usuario demo.
- Acceso denegado por rol o equipo.

Modelo futuro recomendado:

| Campo | Descripción |
| --- | --- |
| `id` | Identificador del evento. |
| `actorUserId` | Usuario que ejecutó la acción, si existe. |
| `action` | Acción normalizada. |
| `entityType` | Tipo de entidad afectada. |
| `entityId` | Identificador de entidad, si aplica. |
| `metadata` | Información mínima, sin respuestas individuales. |
| `ipHash` | Hash de IP si se requiere trazabilidad sin exponer IP directa. |
| `createdAt` | Fecha del evento. |

Los audit logs no deben almacenar respuestas de encuesta ni detalles que permitan inferir el estado individual de una persona.

## 14. Modelo de amenazas del MVP

### 14.1 Amenazas técnicas

| Amenaza | Impacto | Mitigación |
| --- | --- | --- |
| Acceso no autorizado | Alto | Supabase Auth, middleware, RBAC y validación server-side. |
| Consulta cruzada de equipos | Alto | Filtros por organización/equipo y pruebas de autorización. |
| Exposición de respuestas individuales | Alto | APIs agregadas, privacy guard y prohibición de endpoints individuales. |
| Manipulación de respuestas | Medio | Validación server-side, usuario derivado de sesión y control de duplicados. |
| Secretos expuestos | Alto | Separación de variables públicas/privadas y revisión de bundles. |
| Inyección SQL | Alto | Prisma ORM y evitar SQL dinámico no parametrizado. |
| XSS | Medio | Componentes seguros, escape por defecto de React y sanitización si se agrega contenido HTML. |
| CSRF | Medio | Métodos seguros, validación de sesión y protección propia de Supabase/Next.js según implementación. |
| Enumeración de usuarios | Medio | Mensajes de login no reveladores y rate limiting futuro. |

### 14.2 Amenazas organizacionales y éticas

| Amenaza | Impacto | Mitigación |
| --- | --- | --- |
| Managers intentan identificar colaboradores | Alto | Umbral mínimo, no mostrar listas pequeñas ni filtros sensibles. |
| RH interpreta métricas como diagnóstico | Alto | Lenguaje de indicadores, disclaimers y capacitación. |
| Uso punitivo de alertas | Alto | Recomendaciones preventivas, no individuales, y política explícita de uso. |
| Baja confianza de empleados | Alto | Transparencia en UI, agregación visible y comunicación clara. |
| Reidentificación por equipos pequeños | Alto | `responseCount >= 5` y supresión cuando filtros reduzcan muestra. |

## 15. Límites éticos y lenguaje seguro

### 15.1 No diagnóstico

No usar: “Tu equipo tiene burnout.”

Usar: “El equipo muestra indicadores elevados asociados con riesgo de burnout.”

### 15.2 No individualización

No usar: “Luis tiene alto riesgo.”

Usar: “El equipo de Engineering muestra una tendencia de carga elevada.”

### 15.3 No castigo

No recomendar: “Evaluar desempeño de empleados con baja energía.”

Usar: “Revisar carga de trabajo, claridad de prioridades y espacios de recuperación.”

### 15.4 Terminología

| Evitar | Usar |
| --- | --- |
| Diagnóstico | Indicadores de riesgo |
| Enfermedad mental | Señales tempranas de bienestar |
| Empleado problemático | Tendencia de equipo |
| Trabajador quemado | Riesgo de burnout a nivel equipo |
| Detección individual | Analítica agregada |
| Vigilancia | Prevención organizacional |
| Productividad individual | Productividad saludable |

## 16. Mensajes obligatorios de privacidad en UI

| Superficie | Mensaje recomendado |
| --- | --- |
| Login | “Ambiente demo. Los datos utilizados son simulados, anonimizados o sintéticos.” |
| Encuesta | “Tus respuestas ayudan a comprender el bienestar del equipo. PulseWell solo muestra resultados agregados cuando existen al menos 5 respuestas. Tu respuesta individual no será mostrada a managers ni a RH.” |
| Dashboard HR | “Insights basados en datos agregados a nivel equipo. Las respuestas individuales nunca se muestran.” |
| Dashboard Manager | “Este dashboard muestra señales agregadas del equipo. No identifica colaboradores individuales.” |
| Datos insuficientes | “Datos insuficientes para proteger la confidencialidad. Se requieren al menos 5 respuestas para generar analítica de equipo.” |

## 17. Requisitos de implementación

### 17.1 Middleware y autorización

- Implementar `middleware.ts` para validar sesión y redirigir usuarios no autenticados.
- Bloquear rutas privadas por rol.
- Complementar el middleware con autorización server-side en cada endpoint o acción sensible.

Helpers recomendados:

```ts
requireRole(["ADMIN", "HR_ANALYST"])
requireTeamAccess(teamId)
requireAggregationThreshold(responseCount, 5)
```

### 17.2 Data access layer

- Centralizar consultas en `lib/db/` o servicios de dominio equivalentes.
- Evitar consultas directas desde componentes de UI.
- Crear funciones separadas para datos agregados y datos internos sensibles.
- Garantizar que funciones usadas por dashboards nunca retornen `user.email`, `user.name` ni respuestas individuales.

### 17.3 Privacy guard

Antes de retornar analítica:

```ts
if (responseCount < 5) {
  return {
    status: "INSUFFICIENT_DATA",
    message: "Datos insuficientes para proteger la confidencialidad.",
  };
}
```

## 18. Criterios de aceptación

El sistema cumple esta especificación cuando:

- Ningún rol puede ver respuestas individuales desde UI, API o dashboard.
- `MANAGER` solo ve métricas de su propio equipo.
- `EMPLOYEE` solo puede responder encuestas y no accede a dashboards.
- `HR_ANALYST` ve datos agregados, nunca identificadores asociados a respuestas.
- Equipos o filtros con menos de 5 respuestas muestran `INSUFFICIENT_DATA`.
- OWI, burnout risk, alertas y recomendaciones se calculan en backend.
- Las APIs validan sesión, rol, input y alcance por equipo/organización.
- Las variables privadas no se exponen al navegador.
- La UI contiene mensajes claros de privacidad.
- El lenguaje evita diagnóstico clínico, vigilancia y uso punitivo.
- Los datos demo son sintéticos o anonimizados.
- Los eventos críticos quedan registrados en auditoría mínima sin respuestas individuales.

## 19. Checklist para desarrollo y demo

- [ ] Variables privadas no expuestas.
- [ ] Supabase Auth configurado para email/password.
- [ ] Middleware activo para rutas privadas.
- [ ] Roles validados server-side.
- [ ] Manager limitado a su equipo.
- [ ] Employee sin acceso a dashboards.
- [ ] No existen endpoints de dashboard que retornen respuestas individuales.
- [ ] Regla de mínimo 5 respuestas activa en API y UI.
- [ ] Métricas calculadas en backend.
- [ ] Datos demo sintéticos o anonimizados.
- [ ] Mensajes de privacidad visibles.
- [ ] Audit logs mínimos implementados.
- [ ] Deploy en Vercel con variables correctas.

## 20. Compliance boundaries y evolución posterior

### 20.1 Declaración para MVP

PulseWell MVP es un prototipo de validación técnica y de negocio. No debe comercializarse como:

- Herramienta clínica.
- Sistema de diagnóstico médico o psicológico.
- Evaluación individual de salud mental.
- Solución certificada de cumplimiento NOM-035.
- Plataforma con cumplimiento completo de LFPDPPP, GDPR, SOC 2 o ISO 27001.

### 20.2 Requisitos futuros antes de producción real

- Consentimiento explícito y aviso de privacidad.
- Base legal y contrato de tratamiento de datos con clientes.
- Evaluación de impacto de privacidad.
- Políticas formales de retención, eliminación y derechos ARCO cuando aplique.
- MFA para `ADMIN` y `HR_ANALYST`.
- SSO empresarial.
- Rate limiting y protección contra abuso.
- Gestión de incidentes y respuesta a brechas.
- Auditoría completa y monitoreo.
- Separación multi-tenant robusta por organización.
- Revisión legal de NOM-035, LFPDPPP y jurisdicciones objetivo.

## 21. Preguntas abiertas para PRD y legal

- ¿El MVP demo usará únicamente datos sintéticos o habrá pilotos con empleados reales?
- ¿Cuál será el período de encuesta: semanal, quincenal o mensual?
- ¿Cómo se define “una respuesta por encuesta”: por período, por campaña o por formulario activo?
- ¿El umbral mínimo de 5 respuestas será suficiente para todos los clientes o deberá subir según tamaño de organización?
- ¿Los managers podrán ver tendencias históricas cuando un equipo caiga temporalmente por debajo del umbral?
- ¿Qué jurisdicción legal será prioritaria para producción: México, Unión Europea, Estados Unidos u otra?
- ¿Se permitirá exportación de datos agregados en fases posteriores?
- ¿Qué proceso seguirá un cliente si un equipo muestra indicadores altos de riesgo?

## 22. Resumen ejecutivo

PulseWell debe proteger la confianza desde su primera versión. La arquitectura de privacidad del MVP se resume así:

```text
Datos simulados o sintéticos
→ Respuestas numéricas mínimas
→ Pseudonimización interna
→ Agregación por equipo
→ Mínimo 5 respuestas
→ Métricas explicables
→ Alertas preventivas
→ Sin exposición individual
```

La seguridad del prototipo no equivale a cumplimiento empresarial completo, pero debe demostrar que el producto fue diseñado con fundamentos correctos: privacidad por diseño, control de acceso por rol, datos mínimos, lenguaje ético, trazabilidad básica y límites claros entre bienestar organizacional y evaluación clínica individual.
