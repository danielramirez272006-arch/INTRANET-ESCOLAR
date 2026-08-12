const VERSION_DATOS = 1;

function ultimasFechasEscolares(cantidad) {
  const fechas = [];
  const dia = new Date(2026, 7, 11);
  while (fechas.length < cantidad) {
    const semana = dia.getDay();
    if (semana !== 0 && semana !== 6) fechas.push(new Date(dia));
    dia.setDate(dia.getDate() - 1);
  }
  return fechas.reverse();
}

function textoFecha(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

const base = {
  usuarios: [
    { id: 1, nombre: "María López", rol: "admin", email: "admin@intranet.edu", activo: true },
    { id: 2, nombre: "Carlos Ríos", rol: "docente", email: "docente@intranet.edu", activo: true, cursoId: 3, materiaId: 1 },
    { id: 3, nombre: "Laura Fernández", rol: "staff", email: "staff@intranet.edu", activo: true },
    { id: 4, nombre: "Ana Torres", rol: "estudiante", email: "estudiante@intranet.edu", activo: true, estudianteId: 1 },
    { id: 5, nombre: "Raquel Torres", rol: "familia", email: "familia@intranet.edu", activo: true, estudianteId: 1 },
    { id: 6, nombre: "Pablo Ortega", rol: "docente", email: "pablo.ortega@intranet.edu", activo: true, cursoId: 3, materiaId: 2 },
    { id: 7, nombre: "Silvia Ramos", rol: "staff", email: "silvia.ramos@intranet.edu", activo: false }
  ],
  cursos: [
    { id: 1, nombre: "1° A" },
    { id: 2, nombre: "1° B" },
    { id: 3, nombre: "2° A" },
    { id: 4, nombre: "2° B" },
    { id: 5, nombre: "3° A" }
  ],
  materias: [
    { id: 1, nombre: "Matemática" },
    { id: 2, nombre: "Lengua y Literatura" },
    { id: 3, nombre: "Ciencias Naturales" },
    { id: 4, nombre: "Ciencias Sociales" },
    { id: 5, nombre: "Inglés" },
    { id: 6, nombre: "Educación Física" }
  ],
  periodos: [
    { id: 1, nombre: "1er Trimestre" },
    { id: 2, nombre: "2do Trimestre" },
    { id: 3, nombre: "3er Trimestre" }
  ],
  estudiantes: [
    { id: 1, nombre: "Ana Torres", cursoId: 3 },
    { id: 2, nombre: "Bruno Pérez", cursoId: 3 },
    { id: 3, nombre: "Carla Gómez", cursoId: 3 },
    { id: 4, nombre: "Diego Sánchez", cursoId: 3 },
    { id: 5, nombre: "Elena Ruiz", cursoId: 3 },
    { id: 6, nombre: "Facundo Medina", cursoId: 3 },
    { id: 7, nombre: "Gabriela Núñez", cursoId: 3 },
    { id: 8, nombre: "Hugo Castro", cursoId: 3 },
    { id: 9, nombre: "Inés Vargas", cursoId: 3 },
    { id: 10, nombre: "Julián Acosta", cursoId: 3 }
  ],
  recursos: [
    { id: 1, nombre: "Aula 101", tipo: "Aula", ubicacion: "Planta baja", capacidad: 30 },
    { id: 2, nombre: "Aula 203", tipo: "Aula", ubicacion: "Primer piso", capacidad: 28 },
    { id: 3, nombre: "Laboratorio de Ciencias", tipo: "Laboratorio", ubicacion: "Primer piso", capacidad: 24 },
    { id: 4, nombre: "Aula de Informática", tipo: "Laboratorio", ubicacion: "Primer piso", capacidad: 20 },
    { id: 5, nombre: "Biblioteca", tipo: "Aula", ubicacion: "Planta baja", capacidad: 40 },
    { id: 6, nombre: "Proyector portátil", tipo: "Equipo", ubicacion: "Secretaría", capacidad: null }
  ],
  comunicados: [
    { id: 1, titulo: "Inicio de clases 2026", cuerpo: "Las clases comienzan el lunes 2 de marzo en el horario habitual. Recuerden llegar con diez minutos de anticipación.", autor: "Dirección", fecha: "2026-03-02", categoria: "General" },
    { id: 2, titulo: "Entrega de boletines del primer trimestre", cuerpo: "Los boletines del primer trimestre se entregarán en las reuniones de padres del día 20 de julio.", autor: "Secretaría", fecha: "2026-07-10", categoria: "Académico" },
    { id: 3, titulo: "Jornada de capacitación docente", cuerpo: "El viernes 14 de agosto no habrá clases por jornada de formación del personal docente.", autor: "Dirección", fecha: "2026-08-05", categoria: "Suspensión" },
    { id: 4, titulo: "Campaña de vacunación", cuerpo: "El centro de salud visitará la escuela el 2 de septiembre para la campaña de vacunación. Se requiere autorización de las familias.", autor: "Secretaría", fecha: "2026-08-10", categoria: "Administrativo" }
  ],
  reservas: [
    { id: 1, recursoId: 4, fecha: "2026-08-14", hora: "09:15-10:45", solicitante: "Carlos Ríos", motivo: "Clase práctica de informática" },
    { id: 2, recursoId: 3, fecha: "2026-08-15", hora: "11:00-12:30", solicitante: "Laura Fernández", motivo: "Taller de ciencias" }
  ],
  calendario: [
    { id: 1, titulo: "Evaluación parcial de Matemática", tipo: "Examen", fecha: "2026-08-18", descripcion: "Unidades 1 y 2 del programa.", destino: "2° A" },
    { id: 2, titulo: "Torneo intercurso de fútbol", tipo: "Actividad", fecha: "2026-08-27", descripcion: "Inscripción abierta hasta el 22 de agosto.", destino: "Todos los cursos" },
    { id: 3, titulo: "Reunión de padres del segundo trimestre", tipo: "Reunión", fecha: "2026-09-10", descripcion: "Se tratará el avance académico y conducta.", destino: "Familias de 1° a 3°" },
    { id: 4, titulo: "Acto por el Día del Estudiante", tipo: "Evento", fecha: "2026-09-18", descripcion: "Actividades recreativas y entrega de distinciones.", destino: "Toda la comunidad" }
  ],
  materiales: [
    { id: 1, materiaId: 1, titulo: "Guía de ejercicios - Álgebra", tipo: "PDF", fecha: "2026-07-20" },
    { id: 2, materiaId: 1, titulo: "Tarea: funciones lineales", tipo: "Tarea", fecha: "2026-07-28", entrega: true, fechaEntrega: "2026-08-22" },
    { id: 3, materiaId: 3, titulo: "Apuntes de química orgánica", tipo: "PDF", fecha: "2026-08-03" },
    { id: 4, materiaId: 5, titulo: "Vocabulario - Unit 3", tipo: "PDF", fecha: "2026-08-06" },
    { id: 5, materiaId: 2, titulo: "Guía de lectura: poesía latinoamericana", tipo: "PDF", fecha: "2026-08-08" }
  ]
};

base.calificaciones = (() => {
  const lista = [];
  let id = 1;
  for (const est of base.estudiantes) {
    for (const mat of base.materias) {
      for (const per of base.periodos) {
        const nota = 5 + ((est.id * 7 + mat.id * 3 + per.id * 5) % 6);
        lista.push({ id: id++, estudianteId: est.id, materiaId: mat.id, periodoId: per.id, nota });
      }
    }
  }
  return lista;
})();

base.asistencia = (() => {
  const lista = [];
  let id = 1;
  const fechas = ultimasFechasEscolares(10);
  for (const est of base.estudiantes) {
    for (const fecha of fechas) {
      const valor = (est.id * 3 + fecha.getDate()) % 7;
      const estado = valor === 0 ? "Ausente" : valor === 1 ? "Justificado" : valor === 2 ? "Tardanza" : "Presente";
      lista.push({ id: id++, estudianteId: est.id, fecha: textoFecha(fecha), estado });
    }
  }
  return lista;
})();

base.horarios = (() => {
  const lista = [];
  let id = 1;
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const bloques = ["07:30-09:00", "09:15-10:45", "11:00-12:30"];
  const docentes = ["Carlos Ríos", "Pablo Ortega", "Marta Suárez", "José Vidal", "Cecilia Pérez", "Lucas Díaz"];
  for (const curso of base.cursos) {
    for (let d = 0; d < dias.length; d++) {
      for (let b = 0; b < bloques.length; b++) {
        const materia = base.materias[(d + b + curso.id) % base.materias.length];
        lista.push({
          id: id++,
          cursoId: curso.id,
          dia: dias[d],
          hora: bloques[b],
          materiaId: materia.id,
          docente: docentes[(materia.id - 1) % docentes.length],
          aula: String(101 + d * 10 + b)
        });
      }
    }
  }
  return lista;
})();

base.entregas = {};

const DATOS_INICIALES = base;
