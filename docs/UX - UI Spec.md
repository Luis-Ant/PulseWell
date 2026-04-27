# UX / UI Spec

**Producto:** PulseWell  
**Descripción:** Plataforma SaaS de *Organizational Wellbeing Intelligence* para convertir datos agregados de bienestar en insights predictivos y recomendaciones accionables.  
**Alcance:** MVP con datos simulados, dashboards por rol, pulse surveys, alertas, recomendaciones y visualización de tendencias.  
**Stack UI:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui y Recharts.

---

## 1. Propósito del documento

Este documento define la experiencia de usuario, arquitectura de información, navegación, pantallas, componentes, estados, criterios de accesibilidad y criterios de aceptación para el MVP de PulseWell.

Debe servir como guía directa para diseño e implementación frontend. El resultado debe comunicar una idea central:

> PulseWell ayuda a las organizaciones a entender señales tempranas de bienestar de forma agregada, segura y accionable.

La interfaz debe sentirse profesional, minimalista, confiable, moderna y lista para demo ante usuarios, empresas e inversionistas.

---

## 2. Visión UX

PulseWell debe sentirse como un sistema sereno de inteligencia organizacional, no como una herramienta de vigilancia.

Mensaje rector:

> No es una herramienta de monitoreo individual. Es un sistema de alerta temprana para construir equipos más saludables.

La experiencia debe evitar lenguaje clínico, invasivo o punitivo. Debe priorizar claridad, privacidad, prevención y acción.

### 2.1 Narrativa de demo

Cada pantalla clave debe apoyar esta secuencia:

```text
Problema → Señal → Riesgo → Predicción → Recomendación → Valor de negocio
```

---

## 3. Principios de diseño

### 3.1 Claridad sobre densidad

El usuario debe entender el estado general en menos de 30 segundos.

**Evitar:**

- Demasiados gráficos simultáneos.
- Tablas densas sin jerarquía visual.
- Formularios largos.
- Métricas sin explicación.
- Lenguaje técnico innecesario.

**Preferir:**

- Cards con métricas principales.
- Insights breves.
- Badges de estado.
- Tendencias simples.
- Recomendaciones concretas.

### 3.2 Privacidad por diseño

La UI debe reforzar constantemente que PulseWell trabaja con datos agregados.

Reglas de comunicación:

- No mostrar respuestas individuales.
- No sugerir diagnóstico psicológico o médico.
- No usar lenguaje que identifique o etiquete personas.
- Mostrar estados de datos insuficientes cuando no se cumpla el mínimo de respuestas.

Frase base recomendada:

> PulseWell muestra únicamente insights agregados por equipo. Las respuestas individuales nunca se exponen.

### 3.3 Acción sobre observación

Cada alerta o insight relevante debe responder:

1. ¿Qué está ocurriendo?
2. ¿Por qué importa?
3. ¿Qué acción preventiva se recomienda?

### 3.4 Confianza visual

La interfaz debe sentirse premium y sobria. Los efectos visuales deben acompañar la comprensión, no competir con los datos.

---

## 4. Arquitectura de información

### 4.1 Rutas principales

| Ruta | Rol principal | Propósito | MVP |
| --- | --- | --- | --- |
| `/` | Público / demo | Presentar propuesta de valor | Opcional recomendado |
| `/auth/login` | Todos | Acceso y selección demo de rol | Sí |
| `/dashboard/hr` | HR Analyst | Vista global organizacional | Sí |
| `/dashboard/manager` | Manager | Vista del equipo asignado | Sí |
| `/dashboard/admin` | Admin | Gestión básica de demo | Opcional |
| `/survey` | Employee | Responder encuesta pulse semanal | Sí |
| `/dashboard/alerts` | HR / Manager | Lista consolidada de alertas | Futuro / opcional |
| `/dashboard/recommendations` | HR / Manager | Lista consolidada de acciones | Futuro / opcional |

### 4.2 Navegación por rol

