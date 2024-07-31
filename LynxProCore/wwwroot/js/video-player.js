var self;
var defaultMime;
var url;
var anchor;
var myBlob;
var fileName;
var videoPlayers = [];
var player;
var videoName;
var blobName;
var crrvideo;
function preparePlayer(playerId) {
    setTimeout(function () {
        var index = videoPlayers.findIndex(i => i.id() == playerId || `${i.id()}_html5_api` == playerId);
        resetPrevPlayer();
        if (index == -1) {
            initializePlayer(playerId);
            videoPlayers.push(player);
        }
        else {
            player = videoPlayers[index];
            resetCurrentPlayer();
        }
        blobName = player.tagAttributes["data-name"];
        var blobDetailsUrl = player.tagAttributes["data-details"]
        getBlobs(blobName);

        $.ajax({
            url: blobDetailsUrl,
            contentType: 'application/json; charset=utf-8',
            type: 'GET',
            cache: false,
        }).done(function (blob) {
            $(crrvideo[0]).closest('.item').find('.image-date-caption').html(blob.createdDate);
        });
    }, 2000);
}

function resetVideoPlayers() {
    videoPlayers.forEach((videoPlayer) => {
        videoPlayer.dispose();
    })

    fileName = '';
    videoPlayers = [];
    player = null;
    videoName = '';
}

function initializePlayer(playerId) {

    player = videojs(playerId, {
        inactivityTimeout: 0,
        bigPlayButton: false,
        renderers: ['html5'],
        autoplay: false,
        muted: true,
        controls: true,
        errorDisplay: false,
        preload: 'auto',
        controlBar: {
            pictureInPictureToggle: false,
            children: {
                "playToggle": {},
                "progressControl": {},
                "timeDivider": {},
                "durationDisplay": {},
                "remainingTimeDisplay": {},
                "muteToggle": {},
                "volumeControl": {},
                "fullscreenToggle": {},
            }
        }
    });

    player.on("loadeddata", function () {
        videoName = player.tagAttributes["data-name"];
        const controlBar = player.getChild('ControlBar');
        controlBar.removeChild('downloadButton');
        controlBar.addChild('downloadButton', {});
    });

    player.userActive(true);
    var streamLink = player.tagAttributes["data-url"];
    loadVideoPlayer(streamLink);
}

function loadVideoPlayer(streamLink) {
    $.ajax({
        url: streamLink,
        type: 'Get',
        cache: false,
        timeout: 30 * 1000,
        xhrFields: {
            responseType: 'blob'
        },
        async: true
    }).done(data => {
        if (data != null) {
            player.src({
                type: 'video/mp4',
                src: self.URL.createObjectURL(data)
            });
        }
    }).fail(function () {
        Metronic.unblockUI('#attachments');
    }).always(function () {
        Metronic.unblockUI('#attachments');
    });
}

function registerSettings() {
    var button = videojs.getComponent('Button');
    var downloadButton = videojs.extend(button, {
        constructor: function () {
            button.apply(this, arguments);
            this.addClass('fa');
            this.addClass('fa-download');
            this.setAttribute('title', 'Download Record');
        },
        handleClick: function () {
            Metronic.blockUI({ target: '#attachments', animate: true });
            $.ajax({
                url: player.tagAttributes["data-download"],
                type: 'Get',
                cache: false,
                timeout: 30 * 1000,
                xhrFields: {
                    responseType: 'blob'
                },
                async: true
            }).done(data => {
                if (data != null) {
                    download(data, videoName, "video/mp4");
                }
            }).fail(function () {
                Metronic.unblockUI('#attachments');
            }).always(function () {
                Metronic.unblockUI('#attachments');
            });
        }
    });
    videojs.registerComponent('downloadButton', downloadButton);
}

function resetPrevPlayer() {
    if (player != null) {
        player.reset();
    }
}

function resetCurrentPlayer() {
    if (player != null) {

        player.reset();
        $(`#${player.id()}`).find('.vjs-play-control').removeClass('vjs-playing').addClass('vjs-pause');
        var streamLink = player.tagAttributes["data-url"];
        loadVideoPlayer(streamLink);
    }
}

