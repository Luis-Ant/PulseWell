# Roadmap & Delivery Plan Spec

**Producto:** PulseWell  
**Documento:** Plan de entrega del MVP y evolución del producto  
**Audiencia:** producto, ingeniería, diseño, negocio e inversionistas  
**Estado:** documento guía para implementación

---

## 1. Propósito

Este documento convierte la visión de PulseWell en una ruta ejecutable de desarrollo, validación y evolución comercial.

PulseWell es una plataforma SaaS de **Organizational Wellbeing Intelligence** que transforma datos agregados de bienestar en insights accionables para anticipar burnout, desmotivación, sobrecarga laboral y riesgo de rotación.

El MVP debe demostrar la tesis del producto con un prototipo funcional basado en datos simulados, reglas explicables y una narrativa clara de demo. No busca ser un SaaS empresarial completo ni una herramienta clínica.

---

## 2. Objetivo del roadmap

Entregar un MVP que pruebe que PulseWell puede:

- Medir señales de bienestar organizacional mediante encuestas pulse.
- Agregar resultados por equipo sin exponer información individual sensible.
- Calcular un **Organizational Wellbeing Index (OWI)**.
- Detectar riesgos tempranos de burnout, rotación y deterioro de productividad.
- Mostrar tendencias y predicciones simuladas de forma comprensible.
- Generar alertas y recomendaciones accionables para HR y managers.
- Validar interés de usuarios, empresas piloto e inversionistas.

---

## 3. Principios de planificación

1. **Primero demo, después escala:** el MVP debe contar una historia convincente antes de optimizar para volumen.
2. **Primero datos simulados, después datos reales:** los escenarios demo deben ser intencionales y verificables.
3. **Primero reglas explicables, después Machine Learning avanzado:** la confianza depende de entender por qué aparece un riesgo.
4. **Primero privacidad, después integraciones:** ningún valor de producto justifica exponer datos individuales innecesarios.
5. **Primero flujo completo, después features secundarias:** encuesta → analytics → dashboards → alertas → recomendaciones.
6. **Primero utilidad para HR, después personalización:** el dashboard HR es la principal superficie de validación.
7. **Primero MVP funcional, después SaaS empresarial:** billing, SSO, auditoría avanzada y multi-tenant robusto quedan fuera del MVP.

---

## 4. Supuestos de producto

- El MVP usa datos simulados y/o cuentas demo para validar la experiencia.
- El público inicial son áreas de Recursos Humanos, líderes de equipo e inversionistas.
- Las métricas se muestran a nivel agregado por equipo o área.
- Debe existir un mínimo de respuestas por equipo antes de mostrar métricas agregadas.
- Las recomendaciones son preventivas y organizacionales; no son diagnósticos médicos ni psicológicos.
- La capa predictiva del MVP es simulada o basada en reglas, no en modelos entrenados en producción.
- El mercado inicial priorizado es México, con futura alineación a NOM-035 como oportunidad post-MVP.

---

## 5. Alcance del MVP

### 5.1 Incluido

- Aplicación web con Next.js App Router, React, TypeScript, Tailwind CSS y shadcn/ui.
- Backend con API Routes, Prisma 7, `prisma.config.ts`, PostgreSQL y Supabase.
- Login básico con Supabase Auth o flujo demo equivalente.
- Roles mínimos: Admin, HR Analyst, Manager y Employee.
- Seed de datos simulados con escenarios narrativos.
- Encuesta pulse con respuestas numéricas de 1 a 5.
- Motor analítico basado en reglas explicables.
- Cálculo de OWI, Burnout Risk, Attrition Risk y Productivity Health.
- Dashboard HR como vista principal del MVP.
- Dashboard Manager limitado al equipo asignado.
- Alertas por umbrales y tendencias.
- Recomendaciones accionables por tipo de alerta.
- Privacy Guard para evitar exposición individual.
- Landing page simple y narrativa comercial.
- Deploy en Vercel conectado a GitHub.

### 5.2 No incluido en MVP