| Rol | Ruta inicial | Navegación MVP | Visibilidad de datos |
| --- | --- | --- | --- |
| Admin | `/dashboard/admin` | Admin, Equipos, Usuarios, Logout | Configuración y métricas agregadas |
| HR Analyst | `/dashboard/hr` | Dashboard, Alertas, Recomendaciones, Logout | Organización y equipos agregados |
| Manager | `/dashboard/manager` | Mi equipo, Recomendaciones, Logout | Solo equipo asignado |
| Employee | `/survey` | Encuesta, Logout | Sin analytics |

Para el MVP, las páginas de alertas y recomendaciones pueden estar embebidas dentro de los dashboards. Si existen en navegación, deben reutilizar los mismos componentes y filtros.

### 4.3 Estructura de navegación autenticada

Desktop:

```text
Sidebar
├── Dashboard / Mi equipo
├── Alertas                  (si aplica al rol)
├── Recomendaciones          (si aplica al rol)
├── Encuestas / Estado       (Admin / HR)
└── Logout
```

Mobile:

- Header compacto con nombre de producto.
- Menú tipo drawer o navegación inferior simple.
- Para empleados, priorizar acceso directo a la encuesta.

---

## 5. Sistema visual

### 5.1 Personalidad de marca

PulseWell debe sentirse:

- Inteligente.
- Humano.
- Calmado.
- Preventivo.
- Premium.
- Confiable.

### 5.2 Dirección visual

Interfaz dark minimalista con gradientes suaves, cards de superficie profunda, bordes sutiles, estados cromáticos claros y visualizaciones simples.

El estilo debe ser compatible con shadcn/ui: componentes sobrios, espaciado generoso, `Card`, `Badge`, `Button`, `Tabs`, `Alert`, `Dialog`, `Table`, `Tooltip`, `Skeleton`, `Select`, `Input`, `Progress` y patrones semánticos.

### 5.3 Design tokens sugeridos

Usar tokens semánticos, no colores hardcodeados dentro de componentes. En Tailwind CSS 4, centralizar variables en el tema CSS y mapearlas a los componentes shadcn/ui.

| Token | Uso | Valor orientativo |
| --- | --- | --- |
| `--background` | Fondo principal | Navy / slate profundo |
| `--foreground` | Texto principal | Blanco cálido |
| `--muted` | Superficies secundarias | Slate oscuro |
| `--muted-foreground` | Texto secundario | Gris azulado |
| `--card` | Cards | Superficie oscura elevada |
| `--border` | Bordes | Blanco con baja opacidad |
| `--primary` | Acción principal | Cyan / teal |
| `--secondary` | Acento secundario | Violet suave |
| `--success` | Estado saludable | Emerald |
| `--warning` | Riesgo moderado | Amber |
| `--destructive` | Riesgo crítico / error | Rose |

Clases Tailwind orientativas:

- Fondo: `bg-background`.
- Cards: `bg-card border-border`.
- Texto principal: `text-foreground`.
- Texto auxiliar: `text-muted-foreground`.
- Acciones: `bg-primary text-primary-foreground`.

### 5.4 Tipografía

Fuente recomendada: Geist, Inter o system sans-serif.

| Elemento | Tamaño orientativo | Peso |
| --- | --- | --- |
| Título de página | `text-3xl` / `text-4xl` | Semibold |
| Título de sección | `text-xl` / `text-2xl` | Semibold |
| Título de card | `text-sm` / `text-base` | Medium |
| Métrica principal | `text-3xl` / `text-5xl` | Bold |
| Cuerpo | `text-sm` | Regular |
| Ayuda / disclaimer | `text-xs` | Regular |

---

## 6. Pantallas principales

### 6.1 Landing page

**Ruta:** `/`  
**Estado MVP:** Opcional recomendado para demo.

**Propósito:** Presentar PulseWell como SaaS premium antes de entrar al producto.

**Secciones:**

1. Hero.
2. Problema organizacional.
3. Promesa del producto.
4. Cómo funciona.
5. Privacidad por diseño.
6. Call to action.

**Copy sugerido:**

- Título: `PulseWell`
- Subtítulo: `Organizational Wellbeing Intelligence`
- Mensaje: `Detecta señales de burnout antes de que se conviertan en rotación.`
- CTA principal: `Ver demo`
- CTA secundario: `Conocer cómo funciona`

