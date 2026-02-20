// Variables globales para el calendario
let fechaActual = new Date();
let mesActual = fechaActual.getMonth();
let añoActual = fechaActual.getFullYear();
let diaSeleccionado = null;
let mesSeleccionado = null;
let añoSeleccionado = null;

// Nombres de meses en español
const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Función para generar el calendario
function generarCalendario(mes, año) {
    const primerDiaMes = new Date(año, mes, 1);
    const ultimoDiaMes = new Date(año, mes + 1, 0);
    
    // Ajustar para que la semana empiece en lunes
    let diaSemanaInicio = primerDiaMes.getDay();
    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;
    
    const diasEnMes = ultimoDiaMes.getDate();
    
    // Obtener días del mes anterior
    const diasMesAnterior = [];
    if (diaSemanaInicio > 0) {
        const ultimoDiaMesAnterior = new Date(año, mes, 0).getDate();
        for (let i = diaSemanaInicio - 1; i >= 0; i--) {
            diasMesAnterior.push(ultimoDiaMesAnterior - i);
        }
    }
    
    // Días del mes actual
    const diasMesActual = [];
    for (let i = 1; i <= diasEnMes; i++) {
        diasMesActual.push(i);
    }
    
    return { diasMesAnterior, diasMesActual };
}

// Función para renderizar el calendario
function renderizarCalendario() {
    const calendarioGrid = document.querySelector('.grid-cols-7.gap-2');
    if (!calendarioGrid) return;
    
    const { diasMesAnterior, diasMesActual } = generarCalendario(mesActual, añoActual);
    
    // Limpiar calendario
    calendarioGrid.innerHTML = '';
    
    // Días del mes anterior (grises, no seleccionables)
    diasMesAnterior.forEach(dia => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'h-10 flex items-center justify-center text-stone-300';
        diaDiv.textContent = dia;
        calendarioGrid.appendChild(diaDiv);
    });
    
    // Días del mes actual (seleccionables)
    diasMesActual.forEach(dia => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'h-10 flex items-center justify-center text-stone-800 dark:text-stone-200 cursor-pointer hover:bg-primary/10 rounded';
        diaDiv.textContent = dia;
        
        // Verificar si está seleccionado
        if (diaSeleccionado === dia && mesSeleccionado === mesActual && añoSeleccionado === añoActual) {
            diaDiv.className = 'h-10 flex items-center justify-center bg-primary font-bold text-white rounded shadow-md';
        }
        
        diaDiv.addEventListener('click', function() {
            seleccionarFecha(dia, mesActual, añoActual);
        });
        
        calendarioGrid.appendChild(diaDiv);
    });
    
    // Actualizar título del mes
    const mesTitulo = document.querySelector('.flex.justify-between.items-center.mb-4 .font-bold');
    if (mesTitulo) {
        mesTitulo.textContent = `${nombresMeses[mesActual]} ${añoActual}`;
    }
}

// Función para seleccionar fecha
function seleccionarFecha(dia, mes, año) {
    diaSeleccionado = dia;
    mesSeleccionado = mes;
    añoSeleccionado = año;
    
    renderizarCalendario();
    
    const fecha = new Date(año, mes, dia);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const nombreDia = diasSemana[fecha.getDay()];
    
    document.querySelector('.resumen-fecha').textContent = `${nombreDia}, ${dia} ${nombresMeses[mes]} ${año}`;
    actualizarStepper();
}

// Función para cambiar mes
function cambiarMes(direccion) {
    mesActual += direccion;
    
    if (mesActual < 0) {
        mesActual = 11;
        añoActual -= 1;
    } else if (mesActual > 11) {
        mesActual = 0;
        añoActual += 1;
    }
    
    renderizarCalendario();
}

// Manejar botones de navegación del calendario
document.querySelectorAll('.flex.space-x-2 button').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.querySelector('.material-icons').textContent === 'chevron_left') {
            cambiarMes(-1);
        } else {
            cambiarMes(1);
        }
    });
});

// Función para hacer scroll suave a una sección
function scrollASeccion(selector) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        // Calcular la posición considerando el header y stepper sticky
        const headerHeight = 80; // Altura del header
        const stepperHeight = 80; // Altura aproximada del stepper sticky
        const offset = headerHeight + stepperHeight + 20; // 20px de margen extra
        
        const elementPosition = elemento.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
} 

