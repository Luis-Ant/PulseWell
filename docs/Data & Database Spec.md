# Data & Database Spec

PulseWell — Modelo de datos, persistencia y reglas de privacidad

## 1. Propósito

Este documento define el modelo de datos de PulseWell para el MVP: entidades, relaciones, reglas de agregación, ciclo de vida de datos, criterios de privacidad y lineamientos operativos para PostgreSQL/Supabase con Prisma 7.

Debe servir como referencia para producto, ingeniería, QA y demo. Su alcance está alineado con el README: un SaaS MVP de inteligencia de bienestar organizacional basado en datos simulados, análisis agregado y privacidad por diseño.

## 2. Principios de datos

- **Privacidad primero:** PulseWell no debe exponer respuestas individuales ni usarse para evaluar la salud mental individual de empleados.
- **Agregación por equipo:** los dashboards consumen métricas agregadas, no registros individuales.
- **Umbral mínimo:** no se muestran métricas de un equipo si hay menos de 5 respuestas válidas para el período analizado.
- **MVP con datos sintéticos:** el producto usa datos simulados para validación técnica y narrativa comercial.
- **Trazabilidad suficiente:** cada entidad persistida incluye timestamps para análisis temporal y auditoría básica.
- **Evolución controlada:** los cambios del modelo deben pasar por migraciones Prisma y mantenerse coherentes con este documento.

## 3. Estado actual del esquema Prisma

El esquema vigente está en `prisma/schema.prisma` y usa Prisma 7 con `prisma.config.ts` para resolver `DATABASE_URL`.

Entidades actuales:

| Entidad Prisma | Propósito | Estado MVP |
| --- | --- | --- |
| `Organization` | Representa una empresa o cuenta cliente. | Actual |
| `Team` | Agrupa usuarios dentro de una organización. | Actual |
| `User` | Representa una identidad operativa con rol, organización y equipo opcional. | Actual |
| `SurveyResult` | Guarda respuestas pulse individuales en escala 1–5. | Actual |
| `WellbeingScore` | Guarda resultados agregados por equipo. | Actual |
| `SmartAlert` / `Recommendation` | Alertas y recomendaciones persistidas. | Futuro; el MVP puede calcularlas en runtime o mockearlas desde la capa de aplicación. |

> Decisión de alineación: este documento describe el modelo real de Prisma. Las entidades conceptuales `Survey`, `SurveyResponse`, `Metrics` y `Alert` quedan normalizadas como `SurveyResult`, `WellbeingScore` y, para futuro, `SmartAlert`/`Recommendation`.

## 4. Entidades y campos

### 4.1 Organization

Representa una organización cliente dentro del SaaS.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | `String` | Primary key con `cuid()` |
| `name` | `String` | Requerido |
| `createdAt` | `DateTime` | `now()` |
| `updatedAt` | `DateTime` | `@updatedAt` |

Relaciones:

- Una organización tiene muchos `Team`.
- Una organización tiene muchos `User`.

### 4.2 Team

Representa un equipo, área o grupo organizacional.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | `String` | Primary key con `cuid()` |
| `name` | `String` | Requerido |
| `organizationId` | `String` | Requerido; referencia a `Organization` |
| `createdAt` | `DateTime` | `now()` |
| `updatedAt` | `DateTime` | `@updatedAt` |

Relaciones:

- Pertenece a una `Organization`.
- Tiene muchos `User`.
- Tiene muchos `SurveyResult`.
- Tiene muchos `WellbeingScore`.

Reglas:

- En el MVP, un usuario pertenece como máximo a un equipo.
- Si una organización se elimina, sus equipos se eliminan por cascada.

### 4.3 User

