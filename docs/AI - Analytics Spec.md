# PulseWell — Especificación de Analítica e Inteligencia Predictiva Simulada

## 1. Propósito

Este documento define el núcleo analítico del MVP de **PulseWell**, una plataforma SaaS de *Organizational Wellbeing Intelligence* orientada a convertir respuestas agregadas de encuestas pulse en métricas, alertas preventivas y recomendaciones accionables para Recursos Humanos y managers.

La especificación debe guiar decisiones de producto, diseño, datos e ingeniería. Define entradas, salidas, reglas de cálculo, privacidad, limitaciones, criterios de aceptación y alcance del MVP.

## 2. Alcance

### 2.1 Incluido en el MVP

- Cálculo del **Organizational Wellbeing Index (OWI)** por equipo y período.
- Cálculo de **Burnout Risk Score** por equipo.
- Cálculo de **Attrition Risk Score** por equipo.
- Cálculo de **Productivity Health Score** por equipo.
- Análisis semanal de tendencia.
- Proyección simulada del OWI del siguiente período.
- Generación de alertas por reglas.
- Mapeo de recomendaciones preventivas.
- Dataset simulado para demostración e inversionistas.
- Visualización agregada por rol: HR Analyst, Manager y Employee.

### 2.2 Fuera de alcance para el MVP

- Modelos reales de Machine Learning en producción.
- Diagnósticos médicos, psicológicos o clínicos.
- Evaluación individual de empleados.
- Análisis de mensajes privados, Slack, Microsoft Teams o correo electrónico.
- NLP sobre texto abierto.
- Cumplimiento normativo completo para ambientes productivos.
- Recomendaciones personalizadas a nivel empleado.

## 3. Principios analíticos

### 3.1 Analítica agregada por equipo

PulseWell **DEBE** calcular y mostrar resultados únicamente a nivel de equipo, área u organización. El sistema **NO DEBE** exponer puntajes individuales ni inferir riesgos personales.

Flujo conceptual:

```text
Respuestas individuales → Agregación por equipo → Métricas → Alertas → Recomendaciones
```

### 3.2 Privacidad por diseño

- Un equipo **DEBE** tener al menos `5` respuestas válidas para generar métricas.
- Si `responseCount < 5`, el sistema **NO DEBE** calcular métricas, alertas ni recomendaciones.
- Si no hay datos suficientes, el sistema **DEBE** mostrar: `Datos insuficientes para proteger la confidencialidad.`
- Los dashboards **DEBEN** evitar tablas o visualizaciones que permitan reidentificar respuestas individuales.
- Los identificadores de usuario **DEBEN** tratarse como datos sensibles y no deben usarse en la capa de presentación analítica.

### 3.3 No diagnóstico clínico

PulseWell **NO DEBE** afirmar que una persona o equipo “tiene burnout”.

Redacción prohibida:

> Este equipo tiene burnout.

Redacción permitida:

> Este equipo muestra indicadores elevados asociados con riesgo de burnout.

### 3.4 Explicabilidad primero

Cada métrica y alerta **DEBE** poder responder:

- ¿Qué variables participaron?
- ¿Qué regla o umbral se activó?
- ¿Qué tendencia justificó la alerta?
- ¿Qué recomendación se propone y por qué?

## 4. Definiciones operativas

| Término | Definición |
| --- | --- |
| Período | Ventana semanal de análisis. Para el MVP, `1 período = 1 semana`. |
| Respuesta válida | Encuesta completa con todos los valores requeridos dentro del rango `1..5`. |
| Equipo elegible | Equipo con al menos `5` respuestas válidas en el período analizado. |
| OWI | Índice de bienestar organizacional normalizado de `0` a `100`. |
| Riesgo | Señal organizacional basada en reglas, no probabilidad clínica ni diagnóstico. |
| Tendencia | Diferencia entre el OWI actual y el OWI del período anterior. |
| Proyección | Estimación simulada del próximo OWI usando tendencia histórica simple. |

## 5. Entradas del modelo analítico

### 5.1 Variables requeridas para MVP v1

Todas las respuestas usan escala Likert numérica de `1` a `5`.

