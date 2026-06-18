var store = {
    events: [
        {
            id: 1,
            title: 'Konferencja Technologiczna',
            date: '2026-07-15',
            location: 'Warszawa, Centrum Kongresowe',
            desc: 'Największe wydarzenie branżowe roku.',
            status: 'active',
            tasks: [
                { id: 1, text: 'Przygotowanie sali', done: false },
                { id: 2, text: 'Zamówienie cateringu', done: false },
                { id: 3, text: 'Wydrukowanie identyfikatorów', done: true }
            ],
            participants: []
        },
        {
            id: 2,
            title: 'Warsztaty React',
            date: '2026-08-22',
            location: 'Kraków, Makerspace',
            desc: 'Praktyczne warsztaty z React 19.',
            status: 'active',
            tasks: [
                { id: 4, text: 'Przygotowanie materiałów', done: true },
                { id: 5, text: 'Test sprzętu', done: false }
            ],
            participants: []
        },
        {
            id: 3,
            title: 'Hackathon Weekend',
            date: '2026-09-05',
            location: 'Wrocław, Park Technologiczny',
            desc: '48h maraton programowania.',
            status: 'planned',
            tasks: [
                { id: 6, text: 'Znalezienie sponsorów', done: false },
                { id: 7, text: 'Przygotowanie regulaminu', done: true },
                { id: 8, text: 'Promocja wydarzenia', done: false },
                { id: 9, text: 'Rezerwacja sal', done: false }
            ],
            participants: []
        }
    ],
    nextId: 10,
    nextTaskId: 10
};

function renderDashboard() {
    totalTasks = store.events.reduce(function (s, e) { return s + e.tasks.length; }, 0);
    doneTasks = store.events.reduce(function (s, e) { return s + e.tasks.filter(function (t) { return t.done; }).length; }, 0);
    participants = store.events.reduce(function (s, e) { return s + e.participants.length; }, 0);

    document.getElementById('dashboard').innerHTML =
        '<h2>Dashboard</h2><div class="stats">' +
        '<div>Wydarzenia <span>' + store.events.length + '</span></div>' +
        '<div>Zadania <span>' + doneTasks + '/' + totalTasks + '</span></div>' +
        '<div>Uczestnicy <span>' + participants + '</span></div></div>';
}

function renderEvents() {
    var html = '<div class="card-header"><h2>Wydarzenia</h2>' +
        '<button class="btn btn-primary btn-sm" id="addEventBtn">+ Dodaj event</button></div>';

    html += '<div class="events-grid">';
    store.events.forEach(function (e) {
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
    html += '</div>';
    document.getElementById('events').innerHTML = html;

    document.getElementById('addEventBtn').addEventListener('click', function () {
        document.getElementById('addEventModal').classList.add('open');
    });
    document.querySelectorAll('.event-card').forEach(function (card) {
        card.addEventListener('click', function () {
            openEventDetail(this.dataset.id);
        });
    });
}

function openEventDetail(id) {
    var e = store.events.find(function (ev) { return ev.id == id; });
    if (!e) return;
    var modal = document.getElementById('eventDetailModal');
    var body = document.getElementById('eventDetailBody');
    var done = e.tasks.filter(function (t) { return t.done; }).length;
    var pct = e.tasks.length > 0 ? Math.round(done / e.tasks.length * 100) : 0;

    var html = '<h3>' + e.title + '</h3>' +
        '<p><strong>Data:</strong> ' + formatDate(e.date) + '</p>' +
        '<p><strong>Miejsce:</strong> ' + e.location + '</p>' +
        '<p>' + e.desc + '</p>' +
        '<div class="progress-section"><div class="progress-header"><span>Postęp zadań</span><span>' + done + '/' + e.tasks.length + ' (' + pct + '%)</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>' +
        '<h4>Zadania</h4><ul class="task-list" data-event="' + e.id + '">';

    e.tasks.forEach(function (t) {
        html += '<li><label><input type="checkbox" class="task-check" data-task="' + t.id + '" data-event="' + e.id + '"' + (t.done ? ' checked' : '') + '> ' + t.text + '</label></li>';
    });

    html += '</ul>' +
        '<div class="add-task-row"><input type="text" id="newTaskInput" placeholder="Nowe zadanie...">' +
        '<button class="btn btn-primary btn-sm" id="addTaskBtn">Dodaj</button></div>';

    body.innerHTML = html;
    modal.classList.add('open');

    body.querySelectorAll('.task-check').forEach(function (cb) {
        cb.addEventListener('change', function () {
            var evId = this.dataset.event;
            var taskId = this.dataset.task;
            var ev = store.events.find(function (x) { return x.id == evId; });
            if (ev) {
                var task = ev.tasks.find(function (t) { return t.id == taskId; });
                if (task) task.done = this.checked;
            }
            openEventDetail(evId);
            renderEvents();
            renderDashboard();
        });
    });

    document.getElementById('addTaskBtn').addEventListener('click', function () {
        var input = document.getElementById('newTaskInput');
        var text = input.value.trim();
        if (!text) return;
        var ev = store.events.find(function (x) { return x.id == e.id; });
        if (ev) {
            ev.tasks.push({ id: store.nextTaskId++, text: text, done: false });
        }
        input.value = '';
        openEventDetail(e.id);
        renderEvents();
        renderDashboard();
    });
}

function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.getDate() + ' ' + ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
        'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'][d.getMonth()] + ' ' + d.getFullYear();
}

document.addEventListener('DOMContentLoaded', function () {
    renderDashboard();
    renderEvents();

    document.getElementById('navToggle').addEventListener('click', function () {
        document.getElementById('navMenu').classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var t = this.getAttribute('href').substring(1);
            document.querySelectorAll('main section').forEach(function (s) { s.style.display = 'none'; });
            document.getElementById(t).style.display = 'block';
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
            id: store.nextId++,
            title: title, date: date, location: loc,
            desc: document.getElementById('evDesc').value.trim() || '',
            status: 'active', tasks: [], participants: []
        });
        this.reset();
        document.getElementById('addEventModal').classList.remove('open');
        renderDashboard();
        renderEvents();
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