Representa una cuenta o identidad de uso dentro de PulseWell.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | `String` | Primary key con `cuid()` |
| `email` | `String` | Único y requerido |
| `name` | `String` | Requerido para demo y visualización interna |
| `role` | `UserRole` | Default `EMPLOYEE` |
| `organizationId` | `String` | Requerido; referencia a `Organization` |
| `teamId` | `String?` | Opcional; referencia a `Team` |
| `createdAt` | `DateTime` | `now()` |
| `updatedAt` | `DateTime` | `@updatedAt` |

Roles:

| Rol | Uso esperado |
| --- | --- |
| `ADMIN` | Administración general de organización, equipos y usuarios. |
| `HR_ANALYST` | Lectura de insights globales y tendencias organizacionales. |
| `MANAGER` | Lectura de métricas agregadas del equipo asignado. |
| `EMPLOYEE` | Respuesta de encuestas pulse. |

Reglas:

- Si una organización se elimina, sus usuarios se eliminan por cascada.
- Si un equipo se elimina, `teamId` se establece en `null` para preservar la identidad del usuario mientras exista la organización.
- El email identifica de forma única al usuario a nivel global en el MVP.

### 4.4 SurveyResult

Guarda una respuesta pulse individual. Es información sensible y no debe exponerse directamente en dashboards.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | `String` | Primary key con `cuid()` |
| `userId` | `String` | Requerido; referencia a `User` |
| `teamId` | `String` | Requerido; referencia a `Team` al momento de responder |
| `energy` | `Int` | Escala 1–5 |
| `belonging` | `Int` | Escala 1–5 |
| `clarity` | `Int` | Escala 1–5 |
| `stress` | `Int` | Escala 1–5 |
| `workload` | `Int` | Escala 1–5 |
| `createdAt` | `DateTime` | Fecha de respuesta |

Reglas:

- Los valores de encuesta deben estar entre 1 y 5.
- `teamId` se guarda explícitamente para conservar el contexto histórico aunque el usuario cambie de equipo después.
- En el esquema actual no existe entidad `Survey`; por lo tanto, la periodicidad se infiere por `createdAt`.
- La unicidad de una respuesta por usuario/período todavía no está representada en Prisma; debe aplicarse desde la aplicación o agregarse con un campo de período en una migración futura.

### 4.5 WellbeingScore

Guarda métricas agregadas por equipo calculadas a partir de `SurveyResult`.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | `String` | Primary key con `cuid()` |
| `teamId` | `String` | Requerido; referencia a `Team` |
| `owi` | `Int` | Organizational Wellbeing Index normalizado 0–100 |
| `burnoutRisk` | `RiskLevel` | `LOW`, `MEDIUM` o `HIGH` |
| `createdAt` | `DateTime` | Fecha de cálculo |

Reglas:

- Solo debe calcularse cuando el equipo alcance el umbral mínimo de 5 respuestas válidas para el período.
- No debe permitir inferir respuestas individuales.
- El MVP persiste `owi` y `burnoutRisk`; `attritionRisk`, tendencias detalladas y recomendaciones persistidas quedan para alcance futuro.

## 5. Relaciones principales

```text
Organization 1 ── * Team
Organization 1 ── * User
Team         1 ── * User
User         1 ── * SurveyResult
Team         1 ── * SurveyResult
Team         1 ── * WellbeingScore
```

Reglas de integridad:

- `Team.organizationId` debe apuntar a una organización existente.
- `User.organizationId` debe apuntar a una organización existente.
- `User.teamId`, cuando exista, debe apuntar a un equipo existente.
- `SurveyResult.userId` y `SurveyResult.teamId` deben apuntar a entidades existentes.
- `WellbeingScore.teamId` debe apuntar a un equipo existente.

## 6. Reglas de agregación y cálculo

### 6.1 Período de análisis

Para el MVP, el período recomendado de agregación es semanal. Como el esquema actual no tiene un campo `period`, el período debe derivarse de `SurveyResult.createdAt`.

Futuro recomendado: agregar un campo `period` o `weekStartDate` a `SurveyResult` y `WellbeingScore` para soportar consultas, unicidad e índices más precisos.

