function execJS() {
    $('.spinner-border').removeClass('d-none');
    chrome.tabs.executeScript({
        file: 'content.js'
    });
}

var developName = '';

function loadDevelopName() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        developer: '',
    }, function (items) {
        if (items['developer'].length > 0) {
            developName = items['developer'];
            $('#develop-name').html(items['developer'])
        }
    });
}

function copyTableData() {
    var clipboard = new Clipboard('#btn-copy');

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        $.notify("Danh sách files thay đổi đã được thêm vào clipboard.", "success");
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadDevelopName();
    document.getElementById('btn-copy').addEventListener('click', copyTableData);
    document.getElementById('load-data').addEventListener('click', execJS);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.msg === "completed") {
                let html = '';
                let fileOnly = $('#file-only').prop('checked');
                request.data.files.forEach(function (item, index) {
                    if (fileOnly) {
                        html += `<tr>
                                <td>${item['path']}</td>
                            </tr>`;
                    } else {
                        html += `<tr>
                                <td style="width: 50px" class="font-weight-bold text-center ${item['tdClass']}">${item['status']}</td>
                                <td>${item['path']}</td>
                                <td style="width: 150px">${developName}</td>
                            </tr>`;
                    }
                });
                $('#table-wrapper').removeClass('d-none');
                $('#table-result table').html(html);
                $.notify(`Có ${request.data.files.length} files thay đổi`, "success");
                $('#btn-copy').removeClass('d-none');
            }
            $('.spinner-border').addClass('d-none');
        }
    );

});
