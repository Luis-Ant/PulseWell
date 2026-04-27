# User Personas & Stakeholders Spec

**Producto:** PulseWell — Organizational Wellbeing Intelligence Platform  
**Documento:** Personas, stakeholders, necesidades, permisos y contexto de decisión  
**Alcance:** MVP con datos simulados, analítica agregada, dashboards por rol, alertas y recomendaciones iniciales.

---

## 1. Propósito

Este documento define las personas usuarias, stakeholders, motivaciones, necesidades, frustraciones, responsabilidades, permisos, métricas de éxito y roles de decisión relacionados con PulseWell.

Su objetivo es guiar el diseño y la implementación del MVP para que la plataforma resuelva un problema organizacional real: convertir señales agregadas de bienestar en insights accionables sin exponer innecesariamente a las personas.

PulseWell debe sostener una regla central:

> **PulseWell analiza equipos y áreas, no evalúa individuos.**

---

## 2. Contexto del producto

PulseWell es una plataforma SaaS para medir, analizar y anticipar riesgos de bienestar organizacional a partir de encuestas pulse y datos agregados. El MVP funciona como prototipo de analítica predictiva con datos simulados para validar:

- valor del problema para empresas medianas;
- claridad de la experiencia por rol;
- utilidad de alertas y recomendaciones preventivas;
- viabilidad de una narrativa de negocio para dirección e inversionistas;
- confianza del colaborador mediante privacidad por diseño.

### Principios de producto derivados del README

1. **Privacidad primero:** no mostrar respuestas individuales ni métricas sensibles por persona.
2. **Agregación mínima:** mostrar datos por equipo o área solo cuando exista un mínimo suficiente de respuestas.
3. **Acción sobre complejidad:** cada métrica relevante debe orientar una decisión o recomendación.
4. **Lenguaje no clínico:** PulseWell no diagnostica salud mental ni reemplaza atención profesional.
5. **Inteligencia organizacional:** el foco es anticipar riesgos de burnout, sobrecarga, baja energía, desconexión y rotación.
6. **MVP demostrable:** la experiencia debe ser entendible en demo, aunque la capa predictiva sea simulada.

---

## 3. Segmentos y roles principales

### 3.1 Roles de producto del MVP

| Rol de producto | Tipo | Capacidades principales |
| --- | --- | --- |
| **Admin** | Operativo / configuración | Gestiona usuarios, equipos, datos demo, configuración y estado del sistema. |
| **HR Analyst** | Usuario principal / comprador funcional | Visualiza insights globales, alertas, OWI, tendencias y recomendaciones organizacionales. |
| **Manager** | Usuario operativo | Monitorea el bienestar agregado de su equipo y recibe acciones preventivas. |
| **Employee** | Participante / fuente de datos | Responde encuestas pulse breves, periódicas y con privacidad explícita. |

### 3.2 Stakeholders ampliados

| Stakeholder | Relación con PulseWell | Influencia | Uso esperado | Rol en decisión |
| --- | --- | --- | --- | --- |
| **HR / People Team** | Usuario principal y comprador funcional | Alta | Alto | Evalúa utilidad, adopción y operación. |
| **Manager / Líder de equipo** | Usuario operativo | Media-Alta | Alto | Convierte insights en acciones de equipo. |
| **Employee / Colaborador** | Participante impactado | Media | Medio | Define la calidad de datos mediante confianza y respuesta. |
| **Dirección / C-Level** | Sponsor y decisor económico | Alta | Medio | Aprueba presupuesto y prioriza inversión. |
| **IT / Seguridad** | Evaluador técnico | Alta en venta B2B | Bajo-Medio | Aprueba seguridad, acceso, integración y despliegue. |
| **Legal / Compliance** | Evaluador de riesgo | Alta | Bajo | Revisa privacidad, uso responsable y límites de datos. |
| **Finanzas / Procurement** | Comprador administrativo | Media-Alta | Bajo | Evalúa costo, contrato, ROI y proceso de compra. |
| **Inversionista** | Evaluador de viabilidad del proyecto | Alta para el proyecto | Bajo | Valida mercado, diferenciación, escalabilidad y riesgo. |
| **Admin del sistema** | Operación técnica/demo | Media | Medio | Mantiene datos demo y configuración estable. |