### 6.2 Cálculo del OWI

El README define el modelo base:

```text
OWI = (Energy + Belonging + Clarity) - (Stress + Workload)
```

Regla MVP:

1. Calcular promedios por equipo y período para cada dimensión.
2. Aplicar la fórmula base con esos promedios.
3. Normalizar el resultado a una escala de 0 a 100.
4. Persistir el resultado como `WellbeingScore.owi`.

### 6.3 Burnout Risk

El riesgo de burnout se calcula con reglas simples para el MVP:

- `HIGH`: estrés alto, workload alto y energía baja de forma combinada.
- `MEDIUM`: señales mixtas o tendencia negativa sin alcanzar umbral crítico.
- `LOW`: indicadores dentro de rangos saludables.

La definición exacta de umbrales pertenece al documento de AI/Analytics, pero la base de datos debe soportar el resultado final mediante `RiskLevel`.

### 6.4 Regla de anonimización por agregación

Un resultado agregado puede mostrarse solo si cumple:

- Mínimo 5 respuestas válidas en el equipo y período.
- Ningún usuario individual domina el conjunto de respuestas.
- La UI no permite navegar desde métricas agregadas hacia respuestas individuales.

Si el equipo no cumple el umbral, la aplicación debe mostrar un estado tipo “datos insuficientes”.

## 7. Ciclo de vida de datos

### 7.1 Ingesta

1. Un `EMPLOYEE` responde una encuesta pulse.
2. La aplicación valida escala 1–5 en cada dimensión.
3. Se crea un `SurveyResult` con `userId`, `teamId` y `createdAt`.

### 7.2 Procesamiento

1. Un proceso de aplicación agrupa resultados por equipo y período.
2. Se valida el umbral mínimo de privacidad.
3. Se calcula `owi` y `burnoutRisk`.
4. Se persiste `WellbeingScore`.

### 7.3 Consumo

1. Dashboards de HR y managers leen `WellbeingScore` por equipo.
2. Alertas y recomendaciones se calculan desde métricas agregadas.
3. No se exponen `SurveyResult` individuales salvo para administración técnica autorizada.

### 7.4 Retención

Regla MVP recomendada:

- `SurveyResult`: conservar datos sintéticos durante la vida del demo o ambiente de validación.
- `WellbeingScore`: conservar histórico agregado para tendencias.
- Ambientes productivos futuros deberán definir políticas explícitas de retención, borrado, exportación y anonimización irreversible.

## 8. Índices, constraints y migraciones

### 8.1 Constraints actuales

- `User.email` es único.
- Las relaciones usan foreign keys administradas por Prisma.
- `Organization`, `Team` y `User` tienen `updatedAt`.

### 8.2 Constraints faltantes recomendadas

- Validación de rango 1–5 en `SurveyResult` mediante lógica de aplicación o constraints SQL.
- Índice compuesto para consultar respuestas por equipo y fecha.
- Índice compuesto para consultar scores por equipo y fecha.
- Campo de período para evitar duplicados semanales por usuario y facilitar agregaciones.

### 8.3 Índices recomendados

Para el MVP, cuando se formalicen migraciones, se recomienda agregar:

- `SurveyResult(teamId, createdAt)` para agregación temporal.
- `SurveyResult(userId, createdAt)` para control de frecuencia de respuesta.
- `WellbeingScore(teamId, createdAt)` para dashboards de tendencias.
- `Team(organizationId)` y `User(organizationId)` para consultas multi-organización.

### 8.4 Migraciones

- Prisma 7 debe usar `prisma.config.ts` como fuente de configuración.
- Las migraciones deben vivir en `prisma/migrations`.
- Actualmente no hay migraciones versionadas en el repositorio; antes de conectar ambientes compartidos se debe generar una migración inicial.
- No se deben hacer cambios manuales en la base de datos sin reflejarlos en Prisma.

