# PulseWell — Especificación de Requerimientos Funcionales

## 1. Propósito

Este documento define el comportamiento funcional de **PulseWell**, una plataforma SaaS MVP de inteligencia de bienestar organizacional. Su objetivo es convertir datos agregados de encuestas pulse en métricas, alertas y recomendaciones accionables para Recursos Humanos y líderes de equipo.

La especificación debe servir como guía para diseño, implementación, pruebas funcionales y validación del MVP.

## 2. Alcance del producto

### 2.1 Incluido en el MVP

- Autenticación y control de acceso por rol.
- Gestión básica de organizaciones, equipos y usuarios.
- Encuestas pulse con respuestas numéricas en escala de 1 a 5.
- Cálculo del **Organizational Wellbeing Index (OWI)** por equipo y organización.
- Detección inicial de riesgo de burnout mediante reglas.
- Estimación inicial de riesgo de rotación mediante señales agregadas.
- Dashboards por rol con métricas, tendencias, alertas y recomendaciones.
- Privacidad por diseño: resultados agregados y bloqueo de métricas cuando no exista muestra mínima.
- Datos simulados o precargados cuando no exista persistencia completa disponible.

### 2.2 Fuera del MVP / alcance futuro

- Integraciones reales con Slack, Microsoft Teams u otras herramientas internas.
- Análisis de sentimiento con NLP sobre mensajes o conversaciones.
- Modelos de Machine Learning productivos.
- Diagnóstico clínico, psicológico o médico.
- Evaluación individual del estado mental de empleados.
- Cumplimiento normativo completo para entornos productivos.
- Módulo formal de cumplimiento NOM-035.
- Auditoría avanzada, políticas granulares de seguridad y flujos enterprise.

## 3. Actores y roles

| Rol | Propósito | Capacidades principales | Restricciones |
| --- | --- | --- | --- |
| **Admin** | Configurar y operar el tenant organizacional. | Gestionar organización, usuarios, equipos, roles y datos demo. | No debe usar datos individuales para diagnósticos. |
| **HR Analyst** | Analizar el bienestar global de la organización. | Ver dashboards organizacionales, comparar equipos, revisar alertas y recomendaciones. | No puede ver respuestas individuales identificables. |
| **Manager** | Monitorear el bienestar de sus equipos asignados. | Ver métricas, tendencias, alertas y recomendaciones de sus equipos. | No puede acceder a equipos no asignados ni a respuestas individuales. |
| **Employee** | Participar en encuestas pulse. | Responder encuestas activas y consultar estado básico de participación si está disponible. | No puede ver métricas agregadas, alertas ni datos de otros empleados. |
| **System** | Ejecutar lógica automática. | Calcular métricas, detectar riesgos, generar alertas y recomendaciones. | Debe respetar reglas de privacidad y permisos. |

## 4. Conceptos funcionales clave

| Concepto | Definición |
| --- | --- |
| **Organización** | Tenant o empresa que usa PulseWell. |
| **Equipo** | Grupo de empleados dentro de una organización. Las métricas se calculan como mínimo a este nivel. |
| **Encuesta pulse** | Cuestionario breve y periódico para capturar señales de bienestar. |
| **Respuesta** | Valores numéricos enviados por un empleado para una encuesta activa. |
| **OWI** | Índice normalizado de bienestar organizacional en escala 0–100. |
| **Riesgo de burnout** | Clasificación `low`, `medium` o `high` derivada de estrés, energía y carga de trabajo. |
| **Riesgo de rotación** | Señal agregada basada en pertenencia, energía, carga de trabajo y tendencia histórica. |
| **Alerta** | Evento generado por el sistema cuando una métrica supera un umbral o muestra una tendencia negativa. |
| **Recomendación** | Acción sugerida para reducir un riesgo o mejorar una señal de bienestar. |

## 5. Historias de usuario

### Admin

