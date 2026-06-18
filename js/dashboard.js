var taskFilterEvent = 'all';

function renderAllTasks() {
    var select = document.getElementById('taskFilterEvent');

    var optHtml = '<option value="all"' + (taskFilterEvent === 'all' ? ' selected' : '') + '>Wszystkie wydarzenia</option>';
    store.events.forEach(function (e) {
        optHtml += '<option value="' + e.id + '"' + (taskFilterEvent == e.id ? ' selected' : '') + '>' + e.title + '</option>';
    });
    select.innerHTML = optHtml;

    var list = document.getElementById('allTasksList');
    var items = [];
    store.events.forEach(function (e) {
        if (taskFilterEvent !== 'all' && taskFilterEvent != e.id) return;
        e.tasks.forEach(function (t) {
            items.push({ task: t, event: e });
        });
    });

    var html = '';
    if (items.length === 0) {
        html = '<p style="text-align:center;color:#95a5a6;padding:20px 0">Brak zadań.</p>';
    }
    items.forEach(function (item) {
        var t = item.task, e = item.event;
        html += '<div class="all-task-row">' +
            '<label class="all-task-label">' +
            '<input type="checkbox" class="all-task-check" data-task="' + t.id + '" data-event="' + e.id + '"' + (t.done ? ' checked' : '') + '>' +
            '<span class="all-task-text' + (t.done ? ' done' : '') + '">' + t.text + '</span></label>' +
            '<span class="all-task-event">' + e.title + '</span>' +
            '<button class="task-del all-task-del" data-task="' + t.id + '" data-event="' + e.id + '" title="Usuń zadanie">&times;</button></div>';
    });
    list.innerHTML = html;

    document.querySelectorAll('.all-task-check').forEach(function (cb) {
        cb.addEventListener('change', function () {
            var eid = parseInt(this.dataset.event);
            var tid = parseInt(this.dataset.task);
            var ev = store.events.find(function (e) { return e.id === eid; });
            if (ev) {
                var task = ev.tasks.find(function (t) { return t.id === tid; });
                if (task) task.done = this.checked;
            }
            saveStore();
            renderAllTasks();
        });
    });

    document.querySelectorAll('.all-task-del').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var eid = parseInt(this.dataset.event);
            var tid = parseInt(this.dataset.task);
            var ev = store.events.find(function (e) { return e.id === eid; });
            if (ev) {
                ev.tasks = ev.tasks.filter(function (t) { return t.id !== tid; });
            }
            saveStore();
            renderAllTasks();
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var stats = getStats();
    document.getElementById('stats').innerHTML =
        '<div>Wydarzenia <span>' + stats.events + '</span></div>' +
        '<div>Zadania <span>' + stats.doneTasks + '/' + stats.totalTasks + '</span></div>' +
        '<div>Uczestnicy <span>' + stats.participants + '</span></div>';

    var recent = store.events.slice(-3).reverse();
    var html = '';
    recent.forEach(function (e) {
        var done = e.tasks.filter(function (t) { return t.done; }).length;
        var pct = e.tasks.length > 0 ? Math.round(done / e.tasks.length * 100) : 0;
        html += '<article class="event-card" onclick="location=\'event.html?id=' + e.id + '\'">' +
            '<h3>' + e.title + '</h3>' +
            '<p class="event-date">' + formatDate(e.date) + '</p>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
            '<p class="event-meta"><span>' + done + '/' + e.tasks.length + ' zadań</span>' +
            '<span class="event-status ' + e.status + '">' + (e.status === 'active' ? 'Aktywne' : 'Planowane') + '</span></p></article>';
    });
    document.getElementById('recentEvents').innerHTML = html;

    document.getElementById('taskFilterEvent').addEventListener('change', function () {
        taskFilterEvent = this.value;
        renderAllTasks();
    });

    renderAllTasks();
});
