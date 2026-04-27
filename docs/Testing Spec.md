# 📄 Testing Spec

PulseWell — Especificación de Pruebas, Validación y Preparación de Demo

## 1. Propósito

Este documento define la estrategia de pruebas para el MVP de **PulseWell**, una plataforma SaaS de inteligencia de bienestar organizacional basada en datos agregados y simulados.

El objetivo es asegurar que el MVP sea:

- funcional en los flujos críticos;
- seguro por rol y por equipo;
- consistente con privacidad por diseño;
- explicable en sus reglas analíticas;
- confiable para una demo con usuarios, empresas o inversionistas;
- verificable por criterios claros de aceptación.

Esta especificación guía pruebas unitarias, integración, API, UI, accesibilidad, privacidad, datos demo, validación manual, smoke tests y expectativas de CI/CD.

## 2. Principios de testing

1. **Privacidad antes que cobertura visual**: ninguna prueba se considera aprobada si expone respuestas individuales, emails de employees o riesgo individual en dashboards.
2. **Analítica explicable**: los cálculos deben ser deterministas, trazables y testeables con datos controlados.
3. **Roles como frontera de seguridad**: cada flujo debe validarse por `ADMIN`, `HR`, `MANAGER` y `EMPLOYEE`.
4. **Demo reproducible**: los datos simulados deben poder recrear siempre la narrativa del producto.
5. **MVP pragmático**: se priorizan pruebas de lógica, permisos, privacidad y demo por encima de cobertura exhaustiva de UI.
6. **Automatización incremental**: lo crítico debe automatizarse primero; lo visual y exploratorio puede iniciar con checklist manual.

## 3. Alcance

### 3.1 Incluido en el MVP

Las pruebas deben cubrir:

- autenticación y redirección por rol;
- autorización de rutas privadas y APIs;
- envío y validación de encuestas pulse;
- prevención de respuestas duplicadas por encuesta;
- agregación por equipo con mínimo de 5 respuestas;
- cálculo de OWI, burnout risk, attrition risk, productivity health, tendencia y proyección;
- generación de alertas y recomendaciones;
- dashboards de HR y Manager;
- vista de Employee para responder encuesta;
- datos simulados y narrativa de demo;
- privacidad, anonimización operativa y ausencia de exposición individual;
- deploy en Vercel y smoke tests post-deploy;
- accesibilidad básica de formularios, navegación y dashboards.

### 3.2 Fuera del alcance del MVP

No se requiere validar en esta versión:

- integraciones reales con Slack o Microsoft Teams;
- NLP o análisis de texto libre;
- modelos reales de Machine Learning en producción;
- pagos, facturación o planes comerciales;
- app móvil nativa;
- SSO empresarial, MFA o auditoría avanzada;
- cumplimiento legal completo de producción;
- rendimiento a gran escala o pruebas de carga masiva;
- multi-tenant empresarial completo.

### 3.3 Alcance futuro recomendado

- Pruebas contractuales para integraciones externas.
- Pruebas de consentimiento y retención de datos.
- Pruebas de RLS detalladas en Supabase.
- Pruebas de accesibilidad WCAG 2.2 AA completas.
- Pruebas de carga con datasets multi-organización.
- Validación estadística de modelos predictivos reales.

## 4. Estrategia por dimensión

### 4.1 Producto

Validar que la propuesta de valor sea demostrable:

- HR entiende el estado global de bienestar.
- Manager ve únicamente señales agregadas de su equipo.
- Employee puede responder una encuesta simple y entiende la promesa de privacidad.
- La demo cuenta una historia clara: señal → insight → predicción → recomendación → valor de negocio.

### 4.2 Ingeniería

Validar comportamiento técnico:

- componentes renderizan estados clave;
- APIs validan input, sesión y rol;
- funciones de analytics son deterministas;
- errores tienen formato consistente;
- rutas privadas bloquean accesos indebidos;
- el proyecto funciona con Bun, Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui, Supabase/PostgreSQL y Prisma 7 con `prisma.config.ts`.

### 4.3 Datos

Validar calidad y consistencia:

- seed demo reproducible;
- 4 equipos, 20 employees y 4 semanas de respuestas;
- mínimo 5 respuestas por equipo para mostrar analítica;
- métricas entre 0 y 100;
- tendencias coherentes por equipo;
- alertas y recomendaciones vinculadas a métricas reales del dataset simulado.