- Como Admin, quiero crear y mantener usuarios para que la organización pueda operar dentro de PulseWell.
- Como Admin, quiero asignar usuarios a equipos y roles para que los permisos y agregaciones funcionen correctamente.
- Como Admin, quiero cargar o activar datos demo para validar el flujo del MVP sin depender de integraciones externas.

### HR Analyst

- Como HR Analyst, quiero visualizar el OWI global para entender el estado general de la organización.
- Como HR Analyst, quiero comparar equipos para identificar áreas con mayor riesgo.
- Como HR Analyst, quiero revisar alertas y recomendaciones priorizadas para orientar acciones preventivas.
- Como HR Analyst, quiero ver tendencias históricas para detectar deterioros antes de que se vuelvan críticos.

### Manager

- Como Manager, quiero ver el bienestar de mis equipos asignados para tomar decisiones de liderazgo informadas.
- Como Manager, quiero recibir alertas cuando mi equipo tenga señales de burnout, baja energía o sobrecarga.
- Como Manager, quiero recomendaciones accionables para intervenir sin acceder a información individual sensible.

### Employee

- Como Employee, quiero responder una encuesta breve para compartir mi percepción de bienestar de manera simple.
- Como Employee, quiero que mis respuestas no sean expuestas individualmente para confiar en el sistema.
- Como Employee, quiero saber si ya respondí la encuesta activa para evitar duplicados.

## 6. Requerimientos funcionales

### FR-01 — Autenticación

El sistema **DEBE** permitir que usuarios registrados inicien sesión con credenciales válidas mediante el proveedor de autenticación definido para el MVP.

#### Criterios de aceptación

- **Dado** un usuario registrado, **cuando** ingresa credenciales válidas, **entonces** el sistema inicia sesión y lo dirige a la experiencia correspondiente a su rol.
- **Dado** un usuario no registrado o credenciales inválidas, **cuando** intenta iniciar sesión, **entonces** el sistema rechaza el acceso y muestra un mensaje claro.
- **Dado** un usuario autenticado, **cuando** cierra sesión, **entonces** el sistema invalida la sesión de usuario en la aplicación.

### FR-02 — Autorización por rol

El sistema **DEBE** restringir acceso a vistas, datos y acciones según el rol del usuario autenticado.

#### Criterios de aceptación

- **Dado** un HR Analyst, **cuando** accede al dashboard, **entonces** ve datos agregados de la organización y sus equipos.
- **Dado** un Manager, **cuando** accede al dashboard, **entonces** ve únicamente los equipos asignados.
- **Dado** un Employee, **cuando** accede al sistema, **entonces** solo puede responder encuestas o ver su estado de participación.
- **Dado** cualquier usuario, **cuando** solicita una acción no permitida por su rol, **entonces** el sistema bloquea la acción.

### FR-03 — Gestión de usuarios y equipos

El sistema **DEBE** permitir al Admin mantener la estructura mínima de organización, equipos, usuarios y roles necesaria para operar el MVP.

#### Criterios de aceptación

- **Dado** un Admin, **cuando** crea un usuario, **entonces** el sistema registra nombre, email, rol, organización y equipo cuando aplique.
- **Dado** un Admin, **cuando** crea o edita un equipo, **entonces** el sistema lo asocia a una organización.
- **Dado** un usuario sin equipo requerido para analítica, **cuando** se calculan métricas, **entonces** sus respuestas no se agregan a un equipo inválido.

### FR-04 — Encuestas pulse

El sistema **DEBE** permitir que Employees respondan encuestas pulse breves con variables numéricas en escala de 1 a 5.

#### Variables del MVP

| Variable | Sentido funcional |
| --- | --- |
| **Energy** | Nivel percibido de energía. Mayor es mejor. |
| **Belonging** | Sentido de pertenencia. Mayor es mejor. |
| **Clarity** | Claridad sobre prioridades y expectativas. Mayor es mejor. |
| **Stress** | Nivel de estrés percibido. Mayor es peor. |
| **Workload** | Carga de trabajo percibida. Mayor es peor. |