- Integración real con Slack o Microsoft Teams.
- NLP sobre mensajes, conversaciones o contenido privado.
- Modelos de Machine Learning reales en producción.
- Diagnóstico clínico, psicológico o médico.
- Pagos, planes comerciales y facturación.
- App móvil nativa.
- Exportación PDF formal.
- Módulo NOM-035 completo.
- SSO empresarial.
- Auditoría avanzada.
- Multi-tenant empresarial robusto.

---

## 6. Estrategia de entrega

La entrega debe seguir una secuencia incremental:

```text
Base técnica
→ Modelo de datos y seed demo
→ Autenticación y roles
→ Encuesta pulse
→ Motor analítico
→ Alertas y recomendaciones
→ Dashboards
→ Landing y demo polish
→ QA y preparación de demo
```

Esta secuencia reduce riesgo porque cada fase habilita la siguiente y produce valor visible temprano.

---

## 7. Fases del MVP

### Fase 0 — Preparación técnica

**Resultado esperado:** aplicación base desplegable y lista para desarrollo.

**Entregables:**

- [ ] Proyecto Next.js 15 con TypeScript strict.
- [ ] Tailwind CSS 4 y shadcn/ui configurados.
- [ ] Supabase project creado.
- [ ] Prisma 7 configurado con `prisma.config.ts`.
- [ ] Variables de entorno documentadas.
- [ ] Repositorio GitHub conectado a Vercel.
- [ ] README consistente con la propuesta de valor.

**Dependencias:** ninguna.

**Criterios de salida:**

- [ ] La app puede ejecutarse localmente con Bun.
- [ ] El deploy inicial en Vercel existe o queda preparado.
- [ ] La estructura base permite agregar API Routes, Prisma y componentes UI.

---

### Fase 1 — Modelo de datos y seed demo

**Resultado esperado:** datos suficientes para alimentar dashboards y contar una historia de demo.

**Entregables:**

- [ ] Prisma schema para organizaciones, equipos, usuarios, encuestas, respuestas, métricas, alertas y recomendaciones.
- [ ] Migraciones iniciales funcionando contra PostgreSQL/Supabase.
- [ ] Seed script restaurable.
- [ ] 4 equipos demo: Engineering, Sales, Operations y Customer Success.
- [ ] 20 empleados demo como mínimo.
- [ ] 4 semanas de respuestas simuladas.
- [ ] 1 encuesta pulse activa.
- [ ] Escenarios de riesgo diseñados intencionalmente.

**Escenarios demo esperados:**

| Equipo | Narrativa |
| --- | --- |
| Engineering | Riesgo alto de burnout por estrés, baja energía y alta carga. |
| Sales | Riesgo de rotación por baja pertenencia y claridad. |
| Operations | Estado estable con métricas saludables. |
| Customer Success | Tendencia de mejora después de intervención simulada. |

**Dependencias:** Fase 0.

**Criterios de salida:**

- [ ] Los datos demo son repetibles.
- [ ] Cada equipo cuenta una historia distinta.
- [ ] Hay volumen suficiente para aplicar Privacy Guard.

---

### Fase 2 — Autenticación, roles y acceso

**Resultado esperado:** cada usuario entra a su experiencia correspondiente y no accede a vistas no autorizadas.

**Entregables:**

- [ ] Supabase Auth configurado o flujo demo controlado documentado.
- [ ] Login con email/password o selector demo explícito.
- [ ] Cuentas demo para Admin, HR Analyst, Manager y Employee.
- [ ] Middleware de rutas protegidas.
- [ ] Redirección por rol.
- [ ] Helpers `getCurrentUser()`, `requireRole()` y `requireTeamAccess()`.

**Cuentas demo recomendadas:**

- `admin@pulsewell.demo`
- `hr@pulsewell.demo`
- `manager.engineering@pulsewell.demo`
- `employee01@pulsewell.demo`

**Dependencias:** Fase 1.

**Criterios de salida:**

