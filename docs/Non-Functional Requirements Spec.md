# Non-Functional Requirements Spec

**Producto:** PulseWell — Organizational Wellbeing Intelligence Platform  
**Versión:** MVP SaaS para validación, demo técnica y presentación a usuarios o inversionistas  
**Stack de referencia:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui, Supabase Auth, Supabase PostgreSQL, Prisma 7 con `prisma.config.ts`, Bun, Vercel y GitHub CI/CD.

---

## 1. Propósito

Este documento define los requisitos no funcionales que PulseWell debe cumplir para ser confiable, demostrable, seguro y coherente con su promesa principal: generar inteligencia organizacional útil sin comprometer la confianza de los colaboradores.

Los requisitos funcionales describen qué hace el producto. Estos requisitos describen cómo debe comportarse respecto de privacidad, seguridad, rendimiento, disponibilidad, confiabilidad, mantenibilidad, accesibilidad, observabilidad, compatibilidad, integridad de datos y límites éticos.

---

## 2. Alcance

### 2.1 Incluido en el MVP

- Aplicación web con Next.js 15 App Router y React 19.
- Backend mediante Route Handlers de Next.js.
- Persistencia con Supabase PostgreSQL y Prisma 7.
- Autenticación con Supabase Auth.
- Dashboards por rol: Admin, HR Analyst, Manager y Employee.
- Encuesta pulse con respuestas numéricas de 1 a 5.
- Analítica agregada: Organizational Wellbeing Index (OWI), riesgo de burnout, riesgo de rotación, alertas y recomendaciones.
- Datos simulados para demo.
- Deploy en Vercel y flujo CI/CD desde GitHub.

### 2.2 Fuera del alcance del MVP

- Certificaciones SOC 2, ISO 27001, HIPAA u otras auditorías formales.
- Cumplimiento legal productivo completo.
- SSO empresarial, OAuth corporativo o MFA obligatorio.
- Integraciones reales con Slack, Microsoft Teams u otras fuentes privadas.
- Análisis de mensajes, conversaciones, texto libre sensible o datos biométricos.
- Modelos de Machine Learning productivos.
- Alta disponibilidad empresarial, disaster recovery formal o multi-region.
- Multi-tenant empresarial completo.

### 2.3 Límites de cumplimiento

PulseWell MVP es un prototipo con datos simulados. No debe presentarse como sistema clínico, herramienta de diagnóstico, evaluación individual de salud mental ni solución legalmente certificada para cumplimiento laboral. Para un piloto real se requiere revisión legal, consentimiento explícito, política de retención, tratamiento de datos personales, controles de acceso reforzados y evaluación normativa aplicable, incluyendo LFPDPPP y, si corresponde, NOM-035.

---

## 3. Principios no funcionales

1. Privacidad antes que visibilidad.
2. Seguridad antes que comodidad.
3. Datos agregados antes que datos individuales.
4. Explicabilidad antes que complejidad.
5. Demo estable antes que features avanzadas.
6. Simplicidad antes que sobreingeniería.
7. Prevención antes que diagnóstico.
8. Medición objetiva antes que intención declarada.

---

## 4. Convenciones de requisitos

- **MUST / DEBE:** requisito obligatorio para aceptar el MVP.
- **SHOULD / DEBERÍA:** requisito recomendado; cualquier excepción debe justificarse.
- **MAY / PUEDE:** capacidad opcional o futura.
- Los umbrales de tiempo se miden en ambiente de demo con datos simulados, red estable y deployment de Vercel production o preview.
- Ningún requisito permite exponer respuestas individuales aunque simplifique implementación.

---

## 5. Requisitos de privacidad

La privacidad es el atributo de calidad más importante de PulseWell. La plataforma debe evitar exposición individual y reducir la percepción de vigilancia.

### NFR-PRIV-01 — Agregación obligatoria por equipo

**Prioridad:** Must  
**Requisito:** El sistema DEBE mostrar métricas, alertas, tendencias y recomendaciones únicamente a nivel agregado por equipo o grupo permitido.

**Criterios de aceptación:**