#### Reglas

- Cada respuesta **DEBE** usar valores enteros entre 1 y 5.
- Todas las variables requeridas **DEBEN** completarse antes del envío.
- Cada Employee **DEBE** enviar como máximo una respuesta por ciclo activo de encuesta.
- El MVP **PUEDE** operar con un único ciclo activo mientras no exista un módulo avanzado de planificación de encuestas.

#### Criterios de aceptación

- **Dado** un Employee con encuesta activa pendiente, **cuando** completa todos los valores válidos, **entonces** el sistema guarda la respuesta.
- **Dado** un Employee que ya respondió el ciclo activo, **cuando** intenta responder nuevamente, **entonces** el sistema impide el duplicado.
- **Dado** una respuesta incompleta o fuera de rango, **cuando** se envía, **entonces** el sistema la rechaza y solicita corrección.

### FR-05 — Procesamiento y agregación de datos

El sistema **DEBE** agregar respuestas por equipo y organización sin exponer respuestas individuales identificables.

#### Reglas

- Las métricas visibles **DEBEN** calcularse sobre datos agregados.
- Un equipo **DEBE** tener al menos 5 empleados elegibles o 5 respuestas válidas, según la métrica, para mostrar resultados.
- Si no se alcanza la muestra mínima, el sistema **DEBE** ocultar métricas y mostrar un estado de privacidad insuficiente.
- El sistema **DEBE** manejar ausencia de datos con estados vacíos comprensibles.

#### Criterios de aceptación

- **Dado** un equipo con muestra mínima suficiente, **cuando** existen respuestas válidas, **entonces** el sistema calcula métricas agregadas.
- **Dado** un equipo con menos de 5 participantes o respuestas válidas, **cuando** se consulta su dashboard, **entonces** el sistema no muestra métricas del equipo.
- **Dado** una organización sin respuestas, **cuando** HR consulta el dashboard, **entonces** el sistema muestra un estado vacío sin errores.

### FR-06 — Cálculo del OWI

El sistema **DEBE** calcular el **Organizational Wellbeing Index (OWI)** combinando señales positivas y negativas, y normalizarlo en escala 0–100.

#### Fórmula funcional del MVP

```text
OWI base = Energy + Belonging + Clarity - Stress - Workload
OWI normalizado = valor equivalente en escala 0–100
```

#### Criterios de aceptación

- **Dado** un conjunto válido de promedios agregados, **cuando** se calcula el OWI, **entonces** el resultado se expresa entre 0 y 100.
- **Dado** valores extremos, **cuando** se calcula el OWI, **entonces** el resultado no debe ser menor a 0 ni mayor a 100.
- **Dado** datos insuficientes, **cuando** se solicita el OWI, **entonces** el sistema no calcula ni muestra el índice.

### FR-07 — Detección de riesgo de burnout

El sistema **DEBE** clasificar el riesgo de burnout por equipo usando reglas simples y explicables para el MVP.

#### Reglas del MVP

| Señal | Condición de riesgo |
| --- | --- |
| Estrés alto | `Stress >= 4` |
| Energía baja | `Energy <= 2` |
| Carga alta | `Workload >= 4` |

Clasificación mínima:

- **High**: estrés alto, energía baja y carga alta.
- **Medium**: estrés alto con carga alta, o energía baja.
- **Low**: no se cumplen las condiciones anteriores.

#### Criterios de aceptación

- **Dado** un equipo con estrés alto, energía baja y carga alta, **cuando** el sistema evalúa burnout, **entonces** clasifica el riesgo como `high`.
- **Dado** un equipo con estrés alto y carga alta, **cuando** el sistema evalúa burnout, **entonces** clasifica el riesgo como `medium`.
- **Dado** un equipo sin señales críticas, **cuando** el sistema evalúa burnout, **entonces** clasifica el riesgo como `low`.

