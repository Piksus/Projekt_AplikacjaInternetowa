var defaultEvents = [
    { id: 1, title: 'Konferencja Technologiczna', date: '2026-07-15', location: 'Warszawa, Centrum Kongresowe', desc: 'Największe wydarzenie branżowe roku. Prelekcje, warsztaty i networking.', status: 'active', tasks: [
        { id: 1, text: 'Przygotowanie sali', done: false }, { id: 2, text: 'Zamówienie cateringu', done: false }, { id: 3, text: 'Wydrukowanie identyfikatorów', done: true }
    ], participants: [
        { id: 1, name: 'Anna Kowalska', email: 'anna@example.com', company: 'ABC', role: 'speaker' }, { id: 2, name: 'Jan Nowak', email: 'jan@example.com', company: 'XYZ', role: 'attendee' }, { id: 3, name: 'Ewa Wiśniewska', email: 'ewa@example.com', company: '123', role: 'organizer' }
    ]},
    { id: 2, title: 'Warsztaty React', date: '2026-08-22', location: 'Kraków, Makerspace', desc: 'Praktyczne warsztaty z React 19.', status: 'active', tasks: [
        { id: 4, text: 'Przygotowanie materiałów', done: true }, { id: 5, text: 'Test sprzętu', done: false }
    ], participants: [
        { id: 4, name: 'Piotr Zieliński', email: 'piotr@example.com', company: 'TechCorp', role: 'sponsor' }
    ]},
    { id: 3, title: 'Hackathon Weekend', date: '2026-09-05', location: 'Wrocław, Park Technologiczny', desc: '48h maraton programowania dla zespołów.', status: 'planned', tasks: [
        { id: 6, text: 'Znalezienie sponsorów', done: false }, { id: 7, text: 'Przygotowanie regulaminu', done: true }, { id: 8, text: 'Promocja wydarzenia', done: false }, { id: 9, text: 'Rezerwacja sal', done: false }
    ], participants: []}
];

var filterStatus = 'all', filterSearch = '';

function loadStore() {
    try {
        var saved = localStorage.getItem('eventmanager_store');
        if (saved) {
            var data = JSON.parse(saved);
            store = data;
            return;
        }
    } catch (e) {}
    store = { events: defaultEvents, nextId: 10, nextTaskId: 10, nextPartId: 10 };
}

function saveStore() {
    try { localStorage.setItem('eventmanager_store', JSON.stringify(store)); } catch (e) {}
}

var store;
loadStore();

function renderDashboard() {
    var totalTasks = store.events.reduce(function (s, e) { return s + e.tasks.length; }, 0);
    var doneTasks = store.events.reduce(function (s, e) { return s + e.tasks.filter(function (t) { return t.done; }).length; }, 0);
    var participants = store.events.reduce(function (s, e) { return s + e.participants.length; }, 0);

    document.getElementById('mainContent').innerHTML =
        '<section><h2>Dashboard</h2><div class="stats">' +
        '<div>Wydarzenia <span>' + store.events.length + '</span></div>' +
        '<div>Zadania <span>' + doneTasks + '/' + totalTasks + '</span></div>' +
        '<div>Uczestnicy <span>' + participants + '</span></div></div></section>';
}

function getFilteredEvents() {
    return store.events.filter(function (e) {
        if (filterStatus !== 'all' && e.status !== filterStatus) return false;
        if (filterSearch) {
            var q = filterSearch.toLowerCase();
            if (e.title.toLowerCase().indexOf(q) === -1 && e.desc.toLowerCase().indexOf(q) === -1) return false;
        }
        return true;
    });
}

