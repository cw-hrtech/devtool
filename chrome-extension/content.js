if (document.location.origin !== 'https://gitlab002.co-well.jp') {
    alert('Extension chỉ chạy được trên trang https://gitlab002.co-well.jp/')
} else {
    var startId = 0;
    var endId = 0;
    chrome.storage.sync.get({
        start: '',
        end: '',
    }, async function (items) {
        startId = parseInt(items['start'])
        endId = parseInt(items['end'])
        let mergeId = 0;
        for (mergeId = startId; mergeId <= endId; mergeId++) {
            let checkStatus = `https://gitlab002.co-well.jp/willandway/historia/merge_requests/${mergeId}.json?serializer=widget`;
            let urlFileChange = `https://gitlab002.co-well.jp/willandway/historia/merge_requests/${mergeId}/diffs.json`
            let urlInfo = `https://gitlab002.co-well.jp/willandway/historia/merge_requests/${mergeId}.json?serializer=sidebar_extras`;
            let mID = mergeId

            await $.ajax({
                type: 'GET',
                url: checkStatus,
                success: async function (data) {
                    if (data['state'] == 'merged') {
                        await $.ajax({
                            type: 'GET',
                            url: urlInfo,
                            success: async function (data) {
                                let participants = data['participants'];
                                let userRequestMerge = participants[participants.length - 1];
                                let developerName = userRequestMerge['name'];
                                await $.ajax({
                                    type: 'GET',
                                    url: urlFileChange,
                                    success: function (data) {
                                        if (data['target_branch_name'] != 'develop') {
                                            detechFileChange(data['diff_files'], developerName, mID);
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    });
}

function detechFileChange(data, developerName, mergeId) {
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
    sendToPopup(filesChange, developerName, mergeId);
}

function sendToPopup(files, developerName, mergeId) {
    chrome.runtime.sendMessage({
        msg: "completed",
        data: {
            files: files,
            developerName: developerName,
            mergeId: mergeId
        }
    });
}