### 4.4 Seguridad y privacidad

Validar controles obligatorios:

- RBAC por rol;
- aislamiento de manager por equipo;
- ausencia de respuestas individuales en UI y API de dashboard;
- no exposición de `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` ni secretos server-side;
- mensajes de privacidad visibles;
- lenguaje no clínico y no punitivo.

### 4.5 Demo

Validar preparación operacional:

- ambiente de Vercel estable;
- datos demo precargados;
- credenciales demo disponibles de forma segura;
- sin errores visibles en consola;
- narrativa practicada de principio a fin;
- alternativa manual disponible si falla una interacción secundaria.

## 5. Niveles de prueba

| Nivel | Objetivo | Prioridad MVP | Herramientas recomendadas |
| --- | --- | --- | --- |
| Unitarias | Validar funciones puras de analytics, validación y mapeo | Alta | Bun Test o Vitest |
| Integración | Validar flujo entre API, Prisma, Supabase y reglas de negocio | Alta | Bun Test/Vitest + base de prueba o mocks controlados |
| API | Validar contratos, errores, roles y privacidad | Alta | Bun Test/Vitest, fetch contra Route Handlers |
| Componentes | Validar estados de UI críticos | Media | React Testing Library |
| E2E | Validar flujos reales por rol | Media-alta | Playwright |
| Accesibilidad | Validar uso básico sin barreras obvias | Media | Checklist manual, axe como futuro |
| Privacidad | Validar no exposición de datos individuales | Crítica | API tests + revisión manual |
| Performance smoke | Detectar lentitud evidente en demo | Media | Playwright traces, Vercel Analytics, inspección manual |
| Demo QA | Validar historia y estabilidad ante presentación | Crítica | Checklist manual |

## 6. Comandos esperados

El proyecto usa Bun como package manager. Los comandos deben expresarse con Bun:

```bash
bun install
bun dev
bun test
bun run lint
bunx playwright test
```

Para CI o validación de release se espera ejecutar el build con Bun:

```bash
bun run build
```

> Nota: este documento define expectativas; la ejecución local de build no forma parte de esta tarea de documentación.

Si el repositorio aún no tiene scripts de testing, se debe agregar en una tarea posterior un script `test` en `package.json` antes de exigirlo en CI.

## 7. Criterios de cobertura prioritaria

### 7.1 Cobertura obligatoria para MVP

- 100% de funciones de analytics principales cubiertas por casos deterministas.
- 100% de endpoints privados con pruebas de `401` y `403`.
- 100% de roles validados contra sus rutas principales.
- 100% de respuestas de dashboard revisadas para no incluir datos individuales.
- Al menos 1 E2E exitoso para HR, Manager y Employee.
- Checklist manual de demo completado antes de presentación.

### 7.2 Cobertura recomendable

- Componentes de cards, alerts, recommendations y survey form.
- Estados vacíos, loading y error.
- Validaciones de accesibilidad automatizadas.
- Performance smoke post-deploy.

### 7.3 No perseguir en MVP

- Cobertura numérica arbitraria en archivos de presentación.
- Snapshots grandes de UI.
- Pruebas de carga empresarial.
- Validación estadística avanzada de predicciones.

## 8. Requisitos testables estilo SDD

### Requirement: Analytics determinística

El sistema **MUST** calcular métricas organizacionales de forma determinística y con valores acotados entre 0 y 100.

#### Scenario: OWI de equipo crítico

- GIVEN un equipo con alta carga, alto estrés y baja energía.
- WHEN se calcula el OWI.
- THEN el resultado debe estar en rango crítico según el spec analítico.
- AND el valor debe estar entre 0 y 100.

#### Scenario: Valores extremos

- GIVEN entradas válidas en escala 1 a 5.
- WHEN se calculan todos los indicadores.
- THEN ningún indicador debe ser menor a 0 ni mayor a 100.

### Requirement: Privacidad por agregación

El sistema **MUST NOT** mostrar analítica de equipo cuando existan menos de 5 respuestas válidas.

#### Scenario: Equipo con datos insuficientes

- GIVEN un equipo con 3 respuestas.
- WHEN se solicita su dashboard o se recalculan métricas.
- THEN no se deben generar métricas, alertas ni recomendaciones.
- AND debe mostrarse un mensaje de datos insuficientes.

