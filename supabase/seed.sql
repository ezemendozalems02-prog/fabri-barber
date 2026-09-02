-- Datos iniciales — mismos valores que hoy vive en lib/site-data.ts,
-- para que la base de datos arranque en el mismo estado que la demo.

insert into servicios (id, nombre, descripcion, precio, duracion, dias_disponibles, hora_inicio, hora_fin, orden) values
  ('corte', 'Corte', 'Corte personalizado según tu estilo, tipo de cabello y forma del rostro. Incluye perfilado de cejas.', 14000, 60, '{2,3,4,5,6}', '10:00', '19:00', 1),
  ('barba', 'Barba', 'Perfilado y definición de barba para mantener un look prolijo y cuidado.', 4000, 30, '{2,3,4,5,6}', '10:00', '19:00', 2),
  ('cejas', 'Cejas', 'Perfilado de cejas para complementar tu corte y definir tu mirada.', 4000, 30, '{2,3,4,5,6}', '10:00', '19:00', 3),
  ('claritos', 'Claritos', 'Iluminación y coloración personalizada para darle dimensión y estilo a tu cabello.', 45000, 120, '{2,3,4,5,6}', '10:00', '19:00', 4),
  ('global', 'Global', 'Coloración global para un cambio de look completo y personalizado.', 55000, 120, '{2,3,4,5,6}', '10:00', '19:00', 5),
  ('radiofrecuencia', 'Radiofrecuencia', 'Tratamiento de radiofrecuencia orientado al cuidado facial masculino.', 15000, 60, '{2,3,4,5}', '10:00', '19:00', 6)
on conflict (id) do nothing;

insert into productos (id, nombre, descripcion, precio, imagen, stock) values
  ('cera-matte', 'Cera Matte', 'Fijación media/alta con acabado mate.', 12000, '', 20),
  ('peine-profesional', 'Peine Profesional', 'Peine profesional para peinar y definir tu estilo.', 8000, '', 20),
  ('pomada-cabello', 'Pomada para Cabello', 'Fijación y brillo controlado para estilos clásicos y modernos.', 15000, '', 20),
  ('aceite-barba', 'Aceite para Barba', 'Aceite para hidratar y mantener la barba suave y prolija.', 13000, '', 20),
  ('shampoo-masculino', 'Shampoo Masculino', 'Shampoo de uso diario para mantener el cabello limpio y saludable.', 11000, '', 20),
  ('cepillo-barba', 'Cepillo para Barba', 'Para ordenar, peinar y mantener la barba en forma.', 9000, '', 20)
on conflict (id) do nothing;

insert into barberos (id, nombre, especialidad, estado, comision_tipo, comision_valor) values
  ('fabri', 'Fabri', 'Cortes y color', 'activo', 'porcentaje', 40)
on conflict (id) do nothing;

insert into usuarios (nombre, email, rol, barbero_id) values
  ('Fabri (dueño)', 'admin@fabribarber.com', 'admin', null),
  ('Fabri', 'fabri@fabribarber.com', 'barbero', 'fabri'),
  ('Recepción', 'recepcion@fabribarber.com', 'recepcion', null)
on conflict (email) do nothing;