**Elementos visuales:** fondo dark gradient, línea de pulso abstracta, cards flotantes con métricas simuladas y acentos cyan/violet.

### 6.2 Login

**Ruta:** `/auth/login`  
**Estado MVP:** Requerido.

**Propósito:** Permitir acceso al prototipo y reducir fricción de demo.

**Contenido:**

- Logo / nombre PulseWell.
- Formulario email + password.
- Botones de acceso demo por rol.
- Reaseguro de privacidad.

**Acciones demo recomendadas:**

- `Continuar como HR Analyst`.
- `Continuar como Manager`.
- `Continuar como Employee`.
- `Continuar como Admin` si el dashboard admin está disponible.

**Copy sugerido:**

> Bienvenido a PulseWell. Accede a tu dashboard de inteligencia de bienestar organizacional.

Texto auxiliar:

> Entorno demo con datos simulados y anonimizados.

### 6.3 HR Dashboard

**Ruta:** `/dashboard/hr`  
**Estado MVP:** Requerido.  
**Rol:** HR Analyst.  
**Importancia:** Pantalla principal para demo inversionista.

**Preguntas que debe responder:**

1. ¿Cómo está la organización?
2. ¿Qué equipos requieren atención?
3. ¿Qué tendencia preocupa?
4. ¿Qué acción preventiva conviene tomar?

**Layout desktop:**

```text
Header
├── Organización
├── Periodo actual
└── Badge: Datos simulados / agregados

KPI Cards
├── Global OWI
├── Burnout Risk
├── Attrition Risk
└── Productivity Health

Analytics
├── OWI Trend Chart
├── Team Risk Comparison
└── Risk Distribution

Insights
├── Active Alerts
├── Recommended Interventions
└── Prediction Summary
```

**KPI cards:**

| Card | Ejemplo | Estado |
| --- | --- | --- |
| Global Wellbeing Index | `68 / 100` | Stable, `-4 vs semana anterior` |
| Burnout Risk | `62%` | High, `1 equipo afectado` |
| Attrition Risk | `48%` | Moderate, `driver: pertenencia en descenso` |
| Productivity Health | `71 / 100` | Healthy productivity |

**Alertas embebidas:** cada alerta debe mostrar severidad, equipo, señal detectada, impacto y acción recomendada.

Ejemplo:

> **Indicadores elevados de burnout**  
> Equipo Engineering · Riesgo alto  
> Estrés y carga de trabajo se mantienen elevados por dos semanas consecutivas.  
> **Acción recomendada:** reducir reuniones no esenciales y revisar distribución de carga.

**Predicción:** debe comunicar tendencia, no certeza absoluta.

Copy seguro:

> Si la tendencia actual continúa, Engineering podría entrar en un estado crítico de bienestar la próxima semana.

Evitar:

> Engineering estará en crisis la próxima semana.

### 6.4 Manager Dashboard

**Ruta:** `/dashboard/manager`  
**Estado MVP:** Requerido.  
**Rol:** Manager.

**Preguntas que debe responder:**

1. ¿Cómo está mi equipo?
2. ¿Qué cambió esta semana?
3. ¿Qué puedo hacer ahora?

**Layout:**

```text
Header
├── Nombre del equipo
├── Periodo
└── Nota de privacidad

Team KPI Cards
├── Team OWI
├── Burnout Risk
├── Workload
└── Energy

Trend Chart
Recommendations
Alerts
```

**Diferencia clave vs HR:** el manager no ve comparativas globales innecesarias ni datos de otros equipos. La experiencia debe ser más enfocada y accionable.

**Copy sugerido:**

> Tu equipo muestra señales de aumento en la presión de carga laboral. Considerá reducir reuniones no esenciales y clarificar prioridades esta semana.

### 6.5 Employee Survey

**Ruta:** `/survey`  
**Estado MVP:** Requerido.  
**Rol:** Employee.

**Propósito:** Responder la encuesta pulse semanal de forma rápida, segura y mobile-friendly.

**Requisitos UX:**

- Debe completarse en menos de 1 minuto.
- Escala numérica 1–5.
- Una pregunta por bloque visual o flujo compacto con jerarquía clara.
- Botón de submit persistente al final.
- Privacidad visible antes de responder.
- Validación clara si faltan respuestas.

