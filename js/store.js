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

function loadStore() {
    try {
        var saved = localStorage.getItem('eventmanager_store');
        if (saved) { store = JSON.parse(saved); return; }
    } catch (e) {}
    store = { events: defaultEvents, nextId: 10, nextTaskId: 10, nextPartId: 10 };
}

function saveStore() {
    try { localStorage.setItem('eventmanager_store', JSON.stringify(store)); } catch (e) {}
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

function getEventById(id) {
    return store.events.find(function (e) { return e.id == id; });
}

function getStats() {
    var totalTasks = store.events.reduce(function (s, e) { return s + e.tasks.length; }, 0);
    var doneTasks = store.events.reduce(function (s, e) { return s + e.tasks.filter(function (t) { return t.done; }).length; }, 0);
    var participants = store.events.reduce(function (s, e) { return s + e.participants.length; }, 0);
    return { events: store.events.length, totalTasks: totalTasks, doneTasks: doneTasks, participants: participants };
}

var store;
loadStore();