---

## 4. Mapa de decisión B2B

| Rol | Pregunta que necesita responder | Evidencia esperada en PulseWell |
| --- | --- | --- |
| **Usuario principal: HR Analyst** | ¿Dónde debo intervenir antes de que el problema escale? | Dashboard global, riesgos por equipo, tendencias, recomendaciones. |
| **Usuario operativo: Manager** | ¿Qué puedo hacer esta semana para cuidar a mi equipo sin invadir privacidad? | Vista de equipo, alerta priorizada, acción recomendada, explicación simple. |
| **Participante: Employee** | ¿Puedo responder sin que esto se use en mi contra? | Mensaje de privacidad, encuesta breve, ausencia de datos individuales visibles. |
| **Comprador funcional: HR / People Lead** | ¿La herramienta mejora decisiones de talento y clima? | Insights continuos, reducción de incertidumbre, narrativa preventiva. |
| **Decisor económico: Dirección / C-Level** | ¿Esto reduce riesgo operativo y justifica inversión? | Indicadores ejecutivos, impacto potencial, riesgo de no actuar. |
| **Aprobador técnico: IT / Seguridad** | ¿Es seguro, gobernable e integrable? | Roles, permisos, control de acceso, Supabase/Auth, datos agregados. |
| **Aprobador legal: Legal / Compliance** | ¿Evita uso indebido de datos sensibles? | Privacidad por diseño, no diagnóstico, no exposición individual, límites explícitos. |
| **Evaluador externo: Inversionista** | ¿Hay un problema urgente, vendible y escalable? | Demo funcional, mercado claro, diferenciación, riesgos controlados. |

---

## 5. Matriz de permisos y visibilidad

| Capacidad / dato | Admin | HR Analyst | Manager | Employee | Dirección | IT / Seguridad | Legal | Inversionista demo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Responder encuesta pulse | Opcional | Opcional | Opcional | Sí | No | No | No | No |
| Ver dashboard organizacional | Sí | Sí | No | No | Sí, agregado | No por defecto | No por defecto | Sí, con datos demo |
| Ver dashboard de equipo propio | Sí | Sí | Sí | No | Sí, agregado | No por defecto | No por defecto | Sí, con datos demo |
| Ver otros equipos | Sí | Sí | No | No | Sí, agregado | No por defecto | No por defecto | Sí, con datos demo |
| Ver respuestas individuales | No | No | No | Solo confirmación propia, sin histórico sensible | No | No | No | No |
| Gestionar usuarios/equipos | Sí | Limitado o futuro | No | No | No | Futuro | No | No |
| Configurar datos demo / seed | Sí | No | No | No | No | No | No | No |
| Ver alertas y recomendaciones | Sí | Sí | Solo su equipo | No | Sí, resumen | No por defecto | No por defecto | Sí, demo |
| Acceder a auditoría / seguridad | Futuro | No | No | No | No | Futuro | Futuro | No |

**Regla obligatoria:** ninguna experiencia del MVP debe permitir identificar, rankear o evaluar a colaboradores individuales.

---

## 6. Personas principales

### 6.1 Persona primaria — Mariana Torres, HR Analyst / HR Business Partner

**Tipo:** usuaria principal y compradora funcional probable  
**Empresa:** organización mediana mexicana, 100–500 colaboradores  
**Frecuencia esperada:** semanal  
**Nivel técnico:** medio

#### Contexto

Mariana da seguimiento a clima laboral, engagement, rotación, riesgos psicosociales y bienestar. Hoy depende de encuestas anuales, conversaciones informales y reportes tardíos. Detecta riesgos cuando ya se transformaron en renuncias, conflictos o baja productividad.

#### Jobs to be done

- Cuando necesito saber dónde intervenir, quiero ver señales agregadas por equipo, para actuar antes de que aumente la rotación o el burnout.
- Cuando dirección me pide evidencia, quiero explicar riesgos con datos simples, para justificar acciones preventivas.
- Cuando un manager necesita apoyo, quiero priorizar recomendaciones, para acompañar sin culpar.