- [ ] HR puede ver información agregada organizacional.
- [ ] Manager solo puede ver su equipo asignado.
- [ ] Employee solo puede responder encuestas disponibles.
- [ ] Las rutas protegidas rechazan accesos inválidos.

---

### Fase 3 — Encuesta pulse

**Resultado esperado:** un colaborador puede responder la encuesta y el sistema guarda la respuesta correctamente.

**Entregables:**

- [ ] Pantalla `/survey`.
- [ ] API `GET /api/surveys`.
- [ ] API `POST /api/responses`.
- [ ] Validación de escala 1–5.
- [ ] Prevención de respuesta duplicada por periodo.
- [ ] Confirmación posterior al envío.
- [ ] Mensaje visible de privacidad y uso agregado de datos.

**Dependencias:** Fase 2.

**Criterios de salida:**

- [ ] La encuesta activa se carga para el empleado correcto.
- [ ] Las respuestas inválidas son rechazadas.
- [ ] No se muestran resultados individuales al usuario final.
- [ ] La respuesta queda disponible para el motor analítico.

---

### Fase 4 — Motor analítico

**Resultado esperado:** las respuestas se convierten en métricas interpretables por equipo.

**Entregables:**

- [ ] Normalización de variables.
- [ ] Cálculo de OWI en escala 0–100.
- [ ] Cálculo de Burnout Risk.
- [ ] Cálculo de Attrition Risk.
- [ ] Cálculo de Productivity Health.
- [ ] Detección de tendencias semanales.
- [ ] Proyección simulada del siguiente OWI.
- [ ] Privacy Guard con mínimo recomendado de 5 respuestas por equipo.
- [ ] Tests unitarios de fórmulas, umbrales y Privacy Guard.

**Dependencias:** Fase 3.

**Criterios de salida:**

- [ ] Las fórmulas son explicables en lenguaje de negocio.
- [ ] Los resultados coinciden con los escenarios demo diseñados.
- [ ] Los equipos con respuestas insuficientes no exponen métricas.
- [ ] Las pruebas cubren casos de bajo, medio y alto riesgo.

---

### Fase 5 — Alertas y recomendaciones

**Resultado esperado:** PulseWell transforma métricas en señales accionables.

**Entregables:**

- [ ] Reglas de alertas por umbral y tendencia.
- [ ] Severidad `LOW`, `MEDIUM` y `HIGH`.
- [ ] Recomendaciones por tipo de alerta.
- [ ] API `GET /api/alerts`.
- [ ] API `GET /api/recommendations`.
- [ ] Acción controlada para regenerar alertas cuando cambien las métricas.

**Dependencias:** Fase 4.

**Criterios de salida:**

- [ ] Las alertas explican causa, severidad y equipo afectado.
- [ ] Cada alerta crítica tiene al menos una recomendación.
- [ ] Las recomendaciones son preventivas, no clínicas.
- [ ] HR y Manager ven solo las alertas permitidas por su rol.

---

### Fase 6 — Dashboard HR

**Resultado esperado:** un inversionista o usuario HR entiende el valor de PulseWell en menos de 60 segundos.

**Entregables:**

- [ ] Pantalla `/dashboard/hr`.
- [ ] Cards de métricas globales.
- [ ] Comparación por equipo.
- [ ] Gráfica de tendencia.
- [ ] Alertas activas.
- [ ] Recomendaciones prioritarias.
- [ ] Predicción simulada visible y etiquetada como tal.
- [ ] Mensaje de privacidad en contexto.

**Dependencias:** Fase 5.

**Criterios de salida:**

- [ ] La pantalla muestra estado actual, riesgos y acciones sugeridas.
- [ ] La narrativa demo se entiende sin explicación técnica extensa.
- [ ] Los datos individuales no son visibles.
- [ ] Las métricas principales son consistentes con el README.

---

### Fase 7 — Dashboard Manager

**Resultado esperado:** el manager entiende qué ocurre en su equipo y qué acción preventiva tomar.

**Entregables:**

