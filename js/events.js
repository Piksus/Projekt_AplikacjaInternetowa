var filterStatus = 'all', filterSearch = '';

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

function renderEventsList() {
    var filtered = getFilteredEvents();
    var grid = document.getElementById('eventsGrid');
    var html = '';
    if (filtered.length === 0) {
        html = '<p style="grid-column:1/-1;text-align:center;color:#95a5a6;padding:40px 0">Brak wydarzeń spełniających kryteria.</p>';
    }
    filtered.forEach(function (e) {
        var done = e.tasks.filter(function (t) { return t.done; }).length;
        var pct = e.tasks.length > 0 ? Math.round(done / e.tasks.length * 100) : 0;
        html += '<article class="event-card" onclick="location=\'event.html?id=' + e.id + '\'">' +
            '<h3>' + e.title + '</h3>' +
            '<p class="event-date">' + formatDate(e.date) + ' | ' + e.location + '</p>' +
            '<p class="event-desc">' + e.desc + '</p>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
            '<p class="event-meta">Zadania: ' + done + '/' + e.tasks.length +
            ' | Uczestnicy: ' + e.participants.length +
            ' <span class="event-status ' + e.status + '">' + (e.status === 'active' ? 'Aktywne' : 'Planowane') + '</span></p></article>';
    });
    grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    renderEventsList();

    document.getElementById('addEventBtn').addEventListener('click', function () {
        document.getElementById('addEventModal').classList.add('open');
    });

    document.getElementById('searchInput').addEventListener('input', function () {
        filterSearch = this.value;
        renderEventsList();
    });
    document.getElementById('statusFilter').addEventListener('change', function () {
        filterStatus = this.value;
        renderEventsList();
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
        renderEventsList();
    });

    document.querySelectorAll('.modal-close').forEach(function (btn) {
        btn.addEventListener('click', function () { this.closest('.modal').classList.remove('open'); });
    });
    document.querySelectorAll('.modal').forEach(function (m) {
        m.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });
    });
});