// Función para actualizar el stepper
function actualizarStepper() {
    // Obtener los elementos del stepper
    const paso1 = document.querySelector('.flex.flex-col.items-center:first-child .w-10.h-10');
    const paso2 = document.querySelector('.flex.flex-col.items-center:nth-child(2) .w-10.h-10');
    const paso3 = document.querySelector('.flex.flex-col.items-center:nth-child(3) .w-10.h-10');
    const paso4 = document.querySelector('.flex.flex-col.items-center:last-child .w-10.h-10');
    
    // Obtener los textos de cada paso
    const textPaso1 = document.querySelector('.flex.flex-col.items-center:first-child span:last-child');
    const textPaso2 = document.querySelector('.flex.flex-col.items-center:nth-child(2) span:last-child');
    const textPaso3 = document.querySelector('.flex.flex-col.items-center:nth-child(3) span:last-child');
    const textPaso4 = document.querySelector('.flex.flex-col.items-center:last-child span:last-child');
    
    // Verificar qué información está completa
    const servicioSeleccionado = document.querySelector('.group.border-2.border-primary') !== null;
    
    const fechaSeleccionada = document.querySelector('.grid-cols-7 div.bg-primary') !== null;
    const horaSeleccionada = document.querySelector('.grid-cols-2 button.bg-primary') !== null;
    const fechaHoraCompleta = fechaSeleccionada && horaSeleccionada;
    
    // Verificar datos del formulario
    const nombreInput = document.querySelector('input[placeholder*="Isabella"]');
    const emailInput = document.querySelector('input[type="email"]');
    const telefonoInput = document.querySelector('input[type="tel"]');
    
    const nombreCompleto = nombreInput && nombreInput.value.trim() !== '';
    const emailCompleto = emailInput && emailInput.value.trim() !== '';
    const telefonoCompleto = telefonoInput && telefonoInput.value.trim() !== '';
    const datosCompletos = nombreCompleto && emailCompleto && telefonoCompleto;
    
    // Actualizar paso 1
    if (servicioSeleccionado) {
        paso1.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20';
        if (textPaso1) textPaso1.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-primary';
    } else {
        paso1.className = 'w-10 h-10 rounded-full bg-white dark:bg-stone-800 border-2 border-primary text-primary flex items-center justify-center font-bold';
        if (textPaso1) textPaso1.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-stone-400';
    }
    
    // Actualizar paso 2
    if (fechaHoraCompleta) {
        paso2.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20';
        if (textPaso2) textPaso2.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-primary';
    } else {
        paso2.className = 'w-10 h-10 rounded-full bg-white dark:bg-stone-800 border-2 border-primary text-primary flex items-center justify-center font-bold';
        if (textPaso2) textPaso2.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-stone-400';
    }
    
    // Actualizar paso 3
    if (datosCompletos) {
        paso3.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20';
        if (textPaso3) textPaso3.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-primary';
    } else {
        paso3.className = 'w-10 h-10 rounded-full bg-white dark:bg-stone-800 border-2 border-primary text-primary flex items-center justify-center font-bold';
        if (textPaso3) textPaso3.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-stone-400';
    }
    
    // Paso 4 siempre pendiente hasta que se envíe el formulario
    paso4.className = 'w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center font-bold';
    if (textPaso4) textPaso4.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-stone-400';
}

// Smooth scroll para enlaces internos (si los hay)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== "#") {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Manejar la selección de servicios
document.querySelectorAll('.group').forEach(card => {
    card.addEventListener('click', function() {
        // Quitar selección de todas las tarjetas
        document.querySelectorAll('.group').forEach(c => {
            c.classList.remove('border-2', 'border-primary');
            c.classList.add('border', 'border-stone-200');
            
            // Quitar el check si existe
            const check = c.querySelector('.absolute.top-4.right-4');
            if (check) check.remove();
        });
        
        // Seleccionar esta tarjeta
        this.classList.remove('border', 'border-stone-200');
        this.classList.add('border-2', 'border-primary');
        
        // Añadir check
        if (!this.querySelector('.absolute.top-4.right-4')) {
            this.innerHTML += `
                <div class="absolute top-4 right-4 text-primary">
                    <span class="material-icons">check_circle</span>
                </div>
            `;
        }
        
        // Actualizar resumen
        const servicio = this.querySelector('h3').textContent;
        const precio = this.querySelector('.font-bold:last-child').textContent;
        const tiempo = this.querySelector('.text-stone-400.text-sm').textContent;
        
        document.querySelector('.resumen-servicio h4').textContent = servicio;
        document.querySelector('.resumen-servicio .precio').textContent = tiempo;
        
        // Actualizar el total en el resumen
        const precioNumerico = parseFloat(precio.replace('Desde $', ''));
        document.querySelector('.flex.justify-between.items-center.mb-8 .text-2xl').textContent = `$${precioNumerico.toFixed(2)}`;
        
        // Actualizar stepper
        actualizarStepper();

         
        // Hacer scroll a la sección de Fecha y Hora
        scrollASeccion('.pt-8.border-t.border-stone-200');
    });
});