## 9. Seed y datos demo

El MVP debe incluir datos suficientes para demostrar tendencias y privacidad agregada.

Dataset recomendado:

| Tipo | Cantidad sugerida |
| --- | --- |
| Organizaciones | 1 organización demo |
| Equipos | 4 equipos |
| Usuarios | 20–32 usuarios |
| Respuestas | 4–6 semanas de datos |
| Scores | 1 score por equipo por semana |

Condiciones del seed:

- Cada equipo de demo debe tener al menos 5 empleados para habilitar métricas agregadas.
- Debe existir al menos un equipo saludable, uno con riesgo medio y uno con riesgo alto.
- Los datos deben ser sintéticos y no representar personas reales.
- El seed aún no existe en el repositorio; debe agregarse cuando se implemente la carga demo.

## 10. Seguridad y privacidad de datos

- Los dashboards no deben consultar respuestas individuales para usuarios finales.
- La API debe filtrar datos por organización y rol.
- Managers solo deben ver equipos autorizados.
- HR/Admin pueden ver agregados organizacionales, no respuestas individuales sensibles.
- Los identificadores de usuario no deben mostrarse en análisis de bienestar.
- El MVP no analiza mensajes, conversaciones, archivos ni contenido privado.

## 11. Alcance MVP vs futuro

### Incluido en el MVP

- Organizaciones, equipos, usuarios y roles básicos.
- Respuestas pulse con cinco dimensiones: energy, belonging, clarity, stress y workload.
- OWI agregado por equipo.
- Burnout risk básico mediante `RiskLevel`.
- Datos sintéticos para demo.
- Privacidad basada en agregación y umbral mínimo.

### Fuera del MVP / futuro

- Entidad formal `Survey` con campañas, preguntas dinámicas y versiones.
- Alertas persistidas (`SmartAlert`).
- Recomendaciones persistidas (`Recommendation`).
- `attritionRisk` persistido.
- Multi-equipo por usuario.
- Integraciones con Slack o Microsoft Teams.
- NLP, análisis de sentimiento y modelos ML productivos.
- Políticas completas de cumplimiento, auditoría y retención productiva.
- Row Level Security avanzada en Supabase.

## 12. Alineación con Prisma: gaps detectados

| Tema | Estado actual | Acción recomendada |
| --- | --- | --- |
| `Organization` | Existe en Prisma, faltaba en el documento anterior. | Documentado como entidad base SaaS. |
| `Survey` | No existe en Prisma. | Mantener fuera del MVP o agregar campaña formal en fase futura. |
| `Alert` | No existe en Prisma. | Calcular/mockear en runtime o crear `SmartAlert` más adelante. |
| `Metrics` | No existe como tal; Prisma usa `WellbeingScore`. | Usar `WellbeingScore` como entidad persistida de métricas. |
| `attritionRisk` | No existe en Prisma. | Mantener como futuro. |
| Unicidad de respuesta por período | No existe. | Agregar `period`/`weekStartDate` antes de producción. |
| Constraints 1–5 | No existen en Prisma. | Validar en aplicación y considerar SQL checks. |
| Índices compuestos | No existen. | Agregarlos al formalizar migraciones. |
| Migraciones | No hay carpeta de migraciones versionada. | Generar migración inicial antes de ambientes compartidos. |

## 13. Requisitos estilo SDD

### Requirement: Persistencia organizacional mínima

El sistema **MUST** persistir organizaciones, equipos, usuarios, respuestas pulse y scores agregados según el esquema Prisma vigente.

#### Scenario: Crear datos base de una organización

- GIVEN una organización demo
- WHEN se cargan equipos y usuarios
- THEN cada usuario queda asociado a una organización
- AND cada usuario puede quedar asociado a un equipo opcional

### Requirement: Captura de respuestas pulse

