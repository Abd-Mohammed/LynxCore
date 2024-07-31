var acacus = acacus || {};
acacus.maps = {};

acacus.maps.drawing = {
    /**
     * Advanced drawing manager
     * */
    DrawingManager: class {
        map;
        constructor() {
            this.map = null;
        }

        init(map) {
            this.map = map;
            const parent = map.getDiv().parentElement;
            parent.insertAdjacentHTML('beforeend', this.html());
            parent.insertAdjacentHTML('beforeend', this.modalHtml());

            const boxDrawingTools = document.getElementById('divDrawingTools');
            const textModal = document.getElementById('textModal')
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(boxDrawingTools);
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(textModal);

            let actionStack = [];
            let redoActionStack = [];
            const strokeWeight = 1;
            const fillColor = $('#fillColor').val();
            const strokeColor = $('#strokeColor').val();
            const actionTypes = { DRAW: 'Draw', CLEAR: 'Clear' };

            // Clickable should be disabled to allow free hand drawing inside shapes
            let drawingOptions = {
                markerOptions: {
                    clickable: false
                },
                rectangleOptions: {
                    fillColor: fillColor,
                    strokeColor: strokeColor,
                    strokeWeight: strokeWeight,
                    clickable: false
                },
                polygonOptions: {
                    fillColor: fillColor,
                    strokeColor: strokeColor,
                    strokeWeight: strokeWeight,
                    clickable: false
                },
                circleOptions: {
                    fillColor: fillColor,
                    strokeColor: strokeColor,
                    strokeWeight: strokeWeight,
                    clickable: false
                },
                polylineOptions: {
                    strokeColor: strokeColor,
                    strokeWeight: strokeWeight,
                    clickable: false
                }
            };

            let drawingManager = new google.maps.drawing.DrawingManager({
                drawingControl: false,
                map: map,
                options: drawingOptions
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                let overlay = event.overlay;
                if (event.type === 'rectangle' && drawingOptions.rectangleOptions.$text === true) {
                    $('#textModal').data('rectangle', overlay);
                    $('#textModal').toggleClass('in inset-0 show');

                    overlay.setMap(null);
                } else {
                    actionStack.push({
                        type: actionTypes.DRAW,
                        overlay: overlay
                    });
                    enableUndoButton();
                    clearRedoActionStack();
                }
            });

            $('#divDrawingTools [data-drawing-mode]').on('click', function (event) {
                let mode;
                let drawingMode;
                delete drawingOptions.rectangleOptions.$text;

                if (event.target = this) {
                    drawingMode = $(event.target).attr('data-drawing-mode');
                } else {
                    drawingMode = $(event.target.parentElement).attr('data-drawing-mode');
                }

                switch (drawingMode) {
                    case 'Marker':
                        mode = google.maps.drawing.OverlayType.MARKER;
                        break;
                    case 'Polygon':
                        mode = google.maps.drawing.OverlayType.POLYGON;
                        break;
                    case 'Rectangle':
                        mode = google.maps.drawing.OverlayType.RECTANGLE;
                        break;
                    case 'Circle':
                        mode = google.maps.drawing.OverlayType.CIRCLE;
                        break;
                    case 'Polyline':
                        mode = google.maps.drawing.OverlayType.POLYLINE;
                        break;
                    case 'Text':
                        drawingOptions.rectangleOptions.$text = true;
                        mode = google.maps.drawing.OverlayType.RECTANGLE;
                        break;
                    default:
                        mode = null;
                        break;
                }

                enableMapOptions();
                drawingManager.setDrawingMode(mode);
                google.maps.event.clearListeners(map, 'mousedown');
            });

            $('#btnFreeHand').on('click', function () {
                disableMapOptions('crosshair');
                drawingManager.setDrawingMode(null);
                delete drawingOptions.rectangleOptions.$text;
                google.maps.event.clearListeners(map, 'mousedown');

                google.maps.event.addDomListener(map, 'mousedown', function () {
                    let poly = new google.maps.Polyline({
                        map: map,
                        clickable: false,
                        strokeColor: drawingOptions.polylineOptions.strokeColor,
                        strokeWeight: drawingOptions.polylineOptions.strokeWeight,
                        icons: drawingOptions.polylineOptions.icons,
                    });

                    let move = google.maps.event.addListener(map, 'mousemove', function (e) {
                        poly.getPath().push(e.latLng);
                    });

                    google.maps.event.addListenerOnce(map, 'mouseup', function () {
                        google.maps.event.removeListener(move);

                        actionStack.push({
                            type: actionTypes.DRAW,
                            overlay: poly
                        });
                        enableUndoButton();
                        clearRedoActionStack();
                    });
                });
            });

            function disableMapOptions(draggableCursor) {
                map.setOptions({
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: false,
                    // Refer to https://www.w3.org/TR/CSS21/ui.html#propdef-cursor
                    draggableCursor: draggableCursor
                });
            }

            function enableMapOptions() {
                map.setOptions({
                    draggable: true,
                    scrollwheel: true,
                    disableDoubleClickZoom: true,
                    draggableCursor: ''
                });
            }

            function enableUndoButton() {
                const btnUndo = $('#btnUndo');
                if (btnUndo.hasClass('disabled') === true) {
                    btnUndo.removeClass('disabled');
                }
            }

            function clearRedoActionStack() {
                if (redoActionStack.length === 0) {
                    return;
                }

                redoActionStack = [];
                $('#btnRedo').addClass('disabled');
            }

            // Register "input" event handler because it's fired every time the color changes.
            // The change event is fired when the user dismisses the color picker.
            $('#fillColor').on('input', function (event) {
                let fillColor = $(event.target).val();
                drawingOptions.polygonOptions.fillColor = fillColor;
                drawingOptions.rectangleOptions.fillColor = fillColor;
                drawingOptions.circleOptions.fillColor = fillColor;
                drawingManager.setOptions(drawingOptions);
            });

            // Register "input" event handler because it's fired every time the color changes.
            // The change event is fired when the user dismisses the color picker.
            $('#strokeColor').on('input', function (event) {
                let strokeColor = $(event.target).val();
                drawingOptions.polygonOptions.strokeColor = strokeColor;
                drawingOptions.rectangleOptions.strokeColor = strokeColor;
                drawingOptions.circleOptions.strokeColor = strokeColor;
                drawingOptions.polylineOptions.strokeColor = strokeColor;
                drawingManager.setOptions(drawingOptions);
            });

            $('#divStrokeWeight a').on('click', function (event) {
                let anchor;
                let strokeWeight;
                if (event.target = this) {
                    anchor = $(event.target);
                    strokeWeight = parseInt(anchor.find('canvas').eq(0).attr('height'));
                } else {
                    anchor = $(event.target.parentElement);
                    strokeWeight = parseInt(anchor.attr('height'));
                }

                drawingOptions.polygonOptions.strokeWeight = strokeWeight;
                drawingOptions.rectangleOptions.strokeWeight = strokeWeight;
                drawingOptions.circleOptions.strokeWeight = strokeWeight;
                drawingOptions.polylineOptions.strokeWeight = strokeWeight;
                drawingManager.setOptions(drawingOptions);

                $('#divStrokeWeight li').removeClass('active');
                anchor.parent().addClass('active');
            });

            $('#divArrowType a').on('click', function (event) {
                let anchor;
                let arrowType;
                let icons;
                if (event.target = this) {
                    anchor = $(event.target);
                    arrowType = anchor.attr('data-arrow-type');
                } else {
                    anchor = $(event.target.parentElement);
                    arrowType = anchor.attr('data-arrow-type');
                }

                switch (arrowType) {
                    case 'Arrow':
                        icons = [{
                            icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW }
                        }];
                        break;
                    case 'RepeatArrow':
                        icons = [{
                            icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW },
                            repeat: '50px'
                        }];
                        break;
                    default:
                        icons = null;
                        break;
                }

                if (arrowType !== null) {
                    drawingOptions.polylineOptions.icons = icons;
                    drawingManager.setOptions(drawingOptions);
                }

                $('#divArrowType a').removeClass('active');
                anchor.addClass('active');
            });

            $('#btnSaveText').on('click', function () {
                const textModal = $('#textModal');
                const textArea = $('#message-text');
                const textVal = textArea.val().trim();
                if (textVal !== '') {
                    const overlay = new acacus.maps.overlays.TextOverlay(textModal.data('rectangle').getBounds(), textVal);

                    overlay.setMap(map);
                    actionStack.push({
                        type: actionTypes.DRAW,
                        overlay: overlay
                    });
                    enableUndoButton();
                    clearRedoActionStack();
                }

                textArea.val('');
                textModal.removeData('rectangle');
                textModal.toggleClass('in inset-0 show');
            });

            function closeTextModalHandler() {
                $('#message-text').val('');
                $('#textModal').removeData('rectangle');
                $('#textModal').toggleClass('in inset-0 show');
            }

            $('#btnCancelText').on('click', function () {
                closeTextModalHandler()
            });

            $('#textModal > div > div > div.modal-header > button').on('click', function () {
                closeTextModalHandler()
            });

            $(document).on('click', '#btnUndo:not(.disabled)', function () {
                let action = actionStack[actionStack.length - 1];

                actionStack.pop();
                redoActionStack.push(action);

                if (action.type === actionTypes.DRAW) {
                    action.overlay.setMap(null);
                } else {
                    let clearedLength = action.overlays.length;
                    for (let i = 0; i < clearedLength; i++) {
                        action.overlays[i].setMap(map);
                    }
                }

                if (actionStack.length === 0) {
                    $('#btnUndo').addClass('disabled');
                } else {
                    $('#btnUndo').removeClass('disabled');
                }

                if (redoActionStack.length === 0) {
                    $('#btnRedo').addClass('disabled');
                } else {
                    $('#btnRedo').removeClass('disabled');
                }
            });

            $(document).on('click', '#btnRedo:not(.disabled)', function () {
                let redoAction = redoActionStack[redoActionStack.length - 1];

                redoActionStack.pop();
                actionStack.push(redoAction);
                if (redoAction.type === actionTypes.DRAW) {
                    redoAction.overlay.setMap(map);
                } else {
                    let clearedLength = redoAction.overlays.length;
                    for (let i = 0; i < clearedLength; i++) {
                        redoAction.overlays[i].setMap(null);
                    }
                }

                if (redoActionStack.length === 0) {
                    $('#btnRedo').addClass('disabled');
                } else {
                    $('#btnRedo').removeClass('disabled');
                }

                if (actionStack.length === 0) {
                    $('#btnUndo').addClass('disabled');
                } else {
                    $('#btnUndo').removeClass('disabled');
                }
            });

            $('#btnClear').on('click', function () {
                let length = actionStack.length;
                if (length === 0) {
                    return;
                }

                let type = actionStack[length - 1].type;
                if (type !== actionTypes.DRAW) {
                    return;
                }

                // Find last clear action index to remove the related overlays, otherwise 
                // consider all actions are eligible for removal, no found index will return -1
                let lastClearActionIndex = actionStack.map(a => a.type).lastIndexOf(actionTypes.CLEAR);
                for (var i = lastClearActionIndex + 1; i < length; i++) {

                    if (actionStack[i].type === actionTypes.DRAW) {
                        actionStack[i].overlay.setMap(null);
                    }
                }

                actionStack.push({
                    type: actionTypes.CLEAR,
                    overlays: actionStack.slice(lastClearActionIndex + 1, length).map(a => a.overlay)
                });

                enableUndoButton();
                clearRedoActionStack();
            });
        }

        html() {
            return `<div id="divDrawingTools" class="btn-group btn-group-lg" role="group">
        <button type="button" class="btn btn-dark" title="Normal" data-drawing-mode="Normal">
            <i class="fa fa-hand-paper-o"></i>
        </button>
        <button type="button" class="btn btn-dark" title="Marker" data-drawing-mode="Marker">
            <i class="fa fa-map-marker"></i>
        </button>
        <div class="btn-group btn-group-lg" role="group">
            <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Shape">
                <i class="fa fa-cube"></i>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a href="#" title="Polygon" data-drawing-mode="Polygon">
                        <i class="fa fa-pencil-square-o fa-lg"></i> Polygon
                    </a>
                </li>
                <li>
                    <a href="#" title="Rectangle" data-drawing-mode="Rectangle">
                        <i class="fa fa-square-o fa-lg"></i> Rectangle
                    </a>
                </li>
                <li>
                    <a href="#" title="Circle" data-drawing-mode="Circle">
                        <i class="fa fa-circle-thin fa-lg"></i> Circle
                    </a>
                </li>
            </ul>
        </div>
        <button type="button" class="btn btn-dark" title="Polyline" data-drawing-mode="Polyline">
            <i class="fa fa-road"></i>
        </button>
        <button type="button" class="btn btn-dark" title="Text" data-drawing-mode="Text">
            <i class="fa fa-text-width"></i>
        </button>
        <button id="btnFreeHand" type="button" class="btn btn-dark" title="Free Hand">
            <i class="fa fa-pencil"></i>
        </button>
        <div id="divStrokeWeight" class="btn-group btn-group-lg" role="group">
            <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Stroke Weight">
                <i class="fa fa-bars"></i>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li class="active">
                    <a href="#" title="Stroke 1">
                        <canvas class="bg-light align-middle" width="120" height="1" />
                    </a>
                </li>
                <li>
                    <a href="#" title="Stroke 2">
                        <canvas class="bg-light align-middle" width="120" height="2" />
                    </a>
                </li>
                <li>
                    <a href="#" title="Stroke 3">
                        <canvas class="bg-light align-middle" width="120" height="3" />
                    </a>
                </li>
                <li>
                    <a href="#" title="Stroke 4">
                        <canvas class="bg-light align-middle" width="120" height="4" />
                    </a>
                </li>
                <li>
                    <a href="#" title="Stroke 5">
                        <canvas class="bg-light align-middle" width="120" height="5" />
                    </a>
                </li>
                <li>
                    <a href="#" title="Stroke 10">
                        <canvas class="bg-light align-middle" width="120" height="10" />
                    </a>
                </li>
            </ul>
        </div>
        <div id="divArrowType" class="btn-group btn-group-lg" role="group">
            <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Arrow Type">
                <i class="fa fa-arrows"></i>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a class="dropdown-item active" href="#" data-arrow-type="NoArrow" title="Line">
                        <i class="fa fa-minus fa-lg"></i> Line
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-arrow-type="Arrow" title="Arrow">
                        <i class="fa fa-long-arrow-right fa-lg"></i> Arrow
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="#" data-arrow-type="RepeatArrow" title="Repeated Arrow">
                        <i class="fa fa-long-arrow-right fa-lg"></i>
                        <i class="fa fa-long-arrow-right fa-lg"></i> Repeated Arrow
                    </a>
                </li>
            </ul>
        </div>
        <a href="#" class="btn btn-dark" title="Fill Color" onclick="document.getElementById('fillColor').click();">
            <i class="fa fa-square"></i>
            <input id="fillColor" type="color" class="color-picker" value="#6e9bf7">
        </a>
        <a href="#" class="btn btn-dark" title="Stroke Color" onclick="document.getElementById('strokeColor').click();">
            <i class="fa fa-paint-brush"></i>
            <input id="strokeColor" type="color" class="color-picker" value="#6e9bf7">
        </a>
        <button id="btnUndo" type="button" class="btn btn-dark disabled" title="Undo">
            <i class="fa fa-mail-reply"></i>
        </button>
        <button id="btnRedo" type="button" class="btn btn-dark disabled" title="Redo">
            <i class="fa fa-mail-forward"></i>
        </button>
        <button id="btnClear" type="button" class="btn btn-dark" title="Clear">
            <i class="fa fa-trash"></i>
        </button>
    </div>`;
        }

        modalHtml() {
            return `<div class="modal fade" id="textModal" tabindex="-1" role="dialog" aria-labelledby="textModalLabel" data-backdrop="static" aria-hidden="true" data-persist="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title" id="textModalLabel">New Annotation</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Text</label>
                            <textarea class="form-control" id="message-text" style="resize:none;"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="btnCancelText" type="button" class="btn secondary" data-dismiss="modal">Close</button>
                    <button id="btnSaveText" type="button" class="btn primary">Save</button>
                </div>
            </div>
        </div>
    </div>`;
        }

        hide() {
            document.getElementById('divDrawingTools').style.display = 'none';
        }

        show() {
            document.getElementById('divDrawingTools').style.display = 'block';
        }
    }
};

