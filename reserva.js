// reserva.js

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
        document.querySelector('.resumen-servicio h4').textContent = servicio;
        document.querySelector('.resumen-servicio .precio').textContent = precio;
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
        precio: document.querySelector('.resumen-servicio .precio').textContent,
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
    
    // Redirigir a confirmación o mostrar mensaje
    alert('¡Reserva confirmada! Te esperamos en Glamour Studio.');
    window.location.href = 'index.html';
});

// Inicializar datos en resumen
document.addEventListener('DOMContentLoaded', function() {
    // Por defecto, seleccionar el primer servicio
    setTimeout(() => {
        const primerServicio = document.querySelector('.group');
        if (primerServicio) {
            primerServicio.click();
        }
    }, 100);
});