### Requirement: Control de acceso por rol

El sistema **MUST** bloquear vistas y APIs no autorizadas según rol.

#### Scenario: Manager intenta consultar otro equipo

- GIVEN un manager asignado a Engineering.
- WHEN solicita métricas de Sales.
- THEN la API debe responder `403`.
- AND no debe devolver datos de Sales.

#### Scenario: Employee intenta abrir dashboard

- GIVEN un employee autenticado.
- WHEN intenta acceder a `/dashboard/hr` o `/dashboard/manager`.
- THEN debe ser bloqueado o redirigido a `/survey`.

### Requirement: Demo reproducible

El sistema **SHOULD** proveer datos simulados estables para ejecutar la narrativa del MVP sin preparación manual riesgosa.

#### Scenario: Seed de demo completo

- GIVEN un ambiente limpio.
- WHEN se genera el dataset demo.
- THEN deben existir 4 equipos, 20 employees, 4 semanas de respuestas, métricas, alertas y recomendaciones.
- AND Engineering debe aparecer como equipo con riesgo alto.

## 9. Casos unitarios de analytics

### 9.1 Normalización

| Función | Input | Expected |
| --- | ---: | ---: |
| `normalizePositive(value)` | 1 | 0 |
| `normalizePositive(value)` | 3 | 50 |
| `normalizePositive(value)` | 5 | 100 |
| `normalizeNegative(value)` | 1 | 100 |
| `normalizeNegative(value)` | 3 | 50 |
| `normalizeNegative(value)` | 5 | 0 |

### 9.2 Organizational Wellbeing Index

| Caso | Input resumido | Expected |
| --- | --- | --- |
| Equipo saludable | energy 4.5, belonging 4.3, clarity 4.2, stress 1.8, workload 2.1 | `OWI >= 75` |
| Equipo crítico | energy 2.0, belonging 2.3, clarity 2.4, stress 4.5, workload 4.6 | `OWI <= 40` |
| Máximo teórico | positivos 5, negativos 1 | `OWI = 100` |
| Mínimo teórico | positivos 1, negativos 5 | `OWI = 0` |

### 9.3 Burnout Risk

| Caso | Input resumido | Expected |
| --- | --- | --- |
| Bajo riesgo | stress 2.0, workload 2.2, energy 4.1, clarity 4.0 | score 0, level `LOW` |
| Riesgo crítico | stress 4.2, workload 4.1, energy 2.3, clarity 2.4 | score 100, level `CRITICAL` |
| Riesgo alto parcial | stress 4.2, workload 4.1, energy 3.0, clarity 3.0 | score 60, level `HIGH` |

### 9.4 Attrition Risk

| Caso | Input resumido | Expected |
| --- | --- | --- |
| Bajo riesgo | belonging 4.2, energy 4.0, workload 2.5, stress 2.0, decline false | score 0, level `LOW` |
| Riesgo crítico | belonging 2.2, energy 2.3, workload 4.3, stress 4.1, decline true | score 100, level `CRITICAL` |

### 9.5 Productivity Health

| Caso | Input resumido | Expected |
| --- | --- | --- |
| Saludable | clarity 4.4, energy 4.1, workload 2.0, belonging 4.0 | `ProductivityHealth >= 75` |
| Bajo presión | clarity 2.5, energy 2.3, workload 4.3, belonging 3.0 | `ProductivityHealth <= 50` |

### 9.6 Tendencia y proyección

| Previous | Current | Expected |
| ---: | ---: | --- |
| 70 | 82 | Strong improvement |
| 70 | 75 | Improvement |
| 70 | 69 | Stable |
| 70 | 64 | Decline |
| 70 | 55 | Strong decline |

| Input | Expected |
| --- | --- |
| `[72, 65, 58]` | `projectedNextOWI = 51` |
| `[55, 61, 67]` | `projectedNextOWI = 73` |

### 9.7 Alertas y recomendaciones

| Caso | Input | Expected |
| --- | --- | --- |
| Burnout alto | burnoutRisk 85, attritionRisk 55, wellbeingIndex 35, productivityHealth 41, consecutiveDecline true | genera `BURNOUT`, `ATTRITION`, `WELLBEING`, `TREND`, `PRODUCTIVITY` |
| Mapping de recomendaciones | alertas `BURNOUT` y `ATTRITION` | genera recomendaciones de carga laboral y pertenencia/engagement |