function download(data, strFileName, strMimeType) {
    self = window; // this script is only for browsers anyway...
    defaultMime = "application/octet-stream"; // this default mime also triggers iframe downloads
    var mimeType = strMimeType || defaultMime;
    var payload = data;
    url = !strFileName && !strMimeType && payload;

    anchor = document.createElement("a");

    var toString = function (a) {
        return String(a);
    };
    myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString;
    fileName = strFileName || "download";
    var blob;
    var reader;
    myBlob = myBlob.call ? myBlob.bind(self) : Blob;

    if (String(this) === "true") {
        //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
        payload = [payload, mimeType];
        mimeType = payload[0];
        payload = payload[1];
    }

    if (url && url.length < 2048) {
        // if no filename and no mime, assume a url was passed as the only argument
        fileName = url
            .split("/")
            .pop()
            .split("?")[0];
        anchor.href = url; // assign href prop to temp anchor
        if (anchor.href.indexOf(url) !== -1) {
            // if the browser determines that it's a potentially valid url path:
            var ajax = new XMLHttpRequest();
            ajax.open("GET", url, true);
            ajax.responseType = "blob";
            ajax.onload = function (e) {
                download(e.target.response, fileName, defaultMime);
            };
            setTimeout(function () {
                ajax.send();
            }, 0); // allows setting custom ajax headers using the return:
            return ajax;
        } // end if valid url?
    } // end if url?

    //go ahead and download dataURLs right away
    if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
        if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
            payload = dataUrlToBlob(payload);
            mimeType = payload.type || defaultMime;
        } else {
            return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
                ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
                : saver(payload); // everyone else can save dataURLs un-processed
        }
    } //end if dataURL passed?

    blob =
        payload instanceof myBlob
            ? payload
            : new myBlob([payload], {
                type: mimeType
            });


    if (navigator.msSaveBlob) {
        // IE10+ : (has Blob, but not a[download] or URL)
        return navigator.msSaveBlob(blob, fileName);
    }

    if (self.URL) {
        // simple fast and modern way using Blob and URL:
        saver(self.URL.createObjectURL(blob), true);
    } else {
        // handle non-Blob()+non-URL browsers:
        if (typeof blob === "string" || blob.constructor === toString) {
            try {
                return saver("data:" + mimeType + ";base64," + self.btoa(blob));
            } catch (y) {
                return saver("data:" + mimeType + "," + encodeURIComponent(blob));
            }
        }

        // Blob but not URL support:
        reader = new FileReader();
        reader.onload = function (e) {
            saver(this.result);
        };
        reader.readAsDataURL(blob);
    }
    return true;
};

function dataUrlToBlob(strUrl) {
    var parts = strUrl.split(/[:;,]/),
        type = parts[1],
        decoder = parts[2] == "base64" ? atob : decodeURIComponent,
        binData = decoder(parts.pop()),
        mx = binData.length,
        i = 0,
        uiArr = new Uint8Array(mx);

    for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

    return new myBlob([uiArr], {
        type: type
    });
}

function saver(url, winMode) {
    if ("download" in anchor) {
        //html5 A[download]
        anchor.href = url;
        anchor.setAttribute("download", fileName);
        anchor.className = "download-js-link";
        anchor.innerHTML = "downloading...";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        setTimeout(function () {
            anchor.click();
            document.body.removeChild(anchor);
            if (winMode === true) {
                setTimeout(function () {
                    self.URL.revokeObjectURL(anchor.href);
                }, 250);
            }
        }, 66);
        return true;
    }

    // handle non-a[download] safari as best we can:
    if (
        /(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(
            navigator.userAgent
        )
    ) {
        url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        if (!window.open(url)) {
            // popup blocked, offer direct download:
            if (
                confirm(
                    "Displaying New Document\n\nUse Save As... to download, then click back to return to this page."
                )
            ) {
                location.href = url;
            }
        }
        return true;
    }

    //do iframe dataURL download (old ch+FF):
    var f = document.createElement("iframe");
    document.body.appendChild(f);

    if (!winMode) {
        // force a mime that will download:
        url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
    }
    f.src = url;
    setTimeout(function () {
        document.body.removeChild(f);
    }, 333);
}

function showImgOrVideo(index) {
    resetPrevPlayer();
    if (typeof $(".owl-item > div:first-child")[index] != 'undefined') {
        var crrItemId = $(".owl-item > div:first-child")[index].id;
        if ($(`#${crrItemId}`).find("img").length > 0) {
            var crrimg = $(`#${crrItemId} img:first-child`);
            var name = crrimg.attr('name');
            getBlobs(name);
            if (crrimg[0].src.indexOf('loading.gif') != -1) {
                $.ajax({
                    url: crrimg[0].dataset.details,
                    contentType: 'application/json; charset=utf-8',
                    type: 'GET',
                    cache: false,
                }).done(function (blob) {
                    $(crrimg[0]).next().html(blob.createdDate);
                });
                crrimg.attr('src', crrimg[0].dataset.url);
            }

            setTimeout(function () { showImageDownloadButton(); }, 100);
        }
        else {
            crrvideo = $(`#${crrItemId} video:first-child`);
            preparePlayer(crrvideo[0].id);
        }
    }
}

//To hide download button for none active images
function showImageDownloadButton() {
    $('.download-button').each(function (i, element) {
        if (element.parentElement.parentElement.className === 'owl-item active') {
            element.style.display = 'block'
        }
        else {
            element.style.display = 'none'
        }
    });
}