- [ ] HR Analyst no puede ver respuestas individuales.
- [ ] Manager no puede ver respuestas individuales.
- [ ] Admin no puede ver respuestas individuales en dashboards.
- [ ] Las APIs de métricas, alertas y recomendaciones no devuelven `userId`, email ni valores individuales de encuesta.
- [ ] Toda visualización de bienestar se presenta por equipo, periodo y métrica agregada.

### NFR-PRIV-02 — Umbral mínimo de confidencialidad

**Prioridad:** Must  
**Requisito:** El sistema DEBE bloquear métricas, alertas y recomendaciones cuando un equipo tenga menos de 5 respuestas válidas para el periodo consultado.

**Comportamiento esperado:**

- Si `responseCount < 5`, el sistema no calcula ni muestra analítica del equipo.
- La UI muestra: “Datos insuficientes para proteger la confidencialidad. Se requieren al menos 5 respuestas para generar analítica de equipo.”

**Criterios de aceptación:**

- [ ] Un equipo con 4 o menos respuestas no genera OWI.
- [ ] Un equipo con 4 o menos respuestas no genera alertas.
- [ ] Un equipo con 4 o menos respuestas no genera recomendaciones.
- [ ] La respuesta de API indica estado de datos insuficientes sin exponer respuestas individuales.

### NFR-PRIV-03 — No identificación individual

**Prioridad:** Must  
**Requisito:** El sistema NO DEBE permitir inferir el estado de bienestar de una persona específica.

**Prohibido en dashboards y APIs analíticas:**

- Nombre o email asociado a una respuesta.
- Respuesta individual.
- Historial individual.
- Riesgo individual.
- Ranking individual.
- Comentarios o texto libre sensible.

**Permitido:**

- Equipo.
- Periodo.
- Cantidad de respuestas.
- Promedios agregados.
- OWI por equipo.
- Riesgo de burnout por equipo.
- Riesgo de rotación por equipo.
- Tendencia por equipo.

### NFR-PRIV-04 — Minimización de datos

**Prioridad:** Must  
**Requisito:** El MVP DEBE recolectar solo los datos necesarios para la demo y la analítica agregada.

**Datos permitidos en MVP:**

- Email para autenticación.
- Rol.
- Equipo.
- Respuestas numéricas de 1 a 5.
- Periodo de encuesta.
- Métricas, alertas y recomendaciones agregadas.

**Datos no permitidos en MVP:**

- Diagnósticos médicos o psicológicos.
- Texto libre sensible.
- Mensajes privados.
- Metadatos reales de Slack o Teams.
- Historial clínico.
- Datos biométricos.
- Evaluación individual de salud mental.

### NFR-PRIV-05 — Comunicación visible de privacidad

**Prioridad:** Must  
**Requisito:** La UI DEBE comunicar claramente que PulseWell opera con datos agregados y que las respuestas individuales no se muestran a managers ni Recursos Humanos.

**Ubicaciones mínimas:**

- Login.
- Encuesta pulse.
- Dashboard HR.
- Dashboard Manager.
- Estados de datos insuficientes.

**Copy base:** “PulseWell solo muestra insights agregados por equipo. Las respuestas individuales nunca se muestran a managers ni RH.”

---

## 6. Requisitos de seguridad

PulseWell debe seguir prácticas básicas de seguridad web alineadas con OWASP Top 10, defensa en profundidad y mínimo privilegio.

### NFR-SEC-01 — Autenticación obligatoria

**Prioridad:** Must  
**Requisito:** Todas las rutas privadas y APIs privadas DEBEN requerir sesión activa.

**Rutas protegidas mínimas:**

- `/dashboard/hr`
- `/dashboard/manager`
- `/dashboard/admin`
- `/survey`
- `/api/*`, excepto endpoints explícitamente públicos como login o health check.

**Criterios de aceptación:**

- [ ] Un usuario no autenticado es redirigido a `/auth/login` desde páginas privadas.
- [ ] Una API privada devuelve `401 Unauthorized` si no hay sesión válida.
- [ ] La expiración de sesión se comunica con un estado recuperable, no con pantalla en blanco.

### NFR-SEC-02 — Autorización por rol y alcance de equipo

**Prioridad:** Must  
**Requisito:** El sistema DEBE restringir acciones y datos según rol y pertenencia de equipo.

