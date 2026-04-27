# 📄 MVP Scope Spec

**Producto:** PulseWell  
**Descripción:** SaaS MVP para inteligencia de bienestar organizacional  
**Estado del documento:** Fuente de verdad para límites del MVP  
**Audiencia:** Producto, diseño, ingeniería, demo e inversionistas

---

## 1. Propósito del documento

Este documento define con precisión qué incluye y qué NO incluye el MVP de PulseWell. Su objetivo es evitar ambigüedades durante implementación, pruebas y demostración.

El MVP debe demostrar que PulseWell puede transformar datos simulados de bienestar organizacional en indicadores agregados, alertas preventivas y recomendaciones accionables, sin exponer información individual ni prometer capacidades clínicas o modelos predictivos reales.

Este documento debe usarse para:

- Controlar scope creep.
- Priorizar desarrollo en ciclos cortos.
- Alinear el producto con el README y la visión del proyecto.
- Definir criterios de aceptación verificables.
- Preparar una demo clara para usuarios, empresas e inversionistas.

---

## 2. Resumen ejecutivo del MVP

PulseWell MVP es un prototipo funcional de analítica de bienestar organizacional basado en datos simulados. La versión MVP NO busca operar como SaaS productivo completo; busca validar la propuesta de valor, la arquitectura base y la narrativa de negocio.

El MVP debe permitir que una persona de Recursos Humanos o liderazgo pueda:

1. Ingresar a una experiencia demo.
2. Ver indicadores agregados de bienestar por organización y equipo.
3. Identificar equipos con señales de riesgo asociadas a burnout, desconexión o rotación.
4. Revisar tendencias semanales simuladas.
5. Ver alertas preventivas y recomendaciones no clínicas.
6. Explicar el impacto potencial para toma de decisiones organizacionales.

---

## 3. Principio rector de alcance

El MVP existe para demostrar **valor, viabilidad y narrativa**, no para cubrir todos los escenarios de una plataforma empresarial real.

Por lo tanto:

- Se prioriza una demo robusta sobre automatizaciones completas.
- Se priorizan reglas explicables sobre inteligencia artificial real.
- Se prioriza privacidad por diseño sobre granularidad individual.
- Se prioriza una arquitectura simple y mantenible sobre multi-tenant avanzado.
- Se prioriza un flujo end-to-end verificable sobre features aisladas.

---

## 4. Definición del MVP

### 4.1 Qué es el MVP

Un prototipo web funcional que demuestra la capacidad de PulseWell para:

- Capturar o simular respuestas de encuestas pulse.
- Agregar datos a nivel equipo.
- Calcular el **Organizational Wellbeing Index (OWI)**.
- Detectar señales de riesgo con reglas determinísticas.
- Mostrar tendencias históricas simuladas.
- Generar alertas y recomendaciones accionables.
- Proteger la privacidad evitando exposición individual.

### 4.2 Qué NO es el MVP

El MVP no es:

- Una solución clínica o médica.
- Un sistema de diagnóstico psicológico.
- Una plataforma de vigilancia individual.
- Un SaaS multi-tenant productivo completo.
- Un sistema con Machine Learning real en producción.
- Una solución certificada de cumplimiento normativo.
- Una herramienta de evaluación de desempeño individual.

---

## 5. Contexto de demo obligatorio

La demo debe construirse alrededor de un escenario fijo para reducir variabilidad y asegurar consistencia narrativa.

| Dimensión | Alcance MVP |
| --- | --- |
| Organización demo | Una organización simulada |
| Tamaño | 20 empleados simulados |
| Equipos | 4 equipos |
| Personas por equipo | 5 empleados por equipo |
| Periodos históricos | 4 semanas simuladas |
| Frecuencia de encuesta | Weekly pulse |
| Datos | Sintéticos / seed data |
| Audiencia de demo | RR. HH., managers, empresas e inversionistas |

### 5.1 Escenarios mínimos de datos simulados

El dataset demo debe incluir al menos:

- 1 equipo con alto riesgo de burnout.
- 1 equipo con tendencia negativa sostenida.
- 1 equipo estable.
- 1 equipo en mejora.
- Al menos 3 alertas activas.
- Recomendaciones asociadas a cada alerta.
- Métricas suficientes para mostrar OWI global, comparación por equipo y tendencias.

---

## 6. Estado actual del scaffold

El repositorio actual ya contiene una base alineada con el MVP:

