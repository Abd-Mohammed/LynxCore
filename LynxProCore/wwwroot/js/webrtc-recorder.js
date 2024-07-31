/*!
 * WebRtc Recording v0.1
 * Copyright 2018 lynx, Inc.
 */
'use strict'; 
(function (lynx, undefined) {
    (function (WebRtc, undefined) {
        var RecStatus = Object.freeze({
            Recording: 'RECORDING',
            Error: 'ERROR',
            Stop: 'STOP',
        });

        lynx.WebRtc.Recording = (function () {

            var mediaSource = new MediaSource();
            var mediaRecorder;
            var recordedBlobs;
            var recordStatus;

            var canvas;
            var downloadAfterStop = false;
            var downloadFileName = 'Vedio';
            var stream;

            function Recording(args) {
                // Private variables
                canvas = document.querySelector(args.canvasId);
                downloadAfterStop = args.downloadAfterStop;
                downloadFileName = args.downloadFileName;

                stream = canvas.captureStream(); // frames per second
                recordStatus = RecStatus.Stop;
            }

            Recording.prototype.startRecording = function () {
                if (recordStatus == RecStatus.Recording) {
                    return;
                }
                startRecording();
            }

            Recording.prototype.stopRecording = function (fileName) {
                if (recordStatus == RecStatus.Stop) {
                    return;
                }
                stopRecording();
                recordStatus = RecStatus.Stop; 
                if (downloadAfterStop) {
                    if (fileName != null) {
                        downloadFileName = fileName
                    }
                    download(downloadFileName);
                }
            }

            Recording.prototype.download = function (fileName) {
                if (fileName != null) {
                    downloadFileName = fileName 
                }
                download(downloadFileName);
            }

            Recording.prototype.getStatus = function () {
                return recordStatus;
            }
             
            function handleDataAvailable(event) {
                if (event.data && event.data.size > 0) {
                    recordedBlobs.push(event.data);
                }
            }

            function startRecording() { 
                recordedBlobs = [];
                var options;
                try {
                    //if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
                    //    options = { type: 'video', mimeType: 'video/mp4;codecs=h264' };
                    //} else if (MediaRecorder.isTypeSupported('video/mp4; codecs="mpeg4, aac"')) {
                    //    options = { type: 'video', mimeType: 'video/mp4; codecs="mpeg4, aac"' };
                    //} else
                    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                        options = { type: 'video', mimeType: 'video/webm;codecs=vp9' };
                    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                        options = { mimeType: 'video/webm;codecs=vp8' };
                    }
                    mediaRecorder = new MediaRecorder(stream, options);
                    recordStatus = RecStatus.Recording;

                } catch (e) {
                    //console.log('Exception while creating MediaRecorder: ' + e);
                    //alert('Exception while creating MediaRecorder: '
                    //  + e + '. mimeType: ' + options.mimeType);
                    recordStatus = RecStatus.Error;
                    return;
                }

                mediaRecorder.ondataavailable = handleDataAvailable;
                mediaRecorder.start(10); // collect 10ms of data 
            }

            function stopRecording() { 
                mediaRecorder.stop();
            }

            function download(fileName) {
                if (recordStatus != RecStatus.Stop) {
                    return;
                } 
                if (recordedBlobs.length <= 1) {
                    //console.log('No Streaming Data');
                    return;
                }
                var blob = new Blob(recordedBlobs, { type: 'video/webm' });
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName + '.webm';
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            }

            return Recording;
        })();
    }(window.lynx.WebRtc = window.lynx.WebRtc || {}));
}(window.lynx = window.lynx || {}));