- [ ] Pantalla `/dashboard/manager`.
- [ ] Métricas del equipo asignado.
- [ ] Alertas del equipo.
- [ ] Recomendaciones del equipo.
- [ ] Tendencia semanal.
- [ ] Restricción estricta de acceso por equipo.

**Dependencias:** Fase 5.

**Criterios de salida:**

- [ ] El manager no puede ver otros equipos.
- [ ] Las recomendaciones son concretas y no punitivas.
- [ ] El dashboard refuerza la privacidad y el uso agregado.

---

### Fase 8 — Landing page y demo polish

**Resultado esperado:** la experiencia se percibe profesional, coherente y lista para presentación.

**Entregables:**

- [ ] Landing page minimalista.
- [ ] Copy comercial alineado con Organizational Wellbeing Intelligence.
- [ ] Estados vacíos, de carga y de error.
- [ ] Responsive básico.
- [ ] Revisión visual de componentes.
- [ ] Flujo de demo documentado.
- [ ] Datos demo restaurables para presentación.

**Dependencias:** Fases 6 y 7.

**Criterios de salida:**

- [ ] La propuesta de valor es clara antes del login.
- [ ] La demo tiene inicio, conflicto, insight y acción recomendada.
- [ ] No hay contenido contradictorio con privacidad por diseño.

---

### Fase 9 — QA y preparación final

**Resultado esperado:** el MVP está listo para una demo controlada ante inversionistas, evaluadores o empresas piloto.

**Entregables:**

- [ ] Checklist de testing manual ejecutado.
- [ ] Deploy final en Vercel validado.
- [ ] Cuentas demo probadas.
- [ ] Seed demo restaurable.
- [ ] Flujo HR probado.
- [ ] Flujo Manager probado.
- [ ] Flujo Employee probado.
- [ ] Privacidad validada.
- [ ] Guion de demo ensayado.
- [ ] Respuestas preparadas para objeciones de privacidad, precisión y alcance.

**Dependencias:** Fase 8.

**Criterios de salida:**

- [ ] La demo se puede completar sin intervención técnica.
- [ ] Los riesgos conocidos están documentados.
- [ ] El producto comunica claramente que es MVP/prototipo predictivo simulado.

---

## 8. Sprints recomendados

| Sprint | Foco | Entregables principales | Resultado |
| --- | --- | --- | --- |
| Sprint 1 | Base funcional | Setup, Supabase, Prisma, seed demo, deploy inicial | Producto técnicamente inicializado. |
| Sprint 2 | Captura y analytics | Auth, roles, encuesta, respuestas, motor analítico | Núcleo funcional disponible. |
| Sprint 3 | Insights | APIs, alertas, recomendaciones, dashboards HR y Manager | Producto demostrable. |
| Sprint 4 | Demo readiness | Landing, polish, QA, guion, datos restaurables | MVP listo para presentación. |

---

## 9. Priorización MoSCoW

### Must Have

- Login o flujo demo controlado.
- Roles mínimos.
- Datos simulados restaurables.
- Encuesta pulse.
- OWI.
- Burnout Risk.
- Attrition Risk.
- Productivity Health.
- Privacy Guard.
- Alertas.
- Recomendaciones.
- Dashboard HR.
- Dashboard Manager limitado.
- Deploy en Vercel.

### Should Have

- Landing page.
- Admin dashboard simple o panel mínimo de control.
- Regeneración manual de métricas.
- Seed/reset demo.
- Gráficas de tendencia.
- Estados vacíos, loading y error.

### Could Have

- Radar chart.
- Filtros por semana.
- Export visual simple de métricas.
- Selector de rol demo.
- Dark/light toggle.
- Microinteracciones de UI.

### Won’t Have en MVP

- Slack real.
- Microsoft Teams real.
- NLP.
- Machine Learning real.
- Billing.
- PDF reports formales.
- App móvil.
- SSO.
- Multi-tenant avanzado.
- NOM-035 completo.

---

## 10. Dependencias