- Next.js 15 App Router con React 19 y TypeScript.
- Tailwind CSS 4 y componentes tipo shadcn/ui.
- Prisma 7 configurado mediante `prisma.config.ts`.
- Esquema inicial con `Organization`, `Team`, `User`, `SurveyResult` y `WellbeingScore`.
- Lógica inicial en `lib/analytics.ts` para OWI y burnout risk.
- Datos demo iniciales en `lib/mock-data.ts`.
- Landing page y dashboard demo inicial en `app/page.tsx` y `app/dashboard/page.tsx`.
- Endpoint básico de salud en `app/api/health/route.ts`.

Este scaffold es suficiente como punto de partida, pero el MVP final requiere completar persistencia, seed data, vistas por rol, encuestas, alertas, recomendaciones y visualizaciones.

---

## 7. Objetivos del MVP

### 7.1 Objetivos primarios

- Validar la viabilidad técnica de PulseWell como plataforma fullstack.
- Demostrar una experiencia de analítica organizacional agregada.
- Probar una narrativa convincente de prevención de riesgos organizacionales.
- Mostrar una demo end-to-end estable y entendible.

### 7.2 Objetivos secundarios

- Establecer una base arquitectónica simple para escalar después.
- Dejar reglas analíticas trazables y explicables.
- Preparar el terreno para futuras integraciones, compliance e IA real.
- Reducir riesgos de privacidad desde la primera versión.

### 7.3 Métricas de éxito del MVP

El MVP se considera exitoso si:

- La demo puede completarse en menos de 7 minutos sin intervención técnica.
- El dashboard comunica claramente el estado global y por equipo.
- Las alertas se explican con datos y reglas visibles.
- Cada alerta tiene una recomendación accionable.
- No se muestra información sensible individual.
- La narrativa diferencia claramente simulación, reglas y capacidades futuras.

---

## 8. Alcance funcional incluido

### 8.1 Autenticación y acceso

Incluido:

- Login con email y password.
- Sesión básica para usuarios demo.
- Protección de rutas privadas.
- Control de acceso por rol.
- Redirección o navegación según rol cuando sea necesario para la demo.

Roles incluidos:

- `Admin`
- `HR Analyst`
- `Manager`
- `Employee`

Excluido:

- OAuth.
- Single Sign-On empresarial.
- Multi-factor authentication.
- Recuperación avanzada de contraseña.
- Administración completa de sesiones empresariales.

### 8.2 Gestión de usuarios y equipos

Incluido:

- Usuarios y equipos creados por seed data.
- Asignación de usuarios a organización y equipo.
- Asignación de roles.
- Mínimo de 5 personas por equipo para habilitar métricas.
- Vista básica o datos preconfigurados para sostener la demo.

Excluido:

- Self-registration.
- Invitaciones por email.
- Importación masiva CSV.
- Directorio empresarial completo.
- Administración avanzada de permisos.

### 8.3 Encuestas pulse

Incluido:

- Encuesta semanal simulada o manualmente disponible.
- 5 preguntas fijas con escala numérica 1–5.
- Variables mínimas: `energy`, `belonging`, `clarity`, `stress`, `workload`.
- Validación de respuestas obligatorias.
- Persistencia de respuestas si el flujo de encuesta se implementa como parte del demo.

Excluido:

- Preguntas abiertas.
- Encuestas adaptativas.
- Programación automática real.
- Recordatorios automáticos.
- Banco editable de preguntas.

### 8.4 Datos simulados

Incluido:

- Dataset precargado para una organización demo.
- 4 semanas de respuestas sintéticas.
- Tendencias simuladas por equipo.
- Alertas predecibles y reproducibles.
- Datos suficientes para evitar estados vacíos durante la demo principal.

Excluido:

- Ingesta de datos reales desde Slack, Microsoft Teams, Google Workspace u otras fuentes.
- Sincronización en tiempo real.
- Datos personales reales de empleados.
- Carga dinámica desde sistemas externos.

### 8.5 Motor analítico

Incluido:

- Cálculo de OWI en escala 0–100.
- Agregación por equipo.
- Detección de burnout risk con reglas.
- Estimación de attrition risk con reglas.
- Análisis de tendencia semanal.
- Proyección simulada del siguiente periodo cuando exista suficiente histórico.
- Clasificación de severidad para alertas.

Excluido:

- Modelos de Machine Learning reales.
- NLP o análisis de sentimiento.
- Personalización por organización real.
- Entrenamiento de modelos.
- Automatización adaptativa basada en resultados históricos reales.

### 8.6 Dashboard

Incluido:

