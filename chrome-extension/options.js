function saveOptions() {
    let name = $('#name').val().trim();
    if (name.length == 0) {
        alert('Vui lòng nhập tên của bạn');
        return;
    }

    //check name have space
    let arr = name.split(' ');
    if (arr.length > 1) {
        alert('Tên không có dấu cách');
        return;
    }

    chrome.storage.sync.set({
        developer: name
    }, function () {
        $('.text-success').removeClass('d-none')
    });
}

function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        developer: '',
    }, function (items) {
        console.log('items', items)
        $('#name').val(items['developer'])
    });
}

document.addEventListener('DOMContentLoaded', function () {
    restoreOptions();
    document.getElementById('save-option').addEventListener('click', saveOptions);
});
