const store = {
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
    ]
};

function renderDashboard() {
    const totalEvents = store.events.length;
    const totalTasks = store.events.reduce((s, e) => s + e.tasks.length, 0);
    const doneTasks = store.events.reduce((s, e) => s + e.tasks.filter(t => t.done).length, 0);
    const totalParticipants = store.events.reduce((s, e) => s + e.participants.length, 0);

    const dash = document.getElementById('dashboard');
    dash.innerHTML = '<h2>Dashboard</h2><div class="stats">' +
        '<div>Wydarzenia <span>' + totalEvents + '</span></div>' +
        '<div>Zadania <span>' + doneTasks + '/' + totalTasks + '</span></div>' +
        '<div>Uczestnicy <span>' + totalParticipants + '</span></div></div>';
}

function renderEvents() {
    const section = document.getElementById('events');
    let html = '<h2>Wydarzenia</h2>';
    store.events.forEach(function (e) {
        html += '<article>' +
            '<h3>' + e.title + '</h3>' +
            '<p>' + e.date + ' | ' + e.location + '</p>' +
            '<p>Status: ' + e.status + '</p>' +
            '<p>Zadania: ' + e.tasks.filter(t => t.done).length + '/' + e.tasks.length +
            ' | Uczestnicy: ' + e.participants.length + '</p>' +
            '</article>';
    });
    section.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    renderDashboard();
    renderEvents();

    document.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = this.getAttribute('href').substring(1);
            document.querySelectorAll('section').forEach(function (s) { s.style.display = 'none'; });
            var el = document.getElementById(target);
            if (el) el.style.display = 'block';
        });
    });
});
