if (document.location.origin === 'https://gitlab002.co-well.jp') {
    let pathArr = document.location.pathname.split('/');
    if (pathArr.length < 5) {
        alert('Extension chỉ chạy được ở trang merge requests, VD: https://gitlab002.co-well.jp/willandway/historia/merge_requests/1134/diffs')
    } else {
        let mergeId = pathArr[4];
        $.ajax({
            type: 'GET',
            url: `https://gitlab002.co-well.jp/willandway/historia/merge_requests/${mergeId}/diffs.json`,
            success: function (data) {
                detechFileChange(data['diff_files']);
            }
        })
    }
} else {
    alert('Extension chỉ chạy được trên trang https://gitlab002.co-well.jp/')
}

function detechFileChange(data) {
    let filesChange = [];
    data.forEach(function (item) {
        let status = 'New file';
        let tdClass = 'text-primary';
        if (item['new_file']) {
            status = 'A'
            tdClass = 'text-primary';
        }
        if (item['deleted_file']) {
            status = 'D'
            tdClass = 'text-danger';
        }
        if (item['new_file'] == false && item['deleted_file'] == false) {
            status = 'U'
            tdClass = 'text-warning';
        }
        let file = {
            path: item.file_path,
            status: status,
            tdClass: tdClass
        }
        filesChange.push(file)
    })
    sendToPopup(filesChange);
}

function sendToPopup(files) {
    chrome.runtime.sendMessage({
        msg: "completed",
        data: {
            files: files
        }
    });
}