### FR-08 — Estimación inicial de riesgo de rotación

El sistema **DEBE** estimar riesgo de rotación a nivel agregado usando señales de pertenencia, energía, carga de trabajo y tendencia cuando existan datos históricos.

#### Reglas funcionales

- El sistema **DEBE** considerar baja pertenencia como señal principal de riesgo.
- El sistema **DEBE** elevar la severidad cuando baja pertenencia se combine con baja energía o alta carga de trabajo.
- El sistema **PUEDE** usar tendencias simuladas en el MVP cuando no exista historial real suficiente.

#### Criterios de aceptación

- **Dado** un equipo con baja pertenencia y alta carga, **cuando** se evalúa rotación, **entonces** el sistema genera una señal de riesgo.
- **Dado** un equipo con pertenencia estable y energía alta, **cuando** se evalúa rotación, **entonces** no se genera una alerta crítica.
- **Dado** ausencia de historial, **cuando** se evalúa rotación, **entonces** el sistema puede usar datos simulados o mostrar una estimación limitada.

### FR-09 — Tendencias

El sistema **DEBE** mostrar tendencias de métricas cuando exista más de un punto temporal comparable.

#### Criterios de aceptación

- **Dado** al menos dos ciclos comparables, **cuando** se consulta un dashboard, **entonces** el sistema muestra variación respecto al ciclo anterior.
- **Dado** un solo ciclo disponible, **cuando** se consulta tendencia, **entonces** el sistema muestra un estado inicial sin comparar falsamente.
- **Dado** una caída relevante de OWI, energía o pertenencia, **cuando** se calculan tendencias, **entonces** el sistema puede generar una alerta de tendencia negativa.

### FR-10 — Alertas inteligentes

El sistema **DEBE** generar alertas cuando detecte riesgos o deterioros relevantes en métricas agregadas.

#### Tipos de alerta del MVP

- Riesgo alto o medio de burnout.
- OWI bajo o caída significativa de OWI.
- Energía en descenso.
- Carga de trabajo alta.
- Pertenencia baja o riesgo de rotación.
- Datos insuficientes para mostrar métricas, cuando sea relevante para Admin o HR.

#### Reglas

- Toda alerta **DEBE** tener severidad: `low`, `medium` o `high`.
- Toda alerta accionable **DEBE** estar vinculada a una recomendación.
- Las alertas **DEBEN** respetar permisos por rol y alcance de equipo.

#### Criterios de aceptación

- **Dado** un equipo con burnout `high`, **cuando** se procesan métricas, **entonces** el sistema genera una alerta de alta severidad.
- **Dado** un Manager asignado a ese equipo, **cuando** abre su dashboard, **entonces** ve la alerta correspondiente.
- **Dado** un Manager no asignado a ese equipo, **cuando** consulta alertas, **entonces** no puede verla.

### FR-11 — Recomendaciones

El sistema **DEBE** generar recomendaciones accionables basadas en la causa funcional de cada alerta.

#### Ejemplos de mapeo

| Señal | Recomendación esperada |
| --- | --- |
| Estrés alto + carga alta | Revisar prioridades, carga y deadlines del equipo. |
| Energía baja | Programar check-ins y revisar bloqueos operativos. |
| Pertenencia baja | Promover reconocimiento, inclusión y rituales de equipo. |
| Claridad baja | Reforzar objetivos, expectativas y criterios de éxito. |
| OWI bajo | Priorizar diagnóstico organizacional y seguimiento semanal. |

#### Criterios de aceptación

- **Dado** una alerta accionable, **cuando** se muestra al usuario autorizado, **entonces** incluye al menos una recomendación asociada.
- **Dado** múltiples alertas, **cuando** se muestran recomendaciones, **entonces** el sistema prioriza las de mayor severidad.
- **Dado** una señal sin recomendación específica, **cuando** se genera salida, **entonces** el sistema usa una recomendación general de seguimiento preventivo.