| Variable | Nombre | Significado | Escala |
| --- | --- | --- | --- |
| `stress` | Estrés percibido | Presión o tensión percibida. | `1 = Bajo`, `5 = Alto` |
| `energy` | Energía | Motivación, vitalidad y capacidad percibida. | `1 = Baja`, `5 = Alta` |
| `workload` | Carga de trabajo | Percepción de sobrecarga laboral. | `1 = Baja`, `5 = Alta` |
| `belonging` | Pertenencia | Conexión con el equipo y la organización. | `1 = Baja`, `5 = Alta` |
| `clarity` | Claridad de rol | Comprensión de objetivos, prioridades y responsabilidades. | `1 = Baja`, `5 = Alta` |

### 5.2 Variables futuras

| Variable | Nombre | Significado | Escala |
| --- | --- | --- | --- |
| `workLifeBalance` | Balance vida-trabajo | Balance percibido entre trabajo y vida personal. | `1 = Deficiente`, `5 = Fuerte` |

Esta variable **NO FORMA PARTE** del MVP v1 y no debe bloquear la implementación inicial.

### 5.3 Validación de entradas

Cada respuesta **DEBE** cumplir:

```text
1 <= value <= 5
```

Reglas:

- Todas las preguntas requeridas **DEBEN** estar respondidas.
- Valores nulos, vacíos, fuera de rango o no numéricos **DEBEN** invalidar la respuesta completa para analítica.
- Una respuesta incompleta **NO DEBE** contar para `responseCount`.
- Los cálculos **DEBEN** usar únicamente respuestas válidas.

## 6. Salidas analíticas

### 6.1 Objeto de promedios por equipo

```ts
export interface TeamAverages {
  teamId: string
  period: string
  responseCount: number
  avgStress: number
  avgEnergy: number
  avgWorkload: number
  avgBelonging: number
  avgClarity: number
}
```

### 6.2 Objeto de métricas por equipo

```ts
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL"

export type TrendClassification =
  | "STRONG_IMPROVEMENT"
  | "IMPROVEMENT"
  | "STABLE"
  | "DECLINE"
  | "STRONG_DECLINE"

export interface TeamMetrics {
  teamId: string
  period: string
  responseCount: number
  wellbeingIndex: number
  wellbeingStatus: "EXCELLENT" | "STABLE" | "AT_RISK" | "CRITICAL" | "SEVERE"
  burnoutRisk: number
  burnoutRiskLevel: RiskLevel
  attritionRisk: number
  attritionRiskLevel: RiskLevel
  productivityHealth: number
  productivityStatus: string
  trendDelta: number | null
  trendClassification: TrendClassification | null
  projectedNextOWI: number | null
  generatedAt: Date
}
```

### 6.3 Objeto de alerta

```ts
export type AlertType = "BURNOUT" | "ATTRITION" | "WELLBEING" | "TREND" | "PRODUCTIVITY" | "PREDICTIVE"
export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH"

export interface TeamAlert {
  id: string
  teamId: string
  period: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  recommendation: string
  metricValue: number
  drivers: string[]
  createdAt: Date
}
```

## 7. Agregación

Para cada equipo y período, el sistema **DEBE** calcular el promedio de cada variable:

```text
avgStress = sum(stress) / responseCount
avgEnergy = sum(energy) / responseCount
avgWorkload = sum(workload) / responseCount
avgBelonging = sum(belonging) / responseCount
avgClarity = sum(clarity) / responseCount
```

Reglas:

- Los promedios **DEBEN** redondearse a `2` decimales.
- Si un equipo no alcanza `5` respuestas válidas, el resultado analítico **DEBE** ser bloqueado.
- Los cálculos derivados **DEBEN** ejecutarse después de validar elegibilidad.

## 8. Normalización

Como las respuestas van de `1` a `5`, cada variable se normaliza a escala `0..100`.

Variables positivas (`energy`, `belonging`, `clarity`):

```text
normalizedPositive = ((value - 1) / 4) * 100
```

Variables negativas invertidas (`stress`, `workload`):

```text
normalizedNegative = ((5 - value) / 4) * 100
```

Interpretación:

- Menor estrés incrementa bienestar.
- Menor carga incrementa bienestar.
- Mayor energía incrementa bienestar.
- Mayor pertenencia incrementa bienestar.
- Mayor claridad incrementa bienestar.