### 10.1 Dependencias técnicas

| Dependencia | Uso | Riesgo asociado |
| --- | --- | --- |
| GitHub | Repositorio y conexión con Vercel | Bajo |
| Vercel | Hosting y deploy | Medio si aparecen errores de configuración |
| Supabase | Auth y PostgreSQL | Medio por configuración de credenciales y permisos |
| Prisma 7 | ORM y modelo de datos | Medio por cambios de configuración con `prisma.config.ts` |
| shadcn/ui | Componentes base | Bajo |
| Recharts | Visualización de datos | Bajo |
| Vitest u otro runner compatible | Pruebas unitarias del motor analítico | Bajo |

### 10.2 Dependencias de producto

| Dependencia | Uso | Riesgo asociado |
| --- | --- | --- |
| Datos simulados | Narrativa de demo | Alto si no son creíbles |
| Algoritmo definido | Métricas y alertas | Alto si no es explicable |
| UX/UI Spec | Pantallas y navegación | Medio |
| Guion de demo | Presentación comercial | Alto si no conecta problema con valor |
| Mensajes de privacidad | Confianza del colaborador | Alto |

---

## 11. Acceptance criteria del MVP

El MVP se considera aceptado cuando se cumplen todos estos criterios:

- [ ] Un usuario HR puede iniciar sesión y ver métricas agregadas de todos los equipos.
- [ ] Un Manager puede ver únicamente su equipo asignado.
- [ ] Un Employee puede responder una encuesta pulse válida.
- [ ] El sistema calcula OWI y riesgos a partir de respuestas simuladas o persistidas.
- [ ] Las alertas reflejan los escenarios demo esperados.
- [ ] Cada alerta relevante ofrece al menos una recomendación accionable.
- [ ] Privacy Guard impide mostrar métricas cuando el volumen de respuestas es insuficiente.
- [ ] La capa predictiva está claramente comunicada como simulada o basada en reglas.
- [ ] La landing y el dashboard HR comunican la propuesta de valor sin contradicciones.
- [ ] La demo puede ejecutarse de punta a punta con cuentas demo.

---

## 12. Métricas de éxito del MVP

- [ ] Inversionistas o evaluadores entienden el valor en menos de 5 minutos.
- [ ] El dashboard HR genera conversación positiva sobre riesgos y acciones.
- [ ] La predicción simulada se percibe útil, no engañosa.
- [ ] La privacidad se percibe creíble.
- [ ] El algoritmo se puede explicar sin depender de jerga técnica.
- [ ] Se identifican posibles clientes piloto.
- [ ] Al menos una persona de HR valida que el problema es relevante.

---

## 13. Plan mínimo si el tiempo es limitado

Si el plazo obliga a recortar alcance, entregar:

- [ ] Landing simple.
- [ ] Login demo o selector de rol claramente identificado.
- [ ] HR dashboard con datos simulados.
- [ ] Analytics precalculada o calculada por reglas simples.
- [ ] Alertas y recomendaciones visibles.
- [ ] Survey visual o persistente básica.
- [ ] Privacy Guard comunicado, aunque sea aplicado sobre datos demo.

Recortes aceptables:

- No Admin dashboard.
- No Manager dashboard completo.
- No autenticación compleja.
- No APIs extensas.
- No recálculo automático.

El objetivo de esta versión reducida es demostrar concepto, no robustez operativa.

---

## 14. Roadmap post-MVP

### Versión 0.2 — Piloto controlado

**Objetivo:** validar PulseWell con una empresa pequeña o una simulación avanzada cercana a producción.

**Features:**

- [ ] Multi-empresa básico.
- [ ] Encuestas configurables.
- [ ] Panel Admin mejorado.
- [ ] Consentimiento explícito.
- [ ] Historial por periodos.
- [ ] Export CSV.
- [ ] Registro básico de intervenciones.

**Criterio de salida:** una organización puede operar un piloto de 4 a 8 semanas con datos reales agregados.

### Versión 0.3 — Cumplimiento y confianza