### FR-12 — Dashboard organizacional para HR

El sistema **DEBE** ofrecer a HR Analyst una vista agregada de la organización.

#### Contenido mínimo

- OWI global.
- Promedios agregados de Energy, Belonging, Clarity, Stress y Workload.
- Comparación por equipo cuando se respete la muestra mínima.
- Tendencias disponibles.
- Alertas priorizadas.
- Recomendaciones organizacionales.
- Estado de datos insuficientes cuando corresponda.

#### Criterios de aceptación

- **Dado** un HR Analyst autenticado, **cuando** abre el dashboard, **entonces** ve métricas globales agregadas.
- **Dado** equipos con muestra insuficiente, **cuando** HR revisa comparación, **entonces** esos equipos aparecen ocultos o marcados como insuficientes sin exponer datos.
- **Dado** alertas activas, **cuando** HR abre el dashboard, **entonces** las ve ordenadas por severidad o prioridad.

### FR-13 — Dashboard de manager

El sistema **DEBE** ofrecer a Manager una vista limitada a sus equipos asignados.

#### Contenido mínimo

- OWI del equipo.
- Métricas agregadas del equipo.
- Tendencias del equipo.
- Alertas del equipo.
- Recomendaciones accionables.
- Mensajes de privacidad cuando no exista muestra mínima.

#### Criterios de aceptación

- **Dado** un Manager con equipos asignados, **cuando** abre el dashboard, **entonces** ve únicamente esos equipos.
- **Dado** un equipo con muestra insuficiente, **cuando** el Manager consulta métricas, **entonces** el sistema muestra bloqueo por privacidad.
- **Dado** una recomendación activa, **cuando** el Manager la visualiza, **entonces** puede entender la acción sugerida sin ver respuestas individuales.

### FR-14 — Experiencia de Employee

El sistema **DEBE** brindar una experiencia simple de participación en encuestas.

#### Criterios de aceptación

- **Dado** un Employee con encuesta pendiente, **cuando** entra a la aplicación, **entonces** ve claramente la acción para responder.
- **Dado** un Employee que completó la encuesta, **cuando** vuelve a entrar, **entonces** ve confirmación o estado de participación completada.
- **Dado** un Employee, **cuando** intenta acceder a dashboards de analítica, **entonces** el sistema bloquea el acceso.

### FR-15 — Privacidad por diseño

El sistema **DEBE** proteger la identidad de empleados y evitar exposición de datos sensibles individuales.

#### Reglas

- El sistema **NO DEBE** mostrar respuestas individuales identificables en dashboards.
- El sistema **NO DEBE** emitir diagnósticos médicos, clínicos o psicológicos.
- El sistema **DEBE** mostrar métricas solamente en forma agregada.
- El sistema **DEBE** aplicar muestra mínima antes de mostrar resultados por equipo.
- El sistema **DEBE** comunicar claramente cuando una métrica está oculta por privacidad.

#### Criterios de aceptación

- **Dado** un equipo pequeño, **cuando** un usuario autorizado consulta métricas, **entonces** el sistema oculta resultados para proteger privacidad.
- **Dado** cualquier dashboard, **cuando** se muestran insights, **entonces** están expresados a nivel agregado.
- **Dado** una alerta de riesgo, **cuando** se muestra, **entonces** no identifica empleados específicos.

### FR-16 — Estados vacíos, demo y degradación funcional

El sistema **DEBE** soportar estados de datos incompletos propios de un MVP y mantener una experiencia demostrable.

#### Criterios de aceptación

- **Dado** que no existen datos persistidos, **cuando** se abre el dashboard MVP, **entonces** el sistema puede mostrar datos demo claramente identificables.
- **Dado** una dependencia no configurada en entorno local, **cuando** se consulta una vista no dependiente de esa integración, **entonces** la aplicación debe seguir mostrando contenido disponible.
- **Dado** datos insuficientes para tendencias, **cuando** se consulta el dashboard, **entonces** el sistema muestra un estado inicial en vez de una tendencia falsa.

