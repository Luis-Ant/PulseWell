# PulseWell — Guion de Demo

## Preparación (antes de la demo)

1. Asegurate de tener la base de datos con datos frescos: `bun seed:reset`
2. Iniciá la app: `bun dev` o usá el deploy de Vercel
3. Tené abiertas estas pestañas/ventanas para el flujo:

## Flujo de Demo (7 minutos)

### 1. Landing Page (30 seg)

- Mostrar propuesta de valor: "Convertí señales de bienestar en decisiones inteligentes"
- Destacar el OWI como métrica sintética
- Explicar los 3 pilares: analítica agregada, alertas tempranas, recomendaciones

### 2. Login como HR Analyst (30 seg)

- Credenciales: hr@pulsewell.demo / Demo1234!
- Mostrar que el dashboard carga métricas reales (simuladas)

### 3. Dashboard HR — Narrativa (2 min)

- **OWI Global**: mostrar el score general
- **Equipos**: Engineering en rojo (burnout), Operations en verde (estable)
- **Tendencia**: Engineering cayendo 4 semanas, Customer Success mejorando
- **Alertas**: 8 alertas activas — BURNOUT, ATTRITION, WELLBEING
- **Recomendaciones**: 10 acciones preventivas concretas
- **Proyección**: OWI simulado — "si la tendencia continúa..."

### 4. Dashboard Manager — Vista de equipo (1 min)

- Login como manager-eng@pulsewell.demo
- Mostrar que SOLO ve su equipo (Engineering)
- Métricas, alertas y recomendaciones filtradas

### 5. Encuesta Employee (1 min)

- Login como employee1-eng@pulsewell.demo
- Responder las 5 preguntas (escala 1-5)
- Mostrar confirmación y mensaje de privacidad

### 6. Cierre — Propuesta de valor (1 min)

- "PulseWell no reemplaza al liderazgo humano"
- "Da señales tempranas para actuar mejor"
- Privacidad por diseño: datos agregados, nunca individuales
- Roadmap: NOM-035, integraciones, ML supervisado

## Credenciales Demo

| Rol            | Email                     | Contraseña |
| -------------- | ------------------------- | ---------- |
| Admin          | admin@pulsewell.demo      | Demo1234!  |
| HR Analyst     | hr@pulsewell.demo         | Demo1234!  |
| Manager (Eng)  | manager-eng@pulsewell.demo | Demo1234!  |
| Employee (Eng) | employee1-eng@pulsewell.demo | Demo1234!  |

## Preguntas Frecuentes en Demo

### ¿De dónde vienen los datos?
Son datos simulados diseñados para contar una historia: Engineering con riesgo de burnout, Sales con riesgo de rotación, Operations estable, Customer Success mejorando. En un piloto real, estos datos vendrían de encuestas semanales respondidas por empleados.

### ¿Qué tan preciso es el OWI?
El OWI usa una fórmula ponderada con 5 dimensiones (energía, pertenencia, claridad, estrés, carga). Es una métrica sintética, no una verdad absoluta. Su valor está en detectar tendencias y cambios, no en el número exacto.

### ¿La proyección es real?
No. Es una simulación basada en regresión lineal simple. Está etiquetada como "Simulación" en la UI. Su propósito es mostrar potencial, no predecir el futuro.

### ¿Qué se necesita para un piloto real?
1. 1-3 empresas dispuestas a participar
2. 50-200 empleados
3. 4-8 semanas de encuestas semanales
4. Feedback cualitativo de HR, managers y empleados