**Aviso de privacidad previo:**

> Tus respuestas se usan para generar insights agregados por equipo. PulseWell solo muestra métricas cuando hay al menos 5 respuestas y nunca expone respuestas individuales.

**Preguntas MVP:**

| Variable | Pregunta visible | Escala |
| --- | --- | --- |
| Stress | ¿Cómo calificarías tu nivel de estrés esta semana? | 1 = Muy bajo, 5 = Muy alto |
| Energy | ¿Cómo calificarías tu nivel de energía esta semana? | 1 = Muy bajo, 5 = Muy alto |
| Workload | ¿Qué tan pesada se siente tu carga de trabajo esta semana? | 1 = Muy ligera, 5 = Muy pesada |
| Belonging | ¿Qué tan conectado te sientes con tu equipo? | 1 = Nada conectado, 5 = Muy conectado |
| Clarity | ¿Qué tan claras sientes tus prioridades? | 1 = Nada claras, 5 = Muy claras |

**Estado de confirmación:**

> Gracias. Tu respuesta ayuda a construir un entorno de trabajo más saludable.

Texto secundario:

> Tus respuestas individuales no serán mostradas a managers ni a Recursos Humanos.

### 6.6 Admin Dashboard

**Ruta:** `/dashboard/admin`  
**Estado MVP:** Opcional.

**Propósito:** Gestionar datos demo, equipos, usuarios y estado de encuestas sin sobreconstruir.

**Contenido MVP:**

- Lista de equipos.
- Usuarios por equipo.
- Estado de encuesta activa.
- Estado de datos simulados.
- Acción para recalcular métricas.
- Acción para regenerar demo data.

### 6.7 Alerts Page

**Ruta:** `/dashboard/alerts`  
**Estado MVP:** Opcional; preferible embeber en dashboards.

Si se implementa, debe permitir filtrar por severidad, equipo, fecha y estado.

### 6.8 Recommendations Page

**Ruta:** `/dashboard/recommendations`  
**Estado MVP:** Opcional; preferible embeber en dashboards.

Si se implementa, debe agrupar acciones por prioridad, categoría y rol responsable.

---

## 7. Componentes UI

### 7.1 MetricCard

**Propósito:** Mostrar una métrica principal con estado y tendencia.

```ts
type MetricCardProps = {
  title: string
  value: string | number
  subtitle?: string
  status?: "healthy" | "stable" | "moderate" | "high" | "critical"
  trend?: {
    value: number
    direction: "up" | "down" | "flat"
    label: string
  }
}
```

**Comportamiento visual:** número grande, label claro, badge de estado, tendencia con icono y texto. No depender solo del color.

### 7.2 RiskBadge

**Propósito:** Mostrar nivel de riesgo.

| Variante | Uso | Color semántico |
| --- | --- | --- |
| Low | Sin señales relevantes | Success |
| Moderate | Atención preventiva | Warning |
| High | Intervención recomendada | Warning / Destructive suave |
| Critical | Acción prioritaria | Destructive |

### 7.3 AlertCard

```ts
type AlertCardProps = {
  title: string
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  teamName: string
  signal: string
  impact: string
  recommendation: string
  metricValue?: string
  createdAt?: string
}
```

Debe presentar alertas como señales agregadas, no como juicios sobre personas.

### 7.4 RecommendationCard

```ts
type RecommendationCardProps = {
  title: string
  category: "workload" | "energy" | "belonging" | "clarity" | "stress"
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  expectedOutcome?: string
  ownerRole?: "HR" | "Manager" | "Admin"
}
```

Cada recomendación debe ser concreta, realista y accionable durante la semana.

### 7.5 SurveyScale

Usar radio cards o segmented buttons accesibles.

Requisitos:

- Label visible para cada pregunta.
- Estado seleccionado evidente.
- Navegable por teclado.
- Texto de extremos de escala visible.
- Área táctil mínima de 44px en mobile.

### 7.6 PrivacyBanner

Usar en login, survey, dashboards y estados de datos insuficientes.

Copy base:

> PulseWell muestra insights agregados por equipo. Las respuestas individuales nunca se exponen.

---

