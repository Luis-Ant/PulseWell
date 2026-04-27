# 🧠 PulseWell

> **Organizational Wellbeing Intelligence Platform**  
> Transformamos datos organizacionales en insights predictivos para cuidar el bienestar, anticipar riesgos y tomar mejores decisiones.

---

## 📌 Resumen del proyecto

**PulseWell** es una plataforma SaaS orientada a medir, analizar y predecir el bienestar organizacional a partir de datos agregados. Su objetivo es ayudar a empresas, áreas de Recursos Humanos y líderes de equipo a identificar señales tempranas de **burnout**, desmotivación, sobrecarga laboral y riesgo de rotación antes de que se conviertan en problemas críticos.

Este MVP funciona como un **prototipo de analítica predictiva** basado en datos simulados. Está diseñado para validar la viabilidad técnica del producto, demostrar su potencial de negocio y presentar una propuesta clara de valor ante usuarios, empresas e inversionistas.

---

## 🎯 Propuesta de valor

PulseWell permite convertir señales internas de bienestar en información accionable para la toma de decisiones.

- 📊 **Analítica organizacional en tiempo real** para visualizar el estado general de equipos y áreas.
- 🔍 **Detección temprana de riesgos** relacionados con burnout, desconexión y baja energía.
- ⚡ **Recomendaciones accionables** para líderes y managers.
- 🧩 **Análisis agregado y privacidad primero**, evitando exposición individual innecesaria.
- 📈 **Conexión entre bienestar y desempeño**, mostrando cómo la salud organizacional impacta al negocio.

---

## 🧱 Stack tecnológico

| Área | Tecnologías |
| --- | --- |
| **Frontend** | Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Base de datos y servicios** | Supabase, PostgreSQL, Supabase Auth |
| **Visualización de datos** | Recharts |
| **Deploy y CI/CD** | Vercel, GitHub CI/CD |

---

## 🧩 Arquitectura del sistema

```text
┌──────────────────────────┐
│ Frontend                 │
│ Next.js + React          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ API Routes               │
│ Next.js Backend          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Prisma ORM               │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ PostgreSQL               │
│ Supabase                 │
└──────────────────────────┘
```

---

## 👥 Roles de usuario

| Rol | Capacidades principales |
| --- | --- |
| **Admin** | Control general del sistema, gestión de usuarios, equipos y configuración. |
| **HR Analyst** | Visualización de insights globales, alertas y recomendaciones organizacionales. |
| **Manager** | Monitoreo del bienestar de su equipo y recepción de alertas preventivas. |
| **Employee** | Respuesta a encuestas pulse de manera simple y periódica. |

---

## 📊 Funcionalidades principales del MVP

### 🧠 Wellbeing Analytics

- Cálculo del **Organizational Wellbeing Index (OWI)**.
- Detección de riesgo de burnout.
- Estimación inicial de riesgo de rotación.
- Análisis de tendencias por equipo o área.

### 📋 Pulse Surveys

- Encuestas breves y periódicas.
- Respuestas numéricas en escala de 1 a 5.
- Agregación de resultados a nivel equipo.

### 🚨 Smart Alerts

- Detección de equipos con alto riesgo de burnout.
- Identificación de tendencias de energía en descenso.
- Alertas por umbrales críticos de bienestar.

### 💡 Recommendations Engine

- Recomendaciones automáticas para managers.
- Acciones preventivas según el estado del equipo.
- Priorización de señales relevantes para liderazgo.

---

## 🔐 Privacidad por diseño

PulseWell parte de una premisa clave: el bienestar organizacional debe medirse sin exponer innecesariamente a las personas.

- 🔒 No se muestran datos individuales sensibles.
- 📦 Los resultados se analizan de forma agregada.
- 👥 Se requiere un mínimo de usuarios por equipo para mostrar métricas.
- 🧾 Los identificadores de usuario se manejan de forma anonimizada.
- 🛡️ El MVP no analiza mensajes, conversaciones ni contenido privado.

---

## 📐 Modelo analítico del MVP

### Organizational Wellbeing Index (OWI)

El **OWI** resume el estado de bienestar de un equipo combinando variables positivas y negativas.

```text
OWI = (Energy + Belonging + Clarity) - (Stress + Workload)
```

El resultado se normaliza en una escala de **0 a 100** para facilitar su interpretación.

### Burnout Risk

La detección inicial de riesgo de burnout se basa en reglas simples dentro del MVP.

Se considera un riesgo elevado cuando existe una combinación de:

- Alto estrés.
- Baja energía.
- Alta carga de trabajo.

### Capa predictiva simulada

Para efectos de validación, el MVP incluye una capa predictiva basada en datos sintéticos.

- Detección de riesgos por tendencia.
- Alertas basadas en patrones históricos.
- Estimación de estados futuros con información simulada.

---

## 📁 Estructura del proyecto

```text
pulsewell/
├── app/                  # Next.js App Router
├── components/           # Componentes reutilizables de UI
├── lib/                  # Utilidades, servicios y lógica de negocio
├── prisma/               # Esquema y configuración de base de datos
├── public/               # Assets estáticos
├── styles/               # Estilos globales
├── .env                  # Variables de entorno locales
├── bun.lock              # Lockfile generado por Bun
├── README.md             # Documentación principal del proyecto
└── package.json          # Dependencias y scripts del proyecto
```

---

## ⚙️ Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/your-org/pulsewell.git
cd pulsewell
```

### 2. Instalar dependencias

```bash
bun install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### 4. Ejecutar el servidor de desarrollo

```bash
bun dev
```

### 5. Abrir la aplicación

```text
http://localhost:3000
```

---

## 🚀 Deployment

El despliegue está pensado para ejecutarse automáticamente mediante:

- **Vercel** como plataforma de hosting.
- **GitHub** como repositorio fuente.
- **Auto-deploy** al hacer push sobre la rama principal.

---

## 🧪 Alcance del MVP

### Incluido

- Datos simulados.
- Dashboards por rol.
- Motor básico de analítica.
- Alertas y recomendaciones iniciales.
- Visualización de tendencias organizacionales.

### No incluido todavía

- Integración real con Slack o Microsoft Teams.
- Análisis de sentimiento con NLP.
- Modelos predictivos de Machine Learning en producción.
- Cumplimiento normativo completo para ambientes productivos.

---

## 🗺️ Roadmap futuro

- 🔗 Integración con Slack y Microsoft Teams.
- 🤖 Análisis de sentimiento asistido por IA.
- 📄 Módulo de cumplimiento NOM-035.
- 📊 Modelos avanzados de predicción organizacional.
- 🧠 Algoritmos adaptativos de aprendizaje.
- 🔐 Controles avanzados de seguridad, auditoría y cumplimiento.

---

## ⚠️ Disclaimer

PulseWell es un prototipo MVP creado para validación de producto, demostración técnica y presentación ante potenciales usuarios o inversionistas.

Este sistema:

- No es una herramienta clínica.
- No realiza diagnósticos médicos o psicológicos.
- No debe utilizarse para evaluar la salud mental individual de empleados.

---

## 🌍 Visión

Construir un futuro donde el trabajo no desgaste a las personas, sino que las potencie mediante sistemas inteligentes, decisiones responsables y una cultura organizacional más humana.

---

## 🧑‍💻 Autores

**PulseWell Team**  
Instituto Politécnico Nacional

---

## 📄 Licencia

MIT License
