function getQueryParam(name) {
    var match = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function renderEventDetail() {
    var id = getQueryParam('id');
    if (!id) {
        document.getElementById('eventDetail').innerHTML = '<p style="color:#e74c3c">Brak identyfikatora wydarzenia.</p>';
        return;
    }
    var e = getEventById(id);
    if (!e) {
        document.getElementById('eventDetail').innerHTML = '<p style="color:#e74c3c">Wydarzenie nie znalezione.</p>';
        return;
    }

    var doneTasks = e.tasks.filter(function (t) { return t.done; }).length;
    var pct = e.tasks.length > 0 ? Math.round(doneTasks / e.tasks.length * 100) : 0;

    var html = '<div style="display:flex;gap:8px;margin-bottom:12px">' +
        '<a href="events.html" class="btn btn-outline btn-sm">&larr; Powrót do listy</a>' +
        '<button class="btn btn-sm" id="deleteEventBtn" style="background:#e74c3c;color:#fff;margin-left:auto">Usuń wydarzenie</button></div>' +
        '<div class="detail-header"><h2>' + e.title + '</h2>' +
        '<span class="event-status ' + e.status + '">' + (e.status === 'active' ? 'Aktywne' : 'Planowane') + '</span></div>' +
        '<p><strong>Data:</strong> ' + formatDate(e.date) + '</p>' +
        '<p><strong>Miejsce:</strong> ' + e.location + '</p>' +
        '<p class="event-desc-full">' + e.desc + '</p>' +
        '<div class="progress-section"><div class="progress-header"><span>Postęp zadań</span><span>' + doneTasks + '/' + e.tasks.length + ' (' + pct + '%)</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>' +
        '<div class="detail-tabs"><button class="tab-btn active" data-tab="tasks">Zadania (' + e.tasks.length + ')</button>' +
        '<button class="tab-btn" data-tab="participants">Uczestnicy (' + e.participants.length + ')</button></div>';

    html += '<div id="tasksTab" class="tab-content active"><ul class="task-list">';
    e.tasks.forEach(function (t) {
        html += '<li style="display:flex;align-items:center;justify-content:space-between">' +
            '<label><input type="checkbox" class="task-check" data-task="' + t.id + '"' + (t.done ? ' checked' : '') + '> ' + t.text + '</label>' +
            '<button class="task-del" data-task="' + t.id + '" title="Usuń zadanie">&times;</button></li>';
    });
    html += '</ul><div class="add-row"><input type="text" id="newTaskInput" placeholder="Nowe zadanie...">' +
        '<button class="btn btn-primary btn-sm" id="addTaskBtn">Dodaj</button></div></div>';

    html += '<div id="participantsTab" class="tab-content"><div class="participants-grid">';
    e.participants.forEach(function (p) {
        html += '<div class="participant-card">' +
            '<span class="avatar">' + getInitials(p.name) + '</span>' +
            '<div style="flex:1"><strong>' + p.name + '</strong><span class="part-email">' + p.email + '</span></div>' +
            '<span class="part-role ' + p.role + '">' + roleLabel(p.role) + '</span>' +
            '<button class="part-del" data-part="' + p.id + '" title="Usuń uczestnika">&times;</button></div>';
    });
    html += '</div><div class="add-row">' +
        '<input type="text" id="newPartName" placeholder="Imię i nazwisko...">' +
        '<input type="email" id="newPartEmail" placeholder="Email...">' +
        '<select id="newPartRole"><option value="attendee">Uczestnik</option><option value="speaker">Prelegent</option><option value="organizer">Organizator</option><option value="sponsor">Sponsor</option></select>' +
        '<button class="btn btn-primary btn-sm" id="addPartBtn">Dodaj</button></div></div>';

    document.getElementById('eventDetail').innerHTML = html;

    document.getElementById('deleteEventBtn').addEventListener('click', function () {
        if (confirm('Czy na pewno chcesz usunąć wydarzenie "' + e.title + '"?')) {
            store.events = store.events.filter(function (ev) { return ev.id !== e.id; });
            saveStore();
            location.href = 'events.html';
        }
    });

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
            var task = e.tasks.find(function (t) { return t.id == this.dataset.task; });
            if (task) task.done = this.checked;
            saveStore();
            renderEventDetail();
        });
    });

    document.querySelectorAll('.task-del').forEach(function (btn) {
        btn.addEventListener('click', function () {
            e.tasks = e.tasks.filter(function (t) { return t.id != this.dataset.task; });
            saveStore();
            renderEventDetail();
        });
    });

    document.querySelectorAll('.part-del').forEach(function (btn) {
        btn.addEventListener('click', function () {
            e.participants = e.participants.filter(function (p) { return p.id != this.dataset.part; });
            saveStore();
            renderEventDetail();
        });
    });

    document.getElementById('addTaskBtn').addEventListener('click', function () {
        var text = document.getElementById('newTaskInput').value.trim();
        if (!text) return;
        e.tasks.push({ id: store.nextTaskId++, text: text, done: false });
        document.getElementById('newTaskInput').value = '';
        saveStore();
        renderEventDetail();
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
        renderEventDetail();
    });
}

document.addEventListener('DOMContentLoaded', renderEventDetail);
