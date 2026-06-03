# PulseWell — QA Checklist MVP

> Ejecutar antes de cada demo. Marcar ✅ al verificar.

## Preparación

- [ ] Base de datos reseteada: `bun seed:reset`
- [ ] Build de producción exitoso: `bun run build`
- [ ] Tests unitarios pasan: `bun test` (75/75)
- [ ] Escenarios demo verificados: `bun verify:scenarios` (4/4)
- [ ] Deploy en Vercel activo y funcional

## Flujo HR Analyst

- [ ] Login con hr@pulsewell.demo / Demo1234!
- [ ] Redirección a Panel de HR (/hr)
- [ ] OWI Global visible y correcto (~51)
- [ ] 4 métricas visibles: OWI, Equipos, Alertas, OWI Proyectado
- [ ] TeamGrid muestra 4 equipos con risk badges
- [ ] Engineering: OWI 33, badge Burnout (Alto/Crítico)
- [ ] Operations: OWI 73, badge Burnout (Bajo)
- [ ] TrendChart muestra 4 líneas de colores con 4 periodos
- [ ] Alertas: 8 alertas activas ordenadas por severidad
- [ ] Recomendaciones: 10 recomendaciones en grid 2-columnas
- [ ] Resumen ejecutivo visible al inicio
- [ ] Sin datos individuales visibles
- [ ] Logout funcional (redirige a /auth/login)

## Flujo Manager

- [ ] Login con manager-eng@pulsewell.demo / Demo1234!
- [ ] Redirección a Panel de Manager (/manager)
- [ ] Solo ve Engineering (no otros equipos)
- [ ] OWI del equipo visible
- [ ] Risk badges: Burnout, Rotación, Productividad
- [ ] Alertas activas visibles (5 alertas)
- [ ] Recomendaciones visibles
- [ ] TrendChart con línea única (Engineering)
- [ ] Privacy footer visible
- [ ] Logout funcional

## Flujo Employee

- [ ] Login con employee1-eng@pulsewell.demo / Demo1234!
- [ ] Redirección a Encuesta (/survey)
- [ ] 5 preguntas visibles con escala 1-5
- [ ] Botones de radio funcionales
- [ ] Validación: no permite enviar sin completar todas
- [ ] Envío exitoso: confirmación "Gracias por responder"
- [ ] Mensaje de privacidad visible
- [ ] No se muestran resultados ni analytics
- [ ] Si ya respondió este periodo: muestra confirmación (no formulario)

## Flujo Admin

- [ ] Login con admin@pulsewell.demo / Demo1234!
- [ ] Acceso al panel (/admin)
- [ ] Logout funcional

## Seguridad y Privacidad

- [ ] Rutas protegidas redirigen a login si no hay sesión
- [ ] Employee no puede acceder a /hr ni /manager
- [ ] Manager no puede ver otros equipos
- [ ] No se expone userId ni email en ninguna API response
- [ ] Mensajes de privacidad visibles en survey y dashboards

## Estados visuales

- [ ] Loading skeletons visibles durante carga
- [ ] Error boundaries funcionales (con retry)
- [ ] 404 page personalizada (/ruta-inexistente)
- [ ] Estados vacíos positivos (sin alertas, sin recomendaciones)
- [ ] Datos insuficientes: mensaje claro

## Responsive

- [ ] Landing page: legible en mobile (375px)
- [ ] Dashboard HR: columnas se adaptan en mobile
- [ ] Manager dashboard: legible en mobile
- [ ] Survey: formulario usable en mobile

## Demo Flow

- [ ] Guion de demo (DEMO.md) se puede seguir sin intervención técnica
- [ ] Credenciales demo funcionan
- [ ] Seed restaurable: `bun seed:reset` completa sin errores