#### Necesidades

- Dashboard global de bienestar.
- Comparación por equipo o área.
- OWI, burnout risk, tendencias y alertas priorizadas.
- Recomendaciones accionables y no genéricas.
- Explicación simple de privacidad y cálculo.
- Narrativa ejecutiva para dirección.

#### Pains y resistencias

- Las encuestas anuales llegan tarde.
- Dirección pide datos, pero RH suele tener percepciones.
- Los empleados pueden temer vigilancia.
- Los managers pueden no actuar.
- El bienestar se percibe como gasto.

#### Métricas de éxito

- Identifica equipos en riesgo antes de una crisis.
- Explica el estado organizacional en menos de 5 minutos.
- Prioriza intervenciones con evidencia.
- Mantiene confianza del colaborador.
- Reduce tiempo de análisis manual.

#### Quote

> “Necesito saber dónde intervenir antes de que el problema explote, pero sin romper la confianza de los colaboradores.”

---

### 6.2 Persona primaria — Carlos Méndez, Manager / Líder de equipo

**Tipo:** usuario operativo  
**Equipo:** 5–12 personas  
**Frecuencia esperada:** semanal  
**Nivel técnico:** medio-alto

#### Contexto

Carlos lidera un equipo con presión por entregar resultados. No siempre ve señales tempranas de desgaste: retrasos, cansancio, baja participación, conflictos o intención de renuncia.

#### Jobs to be done

- Cuando mi equipo muestra señales de desgaste, quiero recibir una acción concreta, para ajustar carga, prioridades o comunicación a tiempo.
- Cuando veo una alerta, quiero entender qué cambió, para actuar sin sobreinterpretar datos.
- Cuando RH me comparte insights, quiero que el mensaje no sea punitivo, para mantener confianza con mi equipo.

#### Necesidades

- Vista solo de su equipo.
- Indicadores simples: estado, tendencia, riesgo y prioridad.
- Recomendación práctica para la semana.
- Explicación de qué hacer y qué evitar.
- Privacidad visible para no romper confianza.

#### Pains y resistencias

- Poco tiempo para revisar dashboards.
- Herramientas de RH desconectadas de la operación.
- Miedo a que los datos se usen para evaluarlo como mal líder.
- Recomendaciones demasiado genéricas o imposibles.

#### Métricas de éxito

- Entiende el estado del equipo en menos de 1 minuto.
- Recibe al menos una acción clara y realista.
- Actúa sin acceder a respuestas individuales.
- Mejora conversaciones de equipo.

#### Quote

> “No necesito más reportes; necesito saber qué hacer esta semana para que mi equipo no se desgaste.”

---

### 6.3 Persona primaria impactada — Ana Ruiz, Employee / Colaboradora

**Tipo:** participante y fuente de datos  
**Frecuencia esperada:** semanal  
**Nivel técnico:** bajo-medio

#### Contexto

Ana responde encuestas pulse breves sobre estrés, energía, carga laboral, pertenencia y claridad. No usa dashboards. Su principal preocupación es que sus respuestas puedan identificarse o usarse en su contra.

#### Jobs to be done

- Cuando respondo una encuesta de bienestar, quiero saber que mi respuesta será confidencial, para responder honestamente sin miedo.
- Cuando dedico tiempo a responder, quiero ver que la empresa hace algo con los resultados, para no sentir que la encuesta es simbólica.

#### Necesidades

- Encuesta de menos de 1 minuto.
- Preguntas claras, no invasivas y en escala simple.
- Confirmación de envío.
- Explicación visible de privacidad: quién ve qué y con qué nivel de agregación.
- Experiencia móvil sencilla.

#### Pains y resistencias

- Encuestas largas o frecuentes sin cambios visibles.
- Miedo a represalias.
- Desconfianza en “anonimato” mal explicado.
- Preguntas demasiado personales o clínicas.

#### Métricas de éxito

- Completa la encuesta sin fricción.
- Entiende que su respuesta individual no será visible.
- Percibe que sus respuestas contribuyen a acciones concretas.
- No siente vigilancia.