Todos los puntajes finales **DEBEN** limitarse a `0..100`:

```text
score = max(0, min(100, score))
```

## 9. Organizational Wellbeing Index (OWI)

### 9.1 Propósito

El OWI resume la condición general de bienestar de un equipo en escala `0..100`. Es la métrica principal del dashboard.

### 9.2 Fórmula MVP

```text
OWI =
  (EnergyScore * 0.25) +
  (BelongingScore * 0.20) +
  (ClarityScore * 0.20) +
  (StressScore * 0.20) +
  (WorkloadScore * 0.15)
```

Donde:

- `EnergyScore`: energía normalizada.
- `BelongingScore`: pertenencia normalizada.
- `ClarityScore`: claridad normalizada.
- `StressScore`: estrés invertido normalizado.
- `WorkloadScore`: carga invertida normalizada.

Los pesos suman `1.00`. El OWI final **DEBE** redondearse al entero más cercano para visualización, manteniendo el valor decimal si ingeniería lo requiere para auditoría interna.

### 9.3 Interpretación

| OWI | Estado | Significado |
| --- | --- | --- |
| `80–100` | Excelente | Condición saludable y sostenible. |
| `65–79` | Estable | Buena condición con áreas menores de seguimiento. |
| `50–64` | En riesgo | Señales tempranas de deterioro. |
| `35–49` | Crítico | Múltiples indicadores negativos. |
| `0–34` | Severo | Intervención preventiva prioritaria. |

## 10. Burnout Risk Score

### 10.1 Propósito

Estima qué tan fuertes son las señales organizacionales asociadas con riesgo de burnout. No representa diagnóstico clínico.

### 10.2 Variables usadas

- `avgStress`
- `avgWorkload`
- `avgEnergy`
- `avgClarity`

### 10.3 Reglas de puntaje

| Condición | Puntos |
| --- | ---: |
| `avgStress >= 4.0` | `+30` |
| `avgWorkload >= 4.0` | `+30` |
| `avgEnergy <= 2.5` | `+25` |
| `avgClarity <= 2.5` | `+15` |

```text
BurnoutRisk = stressRisk + workloadRisk + energyRisk + clarityRisk
```

Máximo: `100` puntos.

### 10.4 Interpretación

| Score | Nivel |
| --- | --- |
| `0–24` | Bajo |
| `25–49` | Moderado |
| `50–74` | Alto |
| `75–100` | Crítico |

## 11. Attrition Risk Score

### 11.1 Propósito

Estima señales organizacionales asociadas con desconexión, pérdida de pertenencia y riesgo de rotación. Es una simulación basada en reglas para el MVP.

### 11.2 Variables usadas

- `avgBelonging`
- `avgEnergy`
- `avgWorkload`
- `avgStress`
- Tendencia de OWI

### 11.3 Reglas de puntaje

| Condición | Puntos |
| --- | ---: |
| `avgBelonging <= 2.5` | `+30` |
| `avgEnergy <= 2.5` | `+25` |
| `avgWorkload >= 4.0` | `+20` |
| `avgStress >= 4.0` | `+15` |
| OWI disminuye durante `2` períodos consecutivos | `+10` |

```text
AttritionRisk = belongingRisk + energyRisk + workloadRisk + stressRisk + trendRisk
```

Máximo: `100` puntos.

### 11.4 Interpretación

| Score | Nivel |
| --- | --- |
| `0–24` | Bajo |
| `25–49` | Moderado |
| `50–74` | Alto |
| `75–100` | Crítico |

## 12. Productivity Health Score

### 12.1 Propósito

Conecta bienestar con productividad sostenible sin reducir el bienestar a desempeño individual.

### 12.2 Fórmula MVP

```text
ProductivityHealth =
  (ClarityScore * 0.30) +
  (EnergyScore * 0.30) +
  (WorkloadBalanceScore * 0.25) +
  (BelongingScore * 0.15)
```

Donde `WorkloadBalanceScore = workload` invertido y normalizado.

### 12.3 Interpretación