function renderEvents() {
    var filtered = getFilteredEvents();
    var html = '<section><div class="card-header"><h2>Wydarzenia</h2>' +
        '<button class="btn btn-primary btn-sm" id="addEventBtn">+ Dodaj event</button></div>';

    html += '<div class="filters"><input type="text" id="searchInput" class="form-input filter-input" placeholder="Szukaj wydarzenia..." value="' + filterSearch + '">' +
        '<select id="statusFilter" class="form-input filter-select"><option value="all"' + (filterStatus === 'all' ? ' selected' : '') + '>Wszystkie</option>' +
        '<option value="active"' + (filterStatus === 'active' ? ' selected' : '') + '>Aktywne</option>' +
        '<option value="planned"' + (filterStatus === 'planned' ? ' selected' : '') + '>Planowane</option></select></div>';

    html += '<div class="events-grid">';

    if (filtered.length === 0) {
        html += '<p style="grid-column:1/-1;text-align:center;color:#95a5a6;padding:40px 0">Brak wydarzeń spełniających kryteria.</p>';
    }

    filtered.forEach(function (e) {
        var done = e.tasks.filter(function (t) { return t.done; }).length;
        var pct = e.tasks.length > 0 ? Math.round(done / e.tasks.length * 100) : 0;
        html += '<article class="event-card" data-id="' + e.id + '">' +
            '<h3>' + e.title + '</h3>' +
            '<p class="event-date">' + formatDate(e.date) + ' | ' + e.location + '</p>' +
            '<p class="event-desc">' + e.desc + '</p>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
            '<p class="event-meta">' +
            'Zadania: ' + done + '/' + e.tasks.length +
            ' | Uczestnicy: ' + e.participants.length +
            ' <span class="event-status ' + e.status + '">' + (e.status === 'active' ? 'Aktywne' : 'Planowane') + '</span></p>' +
            '</article>';
    });

    html += '</div></section>';
    document.getElementById('mainContent').innerHTML = html;

    document.getElementById('addEventBtn').addEventListener('click', function () {
        document.getElementById('addEventModal').classList.add('open');
    });
    document.querySelectorAll('.event-card').forEach(function (card) {
        card.addEventListener('click', function () {
            renderEventDetail(this.dataset.id);
        });
    });

    document.getElementById('searchInput').addEventListener('input', function () {
        filterSearch = this.value;
        renderEvents();
    });
    document.getElementById('statusFilter').addEventListener('change', function () {
        filterStatus = this.value;
        renderEvents();
    });
}

