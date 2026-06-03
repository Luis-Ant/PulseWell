# PulseWell — Riesgos y Limitaciones del MVP

## Limitaciones técnicas

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Datos simulados | Las métricas no reflejan datos reales de empleados | Comunicar claramente que es un prototipo demo |
| Supabase free tier | El proyecto se pausa tras ~1 semana de inactividad | Reactivar manualmente antes de cada demo |
| Sin tests E2E | No hay verificación automatizada de flujos completos | Usar QA Checklist manual antes de demos |
| SSL no-verify | Las conexiones a PostgreSQL usan SSL sin verificación de certificado | Aceptable para MVP; hardening post-MVP |
| Sin CI/CD avanzado | No hay pipeline de tests automáticos en Vercel | El build de Vercel ya ejecuta tsc + lint |
| Predicción simulada | La proyección OWI usa regresión lineal simple, no ML real | Etiquetado como "Simulación" en la UI |

## Limitaciones de producto

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Sin multi-tenant | Solo una organización demo | Documentado como límite del MVP |
| Sin notificaciones reales | Las alertas solo se ven en el dashboard | Roadmap post-MVP |
| Sin exportación | No hay PDF ni CSV exportable | Roadmap post-MVP |
| Sin NOM-035 completo | No cumple regulación mexicana | Comunicar como oportunidad futura, no como capacidad actual |
| Sin datos reales | No se probó con empleados reales | Piloto controlado post-MVP |
| Scope creep | Riesgo de querer agregar features antes de validar | Usar este documento como guardrail |

## Riesgos de percepción

| Riesgo | Mitigación |
|--------|------------|
| "Esto es vigilancia laboral" | Enfatizar: datos agregados, anónimos, voluntarios |
| "Esto diagnostica burnout" | Enfatizar: no es diagnóstico clínico, es señal organizacional |
| "La predicción es engañosa" | Etiquetar como simulación, explicar que es regresión lineal |
| "¿Qué tan preciso es?" | Responder: es un prototipo. La precisión requiere datos reales y validación |

## Objeciones frecuentes y respuestas

### "¿Esto no es invasivo?"
> PulseWell nunca muestra datos individuales. Todas las métricas son agregadas por equipo. Se requiere un mínimo de 5 respuestas para mostrar cualquier dato. Es voluntario y anónimo.

### "¿Cómo saben que funciona?"
> El MVP es un prototipo con datos simulados. La validación real requiere un piloto con datos de empleados reales. Lo que mostramos es el potencial del producto.

### "¿Qué pasa con NOM-035?"
> NOM-035 está en el roadmap post-MVP. El producto actual no cumple con la norma, pero la arquitectura está diseñada para incorporarla.

### "¿Esto reemplaza a RRHH?"
> No. PulseWell es una herramienta de apoyo. Da señales tempranas para que RRHH y managers tomen mejores decisiones. No automatiza decisiones ni reemplaza el juicio humano.

### "¿Los empleados van a querer usarlo?"
> La experiencia está diseñada para ser rápida (5 preguntas, 2 minutos) y con privacidad visible. El encuestado ve exactamente qué datos se recopilan y cómo se usan.

---

## Definiciones de éxito del MVP

- [x] Build de producción pasa sin errores
- [x] 75 tests unitarios pasan
- [x] 4 escenarios demo verificados
- [x] TypeScript strict: cero errores
- [x] ESLint: cero warnings
- [ ] QA Checklist manual ejecutado (previo a demo)
- [ ] Demo ensayada con guion (previo a presentación)