- Dashboard global para `Admin` y `HR Analyst`.
- Vista de equipo para `Manager`.
- OWI global.
- OWI por equipo.
- Comparación entre equipos.
- Tendencias semanales.
- Indicadores de riesgo.
- Alertas activas.
- Recomendaciones asociadas.
- Visualizaciones con Recharts o componentes equivalentes.

Excluido:

- Dashboards personalizados por usuario.
- Drill-down a personas individuales.
- Exportación avanzada.
- Report builder.
- Filtros empresariales complejos.

### 8.7 Alertas

Incluido:

- Alertas por alto riesgo de burnout.
- Alertas por bajo OWI.
- Alertas por tendencia negativa.
- Alertas por riesgo de rotación cuando aplique.
- Severidad básica: baja, media, alta o crítica según el modelo analítico.
- Relación entre alerta, causa y recomendación.

Excluido:

- Notificaciones por email, push o Slack.
- Alertas en tiempo real.
- Configuración personalizada de umbrales por cliente.
- Escalamiento automático.

### 8.8 Recomendaciones

Incluido:

- Recomendaciones predefinidas basadas en reglas.
- Recomendaciones por equipo, no por individuo.
- Lenguaje preventivo, no clínico.
- Acciones comprensibles para managers y RR. HH.

Excluido:

- Recomendaciones personalizadas mediante IA generativa.
- Sistema que aprende automáticamente de intervenciones.
- Consejos médicos, psicológicos o clínicos.
- Planes de tratamiento individual.

### 8.9 Privacidad por diseño

Incluido:

- Métricas agregadas a nivel equipo.
- Bloqueo de analytics si hay menos de 5 respuestas/personas en un equipo.
- Identificadores internos sin exposición innecesaria.
- Mensajes claros de privacidad para usuarios.
- Prohibición de análisis individual de salud mental.

Excluido:

- Certificaciones formales de compliance.
- Auditoría empresarial completa.
- Gestión avanzada de retención de datos.
- Controles legales específicos por país más allá de disclaimers MVP.

---

## 9. Alcance técnico incluido

| Área | Decisión MVP |
| --- | --- |
| Arquitectura | Modular fullstack monolith |
| Framework | Next.js 15 App Router |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Lenguaje | TypeScript strict |
| Base de datos | Supabase PostgreSQL |
| ORM | Prisma 7 con `prisma.config.ts` |
| Auth | Supabase Auth o implementación mínima compatible con demo |
| Visualización | Recharts o componentes equivalentes |
| Deploy | Vercel |
| Package manager | Bun |

### 9.1 Entidades mínimas

El modelo de datos MVP debe cubrir como mínimo:

- `Organization`
- `Team`
- `User`
- `SurveyResult` o equivalente para respuestas.
- `WellbeingScore` o equivalente para métricas calculadas.
- `Alert` o representación equivalente.
- `Recommendation` o representación equivalente.

Si alertas y recomendaciones no se persisten en tablas dedicadas durante el MVP, deben poder generarse de forma determinística desde los datos existentes.

---

## 10. Fuera de alcance crítico

Estas funcionalidades quedan explícitamente fuera del MVP. No deben implementarse salvo cambio formal de alcance:

- Slack integration.
- Microsoft Teams integration.
- NLP sentiment analysis.
- Modelos de Machine Learning en producción.
- Seguimiento individual de bienestar.
- Diagnóstico clínico o psicológico.
- Evaluación de desempeño individual.
- Compliance completo NOM-035.
- Payroll, HRIS o integraciones corporativas.
- Pagos, suscripciones o billing.
- Multi-tenant SaaS avanzado.
- Mobile app nativa.
- White-labeling.
- Auditoría empresarial completa.
- Notificaciones reales por email, push o chat.
- Panel administrativo empresarial completo.

---

## 11. Non-goals del MVP

Los siguientes puntos no son objetivos de esta etapa:

- Maximizar escalabilidad productiva.
- Cubrir todos los roles empresariales posibles.
- Reemplazar procesos humanos de RR. HH.
- Automatizar decisiones laborales.
- Construir un sistema legalmente certificado.
- Demostrar precisión predictiva real.
- Optimizar para grandes volúmenes de datos.
- Crear una experiencia mobile-first completa.

---

## 12. Supuestos

El alcance se basa en estos supuestos:

- La demo se ejecuta con datos sintéticos controlados.
- La organización demo tiene exactamente 4 equipos de 5 personas.
- Las respuestas usan escala 1–5.
- Los usuarios demo ya existen o se crean mediante seed.
- La audiencia entiende que la capa predictiva es simulada y rule-based.
- El deploy objetivo es Vercel.
- No se utilizan datos reales de empleados.
- El objetivo principal es validación, no operación productiva.