## 10. Pruebas de API

Las APIs deben seguir la convención de respuesta definida en `docs/API Spec.md`:

```ts
type ApiSuccess<T> = { success: true; data: T; message?: string }
type ApiError = { success: false; error: { code: string; message: string } }
```

| ID | Caso | Expected |
| --- | --- | --- |
| API-01 | `GET /api/auth/me` sin sesión | `401 UNAUTHORIZED` |
| API-02 | `POST /api/responses` válido como `EMPLOYEE` | `201`, `success = true`, `submitted = true` |
| API-03 | `POST /api/responses` con valor fuera de 1–5 | `400 INVALID_SURVEY_RESPONSE` |
| API-04 | `POST /api/responses` duplicado | `409 SURVEY_ALREADY_SUBMITTED` |
| API-05 | `POST /api/responses` con `userId` o `teamId` en body | backend ignora esos campos o rechaza la manipulación |
| API-06 | `GET /api/metrics` sin sesión | `401 UNAUTHORIZED` |
| API-07 | `GET /api/metrics` como `EMPLOYEE` | `403 FORBIDDEN` |
| API-08 | `GET /api/metrics?teamId=team_sales` como manager de Engineering | `403 TEAM_ACCESS_DENIED` o `FORBIDDEN` |
| API-09 | `POST /api/metrics/recalculate` como HR/Admin | `200`, `processedTeams >= 1` |
| API-10 | `GET /api/alerts` como manager | solo alertas de su equipo |
| API-11 | `GET /api/recommendations` como HR | recomendaciones agregadas sin datos individuales |
| API-12 | `POST /api/demo/seed` como Admin | `200`, 4 teams, 20 employees, al menos 80 responses |
| API-13 | `POST /api/demo/seed` como HR/Manager/Employee | `403 FORBIDDEN` |

### 10.1 Validación de privacidad en responses de API

Los endpoints de dashboard y analítica **MUST NOT** devolver:

- `email` de employees;
- `userId` asociado a respuestas;
- respuestas individuales;
- historial individual;
- riesgo individual;
- datos clínicos o texto libre sensible.

Endpoints obligatorios a revisar:

- `GET /api/metrics`
- `GET /api/alerts`
- `GET /api/recommendations`
- `POST /api/metrics/recalculate`

## 11. Pruebas funcionales y E2E

| ID | Flujo | Pasos mínimos | Resultado esperado |
| --- | --- | --- | --- |
| FT-01 | Login HR | abrir `/auth/login`, ingresar cuenta HR demo, enviar | redirección a dashboard HR; datos globales visibles; sin respuestas individuales |
| FT-02 | Login Manager | ingresar cuenta manager demo | ve solo su equipo; no ve otros equipos como datos accesibles |
| FT-03 | Login Employee | ingresar cuenta employee demo | redirección a `/survey`; no accede a dashboards |
| FT-04 | Enviar encuesta | responder 5 preguntas escala 1–5 | respuesta guardada; confirmación visible; no aparece dashboard |
| FT-05 | Bloquear duplicado | enviar encuesta ya contestada | mensaje de duplicado; no se crea segunda respuesta |
| FT-06 | Dashboard HR | abrir dashboard HR | OWI global, burnout, attrition, productivity, comparación de equipos, alertas y recomendaciones |
| FT-07 | Dashboard Manager | abrir dashboard como manager Engineering | métricas, tendencia, alertas y recomendaciones solo de Engineering |
| FT-08 | Seed demo | ejecutar generación demo como Admin | dataset completo y narrativa lista |

## 12. Pruebas de UI

### 12.1 Login

Debe mostrar:

- marca PulseWell;
- campos email y password;
- mensaje de ambiente demo;
- acción de login;
- error claro ante credenciales inválidas.

### 12.2 HR Dashboard

Debe mostrar:

- Organizational Wellbeing Overview;
- Global OWI;
- Burnout Risk;
- Attrition Risk;
- Productivity Health;
- comparación por equipo;
- tendencia/proyección;
- alertas;
- recomendaciones;
- mensaje de privacidad.

### 12.3 Manager Dashboard

Debe mostrar:

- resumen de bienestar del equipo;
- Team OWI;
- riesgos del equipo;
- tendencia;
- recomendaciones;
- nota de privacidad;
- ausencia de selector para consultar equipos no autorizados, salvo que esté bloqueado server-side.