| Score | Estado |
| --- | --- |
| `80–100` | Productividad altamente sostenible |
| `65–79` | Productividad saludable |
| `50–64` | Productividad bajo presión |
| `35–49` | Riesgo de productividad no sostenible |
| `0–34` | Condición crítica de productividad |

## 13. Tendencias

### 13.1 Definición de período

Para el MVP:

```text
1 período = 1 semana
```

El dataset semilla **DEBE** incluir `4` semanas de datos simulados.

### 13.2 Cálculo

```text
trendDelta = currentOWI - previousOWI
```

Si no existe período anterior elegible, `trendDelta` y `trendClassification` **DEBEN** ser `null`.

### 13.3 Clasificación

| Cambio | Clasificación |
| --- | --- |
| `>= +10` | Mejora fuerte |
| `+3` a `+9.99` | Mejora |
| `-2.99` a `+2.99` | Estable |
| `-3` a `-9.99` | Declive |
| `<= -10` | Declive fuerte |

### 13.4 Regla de declive consecutivo

Si el OWI disminuye durante `2` períodos consecutivos, el sistema **DEBE** generar señal de riesgo por tendencia.

Ejemplo:

```text
Semana 1 OWI: 72
Semana 2 OWI: 65
Semana 3 OWI: 58
Resultado: tendencia negativa consecutiva detectada.
```

## 14. Proyección predictiva simulada

### 14.1 Propósito

La capa predictiva del MVP muestra potencial de producto sin afirmar que existe un modelo de IA entrenado. La proyección es una simulación basada en tendencia lineal simple.

### 14.2 Método

Usar los últimos `3` períodos elegibles:

```text
averageWeeklyChange = ((week2OWI - week1OWI) + (week3OWI - week2OWI)) / 2
projectedNextOWI = currentOWI + averageWeeklyChange
```

Reglas:

- Si existen menos de `3` períodos elegibles, `projectedNextOWI` **DEBE** ser `null`.
- El resultado proyectado **DEBE** limitarse a `0..100`.
- La UI **DEBE** etiquetar esta salida como proyección simulada, no como predicción clínica ni modelo ML.

### 14.3 Interpretación

| OWI proyectado | Estado esperado |
| --- | --- |
| `80–100` | Estado saludable esperado |
| `65–79` | Estado estable esperado |
| `50–64` | Estado de riesgo esperado |
| `35–49` | Estado crítico esperado |
| `0–34` | Estado severo esperado |

### 14.4 Alerta predictiva

Generar alerta predictiva si:

```text
projectedNextOWI < 50
```

Mensaje recomendado:

> Si la tendencia actual continúa, este equipo podría entrar en una condición crítica de bienestar durante el siguiente período.

## 15. Alertas

### 15.1 Tipos y disparadores

| Tipo | Disparador |
| --- | --- |
| `BURNOUT` | `burnoutRisk >= 50` |
| `ATTRITION` | `attritionRisk >= 50` |
| `WELLBEING` | `OWI < 50` |
| `TREND` | OWI disminuye durante `2` períodos consecutivos |
| `PRODUCTIVITY` | `ProductivityHealth < 50` |
| `PREDICTIVE` | `projectedNextOWI < 50` |

### 15.2 Severidad

Para puntajes de riesgo:

| Score | Severidad |
| --- | --- |
| `25–49` | Baja |
| `50–74` | Media |
| `75–100` | Alta |

Para OWI y Productivity Health:

| Score | Severidad |
| --- | --- |
| `50–64` | Baja |
| `35–49` | Media |
| `0–34` | Alta |

Para alertas de tendencia y proyección:

- Declive consecutivo sin estado crítico: severidad `MEDIUM`.
- Declive consecutivo con `OWI < 50`: severidad `HIGH`.
- Proyección `< 50`: severidad `MEDIUM`.
- Proyección `< 35`: severidad `HIGH`.

### 15.3 Priorización

Cuando existan varias alertas para el mismo equipo y período, la UI **DEBE** priorizarlas así:

1. `WELLBEING`
2. `BURNOUT`
3. `ATTRITION`
4. `PRODUCTIVITY`
5. `TREND`
6. `PREDICTIVE`

El sistema **PUEDE** mostrar múltiples alertas, pero **DEBE** evitar mensajes redundantes. Si una recomendación cubre varios riesgos, debe agruparse en una intervención principal.