**Objetivo:** fortalecer confianza, privacidad y alineación al mercado mexicano.

**Features:**

- [ ] Módulo demostrativo avanzado de NOM-035.
- [ ] Reporte de factores de riesgo psicosocial.
- [ ] Políticas de privacidad y consentimiento mejor documentadas.
- [ ] Auditoría básica de accesos.
- [ ] Registro de acciones tomadas por managers.
- [ ] Métricas antes/después de intervención.

**Criterio de salida:** PulseWell puede sostener conversaciones serias con HR, legal y compliance.

### Versión 0.4 — Integraciones iniciales

**Objetivo:** conectar PulseWell al flujo real de trabajo sin comprometer privacidad.

**Features:**

- [ ] Import CSV de usuarios y equipos.
- [ ] Metadata integration con Slack.
- [ ] Metadata integration con Microsoft Teams.
- [ ] Indicadores agregados de carga por calendario.
- [ ] Webhooks internos.
- [ ] Configuración granular de permisos por integración.

**Criterio de salida:** las integraciones aportan señales agregadas sin analizar contenido privado.

### Versión 0.5 — Madurez analítica e IA

**Objetivo:** evolucionar de reglas explicables a modelos más sofisticados con validación responsable.

**Features:**

- [ ] Experimentos offline de detección de anomalías.
- [ ] Modelos predictivos entrenables con datasets autorizados.
- [ ] Evaluación de precisión, falsos positivos y sesgos.
- [ ] Recomendaciones adaptativas.
- [ ] NLP solo para respuestas abiertas explícitamente consentidas.
- [ ] Benchmark por industria cuando exista volumen suficiente.

**Criterio de salida:** cualquier modelo avanzado tiene métricas de desempeño, monitoreo y explicación suficiente.

### Versión 1.0 — SaaS comercial

**Objetivo:** lanzar una versión lista para clientes de pago.

**Features:**

- [ ] Multi-tenant robusto.
- [ ] Billing y planes comerciales.
- [ ] SSO.
- [ ] Roles y permisos avanzados.
- [ ] Auditoría completa.
- [ ] Onboarding guiado.
- [ ] SLA básico.
- [ ] Documentación legal y de seguridad.
- [ ] Hardening de infraestructura.

**Criterio de salida:** PulseWell puede venderse y operarse con clientes reales bajo acuerdos comerciales.

---

## 15. Estrategia de integraciones

Las integraciones deben seguir un enfoque de menor a mayor riesgo:

1. **Import CSV:** baja complejidad, útil para pilotos.
2. **Webhooks internos:** permite automatizaciones controladas.
3. **Slack/Teams metadata:** señales agregadas, sin leer mensajes privados.
4. **Calendar workload indicators:** indicadores de carga, no contenido de reuniones.
5. **Integraciones profundas:** solo después de validar consentimiento, cumplimiento y seguridad.

Regla de producto: PulseWell no debe analizar conversaciones privadas en el MVP ni en las primeras versiones post-MVP.

---

## 16. Estrategia de cumplimiento y privacidad

### MVP

- Privacidad por diseño.
- Agregación por equipo.
- Mínimo de respuestas antes de mostrar métricas.
- Mensajes claros de no diagnóstico clínico.
- Sin análisis de mensajes ni contenido privado.

### Post-MVP

- Consentimiento explícito por colaborador.
- Políticas de privacidad revisadas legalmente.
- Auditoría básica de accesos.
- Registro de intervenciones.
- Alineación progresiva con NOM-035 para México.

### SaaS comercial

- Evaluación legal formal por mercado.
- Controles avanzados de acceso.
- Retención y eliminación de datos.
- Procesos de seguridad, auditoría y respuesta a incidentes.

---

## 17. Madurez de Machine Learning