function renderEventDetail(id) {
    var e = store.events.find(function (ev) { return ev.id == id; });
    if (!e) return renderEvents();
    var doneTasks = e.tasks.filter(function (t) { return t.done; }).length;
    var pct = e.tasks.length > 0 ? Math.round(doneTasks / e.tasks.length * 100) : 0;

    var html = '<section><button class="btn btn-outline btn-sm" id="backToEvents">&larr; Powrót do listy</button>' +
        '<div class="detail-header"><h2>' + e.title + '</h2>' +
        '<span class="event-status ' + e.status + '">' + (e.status === 'active' ? 'Aktywne' : 'Planowane') + '</span></div>' +
        '<p class="event-date"><strong>Data:</strong> ' + formatDate(e.date) + '</p>' +
        '<p><strong>Miejsce:</strong> ' + e.location + '</p>' +
        '<p class="event-desc-full">' + e.desc + '</p>' +
        '<div class="progress-section"><div class="progress-header"><span>Postęp zadań</span><span>' + doneTasks + '/' + e.tasks.length + ' (' + pct + '%)</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>' +
        '<div class="detail-tabs"><button class="tab-btn active" data-tab="tasks">Zadania (' + e.tasks.length + ')</button>' +
        '<button class="tab-btn" data-tab="participants">Uczestnicy (' + e.participants.length + ')</button></div>';

    html += '<div id="tasksTab" class="tab-content active"><ul class="task-list">';
    e.tasks.forEach(function (t) {
        html += '<li><label><input type="checkbox" class="task-check" data-task="' + t.id + '"' + (t.done ? ' checked' : '') + '> ' + t.text + '</label></li>';
    });
    html += '</ul><div class="add-row"><input type="text" id="newTaskInput" placeholder="Nowe zadanie...">' +
        '<button class="btn btn-primary btn-sm" id="addTaskBtn">Dodaj</button></div></div>';

    html += '<div id="participantsTab" class="tab-content"><div class="participants-grid">';
    e.participants.forEach(function (p) {
        html += '<div class="participant-card"><span class="avatar">' + getInitials(p.name) + '</span>' +
            '<div><strong>' + p.name + '</strong><span class="part-email">' + p.email + '</span></div>' +
            '<span class="part-role ' + p.role + '">' + roleLabel(p.role) + '</span></div>';
    });
    html += '</div>' +
        '<div class="add-row"><input type="text" id="newPartName" placeholder="Imię i nazwisko...">' +
        '<input type="email" id="newPartEmail" placeholder="Email...">' +
        '<select id="newPartRole"><option value="attendee">Uczestnik</option><option value="speaker">Prelegent</option><option value="organizer">Organizator</option><option value="sponsor">Sponsor</option></select>' +
        '<button class="btn btn-primary btn-sm" id="addPartBtn">Dodaj</button></div></div></section>';

    document.getElementById('mainContent').innerHTML = html;

    document.getElementById('backToEvents').addEventListener('click', renderEvents);

    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(this.dataset.tab + 'Tab').classList.add('active');
        });
    });

    document.querySelectorAll('.task-check').forEach(function (cb) {
        cb.addEventListener('change', function () {
            var taskId = this.dataset.task;
            var task = e.tasks.find(function (t) { return t.id == taskId; });
            if (task) task.done = this.checked;
            saveStore();
            renderEventDetail(e.id);
            updateNavCounts();
        });
    });

    document.getElementById('addTaskBtn').addEventListener('click', function () {
        var input = document.getElementById('newTaskInput');
        var text = input.value.trim();
        if (!text) return;
        e.tasks.push({ id: store.nextTaskId++, text: text, done: false });
        saveStore();
        renderEventDetail(e.id);
        updateNavCounts();
    });

    document.getElementById('addPartBtn').addEventListener('click', function () {
        var name = document.getElementById('newPartName').value.trim();
        var email = document.getElementById('newPartEmail').value.trim();
        var role = document.getElementById('newPartRole').value;
        if (!name || !email) return;
        e.participants.push({ id: store.nextPartId++, name: name, email: email, company: '', role: role });
        document.getElementById('newPartName').value = '';
        document.getElementById('newPartEmail').value = '';
        saveStore();
        renderEventDetail(e.id);
        updateNavCounts();
    });
}

function updateNavCounts() {
    var eventCount = document.getElementById('eventCount');
    if (eventCount) eventCount.textContent = store.events.length;
}

function getInitials(name) {
    return name.split(' ').map(function (n) { return n[0]; }).join('').toUpperCase().substring(0, 2);
}

function roleLabel(r) {
    return { speaker: 'Prelegent', attendee: 'Uczestnik', organizer: 'Organizator', sponsor: 'Sponsor' }[r] || r;
}

function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.getDate() + ' ' + ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
        'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'][d.getMonth()] + ' ' + d.getFullYear();
}

document.addEventListener('DOMContentLoaded', function () {
    renderDashboard();
    updateNavCounts();

    document.getElementById('navToggle').addEventListener('click', function () {
        document.getElementById('navMenu').classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var t = this.getAttribute('href').substring(1);
            filterStatus = 'all';
            filterSearch = '';
            if (t === 'dashboard') renderDashboard();
            if (t === 'events') renderEvents();
            document.getElementById('navMenu').classList.remove('open');
        });
    });

    document.getElementById('addEventForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var title = document.getElementById('evTitle').value.trim();
        var date = document.getElementById('evDate').value;
        var loc = document.getElementById('evLocation').value.trim();
        if (!title || !date || !loc) return;
        store.events.push({
            id: store.nextId++, title: title, date: date, location: loc,
            desc: document.getElementById('evDesc').value.trim() || '',
            status: 'active', tasks: [], participants: []
        });
        saveStore();
        this.reset();
        document.getElementById('addEventModal').classList.remove('open');
        renderEvents();
        updateNavCounts();
    });

    document.querySelectorAll('.modal-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            this.closest('.modal').classList.remove('open');
        });
    });
    document.querySelectorAll('.modal').forEach(function (m) {
        m.addEventListener('click', function (e) {
            if (e.target === this) this.classList.remove('open');
        });
    });
});