## 16. Motor de recomendaciones

### 16.1 Principios

Las recomendaciones **DEBEN** ser:

- Prácticas.
- No clínicas.
- Accionables por managers o HR.
- Explicadas a nivel equipo.
- Preventivas, no punitivas.
- Simples de ejecutar.

### 16.2 Mapeo base

| Condición | Recomendación |
| --- | --- |
| Alto estrés + alta carga | Reducir reuniones no esenciales, revisar prioridades y redistribuir carga. |
| Baja energía | Incorporar espacios de recuperación, revisar capacidad y pausar iniciativas no críticas. |
| Baja pertenencia | Reforzar reconocimiento, rituales de equipo e inclusión en decisiones. |
| Baja claridad | Alinear prioridades, objetivos, owners y criterios de éxito semanal. |
| Tendencia negativa | Programar check-in de equipo e identificar bloqueos recurrentes. |
| Alto riesgo de rotación | Revisar drivers de engagement, soporte del liderazgo y carga emocional del equipo. |
| Baja productividad sostenible | Reducir cambio de contexto y clarificar foco semanal. |

### 16.3 Categorías

| Categoría | Descripción |
| --- | --- |
| `WORKLOAD` | Reducir sobrecarga o redistribuir trabajo. |
| `RECOGNITION` | Mejorar pertenencia, motivación y reconocimiento. |
| `CLARITY` | Mejorar comunicación, prioridades y ownership. |
| `RECOVERY` | Favorecer recuperación de energía. |
| `LEADERSHIP` | Promover intervención responsable de managers. |
| `COLLABORATION` | Mejorar dinámicas de equipo. |

## 17. Dashboards y visibilidad por rol

### 17.1 HR Analyst

Puede ver:

- OWI global agregado.
- OWI por equipo elegible.
- Burnout Risk por equipo elegible.
- Attrition Risk por equipo elegible.
- Productivity Health por equipo elegible.
- Tendencia semanal.
- Alertas activas.
- Recomendaciones por equipo.

### 17.2 Manager

Puede ver únicamente equipos asignados:

- OWI del equipo.
- Tendencia del equipo.
- Burnout Risk del equipo.
- Productivity Health del equipo.
- Alertas del equipo.
- Recomendaciones del equipo.

### 17.3 Employee

No puede ver analítica agregada ni individual. Puede ver:

- Encuesta activa.
- Confirmación de envío.
- Aviso de privacidad.

## 18. Estructura recomendada de implementación

El stack esperado del proyecto es **Next.js 15 App Router**, **React 19**, **TypeScript strict**, **Tailwind CSS 4**, **shadcn/ui**, **Supabase/PostgreSQL**, **Prisma 7** con `prisma.config.ts` y **Bun**.

Estructura sugerida:

```text
lib/
└── analytics/
    ├── aggregate-team-data.ts
    ├── normalize-score.ts
    ├── wellbeing-index.ts
    ├── burnout-risk.ts
    ├── attrition-risk.ts
    ├── productivity-health.ts
    ├── trends.ts
    ├── prediction.ts
    └── generate-team-metrics.ts

lib/
└── recommendations/
    ├── recommendation-rules.ts
    └── generate-recommendations.ts

lib/
└── alerts/
    ├── alert-rules.ts
    └── generate-alerts.ts
```

Esta estructura es orientativa. Ingeniería puede ajustarla si mantiene separación entre cálculo puro, persistencia, API y UI.

## 19. Ejemplo de cálculo

### 19.1 Entrada

```text
Equipo: Engineering
Período: Semana 4
Respuestas válidas: 5

avgStress: 4.2
avgEnergy: 2.4
avgWorkload: 4.3
avgBelonging: 3.1
avgClarity: 2.8
```

### 19.2 Scores normalizados

```text
EnergyScore = ((2.4 - 1) / 4) * 100 = 35
BelongingScore = ((3.1 - 1) / 4) * 100 = 52.5
ClarityScore = ((2.8 - 1) / 4) * 100 = 45
StressScore = ((5 - 4.2) / 4) * 100 = 20
WorkloadScore = ((5 - 4.3) / 4) * 100 = 17.5
```

### 19.3 OWI