// Manejar selección de hora
document.querySelectorAll('.grid-cols-2 button').forEach(btn => {
    if (!btn.classList.contains('cursor-not-allowed')) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.grid-cols-2 button').forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'border-primary');
                b.classList.add('border', 'border-accent-pink', 'bg-accent-pink');
            });
            
            this.classList.add('bg-primary', 'text-white', 'border-primary');
            this.classList.remove('border', 'border-accent-pink', 'bg-accent-pink');
            
            // Actualizar hora en resumen
            document.querySelector('.resumen-hora').textContent = this.textContent;
            
            // Actualizar stepper
            actualizarStepper();
            
            // Verificar si YA TENEMOS AMBOS (fecha Y hora) seleccionados
            const fechaSeleccionada = document.querySelector('.grid-cols-7 div.bg-primary') !== null;
            const horaSeleccionada = true; // Acabamos de seleccionar hora
            
            // Solo hacer scroll si AMBOS están seleccionados
            if (fechaSeleccionada && horaSeleccionada) {
                scrollASeccion('.pt-8.border-t.border-stone-200:nth-of-type(3)'); // Sección de Tus Datos
            }
        });
    }
});

// Manejar selección de fecha
document.querySelectorAll('.grid-cols-7 div[class*="cursor-pointer"]').forEach(dia => {
    dia.addEventListener('click', function() {
        document.querySelectorAll('.grid-cols-7 div[class*="cursor-pointer"]').forEach(d => {
            d.classList.remove('bg-primary', 'text-white', 'shadow-md');
        });
        
        this.classList.add('bg-primary', 'text-white', 'shadow-md');
        
        // Actualizar fecha en resumen
        const fecha = this.textContent.padStart(2, '0');
        document.querySelector('.resumen-fecha').textContent = `Viernes, ${fecha} Octubre 2023`;
        
        // Actualizar stepper
        actualizarStepper();
        
        // Verificar si YA TENEMOS AMBOS (fecha Y hora) seleccionados
        const horaSeleccionada = document.querySelector('.grid-cols-2 button.bg-primary') !== null;
        const fechaSeleccionada = true; // Acabamos de seleccionar fecha
        
        // Solo hacer scroll si AMBOS están seleccionados
        if (fechaSeleccionada && horaSeleccionada) {
            scrollASeccion('.pt-8.border-t.border-stone-200:nth-of-type(3)'); // Sección de Tus Datos
        }
    });
});

// Manejar cambios en los inputs del formulario
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', function() {
        actualizarStepper();
    });
    
    input.addEventListener('change', function() {
        actualizarStepper();
    });
});

// Manejar envío del formulario
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Recoger datos
    const nombre = this.querySelector('input[placeholder*="Isabella"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const telefono = this.querySelector('input[type="tel"]').value;
    const notas = this.querySelector('textarea').value;
    
    if (!nombre || !email || !telefono) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    // Guardar en localStorage
    const reserva = {
        servicio: document.querySelector('.resumen-servicio h4').textContent,
        precio: document.querySelector('.flex.justify-between.items-center.mb-8 .text-2xl').textContent,
        fecha: document.querySelector('.resumen-fecha').textContent,
        hora: document.querySelector('.resumen-hora').textContent,
        nombre,
        email,
        telefono,
        notas,
        fechaReserva: new Date().toISOString()
    };
    
    let reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    
    // Actualizar paso 4 a completado antes de redirigir
    const paso4 = document.querySelector('.flex.flex-col.items-center:last-child .w-10.h-10');
    const textPaso4 = document.querySelector('.flex.flex-col.items-center:last-child span:last-child');
    
    paso4.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20';
    if (textPaso4) textPaso4.className = 'mt-2 text-xs font-bold uppercase tracking-widest text-primary';
    
    // Mostrar mensaje y redirigir
    setTimeout(() => {
        alert('¡Reserva confirmada! Te esperamos en Glamour Studio.');
        window.location.href = 'index.html';
    }, 500);
});

// Inicializar datos en resumen y stepper
document.addEventListener('DOMContentLoaded', function() {
    // Establecer valores por defecto en el resumen
    document.querySelector('.resumen-servicio h4').textContent = 'Ningún servicio seleccionado';
    document.querySelector('.resumen-servicio .precio').textContent = 'Selecciona un servicio';
    document.querySelector('.resumen-fecha').textContent = 'Sin fecha seleccionada';
    document.querySelector('.resumen-hora').textContent = 'Sin hora seleccionada';
    document.querySelector('.flex.justify-between.items-center.mb-8 .text-2xl').textContent = '$0.00';
    
    // Renderizar calendario con mes actual
    renderizarCalendario();
    
    // Quitar selección de hora predeterminada
    document.querySelectorAll('.grid-cols-2 button').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white', 'border-primary');
        btn.classList.add('border', 'border-accent-pink', 'bg-accent-pink');
    });
    
    actualizarStepper();
});