### 12.4 Survey

Debe mostrar:

- aviso de privacidad;
- 5 preguntas requeridas;
- escala 1–5 comprensible;
- botón de envío;
- estado de confirmación:

> Thank you. Your individual answers will not be shown to managers or HR.

## 13. Pruebas de accesibilidad básica

Validación mínima para MVP:

- [ ] Inputs tienen label accesible.
- [ ] Botones tienen texto claro.
- [ ] Navegación por teclado completa en login y survey.
- [ ] Estados de focus visibles.
- [ ] Contraste suficiente en texto, cards y alertas.
- [ ] No se comunica estado únicamente con color.
- [ ] Mensajes de error se anuncian cerca del campo afectado.
- [ ] Survey usable en móvil.
- [ ] Gráficas tienen texto/resumen alternativo suficiente para la demo.

## 14. Pruebas de seguridad y privacidad

| ID | Caso | Resultado esperado |
| --- | --- | --- |
| PT-01 | HR inspecciona dashboard y response de `/api/metrics` | no hay `userId`, email de employee, respuesta individual ni historial individual |
| PT-02 | Manager consulta otro equipo por query param | `403`; no hay datos del otro equipo |
| PT-03 | Employee intenta abrir dashboards | bloqueo, redirección o `403` |
| PT-04 | Equipo con 3 respuestas | no genera métricas ni alertas; muestra datos insuficientes |
| PT-05 | Usuario manipula `role` desde cliente | backend ignora rol enviado y usa rol server-side |
| PT-06 | Usuario manipula `teamId` en `POST /api/responses` | backend usa `currentUser.teamId` |
| PT-07 | Revisión de variables públicas | solo se exponen claves `NEXT_PUBLIC_*` permitidas |
| PT-08 | Lenguaje de UI | no usa diagnóstico clínico ni mensajes punitivos |

## 15. Validación de datos simulados

El dataset demo debe cumplir:

- [ ] 4 equipos: Engineering, Sales, Operations, Customer Success.
- [ ] 20 employees.
- [ ] 5 employees por equipo.
- [ ] 4 semanas de respuestas.
- [ ] 1 encuesta activa.
- [ ] Al menos 80 respuestas históricas.
- [ ] Engineering en riesgo alto de burnout.
- [ ] Sales con señal de riesgo de rotación.
- [ ] Operations estable.
- [ ] Customer Success mejorando.
- [ ] Al menos 3 alertas.
- [ ] Al menos 3 recomendaciones.
- [ ] Ningún employee real ni dato personal real.
- [ ] Las métricas generadas coinciden con las reglas de analytics.

## 16. Performance smoke tests

No se exige prueba de carga para MVP, pero sí smoke tests de demo:

- Landing page carga en tiempo aceptable para presentación.
- Login responde sin espera perceptiblemente larga.
- Dashboards principales renderizan datos demo sin errores.
- Gráficas no bloquean la interacción.
- APIs críticas responden sin timeout en Vercel.
- No hay errores de consola durante el flujo de demo.

Criterio orientativo para demo: las vistas críticas deberían estar interactivas en menos de 3 segundos en una conexión estable.

## 17. Deployment y CI/CD

### 17.1 Variables de entorno

Validar en Vercel:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Solo las variables con prefijo `NEXT_PUBLIC_` pueden ser visibles en el cliente.

### 17.2 Expectativa de CI para pull requests

Cuando existan scripts de testing, cada pull request debería ejecutar:

```bash
bun install --frozen-lockfile
bun test
bun run lint
bun run build
```

Si se agregan E2E:

```bash
bunx playwright test
```

### 17.3 Deploy en Vercel

Validar:

- pull request crea preview deployment;
- merge/push a rama principal crea production deployment;
- app carga correctamente;
- login funciona;
- dashboards funcionan;
- APIs responden;
- variables están configuradas en el environment correcto.

## 18. Checklist de demo para inversionistas

Antes de presentar:

- [ ] Landing page carga correctamente.
- [ ] Login demo funciona.
- [ ] HR dashboard muestra datos globales.
- [ ] Engineering aparece en riesgo alto.
- [ ] Existe una predicción visible.
- [ ] Existe una recomendación clara y accionable.
- [ ] Manager dashboard funciona y está limitado a su equipo.
- [ ] Employee survey funciona.
- [ ] Privacidad está comunicada explícitamente.
- [ ] No hay errores en consola.
- [ ] No hay datos individuales visibles.
- [ ] Vercel deployment está estable.
- [ ] Internet, navegador y ambiente de demo fueron probados.
- [ ] Existe plan alternativo: capturas o video corto por si falla la conexión.

