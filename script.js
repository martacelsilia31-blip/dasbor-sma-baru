// 1. Variabel Menyimpan Mode Aktif saat ini ('kelompok' atau 'individu')
let currentMode = 'kelompok';

// 2. Mengambil data tugas dari memori browser (localStorage) atau menggunakan data awal jika kosong
let tasks = JSON.parse(localStorage.getItem('simple_tasks')) || [
    { id: 1, title: "Laporan Praktikum Biologi", subject: "Biologi", category: "kelompok", deadline: "2026-10-30T10:00", link: "https://docs.google.com" },
    { id: 2, title: "Mengerjakan PR Bab Turunan", subject: "Matematika", category: "individu", deadline: "2026-10-28T20:00", link: "" }
];

// 3. Fungsi untuk berpindah mode (Kelompok vs Individu)
function setMode(mode) {
    currentMode = mode;
    
    // Mengubah warna tombol yang sedang aktif
    document.getElementById('btnGroup').classList.toggle('active', mode === 'kelompok');
    document.getElementById('btnPersonal').classList.toggle('active', mode === 'individu');
    
    // Mengubah teks judul daftar tugas
    document.getElementById('modeTitle').textContent = mode === 'kelompok' ? 'Kelompok' : 'Individu';
    
    renderTasks(); // Tampilkan ulang daftar tugas sesuai mode yang dipilih
}

// 4. Fungsi Menambah Tugas Baru dari Form Input
function addNewTask() {
    let title = document.getElementById('inputTitle').value;
    let subject = document.getElementById('inputSubject').value;
    let deadline = document.getElementById('inputDeadline').value;
    let link = document.getElementById('inputLink').value;

    // Validasi sederhana: pastikan judul dan deadline diisi oleh pengguna
    if (!title || !deadline) {
        alert("Judul tugas dan deadline wajib diisi!");
        return;
    }

    // Membuat objek data tugas baru
    let newTask = {
        id: Date.now(), // Menggunakan timestamp angka sebagai ID unik
        title: title,
        subject: subject,
        category: currentMode, // Mengikuti mode yang sedang dibuka saat ini
        deadline: deadline,
        link: link
    };

    tasks.push(newTask); // Memasukkan tugas baru ke dalam array tasks
    saveAndRender();     // Simpan data dan perbarui tampilan layar

    // Mengosongkan form setelah berhasil disimpan
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputLink').value = '';
    document.getElementById('inputDeadline').value = '';
}

// 5. Fungsi Menghapus Tugas Berdasarkan ID
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id); // Memfilter dan membuang tugas yang id-nya cocok
    saveAndRender();
}

// 6. Menyimpan Data ke LocalStorage Browser dan Refresh Tampilan
function saveAndRender() {
    localStorage.setItem('simple_tasks', JSON.stringify(tasks));
    renderTasks();
}

// 7. Fungsi Utama Menampilkan Daftar Tugas ke Layar (Dilengkapi Pengecekan Deadline Mepet)
function renderTasks() {
    let listContainer = document.getElementById('taskList');
    listContainer.innerHTML = ''; // Mengosongkan kontainer sebelum diisi ulang

    // Memfilter tugas yang sesuai dengan mode aktif saat ini (kelompok / individu)
    let filtered = tasks.filter(task => task.category === currentMode);

    if (filtered.length === 0) {
        listContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Belum ada tugas.</p>';
        return;
    }

    let now = new Date().getTime(); // Mengambil waktu sekarang dalam milidetik

    // Melakukan perulangan (loop) untuk setiap tugas
    filtered.forEach(task => {
        let deadlineTime = new Date(task.deadline).getTime();
        let timeLeft = deadlineTime - now;
        let hoursLeft = timeLeft / (1000 * 60 * 60); // Mengonversi milidetik ke sisa jam

        // Cek apakah tugas sudah mepet (kurang dari 24 jam)
        let isUrgent = hoursLeft > 0 && hoursLeft < 24;
        let statusText = "";

        if (timeLeft < 0) {
            statusText = "⚠️ TERLAMBAT (Lewat Deadline)";
        } else if (isUrgent) {
            statusText = `🔥 MENDESAK! Sisa waktu sekitar ${Math.floor(hoursLeft)} jam lagi`;
        } else {
            statusText = `⏳ Deadline: ${task.deadline.replace('T', ' Jam ')}`;
        }

        // Membuat elemen HTML kartu tugas secara dinamis
        let card = document.createElement('div');
        card.className = `task-card ${isUrgent ? 'urgent' : ''}`;
        
        card.innerHTML = `
            <div class="task-info">
                <h4>${task.title} <span class="badge-subject">${task.subject}</span></h4>
                <p>${statusText}</p>
                ${task.link ? `<a href="${task.link}" target="_blank" style="font-size:12px; color:#4f46e5;">🔗 Buka Link Tugas</a>` : ''}
            </div>
            <button class="btn-delete" onclick="deleteTask(${task.id})">Hapus</button>
        `;

        listContainer.appendChild(card);
    });
}

// Menjalankan fungsi renderTasks() saat halaman pertama kali dibuka
renderTasks();

// Otomatis memperbarui perhitungan jam deadline setiap 1 menit
setInterval(renderTasks, 60000);