```text
OWI =
  (35 * 0.25) +
  (52.5 * 0.20) +
  (45 * 0.20) +
  (20 * 0.20) +
  (17.5 * 0.15)

OWI = 34.875
OWI visual = 35
```

Interpretación: condición crítica.

### 19.4 Burnout Risk

```text
Stress >= 4.0      → +30
Workload >= 4.0    → +30
Energy <= 2.5      → +25
Clarity <= 2.5     → +0

BurnoutRisk = 85
```

Interpretación: riesgo crítico.

### 19.5 Alerta generada

```text
Type: BURNOUT
Severity: HIGH
Message: Engineering muestra indicadores elevados asociados con riesgo de burnout, impulsados por alto estrés, alta carga de trabajo y baja energía.
Recommendation: Reducir reuniones no esenciales, revisar distribución de carga y programar un check-in liderado por el manager.
```

## 20. Dataset semilla para demo

El dataset simulado **DEBE** incluir:

- `20` empleados.
- `4` equipos.
- `5` empleados por equipo.
- `4` semanas de respuestas.
- `1` encuesta activa.
- Al menos `3` alertas generadas.
- Al menos `1` equipo mejorando.
- Al menos `1` equipo estable.
- Al menos `1` equipo en declive.
- Al menos `1` equipo en estado de alto riesgo.

Escenarios recomendados:

| Equipo | Escenario |
| --- | --- |
| Engineering | Alta carga y riesgo de burnout. |
| Sales | Pertenencia en declive y riesgo de rotación. |
| Operations | Estado estable con carga moderada. |
| Customer Success | Bienestar en mejora. |

## 21. Requisitos funcionales estilo SDD

### Requirement: Protección de confidencialidad

El sistema **DEBE** bloquear métricas, alertas y recomendaciones cuando un equipo tenga menos de `5` respuestas válidas en el período.

#### Scenario: Equipo con datos suficientes

- GIVEN un equipo con `5` respuestas válidas en una semana
- WHEN se ejecuta la analítica semanal
- THEN el sistema calcula métricas agregadas
- AND puede generar alertas y recomendaciones

#### Scenario: Equipo con datos insuficientes

- GIVEN un equipo con `4` respuestas válidas en una semana
- WHEN se ejecuta la analítica semanal
- THEN el sistema no calcula métricas
- AND muestra `Datos insuficientes para proteger la confidencialidad.`

### Requirement: Cálculo explicable de OWI

El sistema **DEBE** calcular OWI usando las variables y pesos definidos en esta especificación.

#### Scenario: Cálculo con respuestas válidas

- GIVEN promedios válidos de stress, energy, workload, belonging y clarity
- WHEN se calcula el OWI
- THEN el resultado está entre `0` y `100`
- AND conserva los drivers usados para explicar el score

### Requirement: Alertas preventivas

El sistema **DEBE** generar alertas cuando un equipo elegible cruce umbrales definidos.

#### Scenario: Burnout Risk alto

- GIVEN un equipo elegible con `burnoutRisk = 85`
- WHEN se generan alertas del período
- THEN se crea una alerta `BURNOUT` con severidad `HIGH`
- AND la alerta incluye recomendación y drivers

### Requirement: Proyección simulada transparente

El sistema **DEBE** etiquetar la proyección del próximo OWI como simulada y basada en tendencia.

#### Scenario: Tres períodos elegibles

- GIVEN un equipo con `3` semanas elegibles de OWI
- WHEN se calcula la proyección
- THEN el sistema devuelve `projectedNextOWI`
- AND la UI comunica que no es un modelo ML real

#### Scenario: Menos de tres períodos elegibles

- GIVEN un equipo con solo `2` semanas elegibles de OWI
- WHEN se calcula la proyección
- THEN `projectedNextOWI` es `null`
- AND no se genera alerta predictiva

## 22. Criterios de aceptación

El módulo analítico del MVP se considera completo cuando:

