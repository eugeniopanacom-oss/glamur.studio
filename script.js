// Smooth scroll para todos los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Si el href es solo "#" (vacío), permite el comportamiento por defecto (ir al inicio)
        if (href === "#") {
            // Comportamiento normal - ir al inicio de la página
            console.log('🏠 Navegando al inicio');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            e.preventDefault();
            return;
        }
        
        // Para otros enlaces con hash (como #servicios, #equipo, etc.)
        if (href && href !== "#") {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                console.log(`➡️ Navegando a: ${href}`);
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Función para mostrar notificaciones
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-xl transform transition-all duration-500 translate-x-0 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
            <p class="font-medium">${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
};

// Función para manejar el submit del formulario
function handleSubmit(e) {
    e.preventDefault();
    console.log('Formulario enviado');
    
    const formData = {
        nombre: document.getElementById('nombre')?.value,
        email: document.getElementById('email')?.value,
        telefono: document.getElementById('telefono')?.value,
        servicio: document.getElementById('servicio')?.value,
        fecha: document.getElementById('fecha')?.value,
        hora: document.getElementById('hora')?.value,
        comentarios: document.getElementById('comentarios')?.value
    };
    
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio || !formData.fecha || !formData.hora) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    let reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push({
        ...formData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    });
    localStorage.setItem('reservas', JSON.stringify(reservas));
    
    showNotification('¡Reserva confirmada! Te enviaremos un email con los detalles.');
    e.target.reset();
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOMContentLoaded EJECUTÁNDOSE CORRECTAMENTE');
    console.log('=== INICIALIZANDO ===');
    
    // 1. CONFIGURAR BOTÓN DORADO "RESERVA TU CITA"
    const botonReservaHero = document.querySelector('a.gold-gradient[href="reserva.html"]');
    if (botonReservaHero) {
        console.log('✅ Botón dorado del hero encontrado');
        botonReservaHero.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón dorado clickeado');
            window.location.href = 'reserva.html';
        });
    } else {
        console.log('❌ Botón dorado del hero NO encontrado');
    }
        
    // 2. CONFIGURAR FORMULARIO
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        console.log('✅ Formulario encontrado');
        
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaInput.min = hoy;
        }
        
        bookingForm.removeEventListener('submit', handleSubmit);
        bookingForm.addEventListener('submit', handleSubmit);
        console.log('✅ Evento submit añadido');
    }
    
    // 3. CONFIGURAR MENÚ MÓVIL
    const menuButton = document.querySelector('.md\\:hidden');
    const navMenu = document.querySelector('header ul');
    
    if (menuButton && navMenu) {
        console.log('✅ Menú móvil encontrado');
        
        menuButton.addEventListener('click', function() {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
            navMenu.classList.toggle('flex-col');
            navMenu.classList.toggle('absolute');
            navMenu.classList.toggle('top-20');
            navMenu.classList.toggle('left-0');
            navMenu.classList.toggle('right-0');
            navMenu.classList.toggle('bg-white');
            navMenu.classList.toggle('p-8');
            navMenu.classList.toggle('shadow-lg');
            navMenu.classList.toggle('z-50');
            navMenu.classList.toggle('rounded-2xl');
        });
    } else {
        console.log('❌ Menú móvil NO encontrado');
    }
    
    console.log('=== INICIALIZACIÓN COMPLETA ===');

    // ===== CARRUSEL DE EQUIPO - MOVIMIENTO DE VAIVÉN SIN PAUSA POR MOUSE =====
    console.log('👥 Iniciando carrusel de equipo con movimiento de vaivén continuo');
    
    // Buscar elementos
    const wrapper = document.querySelector('.team-carousel-wrapper');
    const prevBtn = document.querySelector('.team-arrow-prev');
    const nextBtn = document.querySelector('.team-arrow-next');
    const cards = document.querySelectorAll('.team-card');
    
    console.log('📊 VERIFICACIÓN DE ELEMENTOS:');
    console.log('   - Wrapper:', wrapper ? '✅' : '❌');
    console.log('   - Botón anterior:', prevBtn ? '✅' : '❌');
    console.log('   - Botón siguiente:', nextBtn ? '✅' : '❌');
    console.log('   - Tarjetas:', cards.length);
    
    if (wrapper && prevBtn && nextBtn && cards.length > 0) {
        console.log('✅ TODOS LOS ELEMENTOS ENCONTRADOS');
        
        let currentIndex = 0;
        let direction = 1; // 1 para avanzar, -1 para retroceder
        let autoplayInterval;
        let userInteracted = false; // Controla si el usuario usó las flechas
        
        // Función para mover a una tarjeta específica
        function mover(nuevoIndex) {
            // Validar límites
            if (nuevoIndex < 0) nuevoIndex = cards.length - 1;
            if (nuevoIndex >= cards.length) nuevoIndex = 0;
            
            currentIndex = nuevoIndex;
            
            // Obtener la posición LEFT real de la tarjeta destino
            const targetCard = cards[currentIndex];
            const targetPosition = targetCard.offsetLeft;
            
            console.log('🎯 Moviendo a tarjeta:', currentIndex + 1, 'Dirección:', direction === 1 ? '➡️' : '⬅️');
            
            wrapper.scrollTo({
                left: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Función para mover en la dirección actual
        function moverAutomatico() {
            if (!userInteracted) { // Solo se mueve automáticamente si el usuario NO ha usado las flechas
                // Calcular siguiente índice según dirección
                let nextIndex = currentIndex + direction;
                
                // Cambiar dirección si llegamos a los extremos
                if (nextIndex >= cards.length) {
                    nextIndex = cards.length - 2; // Retrocede una desde el final
                    direction = -1; // Cambiar a retroceder
                    console.log('🔄 Cambiando dirección a RETROCEDER');
                } else if (nextIndex < 0) {
                    nextIndex = 1; // Avanza una desde el inicio
                    direction = 1; // Cambiar a avanzar
                    console.log('🔄 Cambiando dirección a AVANZAR');
                }
                
                mover(nextIndex);
            }
        }
        
        // Iniciar autoplay (cada 4 segundos)
        function iniciarAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = setInterval(moverAutomatico, 4000); // 4 segundos
        }
        
        // Detener autoplay
        function detenerAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }
        
        // Eventos para las flechas
        prevBtn.onclick = function(e) {
            e.preventDefault();
            console.log('⬅️ Click en flecha IZQUIERDA - Interacción de usuario - MOVIMIENTO DETENIDO');
            userInteracted = true; // Marcar que el usuario interactuó
            direction = -1; // Establecer dirección a retroceder
            mover(currentIndex - 1);
            detenerAutoplay(); // Detener el movimiento automático PERMANENTEMENTE
        };
        
        nextBtn.onclick = function(e) {
            e.preventDefault();
            console.log('➡️ Click en flecha DERECHA - Interacción de usuario - MOVIMIENTO DETENIDO');
            userInteracted = true; // Marcar que el usuario interactuó
            direction = 1; // Establecer dirección a avanzar
            mover(currentIndex + 1);
            detenerAutoplay(); // Detener el movimiento automático PERMANENTEMENTE
        };
        
        // ELIMINADO: Eventos de mouseenter y mouseleave - el movimiento continúa siempre
        
        console.log('✅ Eventos asignados correctamente');
        
        // Mostrar primera tarjeta y iniciar autoplay
        setTimeout(() => {
            mover(0);
            iniciarAutoplay();
        }, 100);
        
    } else {
        console.log('❌ ERROR: No se encontraron todos los elementos del carrusel');
    }

    // ===== CARRUSEL DE SERVICIOS - MOVIMIENTO DE VAIVÉN =====
console.log('💇 Iniciando carrusel de servicios con movimiento de vaivén');

// Buscar elementos del carrusel de servicios
const servicesWrapper = document.querySelector('.services-carousel-wrapper');
const servicesPrevBtn = document.querySelector('.carousel-arrow-prev');
const servicesNextBtn = document.querySelector('.carousel-arrow-next');
const serviceCards = document.querySelectorAll('.service-card');

console.log('📊 VERIFICACIÓN DE ELEMENTOS DE SERVICIOS:');
console.log('   - Wrapper:', servicesWrapper ? '✅' : '❌');
console.log('   - Botón anterior:', servicesPrevBtn ? '✅' : '❌');
console.log('   - Botón siguiente:', servicesNextBtn ? '✅' : '❌');
console.log('   - Tarjetas:', serviceCards.length);

if (servicesWrapper && servicesPrevBtn && servicesNextBtn && serviceCards.length > 0) {
    console.log('✅ TODOS LOS ELEMENTOS DE SERVICIOS ENCONTRADOS');
    
    let servicesCurrentIndex = 0;
    let servicesDirection = 1; // 1 para avanzar, -1 para retroceder
    let servicesAutoplayInterval;
    let servicesUserInteracted = false; // Controla si el usuario usó las flechas
    
    // Función para mover a una tarjeta específica
    function moverServicios(nuevoIndex) {
        // Validar límites
        if (nuevoIndex < 0) nuevoIndex = serviceCards.length - 1;
        if (nuevoIndex >= serviceCards.length) nuevoIndex = 0;
        
        servicesCurrentIndex = nuevoIndex;
        
        // Obtener la posición LEFT real de la tarjeta destino
        const targetCard = serviceCards[servicesCurrentIndex];
        const targetPosition = targetCard.offsetLeft;
        
        console.log('🎯 Servicio:', servicesCurrentIndex + 1, 'Dirección:', servicesDirection === 1 ? '➡️' : '⬅️');
        
        servicesWrapper.scrollTo({
            left: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Función para mover en la dirección actual
    function moverServiciosAutomatico() {
        if (!servicesUserInteracted) { // Solo se mueve automáticamente si el usuario NO ha usado las flechas
            // Calcular siguiente índice según dirección
            let nextIndex = servicesCurrentIndex + servicesDirection;
            
            // Cambiar dirección si llegamos a los extremos
            if (nextIndex >= serviceCards.length) {
                nextIndex = serviceCards.length - 2; // Retrocede una desde el final
                servicesDirection = -1; // Cambiar a retroceder
                console.log('🔄 Servicios: Cambiando dirección a RETROCEDER');
            } else if (nextIndex < 0) {
                nextIndex = 1; // Avanza una desde el inicio
                servicesDirection = 1; // Cambiar a avanzar
                console.log('🔄 Servicios: Cambiando dirección a AVANZAR');
            }
            
            moverServicios(nextIndex);
        }
    }
    
    // Iniciar autoplay (cada 4 segundos)
    function iniciarServiciosAutoplay() {
        if (servicesAutoplayInterval) clearInterval(servicesAutoplayInterval);
        servicesAutoplayInterval = setInterval(moverServiciosAutomatico, 4000); // 4 segundos
    }
    
    // Detener autoplay
    function detenerServiciosAutoplay() {
        if (servicesAutoplayInterval) {
            clearInterval(servicesAutoplayInterval);
            servicesAutoplayInterval = null;
        }
    }
    
    // Eventos para las flechas
    servicesPrevBtn.onclick = function(e) {
        e.preventDefault();
        console.log('⬅️ Click en flecha IZQUIERDA de SERVICIOS - Interacción de usuario');
        servicesUserInteracted = true; // Marcar que el usuario interactuó
        servicesDirection = -1; // Establecer dirección a retroceder
        moverServicios(servicesCurrentIndex - 1);
        detenerServiciosAutoplay(); // Detener el movimiento automático PERMANENTEMENTE
    };
    
    servicesNextBtn.onclick = function(e) {
        e.preventDefault();
        console.log('➡️ Click en flecha DERECHA de SERVICIOS - Interacción de usuario');
        servicesUserInteracted = true; // Marcar que el usuario interactuó
        servicesDirection = 1; // Establecer dirección a avanzar
        moverServicios(servicesCurrentIndex + 1);
        detenerServiciosAutoplay(); // Detener el movimiento automático PERMANENTEMENTE
    };
    
    console.log('✅ Eventos de servicios asignados correctamente');
    
    // Mostrar primera tarjeta y iniciar autoplay
    setTimeout(() => {
        moverServicios(0);
        iniciarServiciosAutoplay();
    }, 100);
    
} else {
    console.log('❌ ERROR: No se encontraron todos los elementos del carrusel de servicios');
}

// ===== CARRUSEL DE TRABAJOS - MOVIMIENTO DE VAIVÉN =====
console.log('🖼️ Iniciando carrusel de trabajos con movimiento de vaivén');

// Buscar elementos del carrusel de trabajos
const worksWrapper = document.querySelector('.works-carousel-wrapper');
const worksPrevBtn = document.querySelector('.works-arrow-prev');
const worksNextBtn = document.querySelector('.works-arrow-next');
const workCards = document.querySelectorAll('.work-card');

console.log('📊 VERIFICACIÓN DE ELEMENTOS DE TRABAJOS:');
console.log('   - Wrapper:', worksWrapper ? '✅' : '❌');
console.log('   - Botón anterior:', worksPrevBtn ? '✅' : '❌');
console.log('   - Botón siguiente:', worksNextBtn ? '✅' : '❌');
console.log('   - Tarjetas:', workCards.length);

if (worksWrapper && worksPrevBtn && worksNextBtn && workCards.length > 0) {
    console.log('✅ TODOS LOS ELEMENTOS DE TRABAJOS ENCONTRADOS');
    
    let worksCurrentIndex = 0;
    let worksDirection = 1; // 1 para avanzar, -1 para retroceder
    let worksAutoplayInterval;
    let worksUserInteracted = false; // Controla si el usuario usó las flechas
    
    // Función para mover a una tarjeta específica
    function moverTrabajos(nuevoIndex) {
        // Validar límites
        if (nuevoIndex < 0) nuevoIndex = workCards.length - 1;
        if (nuevoIndex >= workCards.length) nuevoIndex = 0;
        
        worksCurrentIndex = nuevoIndex;
        
        // Obtener la posición LEFT real de la tarjeta destino
        const targetCard = workCards[worksCurrentIndex];
        const targetPosition = targetCard.offsetLeft;
        
        console.log('🎯 Trabajo:', worksCurrentIndex + 1, 'Dirección:', worksDirection === 1 ? '➡️' : '⬅️');
        
        worksWrapper.scrollTo({
            left: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Función para mover en la dirección actual
    function moverTrabajosAutomatico() {
        if (!worksUserInteracted) { // Solo se mueve automáticamente si el usuario NO ha usado las flechas
            // Calcular siguiente índice según dirección
            let nextIndex = worksCurrentIndex + worksDirection;
            
            // Cambiar dirección si llegamos a los extremos
            if (nextIndex >= workCards.length) {
                nextIndex = workCards.length - 2; // Retrocede una desde el final
                worksDirection = -1; // Cambiar a retroceder
                console.log('🔄 Trabajos: Cambiando dirección a RETROCEDER');
            } else if (nextIndex < 0) {
                nextIndex = 1; // Avanza una desde el inicio
                worksDirection = 1; // Cambiar a avanzar
                console.log('🔄 Trabajos: Cambiando dirección a AVANZAR');
            }
            
            moverTrabajos(nextIndex);
        }
    }
    
    // Iniciar autoplay (cada 4 segundos)
    function iniciarTrabajosAutoplay() {
        if (worksAutoplayInterval) clearInterval(worksAutoplayInterval);
        worksAutoplayInterval = setInterval(moverTrabajosAutomatico, 4000); // 4 segundos
    }
    
    // Detener autoplay
    function detenerTrabajosAutoplay() {
        if (worksAutoplayInterval) {
            clearInterval(worksAutoplayInterval);
            worksAutoplayInterval = null;
        }
    }
    
    // Eventos para las flechas
    worksPrevBtn.onclick = function(e) {
        e.preventDefault();
        console.log('⬅️ Click en flecha IZQUIERDA de TRABAJOS - Interacción de usuario');
        worksUserInteracted = true; // Marcar que el usuario interactuó
        worksDirection = -1; // Establecer dirección a retroceder
        moverTrabajos(worksCurrentIndex - 1);
        detenerTrabajosAutoplay(); // Detener el movimiento automático PERMANENTEMENTE
    };
    
    worksNextBtn.onclick = function(e) {
        e.preventDefault();
        console.log('➡️ Click en flecha DERECHA de TRABAJOS - Interacción de usuario');
        worksUserInteracted = true; // Marcar que el usuario interactuó
        worksDirection = 1; // Establecer dirección a avanzar
        moverTrabajos(worksCurrentIndex + 1);
        detenerTrabajosAutoplay(); // Detener el movimiento automático PERMANENTEMENTE
    };
    
    console.log('✅ Eventos de trabajos asignados correctamente');
    
    // Mostrar primera tarjeta y iniciar autoplay
    setTimeout(() => {
        moverTrabajos(0);
        iniciarTrabajosAutoplay();
    }, 100);
    
} else {
    console.log('❌ ERROR: No se encontraron todos los elementos del carrusel de trabajos');
}

    // ===== TOGGLE PARA TARJETAS DE TRABAJOS EN MÓVIL =====
console.log('🖱️ Iniciando toggle para tarjetas de trabajos');

const workCards2 = document.querySelectorAll('.work-card');

if (workCards2.length > 0) {
    console.log(`✅ ${workCards2.length} tarjetas de trabajo encontradas`);
    
    // Función para detectar si es móvil
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Variable para mantener la tarjeta activa actual
    let activeCard = null;
    
    // Primero, aseguramos que todas las tarjetas empiecen con overlay oculto en móvil
    if (isMobile()) {
        workCards2.forEach(card => {
            const overlay = card.querySelector('.pink-hover-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    }
    
    workCards2.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Solo aplicar en móvil
            if (isMobile()) {
                const overlay = this.querySelector('.pink-hover-overlay');
                
                if (overlay) {
                    // Si la tarjeta clickeada es la misma que está activa
                    if (activeCard === this) {
                        // Desactivarla
                        console.log('🔴 Desactivando tarjeta');
                        overlay.style.opacity = '0';
                        activeCard = null;
                    } else {
                        // Si hay otra tarjeta activa, desactivarla
                        if (activeCard) {
                            const oldOverlay = activeCard.querySelector('.pink-hover-overlay');
                            if (oldOverlay) {
                                oldOverlay.style.opacity = '0';
                            }
                        }
                        
                        // Activar la nueva tarjeta
                        console.log('🟢 Activando tarjeta');
                        overlay.style.opacity = '1';
                        activeCard = this;
                    }
                }
            }
        });
    });
    
    // Manejar cambio de tamaño de ventana
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            // En desktop, resetear todo para que funcione el hover
            workCards2.forEach(card => {
                const overlay = card.querySelector('.pink-hover-overlay');
                if (overlay) {
                    overlay.style.opacity = '';
                }
            });
            activeCard = null;
        } else {
            // En móvil, asegurar que todas empiecen ocultas
            workCards2.forEach(card => {
                const overlay = card.querySelector('.pink-hover-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                }
            });
            activeCard = null;
        }
    });
    
    console.log('✅ Toggle para trabajos configurado correctamente');
    
} else {
    console.log('❌ No se encontraron tarjetas de trabajo');
}
});
