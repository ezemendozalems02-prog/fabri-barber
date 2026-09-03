-- Datos iniciales — mismos valores que hoy vive en lib/site-data.ts,
-- para que la base de datos arranque en el mismo estado que la demo.

insert into servicios (id, nombre, descripcion, precio, duracion, dias_disponibles, hora_inicio, hora_fin, orden, nota) values
  ('corte', 'Corte', 'Corte personalizado según tu estilo, tipo de cabello y forma del rostro. Incluye perfilado de cejas.', 14000, 30, '{2,3,4,5,6}', '10:00', '19:00', 1, 'Incluye cejas'),
  ('barba', 'Barba', 'Perfilado y definición de barba para mantener un look prolijo y cuidado.', 4000, 30, '{2,3,4,5,6}', '10:00', '19:00', 2, null),
  ('cejas', 'Cejas', 'Perfilado de cejas para complementar tu corte y definir tu mirada.', 4000, 30, '{2,3,4,5,6}', '10:00', '19:00', 3, null),
  ('claritos', 'Claritos', 'Iluminación y coloración personalizada para darle dimensión y estilo a tu cabello.', 45000, 120, '{2,3,4,5,6}', '10:00', '19:00', 4, null),
  ('global', 'Global', 'Coloración global para un cambio de look completo y personalizado.', 55000, 120, '{2,3,4,5,6}', '10:00', '19:00', 5, null),
  ('radiofrecuencia', 'Radiofrecuencia', 'Tratamiento de radiofrecuencia orientado al cuidado facial masculino.', 15000, 60, '{2,3,4,5}', '10:00', '19:00', 6, 'Martes a viernes')
on conflict (id) do nothing;

insert into productos (id, nombre, descripcion, precio, imagen, stock) values
  ('cera-brillo-coco', 'Cera para Pelo — Brillo Coco', 'Fijación con acabado brillante y aroma a coco.', 12000, '', 20),
  ('cera-brillo-cereza', 'Cera para Pelo — Brillo Cereza', 'Fijación con acabado brillante y aroma a cereza.', 12000, '', 20),
  ('cera-mate-hierba-pura', 'Cera para Pelo — Mate Hierba Pura', 'Fijación con acabado mate natural, a base de hierba pura.', 12000, '', 20)
on conflict (id) do nothing;

insert into barberos (id, nombre, especialidad, estado, comision_tipo, comision_valor) values
  ('fabri', 'Fabri', 'Cortes y color', 'activo', 'porcentaje', 40)
on conflict (id) do nothing;

insert into usuarios (nombre, email, rol, barbero_id) values
  ('Fabri (dueño)', 'admin@fabribarber.com', 'admin', null),
  ('Fabri', 'fabri@fabribarber.com', 'barbero', 'fabri'),
  ('Recepción', 'recepcion@fabribarber.com', 'recepcion', null)
on conflict (email) do nothing;

insert into configuracion (id, nombre, whatsapp, whatsapp_display, instagram, instagram_handle, direccion, horario_general, horario_break, horario_radiofrecuencia, porcentaje_seña, anticipacion_minima_horas, politica_cancelacion, mp_alias, mp_titular) values
  ('default', 'FABRI BARBER', '5491135659873', '+54 9 11 3565-9873', 'https://www.instagram.com/fabrilabanca.03', '@fabrilabanca.03', 'Dirección a definir', 'Martes a Sábados · 10:00 a 19:00 hs', '13:00 a 14:00 hs sin atención', 'Martes a Viernes · 10:00 a 19:00 hs', 30, 0, 'Las condiciones de cancelación y devolución de la seña serán informadas al momento de reservar.', '.fabri', 'Fabrizio Antonio Labanca')
on conflict (id) do nothing;