#### Quote

> “Sí respondería, pero solo si estoy segura de que no podrán usar mi respuesta contra mí.”

---

## 7. Personas secundarias y stakeholders de decisión

### 7.1 Roberto Salgado, Dirección / C-Level

**Tipo:** sponsor y decisor económico  
**Frecuencia esperada:** mensual o quincenal

#### Necesidad principal

Entender si el bienestar organizacional representa un riesgo para productividad, rotación, ausentismo, cultura o reputación, y si la inversión en PulseWell tiene sentido económico.

#### Jobs to be done

- Cuando evalúo inversiones en bienestar, quiero ver indicadores claros de riesgo y productividad, para decidir si vale la pena invertir.
- Cuando hay equipos críticos, quiero priorizar recursos, para reducir impacto operativo.

#### Criterios de éxito

- Visualiza el estado general de la organización.
- Entiende el riesgo de no actuar.
- Puede defender inversión con una narrativa simple.
- No percibe riesgo legal o cultural innecesario.

#### Quote

> “Necesito saber si esto reduce riesgo de rotación y mejora productividad, sin abrir un problema legal o cultural.”

---

### 7.2 Laura Valdez, Inversionista / Evaluadora de innovación

**Tipo:** evaluadora externa de viabilidad  
**Frecuencia esperada:** demo puntual

#### Necesidad principal

Validar que PulseWell no es “otra encuesta de clima”, sino una plataforma SaaS B2B con problema urgente, diferenciación, narrativa de mercado y riesgos controlados.

#### Criterios de éxito

- La demo cuenta una historia clara de problema → insight → acción.
- La capa predictiva simulada es explicable y honesta.
- La privacidad es una ventaja, no un riesgo ignorado.
- Existe camino hacia pilotos reales.

#### Quote

> “Muéstrame que esto puede convertirse en inteligencia estratégica para empresas, no solo en encuestas bonitas.”

---

### 7.3 Sofía Hernández, IT / Seguridad

**Tipo:** aprobadora técnica en venta B2B  
**Frecuencia esperada:** evaluación puntual; operación futura

#### Necesidad principal

Confirmar que PulseWell maneja autenticación, autorización, datos y despliegue de forma gobernable.

#### Preguntas clave

- ¿Qué datos personales se almacenan?
- ¿Cómo se separan roles y permisos?
- ¿Existe mínimo de respuestas antes de mostrar métricas?
- ¿Qué integra el MVP y qué queda fuera?
- ¿Cómo se manejarán auditoría, retención y eliminación en producción?

#### Criterios de éxito

- Permisos claros por rol.
- No hay exposición de datos individuales.
- La arquitectura Next.js, Supabase/PostgreSQL y Prisma es comprensible.
- Los límites del MVP están documentados.

---

### 7.4 Diego Ramírez, Legal / Compliance

**Tipo:** aprobador de riesgo  
**Frecuencia esperada:** revisión puntual; seguimiento futuro

#### Necesidad principal

Asegurar que PulseWell no prometa diagnóstico clínico, no facilite decisiones individuales de empleo y no exponga datos sensibles sin base clara.

#### Preguntas clave

- ¿La herramienta evalúa personas o condiciones agregadas?
- ¿Se puede identificar a un colaborador por equipo pequeño?
- ¿El lenguaje evita diagnóstico médico o psicológico?
- ¿Qué consentimiento o aviso se requiere en producción?
- ¿Qué datos quedan fuera del MVP?

#### Criterios de éxito

- Disclaimer visible: no es herramienta clínica.
- Privacidad por diseño documentada.
- Umbral mínimo de agregación.
- Prohibición explícita de uso punitivo.

---

### 7.5 Valeria Núñez, Finanzas / Procurement

**Tipo:** compradora administrativa  
**Frecuencia esperada:** proceso de compra

#### Necesidad principal

Entender costo, alcance, condiciones comerciales y valor medible antes de aprobar contratación.

#### Criterios de éxito

