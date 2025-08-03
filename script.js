// === Variables globales ===
let rolUsuario = ""; // "profesor" o "alumno"
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
let entregas = JSON.parse(localStorage.getItem('entregas')) || [];
let chatMensajes = JSON.parse(localStorage.getItem('chatMensajes')) || [];

// === LOGIN ===
function login() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  const error = document.getElementById('login-error');

  const profesor = { email: "profesor@clase.com", pass: "admin123" };
  const alumno = { email: "alumno@clase.com", pass: "12345" };

  if (email === profesor.email && pass === profesor.pass) {
    rolUsuario = "profesor";
  } else if (email === alumno.email && pass === alumno.pass) {
    rolUsuario = "alumno";
  } else {
    error.textContent = "Correo o contraseña incorrectos";
    return;
  }

  document.getElementById('login-section').style.display = 'none';
  mostrarSeccionesPorRol();
}

// === Cerrar sesión ===
function cerrarSesion() {
  location.reload();
}

// === Mostrar secciones según rol ===
function mostrarSeccionesPorRol() {
  document.getElementById('main-section').style.display = 'block';
  document.getElementById('nombre-usuario').textContent = `Sesión iniciada como: ${rolUsuario.toUpperCase()}`;

  document.getElementById('formulario-tareas').style.display = rolUsuario === 'profesor' ? 'block' : 'none';
  document.getElementById('registro-notas').style.display = rolUsuario === 'profesor' ? 'block' : 'none';
  document.getElementById('registro-entregas').style.display = rolUsuario === 'profesor' ? 'block' : 'none';
  document.getElementById('entrega-tareas').style.display = rolUsuario === 'alumno' ? 'block' : 'none';

  renderizarTareas();
  renderizarCalificaciones();
  renderizarEntregas();
  cargarTareasParaEntrega();
  cargarMensajesChat();
}

// === TAREAS ===
function agregarTarea() {
  const titulo = document.getElementById('titulo').value;
  const fecha = document.getElementById('fecha').value;

  if (!titulo || !fecha) return alert("Completa todos los campos.");

  tareas.push({ titulo, fecha });
  localStorage.setItem('tareas', JSON.stringify(tareas));
  renderizarTareas();

  document.getElementById('titulo').value = "";
  document.getElementById('fecha').value = "";
}

function renderizarTareas() {
  const lista = document.getElementById('lista-tareas');
  lista.innerHTML = "";

  tareas.forEach((tarea, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${tarea.titulo}</strong> - Fecha: ${tarea.fecha}</span>
    `;
    lista.appendChild(li);
  });
}

// === CALIFICACIONES ===
function agregarCalificacion() {
  const nombre = document.getElementById('nombre-estudiante').value;
  const nota = parseInt(document.getElementById('nota').value);

  if (!nombre || isNaN(nota)) return alert("Campos inválidos.");
  if (nota < 0 || nota > 20) return alert("Nota fuera de rango.");

  calificaciones.push({ nombre, nota });
  localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
  renderizarCalificaciones();

  document.getElementById('nombre-estudiante').value = "";
  document.getElementById('nota').value = "";
}

function renderizarCalificaciones() {
  const lista = document.getElementById('lista-calificaciones');
  lista.innerHTML = "";

  calificaciones.forEach(cal => {
    if (rolUsuario === 'profesor' || (rolUsuario === 'alumno' && cal.nombre.toLowerCase() === "alumno")) {
      const li = document.createElement('li');
      li.innerHTML = `<span><strong>${cal.nombre}</strong>: ${cal.nota}</span>`;
      lista.appendChild(li);
    }
  });
}

// === ENTREGA DE TAREAS (Alumno) ===
function cargarTareasParaEntrega() {
  const select = document.getElementById('tarea-entregar');
  if (!select) return;

  select.innerHTML = "";
  tareas.forEach((tarea, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = tarea.titulo;
    select.appendChild(option);
  });
}

function entregarTarea() {
  const tareaIndex = document.getElementById('tarea-entregar').value;
  const archivo = document.getElementById('archivo-tarea').files[0];

  if (!archivo) return alert("Adjunta un archivo.");

  const nombreArchivo = archivo.name;

  entregas.push({
    tarea: tareas[tareaIndex].titulo,
    archivo: nombreArchivo,
    estado: "Entregada",
    estudiante: "alumno"
  });

  localStorage.setItem('entregas', JSON.stringify(entregas));
  renderizarEntregas();
  document.getElementById('archivo-tarea').value = "";
}

// === REGISTRO DE ENTREGAS (Profesor) ===
function renderizarEntregas() {
  const contenedor = document.getElementById('lista-entregas');
  if (!contenedor) return;

  contenedor.innerHTML = "";

  entregas.forEach((ent, index) => {
    const card = document.createElement('div');
    card.className = `card-entrega ${ent.estado.toLowerCase()}`;
    card.innerHTML = `
      <h4>${ent.estudiante} entregó: ${ent.tarea}</h4>
      <p>Archivo: ${ent.archivo}</p>
      <p>Estado: ${ent.estado}</p>
    `;
    contenedor.appendChild(card);
  });
}

// === CHAT ===
function cargarMensajesChat() {
  const mensajes = JSON.parse(localStorage.getItem('chatMensajes')) || [];
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';
  mensajes.forEach(m => mostrarMensajeChat(m.texto, m.rol));
}

function mostrarMensajeChat(texto, rol) {
  const div = document.createElement('div');
  div.className = `mensaje ${rol}`;
  div.textContent = texto;
  document.getElementById('chat-box').appendChild(div);
  document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

function enviarMensajeChat() {
  const input = document.getElementById('mensaje-chat');
  const texto = input.value.trim();
  if (texto === '') return;

  const rol = rolUsuario;
  const nuevoMensaje = { texto, rol };
  const mensajes = JSON.parse(localStorage.getItem('chatMensajes')) || [];
  mensajes.push(nuevoMensaje);
  localStorage.setItem('chatMensajes', JSON.stringify(mensajes));

  mostrarMensajeChat(texto, rol);
  input.value = '';
}