El sistema **MUST** aceptar solo respuestas con valores entre 1 y 5 para energy, belonging, clarity, stress y workload.

#### Scenario: Respuesta válida

- GIVEN un empleado con equipo asignado
- WHEN envía valores dentro de 1–5
- THEN se persiste un `SurveyResult`
- AND se conserva el `teamId` histórico de la respuesta

#### Scenario: Respuesta inválida

- GIVEN un empleado intenta responder
- WHEN una dimensión está fuera de 1–5
- THEN la respuesta se rechaza
- AND no se persiste un registro parcial

### Requirement: Agregación privada por equipo

El sistema **MUST NOT** mostrar métricas agregadas de equipos con menos de 5 respuestas válidas en el período.

#### Scenario: Equipo con suficientes respuestas

- GIVEN un equipo con 5 o más respuestas válidas
- WHEN se calculan métricas del período
- THEN se genera un `WellbeingScore`
- AND el dashboard puede mostrar OWI y burnout risk

#### Scenario: Equipo con datos insuficientes

- GIVEN un equipo con menos de 5 respuestas válidas
- WHEN el dashboard solicita métricas
- THEN se muestra estado de datos insuficientes
- AND no se exponen respuestas individuales

### Requirement: Dashboard basado en datos agregados

El sistema **SHALL** alimentar dashboards de HR y managers desde `WellbeingScore` y no desde respuestas individuales expuestas a la UI.

#### Scenario: Manager consulta su equipo

- GIVEN un manager autorizado
- WHEN abre el dashboard de equipo
- THEN ve métricas agregadas del equipo
- AND no ve nombres ni respuestas individuales

### Requirement: Evolución por migraciones

El sistema **SHOULD** introducir cambios estructurales mediante migraciones Prisma versionadas.

#### Scenario: Agregar período formal

- GIVEN la necesidad de controlar una respuesta por usuario por semana
- WHEN se agregue `period` o `weekStartDate`
- THEN debe existir una migración Prisma
- AND deben actualizarse índices y reglas de unicidad

## 14. Criterios de aceptación

- El documento refleja las entidades reales de `prisma/schema.prisma`.
- Las diferencias entre modelo actual y modelo futuro están explicitadas.
- Las reglas de privacidad impiden exposición individual en dashboards.
- El umbral mínimo de 5 respuestas queda definido como regla obligatoria.
- La agregación semanal queda definida para el MVP, aunque el campo de período sea una mejora pendiente.
- El seed/demo incluye suficientes usuarios por equipo para mostrar métricas.
- Los gaps de índices, constraints, migraciones, alertas y recomendaciones están identificados.
- El alcance MVP y el alcance futuro quedan separados.

## 15. Preguntas abiertas para producto e ingeniería

1. ¿La organización demo será única durante todo el MVP o se quiere simular multi-tenant desde la UI?
2. ¿La encuesta pulse se ejecutará semanalmente de forma fija o bajo demanda?
3. ¿Se necesita persistir alertas para demo o alcanza con derivarlas desde `WellbeingScore` en runtime?
4. ¿El control de una respuesta por usuario/período debe ser estricto en base de datos o suficiente en aplicación para el MVP?
5. ¿Cuánto histórico sintético debe mostrarse en la demo principal: 4, 6 o más semanas?
6. ¿Qué nivel de acceso técnico tendrá Admin sobre respuestas individuales en ambientes no productivos?

## 16. Resumen ejecutivo

El modelo de datos de PulseWell para el MVP se centra en organizaciones, equipos, usuarios, respuestas pulse y scores agregados. La base de datos debe sostener una narrativa de bienestar organizacional sin exposición individual: se capturan señales sensibles, se agregan por equipo y se muestran solo cuando existe suficiente volumen de respuestas.

La prioridad técnica inmediata es mantener el documento y Prisma alineados, agregar seed demo, formalizar migraciones e introducir índices/constraints antes de cualquier ambiente compartido o productivo.