- Propuesta de valor clara.
- Métricas de ROI o riesgo evitado.
- Alcance del MVP y roadmap diferenciados.
- Modelo comercial futuro defendible.

---

### 7.6 Admin del sistema

**Tipo:** operación técnica/demo  
**Frecuencia esperada:** ocasional

#### Necesidades

- Crear y gestionar usuarios demo.
- Crear equipos y asignaciones.
- Restaurar datos simulados.
- Recalcular métricas.
- Preparar una demo sin modificar código.

#### Criterio de éxito

Puede dejar el entorno listo, estable y coherente para una demo en pocos minutos.

---

## 8. Mapa de necesidades por stakeholder

| Necesidad | HR | Manager | Employee | Dirección | IT/Seguridad | Legal | Inversionista | Admin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ver bienestar global | Sí | No | No | Sí | No | No | Sí, demo | Sí |
| Ver bienestar del equipo | Sí | Sí, propio | No | Sí, agregado | No | No | Sí, demo | Sí |
| Responder encuesta | Opcional | Opcional | Sí | No | No | No | No | Opcional |
| Ver alertas | Sí | Sí, equipo propio | No | Sí, resumen | No | No | Sí, demo | Sí |
| Ver recomendaciones | Sí | Sí, equipo propio | No | Sí, resumen | No | No | Sí, demo | Sí |
| Ver datos individuales | No | No | No | No | No | No | No | No |
| Entender impacto de negocio | Sí | Medio | No | Sí | Medio | Medio | Sí | Bajo |
| Validar privacidad | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Medio |
| Validar seguridad técnica | Medio | Bajo | Bajo | Medio | Sí | Medio | Medio | Sí |
| Ver configuración técnica | No | No | No | No | Sí, futuro | No | No | Sí |

---

## 9. Mapa de valor, riesgos y mitigaciones

| Stakeholder | Valor principal | Riesgo percibido | Mitigación en producto |
| --- | --- | --- | --- |
| HR | Priorización de intervenciones y visibilidad continua | Datos poco confiables o difíciles de explicar | Algoritmo simple, tendencias, recomendaciones y narrativa ejecutiva. |
| Manager | Acciones concretas para cuidar al equipo | Ser evaluado o culpado | Lenguaje preventivo, acceso solo a equipo propio, foco en condiciones. |
| Employee | Canal seguro para expresar señales | Ser identificado o sufrir represalias | Agregación, mínimo de respuestas, no exposición individual, mensaje claro. |
| Dirección | Conexión entre bienestar, riesgo y productividad | ROI poco claro o riesgo legal | Indicadores ejecutivos, disclaimers y privacidad por diseño. |
| IT / Seguridad | Control técnico y gobernabilidad | Riesgos de acceso, datos o integración | Roles claros, arquitectura documentada, alcance MVP acotado. |
| Legal / Compliance | Reducción de exposición legal | Uso clínico, punitivo o discriminatorio | No diagnóstico, anti-personas, restricciones explícitas de uso. |
| Inversionista | Evidencia de oportunidad SaaS escalable | Producto indiferenciado o “IA humo” | Demo funcional, predicción simulada explicable, problema y mercado claros. |
| Admin | Demo estable y configurable | Preparación manual frágil | Seed/reset, gestión de equipos y datos simulados. |

---

## 10. Workflows clave por rol

### 10.1 HR Analyst

1. Inicia sesión.
2. Revisa dashboard global y OWI.
3. Identifica equipos con riesgo alto o tendencia negativa.
4. Abre detalle agregado por equipo.
5. Revisa recomendación priorizada.
6. Comparte insight con manager o dirección.
7. Da seguimiento en ciclos semanales.

### 10.2 Manager

1. Inicia sesión.
2. Ve el estado agregado de su equipo.
3. Detecta qué indicador cambió: estrés, energía, carga, pertenencia o claridad.
4. Recibe una acción concreta.
5. Ajusta carga, comunicación o prioridades.
6. Revisa evolución en el siguiente pulso.

### 10.3 Employee

1. Recibe o accede a encuesta pulse.
2. Lee mensaje breve de privacidad.
3. Responde preguntas en escala 1 a 5.
4. Envía la encuesta.
5. Recibe confirmación sin mostrar dashboards ni comparaciones.