| Rol | Acceso permitido |
| --- | --- |
| Admin | Gestión de demo, usuarios y equipos; sin exposición individual de respuestas en UI analítica. |
| HR Analyst | Datos agregados globales y por equipo. |
| Manager | Datos agregados únicamente de su equipo. |
| Employee | Encuesta pulse y confirmación de envío. |

**Criterios de aceptación:**

- [ ] Manager no puede consultar `teamId` ajeno.
- [ ] Employee no puede acceder a dashboards.
- [ ] HR Analyst no recibe respuestas individuales.
- [ ] Admin no puede usar vistas analíticas para inspeccionar respuestas individuales.

### NFR-SEC-03 — Validación server-side

**Prioridad:** Must  
**Requisito:** Toda entrada de usuario DEBE validarse en servidor antes de persistir, calcular o devolver datos.

**Aplica a:** login, encuesta, creación de usuarios, creación de equipos, recalculo de métricas, seed/reset de demo y filtros de dashboard.

**Reglas mínimas:**

- No confiar en `userId`, `teamId` ni `role` enviados por frontend.
- Validar respuestas de encuesta como enteros entre 1 y 5.
- Validar parámetros de ruta, query strings y body.
- Calcular métricas finales en backend, nunca en cliente como fuente de verdad.
- Responder con `400 Bad Request` ante input inválido.

### NFR-SEC-04 — Protección de secretos

**Prioridad:** Must  
**Requisito:** Las claves privadas y variables sensibles NO DEBEN exponerse al cliente, al repositorio ni a logs.

**Variables privadas:**

- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`, si se usa.

**Variables públicas permitidas:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

**Criterios de aceptación:**

- [ ] `.env` está ignorado por Git.
- [ ] `.env.example` existe sin valores reales.
- [ ] No hay secretos hardcodeados en frontend, server components, route handlers ni documentación.
- [ ] Los logs no imprimen tokens, connection strings ni service role keys.

### NFR-SEC-05 — Row Level Security y acceso a datos

**Prioridad:** Must para piloto real; Should para MVP si se usa Supabase client desde el cliente  
**Requisito:** Las tablas sensibles DEBERÍAN estar preparadas para Row Level Security. Si una tabla es consultada directamente desde el cliente Supabase, RLS DEBE estar habilitado con políticas restrictivas.

**Tablas sensibles:** usuarios, equipos, respuestas, métricas, alertas, recomendaciones y auditoría.

**Criterios de aceptación MVP:**

- [ ] Todo acceso sensible pasa por backend o por políticas RLS activas.
- [ ] La autorización se valida en servidor aunque exista control visual en frontend.
- [ ] RLS queda documentado como requisito obligatorio para piloto real.

### NFR-SEC-06 — Protección de endpoints

**Prioridad:** Must  
**Requisito:** Cada endpoint privado DEBE validar sesión, rol, alcance de equipo, input y formato seguro de salida.

**Criterios de aceptación:**

- [ ] Employee no puede consultar `/api/metrics`, `/api/alerts` ni `/api/recommendations`.
- [ ] Manager no puede consultar métricas de otro equipo mediante manipulación de query params.
- [ ] Las respuestas de API analítica no incluyen datos individuales.
- [ ] Errores internos devuelven mensajes genéricos al usuario y detalle técnico solo en logs seguros.

---

## 7. Requisitos de rendimiento

El MVP debe sentirse rápido durante demo y validación. Los objetivos se miden con dataset MVP, Vercel deployment y red estable.

### NFR-PERF-01 — Tiempo de carga de páginas

**Prioridad:** Should  
**Requisito:** Las páginas principales DEBERÍAN cargar dentro de los umbrales definidos.

| Vista | Objetivo p75 | Máximo aceptable |
| --- | ---: | ---: |
| Landing/Login | < 2.5 s | 4.0 s |
| Dashboard HR | < 3.0 s | 5.0 s |
| Dashboard Manager | < 3.0 s | 5.0 s |
| Survey | < 2.0 s | 3.5 s |

**Criterios de aceptación:**

- [ ] Dashboard HR muestra skeleton, loading state o contenido útil mientras carga.
- [ ] No hay pantallas en blanco durante carga normal.
- [ ] La encuesta permite interacción fluida en móvil.

### NFR-PERF-02 — Tiempo de respuesta de APIs

**Prioridad:** Should  
**Requisito:** Las APIs principales DEBERÍAN responder dentro de los objetivos p75 con dataset MVP.

| Endpoint | Objetivo p75 | Máximo aceptable |
| --- | ---: | ---: |
| `GET /api/auth/me` | < 500 ms | 1.0 s |
| `GET /api/surveys` | < 800 ms | 1.5 s |
| `POST /api/responses` | < 1.5 s | 2.5 s |
| `GET /api/metrics` | < 1.5 s | 2.5 s |
| `GET /api/alerts` | < 1.0 s | 2.0 s |
| `GET /api/recommendations` | < 1.0 s | 2.0 s |

### NFR-PERF-03 — Cálculo eficiente de métricas

**Prioridad:** Must  
**Requisito:** La analítica DEBE calcularse en backend o precalcularse para demo; el frontend no debe ser fuente de verdad analítica.

**Criterios de aceptación:**

- [ ] No se recalculan métricas completas en cada render.
- [ ] Los cálculos usan datos agregados cuando sea posible.
- [ ] El mismo dataset produce siempre el mismo OWI, riesgos, alertas y recomendaciones.
- [ ] La UI no queda bloqueada durante recalculos.

### NFR-PERF-04 — Optimización visual

**Prioridad:** Should  
**Requisito:** Las visualizaciones DEBERÍAN ser simples, legibles y fluidas.

**Restricciones MVP:**

- Máximo 4 equipos visibles por defecto.
- Máximo 4 semanas visibles por defecto.
- Evitar animaciones pesadas.
- No usar gráficos cuya lectura requiera explicación técnica compleja.

---

## 8. Requisitos de disponibilidad y confiabilidad

### NFR-AVAIL-01 — Disponibilidad de demo

**Prioridad:** Must  
**Requisito:** El sistema DEBE estar disponible durante la demo controlada.

**Objetivo MVP:** disponibilidad práctica del deployment de demo durante la ventana de presentación.

**Medidas mínimas:**

- Deployment estable en Vercel production o preview validado antes de la demo.
- Datos demo precargados.
- Cuentas demo probadas.
- Plan de contingencia con capturas o video opcional.

### NFR-REL-01 — Recuperación de datos demo

**Prioridad:** Must  
**Requisito:** Debe existir una forma reproducible de restaurar el dataset de demo.

**Criterios de aceptación:**

- [ ] Seed/reset genera siempre las cuentas, equipos, encuestas, métricas, alertas y recomendaciones esperadas.
- [ ] Engineering aparece con riesgo alto en el escenario demo.
- [ ] Sales aparece con señal de riesgo de rotación en el escenario demo.
- [ ] El reset no requiere editar datos manualmente en producción.

### NFR-REL-02 — Manejo de errores recuperable

**Prioridad:** Must  
**Requisito:** La UI DEBE mostrar errores claros, seguros y accionables cuando falle una operación.

**Mensajes esperados:**

- “No se pudo cargar el dashboard.”
- “No se pudo enviar la encuesta.”
- “No hay datos suficientes para proteger la confidencialidad.”
- “La sesión expiró. Iniciá sesión nuevamente.”

**Prohibido:** pantallas en blanco, stack traces visibles, mensajes con secretos o errores técnicos incomprensibles.

---

## 9. Requisitos de escalabilidad

### NFR-SCAL-01 — Escenario MVP soportado

**Prioridad:** Must  
**Requisito:** El MVP DEBE soportar sin degradación visible el dataset de demo.

| Dimensión | Valor MVP |
| --- | ---: |
| Empresas simuladas | 1 |
| Equipos | 4 |
| Colaboradores | 20 |
| Semanas históricas | 4 |
| Respuestas históricas esperadas | 80 |

### NFR-SCAL-02 — Preparación para piloto

**Prioridad:** Should  
**Requisito:** La arquitectura DEBERÍA poder evolucionar a un piloto real sin reescritura total.

**Escenario piloto esperado:**

- 1 a 3 organizaciones.
- 50 a 200 colaboradores por organización.
- 4 a 8 semanas de encuestas.
- Datos agregados por equipo.

**Implicaciones post-MVP:** agregar entidad `Organization`, particionar por `organizationId`, indexar por `organizationId`, `teamId` y `period`.

### NFR-SCAL-03 — Modularidad evolutiva

**Prioridad:** Must  
**Requisito:** La lógica de negocio DEBE estar separada de UI, acceso a datos y routing.

**Módulos esperados:** auth, db, analytics, alerts, recommendations, survey y dashboard.

**Criterios de aceptación:**

- [ ] La lógica de analytics no está embebida en componentes React.
- [ ] El acceso a datos está centralizado en servicios o repositorios internos.
- [ ] Las reglas de alertas y recomendaciones están separadas y son testeables.

---

## 10. Requisitos de integridad de datos

### NFR-DATA-01 — Valores válidos de encuesta

**Prioridad:** Must  
**Requisito:** Toda respuesta de encuesta DEBE ser un entero entre 1 y 5.

**Criterios de aceptación:**

- [ ] Valores menores a 1, mayores a 5, decimales, strings o nulos se rechazan con `400 Bad Request`.
- [ ] La base de datos refuerza la regla mediante constraints, validación de aplicación o ambos.

### NFR-DATA-02 — Una respuesta por usuario por encuesta

**Prioridad:** Must  
**Requisito:** El sistema DEBE evitar respuestas duplicadas del mismo usuario para la misma encuesta.

**Criterios de aceptación:**

- [ ] Existe unicidad lógica equivalente a `userId + surveyId`.
- [ ] Un intento duplicado devuelve estado controlado y no corrompe métricas.

### NFR-DATA-03 — Consistencia analítica

**Prioridad:** Must  
**Requisito:** Las métricas DEBEN ser deterministas para el mismo dataset.

**Criterios de aceptación:**

- [ ] El mismo input produce el mismo OWI.
- [ ] El mismo input produce el mismo nivel de riesgo de burnout.
- [ ] El mismo input produce las mismas alertas y recomendaciones.
- [ ] Cambios en respuestas disparan recalculo o invalidación explícita de métricas derivadas.

---

## 11. Requisitos de mantenibilidad

### NFR-MAINT-01 — TypeScript estricto

**Prioridad:** Must  
**Requisito:** Frontend, backend y lógica de negocio DEBEN implementarse con TypeScript y tipos explícitos para contratos relevantes.

**Criterios de aceptación:**

- [ ] No se usa `any` salvo excepción documentada.
- [ ] Existen tipos o DTOs para requests y responses de APIs.
- [ ] Existen tipos para métricas, riesgos, alertas y recomendaciones.

### NFR-MAINT-02 — Estructura modular

**Prioridad:** Must  
**Requisito:** El código DEBE organizarse por responsabilidad.

**Estructura recomendada:**

- `app/` para rutas, layouts, páginas y route handlers.
- `components/` para UI reutilizable.
- `lib/auth` para sesión y autorización.
- `lib/db` para Prisma y acceso a datos.
- `lib/analytics` para OWI y riesgos.
- `lib/alerts` para reglas de alertas.
- `lib/recommendations` para recomendaciones.
- `prisma/` y `prisma.config.ts` para modelo y configuración Prisma 7.

### NFR-MAINT-03 — Package manager y comandos

**Prioridad:** Must  
**Requisito:** El proyecto DEBE usar Bun como package manager, de acuerdo con `packageManager` y `bun.lock`.

**Comandos esperados:**

- `bun install`
- `bun dev`
- `bun run lint`
- `bun run build`
- `bun run prisma:generate`
- `bun run prisma:migrate`

### NFR-MAINT-04 — Documentación mínima

**Prioridad:** Must  
**Requisito:** El repositorio DEBE incluir documentación suficiente para ejecutar, configurar y demostrar el MVP.

**Criterios de aceptación:**

- [ ] `README.md` describe propósito, stack, MVP y ejecución local.
- [ ] `.env.example` documenta variables sin secretos reales.
- [ ] Existen instrucciones de seed/reset o demo accounts.
- [ ] Las reglas de privacidad y límites éticos están documentados.

---

## 12. Requisitos de usabilidad

### NFR-UX-01 — Claridad inmediata del dashboard

**Prioridad:** Must  
**Requisito:** Un usuario HR Analyst DEBE entender el estado general del dashboard en menos de 30 segundos durante una demo guiada.

**Criterios de aceptación:**

- [ ] KPI principal visible sin scroll en desktop.
- [ ] Equipos en riesgo identificables sin depender solo del color.
- [ ] Cada alerta tiene recomendación asociada o siguiente acción sugerida.
- [ ] El lenguaje evita jerga técnica innecesaria.

### NFR-UX-02 — Encuesta rápida

**Prioridad:** Must  
**Requisito:** Un Employee DEBE poder completar la encuesta en menos de 1 minuto.

**Criterios de aceptación:**

- [ ] La encuesta tiene 5 preguntas en escala 1 a 5.
- [ ] El significado de la escala es claro.
- [ ] El botón de envío es visible.
- [ ] La confirmación posterior al envío es clara.

### NFR-UX-03 — Lenguaje seguro y preventivo

**Prioridad:** Must  
**Requisito:** La UI DEBE evitar lenguaje clínico, punitivo o individualizante.

**Evitar:** “diagnóstico”, “empleado quemado”, “enfermedad mental”, “bajo rendimiento individual”.  
**Usar:** “indicadores de riesgo”, “señales tempranas”, “tendencia del equipo”, “acción preventiva”.

---

## 13. Requisitos de accesibilidad

### NFR-ACC-01 — Accesibilidad base

**Prioridad:** Must  
**Requisito:** El MVP DEBE cumplir prácticas base alineadas con WCAG 2.2 nivel AA donde sea razonable para el alcance.

**Criterios de aceptación:**

- [ ] Contraste mínimo 4.5:1 para texto normal y 3:1 para texto grande o componentes gráficos relevantes.
- [ ] Inputs tienen labels accesibles.
- [ ] Botones tienen nombre accesible y texto claro.
- [ ] El foco de teclado es visible.
- [ ] La información crítica no depende solo del color.
- [ ] La encuesta se puede completar con teclado.

### NFR-ACC-02 — Responsive mínimo

**Prioridad:** Must  
**Requisito:** La encuesta DEBE ser usable en móvil y los dashboards DEBEN funcionar correctamente en desktop.

**Breakpoints mínimos:**

- Survey: usable desde 360 px de ancho.
- Dashboards: optimizados para 1280 px o superior, con degradación razonable en tablet.

---

## 14. Requisitos de observabilidad y auditoría

### NFR-OBS-01 — Logging operativo básico

**Prioridad:** Should  
**Requisito:** El backend DEBERÍA registrar eventos relevantes para depuración y operación de demo.

**Eventos mínimos:**

- Error al enviar encuesta.
- Error al recalcular métricas.
- Error al cargar dashboard.
- Intento de acceso no autorizado.
- Error de conexión a base de datos.
- Seed/reset de datos demo.

### NFR-OBS-02 — Logs sin datos sensibles

**Prioridad:** Must  
**Requisito:** Los logs NO DEBEN incluir datos sensibles.

**Prohibido en logs:** respuestas individuales completas, tokens, passwords, service role keys, connection strings, variables secretas y payloads completos de autenticación.

### NFR-AUD-01 — Auditoría mínima de eventos críticos

**Prioridad:** Should para MVP; Must para piloto real  
**Requisito:** El sistema DEBERÍA poder registrar eventos críticos de seguridad, demo y administración.

**Eventos auditables:** login exitoso, login fallido, encuesta enviada, intento de acceso no autorizado, recalculo de métricas, generación de alertas, seed/reset, cambio de rol y creación de usuario.

### NFR-AUD-02 — Verificación de privacidad en APIs

**Prioridad:** Must  
**Requisito:** Las respuestas de APIs analíticas DEBEN poder revisarse para confirmar que no exponen datos individuales.

**Criterios de aceptación:**

- [ ] `/api/metrics` no devuelve `userId`, email ni respuestas individuales.
- [ ] `/api/alerts` no devuelve `userId`, email ni respuestas individuales.
- [ ] `/api/recommendations` no devuelve `userId`, email ni respuestas individuales.

---

## 15. Requisitos de compatibilidad

### NFR-COMP-01 — Navegadores soportados

**Prioridad:** Must  
**Requisito:** El MVP DEBE funcionar en las versiones estables actuales de navegadores modernos.

**Soporte mínimo:**

- Chrome actual.
- Edge actual.
- Safari actual.
- Firefox actual.

**No objetivo MVP:** Internet Explorer, navegadores legacy o WebViews corporativos no actualizados.

### NFR-COMP-02 — Entornos soportados

**Prioridad:** Must  
**Requisito:** La aplicación DEBE funcionar en local development, Vercel preview deployments y Vercel production deployment.

---

## 16. Requisitos de CI/CD y despliegue

### NFR-CICD-01 — Deploy automático

**Prioridad:** Must  
**Requisito:** El proyecto DEBE desplegarse automáticamente desde GitHub hacia Vercel.

**Flujo esperado:** pull request o push → Vercel preview → validación → merge a `main` → production deployment.

### NFR-CICD-02 — Build reproducible

**Prioridad:** Must  
**Requisito:** El build DEBE ser reproducible sin pasos manuales no documentados.

**Criterios de aceptación:**

- [ ] `bun install` instala dependencias usando `bun.lock`.
- [ ] `bun run build` es el comando esperado de build.
- [ ] Variables de entorno requeridas están configuradas en Vercel.
- [ ] Prisma genera cliente compatible con `prisma.config.ts`.

### NFR-CICD-03 — Calidad mínima antes de merge

**Prioridad:** Should  
**Requisito:** Antes de merge a `main`, el proyecto DEBERÍA ejecutar checks mínimos.

**Checks esperados:**

- `bun run lint`
- `bun run build`
- Tests automatizados cuando existan.
- Validación manual de flujos demo críticos.

---

## 17. Requisitos éticos

### NFR-ETH-01 — No diagnóstico clínico

**Prioridad:** Must  
**Requisito:** PulseWell NO DEBE presentarse como herramienta médica, psicológica o diagnóstica.

**Regla de lenguaje:**

- No decir: “El equipo tiene burnout.”
- Decir: “El equipo muestra indicadores elevados asociados con riesgo de burnout.”

### NFR-ETH-02 — No uso punitivo

**Prioridad:** Must  
**Requisito:** El producto DEBE estar orientado a prevención y mejora organizacional, no a sanción ni evaluación individual.

**Prohibido:** rankings individuales, alertas individuales, sugerencias de sanción, evaluación de desempeño individual.

### NFR-ETH-03 — Transparencia

**Prioridad:** Must  
**Requisito:** La UI DEBE explicar qué datos se usan y los límites del MVP.

**Mensaje base:** “Esta demo utiliza datos simulados. En una versión real, PulseWell debe operar con consentimiento, agregación, controles de acceso y reglas claras de privacidad.”

---

## 18. Matriz resumida de requisitos

| ID | Categoría | Requisito | Prioridad | Medida principal |
| --- | --- | --- | --- | --- |
| NFR-PRIV-01 | Privacidad | Datos agregados por equipo | Must | 0 respuestas individuales expuestas |
| NFR-PRIV-02 | Privacidad | Mínimo 5 respuestas | Must | Bloqueo si `responseCount < 5` |
| NFR-PRIV-03 | Privacidad | No identificación individual | Must | Sin `userId`/email en APIs analíticas |
| NFR-SEC-01 | Seguridad | Autenticación obligatoria | Must | 401 o redirect sin sesión |
| NFR-SEC-02 | Seguridad | RBAC y alcance de equipo | Must | Manager solo ve su equipo |
| NFR-SEC-03 | Seguridad | Validación server-side | Must | 400 ante input inválido |
| NFR-PERF-01 | Rendimiento | Carga de dashboards | Should | p75 < 3 s |
| NFR-PERF-02 | Rendimiento | APIs principales | Should | p75 según tabla de endpoints |
| NFR-AVAIL-01 | Disponibilidad | Demo estable | Must | Deployment validado antes de demo |
| NFR-REL-01 | Confiabilidad | Seed/reset reproducible | Must | Dataset demo restaurable |
| NFR-SCAL-01 | Escalabilidad | Dataset MVP soportado | Must | 20 empleados / 80 respuestas |
| NFR-DATA-01 | Integridad | Respuestas 1–5 | Must | Rechazo de valores inválidos |
| NFR-MAINT-01 | Mantenibilidad | TypeScript estricto | Must | Contratos tipados |
| NFR-UX-01 | Usabilidad | Dashboard comprensible | Must | Comprensión < 30 s |
| NFR-ACC-01 | Accesibilidad | Base WCAG AA razonable | Must | Contraste, labels, teclado |
| NFR-OBS-02 | Observabilidad | Logs sin datos sensibles | Must | 0 secretos o respuestas en logs |
| NFR-CICD-02 | CI/CD | Build reproducible con Bun | Must | `bun run build` |
| NFR-ETH-01 | Ética | No diagnóstico clínico | Must | Lenguaje preventivo |

---

## 19. Criterios globales de aceptación del MVP

El MVP cumple esta especificación si:

- [ ] No se muestran respuestas individuales en UI.
- [ ] Las APIs analíticas no devuelven datos individuales.
- [ ] Las métricas solo aparecen con mínimo 5 respuestas válidas por equipo y periodo.
- [ ] Todas las rutas privadas requieren sesión.
- [ ] Los roles restringen acceso correctamente.
- [ ] Manager solo ve su equipo.
- [ ] Employee no accede a dashboards.
- [ ] Las entradas se validan server-side.
- [ ] Las métricas se calculan o validan en backend.
- [ ] Dashboard HR carga con datos demo en p75 menor a 3 segundos.
- [ ] Hay estados de loading, error y datos insuficientes.
- [ ] Variables privadas no están expuestas.
- [ ] Existe mecanismo reproducible de seed/reset de demo.
- [ ] La encuesta se completa en menos de 1 minuto.
- [ ] La UI evita diagnóstico clínico y lenguaje punitivo.
- [ ] La demo puede ejecutarse sin errores críticos visibles.

---

## 20. Checklist pre-demo

- [ ] Dependencias instaladas con `bun install`.
- [ ] Variables de entorno configuradas localmente y en Vercel.
- [ ] Prisma Client generado con configuración vigente.
- [ ] Deployment de Vercel validado.
- [ ] Login Admin probado.
- [ ] Login HR Analyst probado.
- [ ] Login Manager probado.
- [ ] Login Employee probado.
- [ ] Dashboard HR carga rápido.
- [ ] Manager no ve otros equipos.
- [ ] Employee no accede a dashboards.
- [ ] Survey funcional en desktop y móvil.
- [ ] Engineering aparece en riesgo alto.
- [ ] Sales aparece con riesgo de rotación.
- [ ] Alertas y recomendaciones visibles.
- [ ] Estado de datos insuficientes visible para equipos con menos de 5 respuestas.
- [ ] No hay datos individuales visibles.
- [ ] Mensajes de privacidad visibles.
- [ ] Consola sin errores críticos durante el flujo principal.
- [ ] Plan de contingencia de demo preparado.

---

## 21. Recomendaciones post-MVP

Para evolucionar a piloto o producto comercial, PulseWell debería agregar:

- MFA para Admin y HR Analyst.
- OAuth Google o SSO empresarial.
- Multi-tenant con entidad `Organization`.
- RLS completo en Supabase.
- AuditLog persistente y panel de auditoría.
- Consentimiento explícito y política de privacidad.
- Política de retención y borrado de datos.
- Backups y restore documentados.
- Error tracking con Sentry u opción equivalente.
- Rate limiting en APIs sensibles.
- Evaluación legal LFPDPPP / NOM-035.
- Export de reportes agregados.
- Pruebas automatizadas de privacidad, autorización y accesibilidad.

---

## 22. Resumen ejecutivo

PulseWell no necesita comportarse todavía como un SaaS empresarial completo, pero sí debe demostrar fundamentos correctos para convertirse en uno. Para el MVP, la prioridad no funcional es:

**Privacidad + Seguridad + Demo estable + Rendimiento suficiente + Código mantenible.**

La regla central es simple: PulseWell debe ayudar a entender el bienestar organizacional sin convertir a las personas en objetos de vigilancia individual.