---

## 13. Restricciones de demo

La demo debe ser estable, repetible y protegida contra escenarios que distraigan del objetivo.

Restricciones:

- No depender de integraciones externas en vivo.
- No depender de datos cargados manualmente durante la presentación.
- No mostrar pantallas vacías en el flujo principal.
- No usar lenguaje clínico o diagnóstico.
- No prometer predicción real basada en IA.
- No mostrar datos individuales como base de decisiones.
- No requerir configuración técnica durante la demo.

---

## 14. Flujo de demo recomendado

1. Abrir landing page y presentar la propuesta de valor.
2. Ingresar como `HR Analyst` o usuario demo equivalente.
3. Ver dashboard organizacional.
4. Identificar OWI global y comparación por equipos.
5. Seleccionar o destacar un equipo con riesgo alto.
6. Mostrar tendencia negativa en las últimas semanas.
7. Explicar qué reglas generaron la alerta.
8. Mostrar recomendación preventiva.
9. Reforzar privacidad: análisis agregado, sin exposición individual.
10. Cerrar con impacto de negocio: prevención, priorización y mejor toma de decisiones.

---

## 15. Fases de implementación

### Fase 1 — Base demo y datos

- Confirmar estructura visual base.
- Completar seed data de organización, equipos, usuarios y respuestas.
- Asegurar dataset con 4 semanas y escenarios mínimos.
- Validar cálculo básico de OWI.

### Fase 2 — Analytics, alertas y recomendaciones

- Consolidar agregación por equipo.
- Implementar reglas de burnout, attrition y tendencias.
- Generar alertas determinísticas.
- Asociar recomendaciones por condición.

### Fase 3 — Experiencia por rol

- Implementar login demo o auth básica.
- Proteger rutas principales.
- Crear dashboard HR/Admin.
- Crear vista Manager.
- Crear flujo Employee de encuesta si se incluye en la demo activa.

### Fase 4 — Visualización y narrativa

- Agregar charts de tendencias y comparación.
- Mejorar estados vacíos y mensajes de privacidad.
- Pulir copy para demo e inversionistas.
- Asegurar que el flujo principal sea repetible.

### Fase 5 — Hardening MVP

- Revisar criterios de aceptación.
- Ejecutar pruebas funcionales manuales.
- Validar que no existan datos individuales visibles.
- Preparar deploy demo en Vercel.

---

## 16. Criterios de aceptación

### 16.1 Datos

- [ ] Existe una organización demo con 20 empleados simulados.
- [ ] Existen 4 equipos con 5 empleados cada uno.
- [ ] Existen 4 semanas de respuestas sintéticas.
- [ ] El dataset incluye al menos un equipo en riesgo alto, uno estable, uno en mejora y uno en deterioro.

### 16.2 Analytics

- [ ] El sistema calcula OWI en escala 0–100.
- [ ] El sistema calcula métricas agregadas por equipo.
- [ ] El sistema bloquea analytics cuando un equipo no cumple el mínimo de 5 respuestas/personas.
- [ ] El sistema detecta riesgo de burnout con reglas explicables.
- [ ] El sistema estima riesgo de rotación con reglas explicables.
- [ ] El sistema identifica tendencias semanales.

### 16.3 Dashboard

- [ ] El dashboard muestra OWI global.
- [ ] El dashboard muestra comparación por equipo.
- [ ] El dashboard muestra tendencia temporal.
- [ ] El dashboard muestra alertas activas.
- [ ] El dashboard muestra recomendaciones asociadas.
- [ ] La UI diferencia claramente estados sano, estable, en riesgo y crítico.

### 16.4 Roles y privacidad

- [ ] `HR Analyst` o `Admin` puede ver métricas globales agregadas.
- [ ] `Manager` solo puede ver información agregada de su equipo.
- [ ] `Employee` no puede ver analytics.
- [ ] Ninguna vista muestra respuestas individuales sensibles.
- [ ] La aplicación comunica que no realiza diagnósticos clínicos.

### 16.5 Demo

- [ ] El flujo de demo se puede completar sin errores críticos.
- [ ] Las alertas mostradas tienen explicación y recomendación.
- [ ] La narrativa deja claro qué es simulado y qué sería futuro.
- [ ] No se requiere integración externa para completar la demo.

---

## 17. Definition of Done del MVP

El MVP se considera terminado cuando:

- El flujo principal de demo está implementado y desplegable.
- La landing page comunica la propuesta de valor.
- El dashboard presenta métricas agregadas y visualizaciones útiles.
- La lógica analítica rule-based funciona de forma determinística.
- Existen alertas y recomendaciones coherentes con los datos.
- La privacidad por diseño está respetada.
- Los límites del producto están explicitados en UI o narrativa.
- No hay errores críticos que bloqueen la demo.
- El deploy objetivo en Vercel está preparado o disponible.

---

## 18. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Scope creep hacia SaaS productivo | Alta | Alto | Usar este documento como límite formal del MVP. |
| Sobreprometer IA o predicción real | Media | Alto | Nombrar la capa como simulada y rule-based. |
| Exposición de datos individuales | Media | Alto | Forzar agregación por equipo y mínimo de 5 usuarios/respuestas. |
| Demo frágil por depender de servicios externos | Media | Alto | Usar seed data y evitar integraciones live. |
| Inconsistencia entre docs y código | Media | Medio | Alinear entidades, stack y flujos con README y scaffold actual. |
| Métricas difíciles de explicar | Media | Medio | Mantener fórmulas simples y explicables. |
| Tiempo insuficiente | Alta | Alto | Priorizar dashboard, analytics y demo flow sobre features administrativas. |
| Expectativas clínicas o legales | Media | Alto | Incluir disclaimers claros y lenguaje no diagnóstico. |

---

## 19. Dependencias

Dependencias técnicas:

- Next.js 15.
- React 19.
- TypeScript strict.
- Tailwind CSS 4.
- shadcn/ui.
- Supabase PostgreSQL.
- Supabase Auth o auth demo equivalente.
- Prisma 7.
- Recharts.
- Bun.
- Vercel.

Dependencias de producto:

- Dataset sintético coherente.
- Reglas analíticas definidas.
- Copy de privacidad y disclaimer.
- Demo narrative alineada con inversionistas y usuarios.

---

## 20. Insumos para PRD

Este documento aporta los siguientes insumos para un PRD formal:

- Problema: las organizaciones detectan tarde señales de burnout, desconexión y riesgo de rotación.
- Usuario principal: HR Analyst y líderes organizacionales.
- Usuario secundario: Manager de equipo.
- Usuario participante: Employee que responde encuestas pulse.
- Propuesta de valor: convertir señales de bienestar en decisiones preventivas accionables.
- Diferenciador MVP: analítica agregada, privacidad por diseño y recomendaciones explicables.
- Métrica principal de producto: capacidad de identificar equipos en riesgo con una explicación accionable.
- Restricción crítica: nunca exponer ni diagnosticar individuos.
- Demo promise: “PulseWell no reemplaza al liderazgo humano; le da señales tempranas para actuar mejor”.

---

## 21. Preguntas abiertas

Estas decisiones pueden resolverse antes o durante implementación sin cambiar el alcance central:

- ¿El login del MVP usará Supabase Auth real o credenciales demo simplificadas?
- ¿Las alertas y recomendaciones se persistirán en base de datos o se generarán on demand?
- ¿El flujo Employee de encuesta será interactivo en la demo principal o estará soportado principalmente por seed data?
- ¿El dashboard inicial priorizará una vista única unificada o rutas separadas por rol?
- ¿Qué nivel de detalle visual se requiere para la comparación de equipos en la demo final?
- ¿Se usará el modelo analítico simple actual o el modelo ponderado documentado en AI / Analytics Spec?

---

## 22. Futuro post-MVP

Después de validar el MVP, el producto puede expandirse hacia:

- Integración con Slack y Microsoft Teams.
- NLP sentiment analysis para respuestas abiertas.
- Modelos predictivos reales.
- Personalización por organización.
- Módulo de cumplimiento NOM-035.
- Integraciones HRIS.
- Notificaciones reales.
- Multi-tenant SaaS productivo.
- Billing y planes comerciales.
- Auditoría y controles avanzados de seguridad.
- Mobile experience.

---

## 23. Resumen final

El MVP de PulseWell debe ser una demostración enfocada, honesta y potente: una plataforma web que usa datos simulados para mostrar cómo la analítica agregada puede ayudar a detectar señales tempranas de riesgo organizacional y recomendar acciones preventivas.

El éxito no depende de cubrir muchas features. Depende de demostrar con claridad que PulseWell puede convertir señales de bienestar en decisiones útiles, respetando privacidad, evitando diagnósticos individuales y manteniendo una base técnica lista para evolucionar.