## 8. Visualización de datos

### 8.1 Principios

- Cada gráfico debe responder una pregunta clara.
- Usar máximo 1–2 colores principales por gráfico.
- Evitar ejes dobles y visualizaciones complejas.
- Incluir labels, tooltips y descripción textual cuando sea necesario.
- No mostrar datos si el equipo no alcanza el umbral mínimo de respuestas.

### 8.2 Charts recomendados

| Caso de uso | Componente Recharts | Pregunta que responde |
| --- | --- | --- |
| OWI en el tiempo | `LineChart` | ¿El bienestar mejora o empeora? |
| Comparación por equipo | `BarChart` | ¿Qué equipo necesita atención? |
| Distribución de riesgo | Progress cards / barras | ¿Cuántos equipos están en cada nivel? |
| Balance de variables | `RadarChart` | ¿Qué dimensión explica el riesgo? |
| Cambio semanal | `AreaChart` | ¿La tendencia se acelera? |

### 8.3 Estados visuales de riesgo

| Estado | Rango orientativo | Tratamiento UX |
| --- | --- | --- |
| Healthy | 80–100 | Mensaje positivo sobrio |
| Stable | 65–79 | Seguimiento normal |
| Moderate | 45–64 | Atención preventiva |
| High | 25–44 | Acción recomendada |
| Critical | 0–24 | Prioridad alta |

Los rangos son orientativos para UI y deben alinearse con la lógica analítica real cuando exista.

---

## 9. Estados de UI

### 9.1 Empty states

| Estado | Copy |
| --- | --- |
| Sin encuestas | `Todavía no hay respuestas de encuesta. Cuando el equipo participe, PulseWell generará insights agregados.` |
| Datos insuficientes | `No hay datos suficientes para proteger la confidencialidad. Se requieren al menos 5 respuestas para mostrar métricas de equipo.` |
| Sin alertas | `No hay alertas activas. El equipo se encuentra dentro de rangos saludables.` |
| Sin recomendaciones | `No hay acciones prioritarias por ahora. Continúa monitoreando la tendencia semanal.` |

### 9.2 Loading states

- Usar `Skeleton` en cards, charts y listas.
- Mantener layout estable para evitar saltos visuales.
- En charts, mostrar skeleton con altura equivalente.

### 9.3 Error states

| Estado | Copy |
| --- | --- |
| Login inválido | `No pudimos iniciar sesión. Revisa tu email y contraseña.` |
| Encuesta ya enviada | `Ya enviaste tu pulse survey de esta semana. Gracias por participar.` |
| Fallo al enviar encuesta | `No pudimos enviar tu respuesta. Intentá nuevamente.` |
| Fallo al cargar dashboard | `No pudimos cargar los insights. Actualizá la página o intentá más tarde.` |

Los errores no deben sugerir pérdida de privacidad ni exponer detalles técnicos.

---

## 10. Accesibilidad

El MVP debe cumplir prácticas básicas de accesibilidad:

- Contraste suficiente en texto, badges y gráficos.
- Navegación completa por teclado.
- Focus states visibles.
- Labels asociados a inputs y radios.
- Botones con nombres accesibles.
- Tooltips no deben contener información crítica exclusiva.
- No comunicar estados solo por color.
- Charts con título, descripción y fallback textual.
- Tamaño táctil mínimo de 44px en mobile.
- Mensajes de error asociados al campo correspondiente.

---

## 11. Responsive behavior

### 11.1 Desktop

Objetivo principal para demo inversionista.

- Grid de 12 columnas.
- KPI cards en 4 columnas.
- Charts en 2 columnas.
- Alertas y recomendaciones como panel lateral o fila secundaria.

### 11.2 Tablet

- KPI cards en 2 columnas.
- Charts apilados.
- Navegación lateral colapsable.

### 11.3 Mobile

Prioridad principal: encuesta de empleado.

- Layout de una columna.
- Cards apiladas.
- Controles grandes.
- Navegación mínima.
- Charts simplificados o resumidos en cards cuando el espacio no permita lectura clara.

---

## 12. Guía de copy y privacidad

### 12.1 Tono

Usar lenguaje claro, calmado, no clínico, no acusatorio y orientado a prevención.