acacus.maps.overlays = {
    /**
   * The custom TextOverlay object contains the text,
   * the bounds of the div, and a reference to the map.
   */
    TextOverlay: class extends google.maps.OverlayView {
        bounds;
        text;
        div;
        constructor(bounds, text) {
            super();
            this.bounds = bounds;
            this.text = text;
        }
        /**
         * onAdd is called when the map's panes are ready and the overlay has been
         * added to the map.
         */
        onAdd() {
            this.div = document.createElement("div");
            this.div.style.borderStyle = "none";
            this.div.style.borderWidth = "0px";
            this.div.style.position = "absolute";
            this.div.style.backgroundColor = "#fff7d1";
            this.div.style.borderColor = "black";
            this.div.style.borderStyle = "solid";
            this.div.style.borderWidth = "1px";
            this.div.style.width = "100%";
            this.div.style.height = "100%";
            this.div.style.overflow = "hidden";
            // Create the text element and attach it to the div.
            const para = document.createElement("p");
            para.innerHTML = this.text;
            para.style.position = "absolute";
            para.style.padding = "5px";
            para.style.fontSize = "15px";
            para.style.fontFamily = "Arial";
            para.style.color = "black";
            this.div.appendChild(para);
            // Add the element to the "overlayLayer" pane.
            const panes = this.getPanes();
            panes.overlayLayer.appendChild(this.div);
        }
        draw() {
            // We use the south-west and north-east
            // coordinates of the overlay to peg it to the correct position and size.
            // To do this, we need to retrieve the projection from the overlay.
            const overlayProjection = this.getProjection();
            // Retrieve the south-west and north-east coordinates of this overlay
            // in LatLngs and convert them to pixel coordinates.
            // We'll use these coordinates to resize the div.
            const sw = overlayProjection.fromLatLngToDivPixel(
                this.bounds.getSouthWest()
            );
            const ne = overlayProjection.fromLatLngToDivPixel(
                this.bounds.getNorthEast()
            );

            // Resize the image's div to fit the indicated dimensions.
            if (this.div) {
                this.div.style.left = sw.x + "px";
                this.div.style.top = ne.y + "px";
                this.div.style.width = ne.x - sw.x + "px";
                this.div.style.height = sw.y - ne.y + "px";
            }
        }
        /**
         * The onRemove() method will be called automatically from the API if
         * we ever set the overlay's map property to 'null'.
         */
        onRemove() {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                delete this.div;
            }
        }
        /**
         *  Set the visibility to 'hidden' or 'visible'.
         */
        hide() {
            if (this.div) {
                this.div.style.visibility = "hidden";
            }
        }
        show() {
            if (this.div) {
                this.div.style.visibility = "visible";
            }
        }
        toggle() {
            if (this.div) {
                if (this.div.style.visibility === "hidden") {
                    this.show();
                } else {
                    this.hide();
                }
            }
        }
        toggleDOM(map) {
            if (this.getMap()) {
                this.setMap(null);
            } else {
                this.setMap(map);
            }
        }
    }
};