## 19. Escenario de demo validado

La demo debe contar esta historia:

1. **Problema**: las empresas detectan burnout, desconexión o sobrecarga demasiado tarde.
2. **Señal**: PulseWell mide señales semanales anónimas en escala simple.
3. **Agregación**: los datos se procesan a nivel equipo con mínimo de 5 respuestas.
4. **Insight**: Engineering muestra estrés y carga elevados.
5. **Predicción**: si la tendencia continúa, el equipo puede entrar en estado crítico.
6. **Acción**: PulseWell recomienda reducir reuniones, redistribuir carga y hacer check-in.
7. **Valor**: la organización puede actuar antes de perder talento, energía o productividad.

## 20. Criterios de aceptación global

El MVP se considera listo para demo cuando:

- [ ] Todos los flujos críticos funcionan.
- [ ] Los cálculos principales son correctos y explicables.
- [ ] Las APIs críticas validan sesión, rol e input.
- [ ] Manager solo accede a su equipo.
- [ ] Employee solo responde encuestas.
- [ ] La privacidad está protegida en UI y API.
- [ ] No existe exposición individual en dashboards.
- [ ] Equipos con menos de 5 respuestas no generan analítica.
- [ ] Los dashboards son comprensibles para una audiencia no técnica.
- [ ] El dataset demo soporta la narrativa del producto.
- [ ] La demo puede ejecutarse sin intervención técnica durante la presentación.
- [ ] El deploy en Vercel funciona con variables correctas.
- [ ] La documentación de pruebas está alineada con README, API, Analytics y Security specs.

## 21. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Demo falla por datos incompletos | Alto | Seed reproducible y checklist de datos demo |
| Error de permisos | Alto | Pruebas por rol en API y E2E |
| Métricas inconsistentes | Medio | Unit tests de analytics con casos deterministas |
| Exposición accidental de datos individuales | Alto | Pruebas de privacidad obligatorias y revisión de responses API |
| Vercel falla por variables mal configuradas | Alto | Checklist de env vars por ambiente |
| UI confusa para inversionistas | Medio | Validar demo narrative end-to-end |
| Sobrepromesa clínica | Alto | Revisar lenguaje: indicadores de riesgo, no diagnóstico |
| Falta de scripts de test | Medio | Crear tarea técnica para agregar scripts y dependencias de testing |

## 22. Prioridad de pruebas

### Alta

1. Auth y sesiones.
2. Roles y permisos.
3. Privacidad y no exposición individual.
4. Cálculos de analytics.
5. API de responses, metrics, alerts y recommendations.
6. HR dashboard.
7. Datos demo.

### Media

1. Manager dashboard.
2. Prevención de respuesta duplicada.
3. Alertas y recomendaciones.
4. Accesibilidad básica.
5. Performance smoke.

### Baja para MVP

1. Admin dashboard completo.
2. Landing page avanzada.
3. Pruebas visuales exhaustivas.
4. Automatización E2E de todos los edge cases.

## 23. Definition of Done para testing

Testing se considera completo para MVP cuando:

- [ ] Unit tests de analytics pasan.
- [ ] API tests críticos pasan.
- [ ] Manual QA de roles pasa.
- [ ] Manual QA de privacidad pasa.
- [ ] Manual QA de survey pasa.
- [ ] Manual QA de dashboards pasa.
- [ ] Validación de datos demo pasa.
- [ ] Accesibilidad básica revisada.
- [ ] Performance smoke post-deploy revisado.
- [ ] CI esperado documentado o implementado.
- [ ] Demo checklist pasa.

## 24. Resumen

La estrategia de testing de PulseWell se centra en cinco garantías:

1. El producto funciona en sus flujos críticos.
2. Los cálculos son explicables, deterministas y testeables.
3. Los roles están correctamente restringidos.
4. La privacidad por diseño se cumple en UI y API.
5. La demo comunica una historia clara y reproducible.

El MVP no necesita una suite empresarial compleja, pero sí debe demostrar solidez funcional, confianza, claridad analítica y preparación real para presentación.