## 7. Matriz de permisos

| Capacidad | Admin | HR Analyst | Manager | Employee |
| --- | --- | --- | --- | --- |
| Iniciar sesión | Sí | Sí | Sí | Sí |
| Gestionar organización | Sí | No | No | No |
| Gestionar usuarios | Sí | No | No | No |
| Gestionar equipos | Sí | No | No | No |
| Responder encuesta | Opcional si tiene perfil operativo | Opcional si tiene perfil operativo | Opcional si tiene perfil operativo | Sí |
| Ver dashboard organizacional | Sí | Sí | No | No |
| Ver dashboard de equipos asignados | Sí | Sí | Sí | No |
| Ver alertas organizacionales | Sí | Sí | No | No |
| Ver alertas de equipo asignado | Sí | Sí | Sí | No |
| Ver respuestas individuales | No | No | No | No |
| Ver recomendaciones | Sí | Sí | Sí, solo equipo asignado | No |

## 8. Workflows funcionales

### WF-01 — Encuesta a insight

1. Employee accede a una encuesta activa.
2. Employee envía respuestas válidas.
3. El sistema almacena la respuesta asociada a usuario, equipo y organización.
4. El sistema agrega respuestas por equipo.
5. El sistema valida muestra mínima.
6. El sistema calcula OWI y señales agregadas.
7. El sistema detecta riesgos.
8. El sistema genera alertas y recomendaciones.
9. Los dashboards autorizados se actualizan con la información disponible.

### WF-02 — Detección de riesgo

1. El sistema obtiene métricas agregadas válidas.
2. Evalúa reglas de burnout, rotación y tendencias.
3. Clasifica severidad.
4. Crea o actualiza alertas.
5. Vincula recomendaciones.
6. Muestra resultados según permisos.

### WF-03 — Acceso a dashboard

1. Usuario inicia sesión.
2. El sistema identifica rol y alcance de datos.
3. El sistema consulta métricas disponibles.
4. El sistema aplica privacidad y muestra mínima.
5. El sistema renderiza métricas, estados vacíos, alertas y recomendaciones según corresponda.

## 9. Reglas de negocio

| ID | Regla |
| --- | --- |
| BR-01 | Las métricas de bienestar se muestran solamente a nivel agregado. |
| BR-02 | La muestra mínima para mostrar métricas por equipo es 5. |
| BR-03 | La escala de encuesta es 1–5 y todos los campos son obligatorios. |
| BR-04 | PulseWell no realiza diagnósticos médicos, psicológicos ni clínicos. |
| BR-05 | Toda alerta accionable debe tener al menos una recomendación. |
| BR-06 | Managers solo pueden ver equipos explícitamente asignados. |
| BR-07 | HR puede ver información organizacional agregada, no respuestas individuales. |
| BR-08 | El MVP puede usar datos simulados para demostrar analítica predictiva inicial. |
| BR-09 | Las métricas no deben mostrarse cuando falten datos suficientes o válidos. |
| BR-10 | Las recomendaciones deben ser preventivas, no punitivas ni diagnósticas. |

## 10. Validaciones de datos

| Entidad | Validación |
| --- | --- |
| Usuario | Email único, nombre requerido, rol válido, organización requerida. |
| Equipo | Nombre requerido, organización requerida. |
| Respuesta de encuesta | Usuario requerido, equipo requerido, valores enteros entre 1 y 5. |
| Métrica agregada | Equipo requerido, OWI entre 0 y 100, riesgo válido. |
| Alerta | Tipo, severidad, equipo u organización, fecha de generación y recomendación asociada cuando sea accionable. |

## 11. Estados de error y casos borde

