/* --- ОБНОВЛЕНИЕ ВРЕМЕНИ (Главная, Оплата, Тарифы) --- */
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
    
    const mainTime = document.getElementById('current-time');
    if (mainTime) { mainTime.textContent = timeString; }
    
    const paymentTime = document.getElementById('payment-current-time');
    if (paymentTime) { paymentTime.textContent = timeString; }

    const tariffTime = document.getElementById('tariff-current-time');
    if (tariffTime) { tariffTime.textContent = timeString; }
}

// Запускаем обновление каждую секунду
setInterval(updateTime, 1000);
updateTime();


/* === АНИМИРОВАННЫЙ ЗВЕЗДНЫЙ ФОН === */
function initStarfield() {
    const starsLayer = document.getElementById('stars-layer');
    if (!starsLayer) return;

    starsLayer.innerHTML = '';

    const count = {
        distant: 150,
        medium: 80,
        bright: 40,
        shooting: 2
    };

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createStars(count, className, durationMin, durationMax, delayMin, delayMax, sizeMin, sizeMax) {
        for(let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add(className);
            
            if(className === 'star-medium') {
                const colors = ['blue', 'violet', 'gold'];
                star.classList.add(colors[Math.floor(Math.random() * colors.length)]);
            }

            const size = random(sizeMin, sizeMax);
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${random(0, 100)}vw`;
            star.style.top = `${random(0, 100)}vh`;
            star.style.animationDelay = `${random(delayMin, delayMax)}s`;
            star.style.animationDuration = `${random(durationMin, durationMax)}s`;
            starsLayer.appendChild(star);
        }
    }

    function createShootingStars(count) {
        for(let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('shooting-star');
            star.style.width = `${random(80, 150)}px`;
            star.style.height = `${random(1, 2)}px`;
            const angle = random(-60, -30);
            star.style.transform = `rotate(${angle}deg)`;
            star.style.left = `${random(-50, 100)}vw`;
            star.style.top = `${random(-50, 100)}vh`;
            
            star.style.animationDelay = `${random(15, 60)}s`;
            star.style.animationDuration = `${random(8, 15)}s`;
            
            setTimeout(() => {
                star.classList.add('animate');
            }, random(0, 5000));

            starsLayer.appendChild(star);
        }
    }

    createStars(count.distant, 'star-distant', 6, 10, 0, 8, 0.5, 1);
    createStars(count.medium, 'star-medium', 4, 8, 0, 6, 1.5, 2.5);
    createStars(count.bright, 'star-bright', 1, 3, 0, 2, 2, 4);
    createShootingStars(count.shooting);
}


/* --- ПЕРЕМЕННЫЕ --- */
let currentUserID = null;
let selectedTariffType = null;

/* --- ГЕНЕРАЦИЯ ID --- */
function generateUserID() {
    if (!currentUserID) {
        currentUserID = Math.floor(Date.now() / 1000).toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    return currentUserID;
}

/* --- ФУНКЦИИ УПРАВЛЕНИЯ МОДАЛЬНЫМИ ОКНАМИ --- */
function openModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }

/* --- УВЕДОМЛЕНИЕ --- */
function showNotification() {
    const bar = document.getElementById('notification-bar');
    if (bar) { bar.style.display = 'block'; setTimeout(() => bar.style.display = 'none', 15000); }
}

/* --- ОТКРЫТИЕ ОКНА "НЕТ ПОДПИСКИ" --- */
function openAccessModal(moduleName) {
    document.getElementById('modal-module-title').textContent = `МОДУЛЬ "${moduleName}"`;
    openModal('accessModal');
}

/* --- ВЫБОР ТАРИФА --- */
function selectTariff(element, type) {
    selectedTariffType = type;
    document.querySelectorAll('.pricing-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

/* --- ГЛАВНАЯ ЛОГИКА СТРАНИЦЫ --- */
function initializePage() {
    /* 0. ЗАПУСК ЗВЕЗДНОГО ФОНА */
    initStarfield();

    /* 1. Заполняем ID */
    document.getElementById('user-id-display').textContent = generateUserID();

    /* 2. РОТАЦИЯ ТЕКСТА (ГЛАВНОЕ ИСПРАВЛЕНИЕ) */
    const phrases = [
        "Цифровая тень есть у каждого — мы умеем находить то, что другие предпочитают скрывать.",
        "Пока другие оставляют следы, мы собираем из них полную картину.",
        "Информация — наше преимущество. Там, где другие видят хаос, мы находим закономерности.",
        " В цифровом мире почти всё можно скрыть от глаз, но не от внимательного анализа."
    ];
    
    const textElement = document.getElementById('feature-text');
    if (textElement) {
        // 1. Пытаемся достать текст, который мы сохранили ПЕРЕД уходом со страницы
        const savedText = sessionStorage.getItem('featureText');
        
        if (savedText) {
            // Если текст есть — вставляем МГНОВЕННО. Это перекрывает кэш браузера.
            textElement.textContent = savedText;
        } else {
            // Если это самая первая загрузка — ставим случайную фразу
            textElement.textContent = phrases[Math.floor(Math.random() * phrases.length)];
        }

        // 3. Настраиваем интервал для БУДУЩИХ смен текста
        let currentIndex = phrases.indexOf(textElement.textContent);
        if (currentIndex === -1) currentIndex = 0;

        function changeText() {
            currentIndex = (currentIndex + 1) % phrases.length;
            const newText = phrases[currentIndex];
            textElement.textContent = newText;
            
            // 4. ВАЖНО: Сохраняем НОВЫЙ текст перед тем, как он сменится в следующий раз
            sessionStorage.setItem('featureText', newText);
        }
        
        // Запускаем интервал (первый раз текст уже вставлен выше)
        setInterval(changeText, 15000);
    }

    /* Остальной код кнопок (модальные окна) */
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', function() { openAccessModal(this.dataset.module); });
    });
    document.getElementById('btn-buy-access').addEventListener('click', () => { closeModal('accessModal'); openModal('tariffModal'); });
    document.getElementById('btn-later').addEventListener('click', () => closeModal('accessModal'));
    document.getElementById('btn-confirm-tariff').addEventListener('click', () => {
        if (selectedTariffType) { openModal('paymentMethodModal'); } else { alert('Пожалуйста, выберите период подписки'); }
    });
    document.getElementById('btn-back-from-tariff').addEventListener('click', () => { closeModal('tariffModal'); openModal('accessModal'); });
    document.getElementById('btn-pay-card').addEventListener('click', () => { closeModal('paymentMethodModal'); openModal('paymentCardModal'); setTimeout(showNotification, 300000); });
    document.getElementById('btn-pay-crypto').addEventListener('click', () => { 
        const links = { '7days': 'https://t.me/send?start=IVYTXAAn2D1B', '14days': 'https://t.me/send?start=IVfbAVucNMpO', 'forever': 'https://t.me/send?start=IV7nIah3TQle' };
        if (selectedTariffType && links[selectedTariffType]) { window.open(links[selectedTariffType], '_blank'); } else { alert('Сначала выберите тариф'); }
    });
    document.getElementById('btn-back-from-payment').addEventListener('click', () => { closeModal('paymentMethodModal'); openModal('tariffModal'); });
    document.getElementById('btn-back-from-card').addEventListener('click', () => { closeModal('paymentCardModal'); openModal('paymentMethodModal'); });
    document.getElementById('btn-check-payment').addEventListener('click', showNotification);
    document.querySelectorAll('.modal-close').forEach(b => { b.addEventListener('click', () => { b.closest('.modal-overlay').style.display = 'none'; }); });
    document.getElementById('tariffModal').addEventListener('click', (e) => { if (e.target.classList.contains('modal-overlay')) { selectedTariffType = null; document.querySelectorAll('.pricing-option').forEach(el => el.classList.remove('selected')); closeModal('tariffModal'); } });
    document.getElementById('paymentMethodModal').addEventListener('click', (e) => { if (e.target.classList.contains('modal-overlay')) { closeModal('paymentMethodModal'); } });
    document.getElementById('paymentCardModal').addEventListener('click', (e) => { if (e.target.classList.contains('modal-overlay')) { closeModal('paymentCardModal'); openModal('paymentMethodModal'); } });
}

/* --- СЛУШАТЕЛИ СОБЫТИЙ --- */

// При уходе СО страницы — сохраняем текущий текст
window.addEventListener('beforeunload', function() {
    const textElement = document.getElementById('feature-text');
    if (textElement) {
        sessionStorage.setItem('featureText', textElement.textContent);
    }
});

// При возврате НА страницу — initializePage запустится и мгновенно возьмет текст из sessionStorage
window.addEventListener('pageshow', function(e) {
    initializePage();
    if (e.persisted) {
        const starsLayer = document.getElementById('stars-layer');
        if (starsLayer) { starsLayer.innerHTML = ''; }
    }
});

// Первая загрузка
document.addEventListener('DOMContentLoaded', initializePage);