- [ ] Valida respuestas obligatorias y rango `1..5`.
- [ ] Excluye respuestas inválidas del cálculo.
- [ ] Bloquea analítica cuando `responseCount < 5`.
- [ ] Calcula promedios por equipo y período.
- [ ] Calcula OWI con la fórmula ponderada definida.
- [ ] Calcula Burnout Risk con umbrales definidos.
- [ ] Calcula Attrition Risk con umbrales definidos.
- [ ] Calcula Productivity Health con fórmula definida.
- [ ] Clasifica tendencias semanales.
- [ ] Detecta declive de `2` períodos consecutivos.
- [ ] Genera proyección simulada cuando hay al menos `3` períodos elegibles.
- [ ] Genera alertas por tipo, severidad, drivers y recomendación.
- [ ] Mantiene visibilidad por rol según esta especificación.
- [ ] Evita exposición individual en UI, API y reportes.
- [ ] Usa lenguaje no clínico en mensajes y recomendaciones.
- [ ] Incluye dataset semilla suficiente para demo.

## 23. Limitaciones conocidas

- Los scores son heurísticos y no deben interpretarse como mediciones científicas validadas.
- Los pesos y umbrales están diseñados para MVP y pueden requerir calibración con datos reales.
- La proyección lineal puede exagerar cambios en datasets pequeños.
- Con equipos de exactamente `5` personas, la privacidad depende también de no mostrar cortes adicionales por subgrupo.
- Los datos simulados pueden demostrar el flujo de producto, pero no prueban precisión predictiva real.

## 24. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Sobreprometer “IA” real | Pérdida de confianza | Nombrar la capa como simulada y basada en reglas. |
| Reidentificación en equipos pequeños | Riesgo de privacidad | Mínimo de `5` respuestas y sin drill-down individual. |
| Interpretación clínica | Uso indebido | Mensajes no clínicos y disclaimer visible. |
| Sesgo por datos simulados | Decisiones incorrectas | Limitar uso a demo y validación de producto. |
| Alert fatigue | Baja adopción | Priorización y agrupación de alertas. |

## 25. Futuras extensiones

Después de validar el MVP, PulseWell puede evolucionar hacia:

- Análisis de sentimiento con NLP sobre respuestas abiertas voluntarias.
- Integración con Slack o Microsoft Teams usando metadata no sensible.
- Modelos predictivos calibrados con datos reales.
- Líneas base personalizadas por organización.
- Detección de anomalías.
- Aprendizaje de recomendaciones según resultados de intervención.
- Módulo de cumplimiento NOM-035.
- Auditoría avanzada, permisos granulares y controles de compliance.

## 26. Narrativa para demo e inversionistas

PulseWell permite contar esta historia:

1. La organización recoge señales breves y periódicas de bienestar.
2. El sistema las agrega de forma segura por equipo.
3. Calcula un índice claro de bienestar organizacional.
4. Detecta riesgos antes de que escalen a problemas de negocio.
5. Proyecta posibles deterioros si la tendencia continúa.
6. Recomienda intervenciones prácticas para liderazgo.
7. Ayuda a tomar decisiones más humanas, preventivas y basadas en datos.

Línea recomendada:

> PulseWell no reemplaza el criterio humano del liderazgo. Funciona como un sistema temprano de señales para cuidar el bienestar organizacional y proteger la productividad sostenible.

## 27. Preguntas abiertas para PRD

- ¿El mínimo de `5` respuestas será configurable por organización en versiones futuras?
- ¿HR Analyst puede ver comparativos entre equipos cuando alguno no alcanza el mínimo de respuestas?
- ¿Qué texto exacto de consentimiento y privacidad verá el empleado antes de responder?
- ¿Cuánto tiempo se conservarán respuestas individuales antes de agregación o anonimización?
- ¿Las alertas se almacenan históricamente o se recalculan bajo demanda?
- ¿Se permitirá que HR cierre, silencie o marque alertas como atendidas?
- ¿Qué nivel de auditoría requiere el MVP para cambios en equipos, roles y permisos?

## 28. Resumen

El motor analítico del MVP de PulseWell se basa en reglas transparentes:

```text
Encuestas pulse
→ Validación
→ Agregación por equipo
→ Normalización
→ Cálculo de métricas
→ Detección de riesgos
→ Proyección simulada
→ Alertas
→ Recomendaciones
```

Su valor no está en complejidad algorítmica prematura, sino en entregar una base clara, explicable y responsable para inteligencia de bienestar organizacional.