| Caso | Comportamiento esperado |
| --- | --- |
| Equipo con menos de 5 participantes o respuestas | Ocultar métricas y explicar que no hay muestra suficiente. |
| Encuesta incompleta | Rechazar envío y marcar campos faltantes. |
| Valor fuera de escala | Rechazar envío y solicitar valor 1–5. |
| Usuario sin equipo | Impedir agregación por equipo hasta que sea asignado. |
| Sin respuestas | Mostrar estado vacío y sugerir recolectar respuestas. |
| Sin histórico | Mostrar métricas actuales sin tendencia comparativa. |
| Rol no autorizado | Bloquear acceso y redirigir a una vista permitida o mostrar error de permisos. |
| Datos demo | Identificar claramente que la información es simulada. |

## 12. Dependencias funcionales

| Dependencia | Uso dentro del MVP |
| --- | --- |
| **Supabase Auth** | Autenticación de usuarios. |
| **PostgreSQL / Supabase** | Persistencia de organizaciones, equipos, usuarios, respuestas y métricas. |
| **Prisma** | Acceso a datos y modelado del dominio persistente. |
| **Next.js App Router** | Vistas, rutas de aplicación y endpoints del backend. |
| **Recharts** | Visualización de métricas y tendencias. |
| **shadcn/ui + Tailwind CSS** | Componentes visuales y sistema de estilos. |
| **Datos simulados** | Demostración de dashboards y capa predictiva durante el MVP. |

## 13. Coherencia con el scaffold actual

El scaffold actual ya contempla una base compatible con esta especificación:

- Roles `admin`, `hr_analyst`, `manager` y `employee` en tipos de aplicación.
- Métricas `energy`, `belonging`, `clarity`, `stress` y `workload`.
- Cálculo inicial de OWI normalizado a 0–100.
- Clasificación inicial de burnout en `low`, `medium` y `high`.
- Dashboard MVP con datos demo.
- Modelo Prisma base para organización, equipo, usuario, respuesta de encuesta y score de bienestar.

Las futuras implementaciones deben expandir esta base sin romper las reglas de privacidad, alcance por rol y muestra mínima definidas en este documento.

## 14. Criterios generales de aceptación del MVP

- Un usuario autenticado accede únicamente a las capacidades permitidas por su rol.
- Un Employee puede completar una encuesta válida una sola vez por ciclo activo.
- Las respuestas se agregan por equipo y organización sin exposición individual.
- El OWI se calcula en escala 0–100 para datos agregados válidos.
- El sistema clasifica burnout con reglas explicables.
- El sistema genera alertas relevantes con severidad y recomendación asociada.
- HR puede ver panorama organizacional agregado.
- Manager puede ver solo sus equipos asignados.
- Los dashboards muestran estados vacíos, demo o privacidad insuficiente cuando corresponda.
- El producto comunica claramente que no realiza diagnósticos clínicos ni evaluación individual.

## 15. Preguntas abiertas para producto

1. ¿Cuál será la duración exacta de un ciclo de encuesta en el MVP: semanal, quincenal o configurable?
2. ¿El Admin también debe poder responder encuestas como empleado o se mantendrá como rol exclusivamente operativo?
3. ¿Qué umbral específico define OWI bajo y caída significativa de tendencia?
4. ¿La muestra mínima debe basarse en empleados elegibles, respuestas recibidas o ambas según el caso?
5. ¿Cómo se asignan Managers a múltiples equipos dentro del MVP?
6. ¿Las alertas deben persistirse históricamente o recalcularse en cada consulta durante la primera versión?
7. ¿Qué textos exactos de disclaimer deben aparecer en dashboards y encuestas?

## 16. Resumen

PulseWell debe comportarse como un MVP de analítica organizacional responsable: captura señales simples de bienestar, calcula métricas agregadas, detecta riesgos tempranos y entrega recomendaciones accionables sin exponer información individual ni prometer diagnósticos clínicos. El valor central del producto está en ayudar a organizaciones y líderes a actuar preventivamente con datos claros, privados y comprensibles.
