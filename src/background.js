///////////////////////////////// Context Menus ////////////////////////////////////////////////////////////////////////

function contextMenu_bookmark_onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log('context menu created')
    }
}

function createMenus() {
    console.log('start creating menus')

    let menu_items = [{
        id: "bookmarks-save-csv-1",
        title: "Export all in CSV (sep: ';')",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-2",
        title: "Export all in CSV (sep: ',')",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    },{
        id: "bookmarks-save-csv-3",
        title: "Export all in text (sep: tab)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-4",
        title: "Export all in text (sep: newline)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    },{
        id: "bookmarks-save-csv-5",
        title: "Export all in text (only URLs) - (sep: tab)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-6",
        title: "Export all in text (only URLs) - (sep: newline)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    },{
        id: "bookmarks-save-csv-7", title: "", contexts: ["bookmark"], enabled: true, type: "separator", visible: true,
    }, {
        id: "bookmarks-save-csv-8",
        title: "Export branch in csv (sep: ';')",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-9",
        title: "Export branch in csv (sep: ',')",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-10",
        title: "Export branch in text (sep: tab)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-11",
        title: "Export branch in text (sep: newline)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    },{
        id: "bookmarks-save-csv-12",
        title: "Export branch in csv (only URLs) - (sep: ';')",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }, {
        id: "bookmarks-save-csv-13",
        title: "Export branch in text (only URLs) - (sep: newline)",
        contexts: ["bookmark"],
        enabled: true,
        type: "normal",
        visible: true,
    }]


    for (const menu_item of menu_items) {
        console.log(menu_item)
        browser.contextMenus.create(menu_item, contextMenu_bookmark_onCreated,);
    }

    console.log('end creating menus')
}


function listener_clicked_Menus(info) {
    console.log('bookmarks-save-csv extension - clicked', info);
    switch (info.menuItemId) {
        case "bookmarks-save-csv-1":
            save_all_bookmarks({is_csv:true, sep_is_semicolon:true, sep_is_tab:true, is_url_only:false})
            break;
        case "bookmarks-save-csv-2":
            save_all_bookmarks({is_csv:true, sep_is_semicolon:false, sep_is_tab:true, is_url_only:false})
            break;
        case "bookmarks-save-csv-3":
            save_all_bookmarks({is_csv:false, sep_is_semicolon:false, sep_is_tab:true, is_url_only:false})
            break;
        case "bookmarks-save-csv-4":
            save_all_bookmarks({is_csv:false, sep_is_semicolon:false, sep_is_tab:false, is_url_only:false})
            break;
        case "bookmarks-save-csv-5":
            save_all_bookmarks({is_csv:false, sep_is_semicolon:false, sep_is_tab:true, is_url_only:true})
            break;
        case "bookmarks-save-csv-6":
            save_all_bookmarks({is_csv:false, sep_is_semicolon:false, sep_is_tab:false, is_url_only:true})
            break;
        case "bookmarks-save-csv-7":
            console.log("bookmarks-save-csv-7 : separator");
            break;
        case "bookmarks-save-csv-8":
            save_branch_bookmarks({base_bookmark:info.bookmarkId, is_csv:true, sep_is_semicolon:true, sep_is_tab:true, is_url_only:false})
            break;
        case "bookmarks-save-csv-9":
            save_branch_bookmarks({base_bookmark:info.bookmarkId, is_csv:true, sep_is_semicolon:false, sep_is_tab:true, is_url_only:false})
            break;
        case "bookmarks-save-csv-10":
            save_branch_bookmarks({base_bookmark:info.bookmarkId, is_csv:false, sep_is_semicolon:true, sep_is_tab:true, is_url_only:false})
            break;
        case "bookmarks-save-csv-11":
            save_branch_bookmarks({base_bookmark:info.bookmarkId, is_csv:false, sep_is_semicolon:true, sep_is_tab:false, is_url_only:false})
            break;
        case "bookmarks-save-csv-12":
            save_branch_bookmarks({base_bookmark:info.bookmarkId, is_csv:false, sep_is_semicolon:true, sep_is_tab:true, is_url_only:true})
            break;
        case "bookmarks-save-csv-13":
            save_branch_bookmarks({base_bookmark:info.bookmarkId, is_csv:false, sep_is_semicolon:true, sep_is_tab:false, is_url_only:true})
            break;
    }
}

