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
            participants: [
                { id: 1, name: 'Anna Kowalska', email: 'anna@example.com', company: 'ABC', role: 'speaker' },
                { id: 2, name: 'Jan Nowak', email: 'jan@example.com', company: 'XYZ', role: 'attendee' }
            ]
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
            participants: [
                { id: 3, name: 'Ewa Wiśniewska', email: 'ewa@example.com', company: '123', role: 'organizer' }
            ]
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
    nextId: 4
};

function renderDashboard() {
    var totalEvents = store.events.length;
    var totalTasks = store.events.reduce(function (s, e) { return s + e.tasks.length; }, 0);
    var doneTasks = store.events.reduce(function (s, e) { return s + e.tasks.filter(function (t) { return t.done; }).length; }, 0);
    var totalParticipants = store.events.reduce(function (s, e) { return s + e.participants.length; }, 0);

    var dash = document.getElementById('dashboard');
    dash.innerHTML = '<h2>Dashboard</h2><div class="stats">' +
        '<div>Wydarzenia <span>' + totalEvents + '</span></div>' +
        '<div>Zadania <span>' + doneTasks + '/' + totalTasks + '</span></div>' +
        '<div>Uczestnicy <span>' + totalParticipants + '</span></div></div>';
}

function renderEvents() {
    var section = document.getElementById('events');
    var html = '<div class="card-header"><h2>Wydarzenia</h2>' +
        '<button class="btn btn-primary btn-sm" id="addEventBtn">+ Dodaj event</button></div>';

    html += '<div class="events-grid">';
    store.events.forEach(function (e) {
        var doneTasks = e.tasks.filter(function (t) { return t.done; }).length;
        html += '<article class="event-card" data-id="' + e.id + '">' +
            '<h3>' + e.title + '</h3>' +
            '<p class="event-date">' + formatDate(e.date) + ' | ' + e.location + '</p>' +
            '<p class="event-desc">' + e.desc + '</p>' +
            '<div class="event-meta">' +
            '<span>Zadania: ' + doneTasks + '/' + e.tasks.length + '</span>' +
            '<span>Uczestnicy: ' + e.participants.length + '</span>' +
            '<span class="event-status ' + e.status + '">' + (e.status === 'active' ? 'Aktywne' : 'Planowane') + '</span>' +
            '</div></article>';
    });
    html += '</div>';
    section.innerHTML = html;

    document.getElementById('addEventBtn').addEventListener('click', function () {
        document.getElementById('addEventModal').classList.add('open');
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

    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () { menu.classList.toggle('open'); });
    }

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = this.getAttribute('href').substring(1);
            document.querySelectorAll('main section').forEach(function (s) { s.style.display = 'none'; });
            var el = document.getElementById(target);
            if (el) el.style.display = 'block';
            if (menu) menu.classList.remove('open');
        });
    });

    var form = document.getElementById('addEventForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var title = document.getElementById('evTitle').value.trim();
            var date = document.getElementById('evDate').value;
            var location = document.getElementById('evLocation').value.trim();
            var desc = document.getElementById('evDesc').value.trim();
            if (!title || !date || !location) return;

            store.events.push({
                id: store.nextId++,
                title: title,
                date: date,
                location: location,
                desc: desc || '',
                status: 'active',
                tasks: [],
                participants: []
            });
            form.reset();
            document.getElementById('addEventModal').classList.remove('open');
            renderDashboard();
            renderEvents();
        });
    }

    var modal = document.getElementById('addEventModal');
    if (modal) {
        modal.querySelector('.modal-close').addEventListener('click', function () {
            modal.classList.remove('open');
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.classList.remove('open');
        });
    }
});