| Nivel | Estado | Uso permitido |
| --- | --- | --- |
| Nivel 0 | Datos simulados | Demo y storytelling. |
| Nivel 1 | Reglas explicables | MVP con OWI, riesgos y alertas. |
| Nivel 2 | Predicción simulada | Tendencias y escenarios futuros etiquetados como simulados. |
| Nivel 3 | Experimentos offline | Validación con datasets autorizados, sin decisiones automáticas. |
| Nivel 4 | Modelos asistivos | Recomendaciones con monitoreo y revisión humana. |
| Nivel 5 | Modelos productivos maduros | Solo con compliance, evaluación de sesgo, explicabilidad y auditoría. |

El MVP no debe prometer precisión predictiva real. Debe vender claridad, prevención y dirección estratégica.

---

## 18. Estrategia de piloto real

Después del MVP, validar con:

- 1 a 3 empresas mexicanas.
- 50 a 200 colaboradores.
- Piloto de 4 a 8 semanas.
- Encuestas semanales.
- Métricas agregadas por equipo.
- Feedback cualitativo de HR, managers y colaboradores.

### Métricas del piloto

- Tasa de respuesta semanal.
- Utilidad percibida por HR.
- Claridad del dashboard.
- Confianza de colaboradores.
- Número de alertas consideradas útiles.
- Acciones tomadas por managers.
- Cambios de OWI por equipo.
- Interés en pagar.

### Preguntas de validación

**Para HR:**

- ¿El dashboard ayudó a entender mejor el estado de los equipos?
- ¿Las alertas fueron útiles?
- ¿Las recomendaciones fueron accionables?
- ¿Qué información faltó?
- ¿Pagarías por esta herramienta?

**Para managers:**

- ¿Las recomendaciones fueron claras?
- ¿Ayudaron a decidir una acción concreta?
- ¿El sistema se sintió invasivo o útil?

**Para colaboradores:**

- ¿Te sentiste cómodo respondiendo?
- ¿El mensaje de privacidad fue claro?
- ¿Confiarías en responder semanalmente?

---

## 19. Validación GTM

Antes de ampliar el producto, validar:

| Dimensión | Pregunta clave | Señal positiva |
| --- | --- | --- |
| Deseabilidad | ¿HR realmente quiere esta solución? | Solicitan piloto o demo extendida. |
| Viabilidad comercial | ¿Una empresa pagaría por esto? | Discuten presupuesto, precio o proceso de compra. |
| Factibilidad | ¿Puede construirse con calidad suficiente? | El MVP funciona de punta a punta y es mantenible. |
| Confianza | ¿Los colaboradores aceptarían usarlo? | No hay rechazo fuerte por privacidad. |
| Diferenciación | ¿PulseWell aporta algo más que una encuesta tradicional? | Usuarios valoran predicción, alertas y recomendaciones. |

---

## 20. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Scope creep | Alto | Mantener MoSCoW como regla de decisión. |
| Datos demo poco convincentes | Alto | Diseñar escenarios narrativos desde el seed. |
| Dashboard HR confuso | Alto | Priorizar pocas métricas claras y accionables. |
| Algoritmo difícil de explicar | Medio | Usar reglas y fórmulas simples en MVP. |
| Percepción invasiva | Alto | Reforzar agregación, consentimiento y no análisis de contenido privado. |
| Predicción percibida como engañosa | Alto | Etiquetar simulación y explicar límites. |
| Auth consume demasiado tiempo | Medio | Usar flujo demo controlado si el plazo lo exige. |
| Problemas de deploy | Medio | Validar configuración desde las primeras fases. |
| Falta de tiempo | Alto | Recortar hacia HR Dashboard + Analytics + Privacidad + Demo Story. |
| Riesgo legal/compliance | Alto post-MVP | No vender como solución regulatoria completa hasta revisión formal. |

---

## 21. Entregables finales del MVP

- [ ] Aplicación desplegada.
- [ ] Repositorio organizado.
- [ ] README actualizado.
- [ ] Prisma schema y configuración de Prisma 7.
- [ ] Seed script restaurable.
- [ ] Cuentas demo.
- [ ] Survey screen.
- [ ] HR Dashboard.
- [ ] Manager Dashboard.
- [ ] Analytics engine.
- [ ] Alerts engine.
- [ ] Recommendations engine.
- [ ] Testing checklist.
- [ ] Demo script.
- [ ] Mensajes de privacidad y disclaimer visibles.