### 10.4 Dirección

1. Revisa resumen ejecutivo.
2. Identifica áreas de mayor riesgo.
3. Evalúa impacto potencial en rotación, productividad o ausentismo.
4. Decide priorización de recursos o continuidad del piloto.

---

## 11. Alcance MVP vs futuro

### Incluido en MVP

- Datos simulados coherentes.
- Dashboards por rol: Admin, HR Analyst, Manager y Employee.
- Encuestas pulse breves con escala 1 a 5.
- Cálculo de Organizational Wellbeing Index (OWI).
- Riesgo de burnout basado en reglas simples.
- Estimación inicial o simulada de riesgo futuro.
- Alertas por umbrales y tendencias.
- Recomendaciones iniciales para managers.
- Privacidad por diseño y mínimo de agregación.
- Narrativa clara para demo ante usuarios, empresas e inversionistas.

### Fuera de alcance del MVP

- Diagnóstico clínico, médico o psicológico.
- Evaluación de salud mental individual.
- Ranking de colaboradores o productividad individual.
- Integración real con Slack, Microsoft Teams u otras fuentes.
- Análisis de sentimiento con NLP en producción.
- Modelos de Machine Learning productivos.
- Cumplimiento normativo completo para ambientes productivos.
- Auditoría avanzada, retención configurable y data residency.
- Módulo completo de NOM-035.

### Futuro posible

- Integraciones con herramientas de comunicación y HRIS.
- Módulo de cumplimiento NOM-035.
- Auditoría, retención y controles avanzados de seguridad.
- Modelos predictivos entrenados con datos reales y validados.
- Recomendaciones adaptativas por contexto organizacional.

---

## 12. Reglas de producto derivadas de personas

1. Si una funcionalidad ayuda a HR a decidir dónde intervenir, es prioritaria.
2. Si una funcionalidad aumenta la confianza del colaborador, es prioritaria.
3. Si una funcionalidad muestra o permite inferir datos individuales, debe rechazarse.
4. Si una funcionalidad complica la demo sin aumentar valor, debe posponerse.
5. Si una métrica no genera una acción clara, debe simplificarse.
6. Si una recomendación puede leerse como culpa hacia un manager, debe reescribirse en lenguaje preventivo.
7. Si un equipo no cumple el mínimo de respuestas, no se muestran métricas específicas.
8. Si un insight parece clínico, debe reformularse como señal organizacional no diagnóstica.

---

## 13. Anti-personas y usos prohibidos

| Anti-persona | Qué busca | Respuesta del producto |
| --- | --- | --- |
| **Supervisor punitivo** | Identificar empleados “problemáticos”. | No hay exposición individual, rankings ni respuestas por persona. |
| **Analista de productividad individual** | Comparar output o rendimiento de colaboradores. | PulseWell mide condiciones agregadas, no desempeño individual. |
| **Médico o terapeuta clínico** | Diagnosticar salud mental. | PulseWell no es herramienta clínica ni emite diagnósticos. |
| **Área legal defensiva mal enfocada** | Usar datos para justificar despidos o sanciones. | El sistema debe limitar usos punitivos y mantener evidencia agregada. |
| **Vigilancia corporativa** | Monitorear conversaciones o contenido privado. | El MVP no analiza mensajes, conversaciones ni contenido privado. |

---

## 14. Criterios de aceptación del documento

Este documento se considera completo si permite responder:

- [x] Quién usa PulseWell.
- [x] Quién compra o impulsa PulseWell.
- [x] Quién responde las encuestas.
- [x] Quién toma decisiones con los datos.
- [x] Quién evalúa seguridad, privacidad y viabilidad legal.
- [x] Qué necesita cada persona.
- [x] Qué teme cada persona.
- [x] Qué permisos y visibilidad corresponden a cada rol.
- [x] Qué workflows mínimos requiere el MVP.
- [x] Qué funcionalidades deben priorizarse.
- [x] Qué usos deben evitarse.
- [x] Qué queda dentro del MVP y qué queda para futuro.

