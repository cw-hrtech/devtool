function saveOptions() {
    let start = $('#start').val().trim();
    let end = $('#end').val().trim();
    chrome.storage.sync.set({
        start, end
    }, function () {
        // $('.text-success').removeClass('d-none')
    });
}

function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        start: 0,
        end: 0,
    }, function (items) {
        $('#start').val(items['start'])
        $('#end').val(items['end'])
    });
}

document.addEventListener('DOMContentLoaded', function () {
    restoreOptions();
    document.getElementById('save-option').addEventListener('click', saveOptions);
});