**Evitar:**

- `empleados deprimidos`
- `trabajadores quemados`
- `detección de enfermedades mentales`
- `diagnóstico psicológico`
- `personas problemáticas`

**Usar:**

- `indicadores de riesgo elevado`
- `señales de bienestar`
- `tendencias agregadas por equipo`
- `acción preventiva`
- `salud organizacional`

### 12.2 Copy recomendado de dashboard

- Header: `Resumen de bienestar organizacional`.
- Subtítulo: `Insights agregados por equipo basados en pulse surveys anonimizadas.`
- Alerta: `Indicadores elevados de burnout`.
- Recomendación: `Acción preventiva recomendada`.
- Predicción: `Tendencia proyectada de bienestar`.

---

## 13. Prioridad MVP vs futuro

### 13.1 MVP requerido

1. `/auth/login` con selector demo por rol.
2. `/dashboard/hr` con KPIs, charts, alertas y recomendaciones embebidas.
3. `/dashboard/manager` con vista de equipo y acciones recomendadas.
4. `/survey` con flujo mobile-friendly y confirmación.
5. Estados de privacidad, loading, empty y error.

### 13.2 MVP opcional recomendado

1. `/` landing page para narrativa comercial.
2. `/dashboard/admin` para gestionar demo data.

### 13.3 Fuera de alcance MVP

- Integración real con Slack o Microsoft Teams.
- Análisis de sentimiento con NLP.
- Modelos predictivos de Machine Learning en producción.
- Cumplimiento normativo completo para producción.
- Auditoría avanzada y controles enterprise.

---

## 14. Flujo de demo inversionista

1. **Landing:** mostrar promesa: `Detecta señales de burnout antes de que se conviertan en rotación.`
2. **Login como HR:** usar acceso demo para HR Analyst.
3. **Dashboard global:** destacar Global OWI, comparación por equipo y riesgo.
4. **Identificar señal:** Engineering muestra indicadores elevados de burnout.
5. **Explicar predicción:** si la tendencia continúa, el equipo podría entrar en estado crítico.
6. **Mostrar recomendación:** reducir reuniones no esenciales, redistribuir carga y agendar check-in.
7. **Cerrar valor:** PulseWell convierte señales anónimas de bienestar en inteligencia temprana y accionable.

---

## 15. Criterios de aceptación

La UX/UI del MVP se considera lista cuando:

- Cada rol entiende su propósito y ruta inicial inmediatamente.
- HR identifica equipos de alto riesgo en menos de 10 segundos.
- Manager entiende qué acción tomar esta semana.
- Employee completa la encuesta en menos de 1 minuto desde mobile.
- La privacidad se comunica en login, survey, dashboards y estados de datos insuficientes.
- Ninguna pantalla expone respuestas individuales.
- Los dashboards muestran estados de loading, empty y error.
- Las alertas incluyen señal, impacto y recomendación.
- Las recomendaciones son accionables y están priorizadas.
- Los gráficos responden preguntas concretas y tienen fallback textual accesible.
- La UI usa tokens semánticos compatibles con Tailwind CSS 4 y shadcn/ui.
- El producto sostiene la narrativa de demo: problema, señal, riesgo, predicción, recomendación y valor.

---

## 16. Riesgos UX a controlar

- **Percepción de vigilancia:** mitigar con copy de privacidad y datos agregados.
- **Exceso de métricas:** limitar dashboards a señales decisivas.
- **Predicciones demasiado absolutas:** comunicar tendencias y escenarios, no certezas.
- **Confusión por roles:** rutas, navegación y permisos deben ser explícitos.
- **Charts poco legibles en mobile:** usar resúmenes y cards cuando sea necesario.
- **Confianza reducida por datos simulados:** mostrar badge claro de demo data.

---

## 17. Resumen

PulseWell debe transformar señales agregadas de bienestar en decisiones preventivas. La experiencia debe ser simple, segura y útil: HR ve riesgos organizacionales, managers reciben acciones concretas y empleados responden encuestas rápidas con confianza.

El MVP debe priorizar privacidad, claridad, predicción responsable y recomendaciones accionables por encima de complejidad visual.