---

## 15. Inputs para PRD

### Requisitos funcionales derivados

- El sistema debe ofrecer dashboards diferenciados para Admin, HR Analyst, Manager y Employee.
- El sistema debe permitir responder encuestas pulse breves con escala numérica de 1 a 5.
- El sistema debe calcular y mostrar OWI por equipo o área.
- El sistema debe identificar riesgos de burnout mediante reglas simples del MVP.
- El sistema debe mostrar tendencias semanales por equipo o área.
- El sistema debe generar alertas priorizadas cuando existan umbrales o tendencias críticas.
- El sistema debe mostrar recomendaciones accionables para HR y managers.
- El sistema debe impedir la visualización de respuestas individuales.
- El sistema debe aplicar un mínimo de respuestas antes de mostrar métricas agregadas.

### Requisitos no funcionales derivados

- La experiencia debe ser clara, rápida y entendible en demo.
- La comunicación debe usar lenguaje humano, preventivo y no clínico.
- La privacidad debe explicarse antes o durante la encuesta.
- Los datos demo deben ser coherentes y restaurables.
- Las métricas deben ser explicables para usuarios no técnicos.
- Los permisos deben respetar el principio de mínimo acceso.

### Métricas de adopción sugeridas

- Tasa de respuesta de Employee.
- Tiempo promedio para completar encuesta.
- Porcentaje de managers que revisan recomendación semanal.
- Tiempo de HR para identificar equipos prioritarios.
- Número de alertas accionadas o marcadas como revisadas.
- Confianza percibida en privacidad durante pruebas de usuario.

---

## 16. Riesgos abiertos

| Riesgo | Impacto | Mitigación inicial |
| --- | --- | --- |
| Baja confianza de empleados | Datos incompletos o sesgados | Mensaje de privacidad claro, preguntas no invasivas, agregación mínima. |
| Managers interpretan datos como evaluación personal | Resistencia al uso | Lenguaje preventivo y recomendaciones enfocadas en condiciones de trabajo. |
| Dirección exige ROI inmediato | Compra más difícil | Narrativa de riesgo evitado y métricas ejecutivas simples. |
| Riesgo legal por datos sensibles | Bloqueo de adopción | Disclaimer, no diagnóstico, no datos individuales, revisión futura de compliance. |
| Predicción simulada se percibe como promesa excesiva | Pérdida de credibilidad | Indicar que la capa predictiva del MVP es simulada y explicable. |
| Equipos pequeños permiten inferencias | Riesgo de privacidad | Umbral mínimo de respuestas y ocultamiento de métricas específicas. |

---

## 17. Preguntas abiertas

1. ¿Cuál será el umbral mínimo definitivo de respuestas para mostrar métricas por equipo: 5, 7 u otro valor?
2. ¿HR podrá configurar frecuencia de encuestas en el MVP o será fija para la demo?
3. ¿Dirección tendrá un rol propio en la aplicación o verá una vista ejecutiva dentro del rol HR/Admin?
4. ¿La narrativa de ROI usará estimaciones monetarias o solo indicadores de riesgo en el MVP?
5. ¿Qué datos personales mínimos se almacenarán para Employee en el prototipo?
6. ¿Se mostrará al colaborador algún resumen agregado posterior o solo confirmación de envío?
7. ¿Qué nivel de auditoría requiere el MVP para demo frente a IT/Seguridad?

---

## 18. Resumen ejecutivo

PulseWell debe equilibrar cinco intereses centrales:

- **HR quiere visibilidad continua.**
- **Manager quiere acciones concretas.**
- **Employee quiere confianza y privacidad.**
- **Dirección quiere impacto de negocio.**
- **IT, Legal e inversionistas quieren viabilidad, control y riesgos acotados.**

La dirección de producto para el MVP es clara: priorizar dashboards por rol, encuestas simples, métricas agregadas, alertas accionables, predicción explicable y privacidad visible.

El producto no debe convertirse en una herramienta de vigilancia, diagnóstico clínico ni evaluación individual. Su ventaja está en transformar señales organizacionales agregadas en decisiones preventivas y responsables.