---

## 22. Checklist pre-inversionistas

- [ ] Revisar narrativa de problema → insight → acción.
- [ ] Validar deploy final.
- [ ] Probar login o selector demo.
- [ ] Probar HR Dashboard.
- [ ] Probar Manager Dashboard.
- [ ] Probar Survey.
- [ ] Confirmar datos demo.
- [ ] Confirmar Privacy Guard y mensajes de privacidad.
- [ ] Ensayar guion completo.
- [ ] Preparar respuestas a objeciones sobre precisión, privacidad, compliance y escalabilidad.

---

## 23. Plan de ejecución sugerido

### Plan agresivo de 7 días

| Día | Foco | Resultado |
| --- | --- | --- |
| 1 | Setup | Next.js, Supabase, Prisma, Vercel. |
| 2 | Data | Schema, migraciones, seed y escenarios demo. |
| 3 | Auth | Login, roles y protección de rutas. |
| 4 | Survey | UI de encuesta y API de respuestas. |
| 5 | Analytics | OWI, riesgos, predicción simulada y tests. |
| 6 | Dashboard HR | KPI cards, charts, alertas y recomendaciones. |
| 7 | Manager + polish | Dashboard Manager, landing, QA y ensayo de demo. |

Este plan solo es viable si el alcance se mantiene estrictamente limitado.

### Plan conservador de 3 semanas

| Semana | Foco | Resultado |
| --- | --- | --- |
| 1 | Setup, DB, Auth, Survey, Seed | Base funcional completa. |
| 2 | Analytics, APIs, Dashboards, Alertas | Producto demostrable. |
| 3 | Polish, QA, Demo, Documentación | Presentación sólida y menos frágil. |

Este plan es más recomendable para reducir errores y mejorar percepción profesional.

---

## 24. Decisiones pendientes

- [ ] Confirmar idioma final de la UI: español, inglés o bilingüe.
- [ ] Definir si el MVP usa Supabase Auth real o selector demo.
- [ ] Confirmar si Admin Dashboard entra al MVP o se reemplaza por seed scripts.
- [ ] Definir umbral exacto de Privacy Guard por equipo.
- [ ] Confirmar si las métricas se recalculan bajo demanda o al registrar respuestas.
- [ ] Definir pricing hypothesis para entrevistas GTM.
- [ ] Validar si NOM-035 se comunica como roadmap, no como capacidad del MVP.
- [ ] Confirmar estilo visual definitivo para demo.

---

## 25. Inputs para PRD

Estos puntos deben alimentar el Product Requirements Document:

- Persona primaria del MVP: HR Analyst.
- Persona secundaria: Manager.
- Usuario participante: Employee.
- Problema principal: detectar riesgos organizacionales temprano sin invadir privacidad individual.
- Propuesta de valor: analytics agregada, alertas y recomendaciones preventivas.
- Feature crítica: HR Dashboard con OWI, riesgos, tendencias y recomendaciones.
- Restricción crítica: no mostrar datos individuales sensibles.
- Métrica de éxito de demo: valor entendido en menos de 5 minutos.
- Métrica de éxito de piloto: tasa de respuesta semanal superior a 60%.
- Diferenciador: pasar de encuesta estática a inteligencia organizacional accionable.

---

## 26. Recomendación final

La ruta óptima para PulseWell es construir un MVP real, no solo un mockup, pero mantenerlo limitado, explicable y seguro.

La prioridad absoluta es:

```text
HR Dashboard + Analytics + Privacidad + Demo Story
```

Si esas cuatro piezas funcionan, el prototipo cumple su objetivo principal: demostrar que las empresas pueden tomar mejores decisiones cuando entienden el bienestar de sus equipos antes de que el problema escale.
