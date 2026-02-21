document.addEventListener('DOMContentLoaded', () => {
    // --- BÖLÜMLER (SECTIONS) ---
    const authSection = document.getElementById('authSection');
    const appSection = document.getElementById('appSection');

    // --- DOM Elementleri ---
    const authForm = document.getElementById('authForm');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const authSubtitle = document.getElementById('authSubtitle');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    const htmlElement = document.documentElement; 
    
    const taskForm = document.getElementById('taskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskTypeSelect = document.getElementById('taskType');

    const titleCol = document.getElementById('titleCol');
    const dateCol = document.getElementById('dateCol');
    const taskDueDate = document.getElementById('taskDueDate');
    
    const dailyTaskList = document.getElementById('dailyTaskList');
    const longTermTaskList = document.getElementById('longTermTaskList');
    const dailyEmptyState = document.getElementById('dailyEmptyState');
    const longTermEmptyState = document.getElementById('longTermEmptyState');

    const accountBtn = document.getElementById('accountBtn');
    const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
    const accountForm = document.getElementById('accountForm');
    const updateUsernameInput = document.getElementById('updateUsername');
    const updatePasswordInput = document.getElementById('updatePassword');

    const resetDailyBtn = document.getElementById('resetDailyBtn');

    let isLoginMode = true;
    let currentUser = null;

    // ==========================================
    // --- TOASTIFY BİLDİRİM FONKSİYONU ---
    // ==========================================
    function showToast(message, type = 'success') {
        let bgColor = '#198754'; // success (Yeşil)
        if (type === 'error') bgColor = '#dc3545'; // danger (Kırmızı)
        if (type === 'info') bgColor = '#0d6efd'; // primary (Mavi)
        if (type === 'warning') bgColor = '#fd7e14'; // warning (Turuncu)

        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "bottom", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: bgColor,
                borderRadius: "8px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }
        }).showToast();
    }

    // Tüm Fetch isteklerine otomatik Token ekleyen yardımcı fonksiyon
    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Güvenlik kartımızı gösteriyoruz
        };
    }

    // --- Görev Tipi Değiştikçe Formu Ayarla ---
    taskTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'long_term') {
            titleCol.classList.replace('col-md-7', 'col-md-5'); 
            dateCol.classList.remove('d-none'); 
        } else {
            titleCol.classList.replace('col-md-5', 'col-md-7'); 
            dateCol.classList.add('d-none'); 
            taskDueDate.value = ''; 
        }
    });

    // --- OTURUM VE EKRAN YÖNETİMİ ---
    const checkAuth = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showAppView(currentUser.username);
            loadTasks(); 
        } else {
            showAuthView(); 
        }
    };

    const showAppView = (username) => {
        authSection.classList.add('d-none');   
        appSection.classList.remove('d-none'); 
        userNameDisplay.textContent = username;
    };

    const showAuthView = () => {
        appSection.classList.add('d-none');    
        authSection.classList.remove('d-none'); 
    };

    // --- TEMA (DARK / LIGHT MODE) YÖNETİMİ ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);

        themeBtns.forEach(btn => {
            if (theme === 'dark') {
                btn.innerHTML = `<i class="bi bi-sun fs-5 text-white"></i>`;
            } else {
                btn.innerHTML = `<i class="bi bi-moon-stars fs-5 text-white"></i>`; 
            }
        });
    }

    // --- Giriş / Kayıt Ekranı Geçiş İşlemleri ---
    toggleAuthMode.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        loginSubmitBtn.textContent = isLoginMode ? 'Giriş Yap' : 'Kayıt Ol';
        toggleAuthMode.textContent = isLoginMode ? 'Kayıt Ol' : 'Giriş Yap';
        toggleAuthMode.previousElementSibling.textContent = isLoginMode ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?';
        authSubtitle.textContent = isLoginMode ? 'Devam etmek için giriş yapın' : 'Yeni bir hesap oluşturun';
    });

    // --- API ile Kayıt Ol / Giriş Yap İşlemi ---
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                if (isLoginMode) {
                    currentUser = data.user;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    localStorage.setItem('token', data.token); // TOKEN'I KAYDET
                    showAppView(currentUser.username); 
                    loadTasks(); 
                    showToast(`Hoş geldin, ${currentUser.username}!`, 'success');
                } else {
                    showToast('Kayıt başarılı! Lütfen giriş yapın.', 'success');
                    isLoginMode = true;
                    loginSubmitBtn.textContent = 'Giriş Yap';
                    toggleAuthMode.textContent = 'Kayıt Ol';
                    toggleAuthMode.previousElementSibling.textContent = 'Hesabın yok mu?';
                    authSubtitle.textContent = 'Devam etmek için giriş yapın';
                    document.getElementById('password').value = '';
                }
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            showToast('Sunucuya bağlanılamadı.', 'error');
        }
    });

    // --- Çıkış Yapma (Logout) ---
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        currentUser = null;
        showAuthView(); 
        
        dailyTaskList.innerHTML = '';
        longTermTaskList.innerHTML = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        updateEmptyStates();
        
        showToast('Başarıyla çıkış yapıldı.', 'info');
    });

    // --- HESAP AYARLARI (Profil Güncelleme) ---
    accountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateUsernameInput.value = currentUser.username;
        updatePasswordInput.value = ''; 
        accountModal.show();
    });

    accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newUsername = updateUsernameInput.value.trim();
        const newPassword = updatePasswordInput.value.trim();

        if (newUsername === currentUser.username && !newPassword) {
            showToast('Herhangi bir değişiklik yapmadınız.', 'warning');
            return;
        }

        try {
            const response = await fetch(`/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ 
                    newUsername: newUsername !== currentUser.username ? newUsername : null, 
                    newPassword: newPassword ? newPassword : null 
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast(data.message, 'success');
                
                if (data.updatedUsername) {
                    currentUser.username = data.updatedUsername;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    userNameDisplay.textContent = currentUser.username;
                }
                
                accountModal.hide();
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            showToast('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.', 'error');
        }
    });

    // --- GÖREV (TASK) İŞLEMLERİ ---
    async function loadTasks() {
        if (!currentUser) return;
        
        try {
            const response = await fetch(`/api/tasks/${currentUser.id}`);
            const tasks = await response.json();
            
            dailyTaskList.innerHTML = '';
            longTermTaskList.innerHTML = '';
            
            tasks.forEach(task => {
                // dueDate parametresini de fonksiyona yolluyoruz
                addTaskToDOM(task.id, task.title, task.task_type, task.is_completed, task.due_date);
            });
            updateEmptyStates();
            updateProgress();
        } catch (error) {
            showToast('Görevler yüklenirken hata oluştu.', 'error');
        }
    }

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const title = taskTitleInput.value.trim();
        const task_type = taskTypeSelect.value;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ title, task_type, userId: currentUser.id, due_date: taskDueDate.value || null })
            });
            
            const data = await response.json();
            if (response.ok) {
                // Yeni görev eklendiğinde de tarihi gönderiyoruz
                addTaskToDOM(data.taskId, title, task_type, false, taskDueDate.value);
                taskTitleInput.value = '';
                taskDueDate.value = ''; // Eklendikten sonra tarihi temizle
                updateEmptyStates();
                updateProgress();
                showToast('Görev eklendi!', 'info');
            }
        } catch (error) {
            showToast('Görev ekleme hatası.', 'error');
        }
    });

    // addTaskToDOM fonksiyonuna dueDate parametresini ekledik
    function addTaskToDOM(taskId, title, type, isCompleted, dueDate) {
        const isChecked = isCompleted == 1 || isCompleted === true;

        // Tarih varsa güzel bir formatta göstermek için HTML hazırlıyoruz
        let dateHtml = '';
        if (type === 'long_term' && dueDate) {
            const dateObj = new Date(dueDate);
            const formattedDate = dateObj.toLocaleDateString('tr-TR');
            dateHtml = `<small class="text-muted ms-auto me-3 text-nowrap d-flex align-items-center gap-1">
                            <i class="bi bi-calendar-event"></i> ${formattedDate}
                        </small>`;
        }

        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.id = `task-row-${taskId}`;

        // dateHtml değişkenini çöp kutusunun hemen önüne ekledik
        li.innerHTML = `
            <div class="form-check d-flex align-items-center gap-3 w-100">
                <input class="form-check-input task-checkbox flex-shrink-0" type="checkbox" id="task_${taskId}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label w-100 fs-5 text-break ${isChecked ? 'task-completed' : ''}" for="task_${taskId}">
                    ${title}
                </label>
                ${dateHtml}
                <button class="btn btn-outline-danger btn-sm border-0 delete-btn flex-shrink-0"><i class="bi bi-trash3"></i></button>
            </div>
        `;

        const targetList = type === 'daily' ? dailyTaskList : longTermTaskList;
        targetList.appendChild(li);

        const checkbox = li.querySelector('.task-checkbox');
        const label = li.querySelector('.form-check-label');
        
        checkbox.addEventListener('change', async (e) => {
            const completed = e.target.checked;
            
            if (completed) label.classList.add('task-completed');
            else label.classList.remove('task-completed');

            try {
                await fetch(`/api/tasks/${taskId}/status`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ is_completed: completed, userId: currentUser.id })
                });

                if (completed) checkIfAllCompleted(type);
                updateProgress();
            } catch (error) {
                showToast('Güncelleme hatası', 'error');
            }
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ userId: currentUser.id })
                });

                if (response.ok) {
                    li.remove();
                    updateEmptyStates();
                    updateProgress();
                    showToast('Görev silindi.', 'info');
                }
            } catch (error) {
                showToast('Silme hatası', 'error');
            }
        });
    }

    // --- GÜNLÜK GÖREVLERİ SIFIRLAMA BUTONU ---
    if (resetDailyBtn) {
        resetDailyBtn.addEventListener('click', async () => {
            if (!currentUser) return;
            
            try {
                // Backend API'sine istek atıyoruz
                const response = await fetch('/api/tasks/reset/daily', {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ userId: currentUser.id })
                });

                if (response.ok) {
                    // Arayüzdeki sadece GÜNLÜK olan checkboxları bul
                    const dailyCheckboxes = dailyTaskList.querySelectorAll('.task-checkbox');
                    
                    dailyCheckboxes.forEach(checkbox => {
                        if (checkbox.checked) {
                            checkbox.checked = false; // Tiki kaldır
                            const label = checkbox.nextElementSibling;
                            label.classList.remove('task-completed'); // Üstü çizili efekti kaldır
                        }
                    });
                    
                    updateProgress(); // Üstteki ilerleme çubuğunu 0'a çek
                    showToast('Tüm günlük görevler sıfırlandı!', 'info');
                } else {
                    showToast('Sıfırlama başarısız oldu.', 'error');
                }
            } catch (error) {
                showToast('Sunucu bağlantı hatası.', 'error');
            }
        });
    }

    // --- GÜNLÜK İLERLEME ÇUBUĞUNU GÜNCELLEME ---
    function updateProgress() {
        const allDailyTasks = dailyTaskList.querySelectorAll('.task-checkbox');
        const completedDailyTasks = dailyTaskList.querySelectorAll('.task-checkbox:checked');
        
        let percentage = 0;
        if (allDailyTasks.length > 0) {
            percentage = Math.round((completedDailyTasks.length / allDailyTasks.length) * 100);
        }

        const navProgressBar = document.getElementById('navProgressBar');
        const progressText = document.getElementById('progressText');
        
        if (navProgressBar && progressText) {
            navProgressBar.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}%`;
        }
    }

    function checkIfAllCompleted(type) {
        const targetList = type === 'daily' ? dailyTaskList : longTermTaskList;
        const allCheckboxes = targetList.querySelectorAll('.task-checkbox');
        const checkedBoxes = targetList.querySelectorAll('.task-checkbox:checked');

        if (allCheckboxes.length > 0 && allCheckboxes.length === checkedBoxes.length) {
            fireConfetti();
            setTimeout(() => {
                const message = type === 'daily' 
                    ? 'Harika! Bugünkü tüm görevlerini tamamladın! 🎉' 
                    : 'İnanılmaz! Uzun dönemli hedeflerini bitirdin! 🚀';
                showToast(message, 'success');
            }, 300);
        }
    }

    function fireConfetti() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        function randomInRange(min, max) { return Math.random() * (max - min) + min; }
        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function updateEmptyStates() {
        dailyEmptyState.style.display = dailyTaskList.children.length === 0 ? 'block' : 'none';
        longTermEmptyState.style.display = longTermTaskList.children.length === 0 ? 'block' : 'none';
    }

    // --- Başlangıç Tetiklemeleri ---
    checkAuth();
    updateEmptyStates();
});