function addListenerForMenus() {
    console.log('start add listener menus')

    browser.contextMenus.onClicked.addListener(listener_clicked_Menus)

    console.log('end add listener menus')
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// BOOKMARKS ////////////////////////////////////////////////////////////////////////////



function logItems(bookmarkItem, saved_data) {
    // console.log(bookmarkItem)
    switch (bookmarkItem.type) {
        case "bookmark":
            console.log(bookmarkItem.title, bookmarkItem.url);
            saved_data.push({"title": bookmarkItem.title, "url": bookmarkItem.url});
            break;
        case "folder":
            console.log(`folder`);
            break;
        case "separator":
            console.log(`separator`);
            break;
    }

    if (bookmarkItem.children) {
        for (const child of bookmarkItem.children) {
            logItems(child, saved_data);
        }
    }
}


function logTree(bookmarkItems) {
    return new Promise((resolve, reject) => {
        let saved_data = [];
        logItems(bookmarkItems[0], saved_data);
        // console.log('saved data:', saved_data);
        resolve(saved_data); })
}


function data_as_csv_sep_semicolon(data) {
    let st = 'title ; url \n'
    for (let d of data) {
        // console.log(d);
        const title = d.title;
        const url = d.url;
        st = st + title + ' ; ' +  url + '\n';
    }
    // console.log('st: ', st);
    return st;
}

function data_as_csv_sep_comma(data) {
    let st = 'title , url \n'
    for (const d of data) {
        // console.log(d);
        const title = d.title;
        const url = d.url;
        st = st + title + ' , ' +  url + '\n';
    }
    // console.log('st: ', st);
    return st;
}

function data_as_txt_tab_url_only(data) {
    let st = ''
    for (const d of data) {
        // console.log(d);
        const url = d.url;
        st = st +  url + '\t';
    }
    // console.log('st: ', st);
    return st;
}

function data_as_txt_newline_url_only(data) {
    let st = ''
    for (const d of data) {
        // console.log(d);
        const url = d.url;
        st = st + url + '\n';
    }
    // console.log('st: ', st);
    return st;
}



function data_as_txt_newline(data) {
    let st = ''
    for (const d of data) {
        // console.log(d);
        const title = d.title;
        const url = d.url;
        st = st + title + '  ' +  url + '\n';
    }
    // console.log('st: ', st);
    return st;
}

function data_as_txt_tab(data) {
    let st = ''
    for (const d of data) {
        // console.log(d);
        const title = d.title;
        const url = d.url;
        st = st + title + '  ' +  url + '\t';
    }
    // console.log('st: ', st);
    return st;
}

function get_transfo(is_csv, sep_is_semicolon, sep_is_tab, is_url_only) {
    let transformation
    let type
    if (is_csv === true) {
        type = saveData_as_csv
        transformation = sep_is_semicolon === true ? data_as_csv_sep_semicolon : data_as_csv_sep_comma;
    } else {
        type = saveData_as_txt
        transformation = sep_is_tab === true ? data_as_txt_tab : data_as_txt_newline;
        if (is_url_only === true) {
            transformation = sep_is_tab === true ? data_as_txt_tab_url_only : data_as_txt_newline_url_only;
        }
    }
    return {transformation, type};
}

function save_all_bookmarks({is_csv, sep_is_semicolon, sep_is_tab, is_url_only} = {}) {
    let {transformation, type} = get_transfo(is_csv, sep_is_semicolon, sep_is_tab, is_url_only);

    browser.bookmarks.getTree().then(logTree, (error) => {
        console.log(error)
    }).then((value) => {let data = transformation(value); type(data)}, (error) => {console.log(error)})
}

function save_branch_bookmarks({base_bookmark, is_csv, sep_is_semicolon, sep_is_tab, is_url_only} = {}) {
    // console.log('save_branch_bookmarks - base_bookmark:', base_bookmark);

    let {transformation, type} = get_transfo(is_csv, sep_is_semicolon, sep_is_tab, is_url_only);

    browser.bookmarks.getSubTree(base_bookmark).then(logTree, (error) => {
        console.log(error)
    }).then((value) => {let data = transformation(value); type(data)}, (error) => {console.log(error)})
}


function dateFile() {
    let dateUTC = new Date();
    return dateUTC.getUTCFullYear() + "-" + (dateUTC.getUTCMonth() + 1) + "-" + dateUTC.getUTCDate() + "_" + dateUTC.getUTCHours() + "-" + dateUTC.getUTCMinutes() + "-" + dateUTC.getUTCSeconds();
}

function saveData_as_txt(data) {
    let filename = 'bk_data_' + dateFile()
    let blob = new Blob([data], {type: 'application/txt'});
    let url = URL.createObjectURL(blob);
    let dateString = filename + ".txt";
    let download = browser.downloads.download({url: url, filename: dateString, saveAs: false});
    download.then(() => {
        let list = []
    }).catch(error => console.log(error));
}


function saveData_as_csv(data) {
    let filename = 'bk_data' + dateFile()
    let blob = new Blob([data], {type: 'application/csv'});
    let url = URL.createObjectURL(blob);
    let dateString = filename + ".csv";
    let download = browser.downloads.download({url: url, filename: dateString, saveAs: false});
    download.then(() => {
        let list = []
    }).catch(error => console.log(error));
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function init() {
    console.log('start init')
    createMenus();
    addListenerForMenus();
    console.log('end init')
}


function main() {
    console.log('start main')
    init()
    console.log('end main')
}


main()