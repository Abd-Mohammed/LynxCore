class JsPlumbHelper {
    static #defaultJsPlumbConfig = {
        connector: 'Flowchart',
        anchors: ['TopCenter'],
        paintStyle: { stroke: '#666' },
        endpointStyle: { stroke: '#d96b00' },
        endpoint: { type: 'Dot', options: { radius: 6 } },
        dropOptions: { activeClass: 'jsp-drag-active', hoverClass: 'jsp-drop-hover' },
        dragOptions: { cursor: 'grab', zIndex: 2000, containment: 'notNegative', containmentPadding: 10 },
    };

    /** @type {HTMLElement} */
    container;

    /** @type {JsPlumbActivity | null} */
    draggingActivity = null;

    /** @type {JsPlumbActivity} */
    #baseActivity;
    #baseActivityPosition = { centerX: true, y: 50 };

    /** @type {Map<string, JsPlumbActivity[]>} */
    #activities = new Map();

    /** @type {Map<string, Object>} */
    #configurations = new Map();

    readOnly = false;
    instance;
    #options;

    constructor(container, options = {}) {
        this.container = container;
        this.#options = options;
    }

    /**
     * Initializes the jsPlumb instance and container, and creates the base activity.
     * @returns {Promise<void>} - A promise that resolves when jsPlumb is ready.
     */
    async init() {
        let resolve = null;
        const readyPromise = new Promise(r => resolve = r);

        jsPlumb.ready(() => {
            this.container.classList.add('jsp-container');
            if (this.#options.containerClass) {
                this.container.classList.add(this.#options.containerClass);
            }

            this.instance = jsPlumb.newInstance({
                ...JsPlumbHelper.#defaultJsPlumbConfig,
                container: this.container,
            });

            this.#setupDragEvents();
            this.#baseActivity = this.#createBaseActivity();
            if (this.#options.activityClass) {
                this.#baseActivity.element.classList.add(this.#options.activityClass);
            }

            resolve();
        });

        return readyPromise;
    }

    #createBaseActivity() {
        const activity = new JsPlumbActivity(this, {
            index: -1,
            type: 'base',
            managed: true,
            configuration: {
                anchor: { type: 'Continuous', options: { faces: ['top', 'bottom'] } },
            },
            defaultEndpointEnabled: false,
            labelCssClass: this.#options.labelClass
        });
        this.container.appendChild(activity.element);

        setElementPos(activity.element, this.#baseActivityPosition);
        activity.setDraggable(false);

        return activity;
    }

    #setupDragEvents() {
        this.container.addEventListener('dragover', (e) => {
            if (this.readOnly)
                return;

            if (e.dataTransfer.types.includes(JsPlumbActivity.DataType)) {
                e.dataTransfer.dropEffect = 'move';
                this.setDropTarget(true);
                this.setDragOver(true);
            } else {
                e.dataTransfer.dropEffect = 'none';
                this.setDropTarget(true, true);
            }
            e.preventDefault();
            return false;
        });

        this.container.addEventListener('dragleave', (e) => {
            if (this.readOnly)
                return;
            this.setDragOver(false);
            e.preventDefault();
            return false;
        });

        this.container.addEventListener('drop', (e) => {
            if (this.readOnly)
                return;
            this.setDropTarget(false);
            this.setDragOver(false);
            e.preventDefault();

            if (!e.dataTransfer.types.includes(JsPlumbActivity.DataType))
                return;

            const data = JSON.parse(e.dataTransfer.getData(JsPlumbActivity.DataType));

            const position = { x: e.offsetX, y: e.offsetY };

            // Calculate position relative to the container
            if (e.target !== this.container) {
                const currentTargetRect = this.container.getBoundingClientRect();
                position.x = e.pageX - window.pageXOffset - currentTargetRect.left;
                position.y = e.pageY - window.pageYOffset - currentTargetRect.top;
            }

            this.connectActivity(data, position);
        });
    }

    connectActivity({ index, type }, position = null) {
        const activities = this.#activities.get(type);
        const activity = activities.at(index);

        if (!activity || this.#baseActivity.hidden() || this.readOnly)
            return;

        // attach element to activity container
        activity.manage();

        // Set element position to the passed position
        const size = activity.getSize();
        if (position !== null)
            setElementPos(activity.element, { x: position.x - (size.width / 2), y: position.y - (size.height / 2) });

        // Add activity endpoints
        activity.addDefaultEndpoint();
        activity.addAdditionEndpoint();

        // Check if there's a previous activity of the same type
        const previousActivity = activities.findLast((a, i) => a !== null && i < index && a.base === null);
        if (previousActivity) {
            this.instance.connect({
                source: previousActivity.getAdditionEndpoint(),
                target: activity.getDefaultEndpoint(),
                detachable: false
            });
        } else {
            // Connect to base activity
            this.instance.connect({
                source: this.#baseActivity.getAdditionEndpoint(activity.type),
                target: activity.getDefaultEndpoint(),
                detachable: false
            });
        }

        activity.onAdded?.();
    }

    /**
     * Returns an iterator over all activities in the container.
     * @returns {IterableIterator<JsPlumbActivity>}
     */
    [Symbol.iterator]() {
        return [...this.#activities.values()]
            .flat(1)
            .filter(a => a != null)
            .values();
    }

    /**
     * @returns {JsPlumbActivity}
     */
    get baseActivity() {
        return this.#baseActivity;
    }

    /**
     * Returns all activities of the specified type.
     * @param {string} type
     * @returns {JsPlumbActivity[]}
     */
    activities(type) {
        return this.#activities.get(type)?.filter(a => a != null) ?? [];
    }

    /**
     * Disables or enables the batch mode of jsPlumb (to suspend redrawing while activites are updated).
     * @param {boolean} enabled
     */
    setBatch(enabled) {
        if (enabled)
            this.instance.setSuspendDrawing(true);
        else
            this.instance.setSuspendDrawing(false, true);
    }

    /**
     * Executes the specified function in batch mode (to suspend redrawing while activites are updated).
     * @param {Function} func - The function to execute.
     */
    batch(func) {
        this.instance.setSuspendDrawing(true);
        func();
        this.instance.setSuspendDrawing(false, true);
    }

    /**
     * Registers a new activity type.
     * Must be called **_before_** any activities of this type are created.
     * @param {String} type - The activity type.
     * @param {Object} configuration - The default configuration for activities of this type.
     */
    registerType(type, configuration) {
        this.#activities.set(type, []);
        this.#configurations.set(type, configuration);

        // Add an addition endpoint to the base activity for this type
        if (configuration.addToBaseActivity) {
            this.#baseActivity.addEndpoint({
                ...configuration,
                scope: type,
                source: true,
                target: false,
                connectionsDetachable: false,
                data: { type: 'addition' },
            });
        }
    }

    /**
     * Creates a new activity of the specified type without adding it to the container.
     * @param {String} type - The activity type.
     * @param {Object} options - The activity options.
     * @returns {JsPlumbActivity}
     */
    createActivity(type, options = {}) {
        if (!this.#activities.has(type))
            throw new Error(`Activity type '${type}' is not registered.`);

        const activities = this.#activities.get(type);
        const configuration = this.#configurations.get(type);

        const activity = new JsPlumbActivity(this, {
            configuration,
            ...options,
            type,
            managed: false,
            index: activities.length,
            labelCssClass: this.#options.labelClass
        });

        if (this.#options.activityClass)
            activity.element.classList.add(this.#options.activityClass);

        activities.push(activity);
        return activity;
    }

    /**
     * Removes an activity from the container.
     * @param {JsPlumbActivity} activity - The activity to remove.
     * @param {Boolean} isBatchDeletion - If set to `true`, the container will not be redrawn after the activity is removed.
     */
    removeActivity(activity, isBatchDeletion = false) {
        if (!activity)
            return;

        const activities = this.#activities.get(activity.type);
        const index = activities.indexOf(activity);
        if (index === -1)
            return;

        if (activity.managed)
            this.instance.unmanage(activity.element);

        // Remove all children activities
        if (activity.children.length > 0) {
            for (const child of [...activity.children]) {
                this.removeActivity(child, true);
            }
        } else if (activity.subActivities.size > 0) {
            for (const activities of activity.subActivities.values()) {
                for (const subActivity of [...activities]) {
                    this.removeActivity(subActivity, true);
                }
            }
        } else if (!activity.parent && !isBatchDeletion) {
            // connect the previous and next sibiling activities
            const previousActivity = activities.findLast((a, i) => a !== null && i < index && a.base === activity.base);
            const nextActivity = activities.find((a, i) => a !== null && i > index && a.base === activity.base);
            if (previousActivity && nextActivity) {
                this.instance.connect({
                    source: previousActivity.getAdditionEndpoint(),
                    target: nextActivity.getDefaultEndpoint(),
                    detachable: false
                });
            } else if (nextActivity) {
                this.instance.connect({
                    source: activity.base?.getAdditionEndpoint() ?? this.#baseActivity.getAdditionEndpoint(activity.type),
                    target: nextActivity.getDefaultEndpoint(),
                    detachable: false
                });
            }
        }

        activity.element.remove();
        activity.managed = false;
        activity.parent?.removeChild(activity);
        activity.base?.removeSubActivity(activity);
        activities[index] = null;

        if (!isBatchDeletion)
            this.redraw();

        activity.onRemoved?.();
    }

    /**
     * Removes all activities from the container.
     */
    removeActivities() {
        this.setBatch(true);

        for (const [type, activities] of this.#activities) {
            activities.forEach((activity, i) => {
                if (activity) {
                    this.instance.unmanage(activity.element);
                    activity.element.remove();
                    activity.managed = false;
                    activity.parent?.removeChild(activity);
                    activity.base?.removeSubActivity(activity);
                    activity.onRemoved?.();
                }
                activities[i] = null;
            });

            this.#activities.set(type, []);
        }

        this.setBatch(false);
    }

    /**
     * Sets the drop target state of the container.
     * @param {boolean} isTarget - If set to `true`, the container will be marked as a drag & drop target (with css class `jsp-drag-target`).
     * @param {boolean} invalid - If set to `true`, the container will be marked as invalid (with css class `jsp-drag-invalid`).
     */
    setDropTarget(isTarget, invalid = false) {
        if (this.readOnly)
            return;

        if (isTarget) {
            this.container.classList.add('jsp-drag-target');
            this.container.classList.toggle('jsp-drag-invalid', invalid);
        } else {
            this.container.classList.remove('jsp-drag-target', 'jsp-drag-invalid');
        }
    }

    /**
     * Sets the drag-over state of the container.
     * @param {boolean} isOver - If set to `true`, the container will be marked as being dragged over (with css class `jsp-drag-over`).
     */
    setDragOver(isOver) {
        this.container.classList.toggle('jsp-drag-over', isOver);
    }

    setReadOnly(readOnly) {
        this.readOnly = readOnly;
        this.container.classList.toggle('jsp-read-only', readOnly);

        this.#baseActivity.setReadOnly(readOnly);
        this.#baseActivity.setDraggable(false);

        for (const activity of this) {
            activity.setReadOnly(readOnly);
        }
    }

    /**
     * Returns the activity with the specified type and index.
     * @param {string} type - The activity type.
     * @param {number} index - The activity index.
     * @returns {JsPlumbActivity | null}
     */
    getActivity(type, index) {
        return this.#activities.get(type)?.at(index) ?? null;
    }

    /**
     * Forces a repaint of all connections and endpoints.
     */
    redraw() {
        setElementPos(this.#baseActivity.element, this.#baseActivityPosition);
        this.instance.repaintEverything();
    }

    /**
     * Automatically positions all activities based on their type and index.
     * @param {Object} context - The positioning context that controls which activities are auto-positioned.
     */
    autoPosition(context = null) {
        context ??= {
            /** @type {Map<string, JsPlumbActivity[]>} */
            activityMap: this.#activities,
            /** @type {JsPlumbActivity} */
            baseActivity: this.#baseActivity,
            shouldIgnore: (a) => a.parent !== null || a.base !== null
        };

        this.setBatch(true);
        let bounds = context.baseActivity === this.#baseActivity ? 0 : context.baseActivity.getBounds().left;

        for (const [type, activities] of context.activityMap) {
            const config = this.#configurations.get(type);
            const activitiesGap = context.activitiesGap ?? config.activitiesGap ?? { y: 40, x: 60 };

            let lastActivityIndex = null;
            for (let i = 0; i < activities.length; i++) {
                const activity = activities[i];
                if (!activity || !activity.managed || context.shouldIgnore(activity))
                    continue;

                // Remove all existing connections for this activity
                this.instance.deleteConnectionsForElement(activity.element);

                if (lastActivityIndex === null) {
                    // Connect to base activity
                    this.instance.connect({
                        source: context.baseActivity.getAdditionEndpoint(type),
                        target: activity.getDefaultEndpoint(),
                        detachable: false
                    });

                    // Calculate the activity's position
                    setElementPos(activity.element, {
                        x: bounds === 0 ? activitiesGap.x : bounds + activitiesGap.x,
                        y: context.baseActivity.getBounds().bottom + activitiesGap.y
                    });
                } else {
                    const lastActivity = activities[lastActivityIndex];

                    // Connect to the last activity
                    this.instance.connect({
                        source: lastActivity.getAdditionEndpoint(),
                        target: activity.getDefaultEndpoint(),
                        detachable: false
                    });

                    // Position the activity next to the last one
                    const lastActivityBounds = lastActivity.getBounds();
                    const lastActivitySize = lastActivity.getSize();
                    const currentActivitySize = activity.getSize();

                    // Calculate the activity's x-axis position to center under the previous activity
                    let xPos = lastActivityBounds.left;
                    if (currentActivitySize.width > lastActivitySize.width) {
                        xPos -= (currentActivitySize.width - lastActivitySize.width) / 2;
                        xPos = Math.max(xPos, 0);
                    } else if (currentActivitySize.width < lastActivitySize.width) {
                        xPos += (lastActivitySize.width - currentActivitySize.width) / 2;
                    }

                    const activityPos = {
                        x: xPos,
                        y: lastActivityBounds.bottom + activitiesGap.y
                    };

                    setElementPos(activity.element, activityPos);
                }

                // Reposition children activities after the parent activity has been positioned
                activity.autoPositionChildren();

                bounds = Math.max(bounds ?? 0, activity.getBounds().right);
                lastActivityIndex = i;
            }
        }

        this.setBatch(false);

        // Check if any activity overlaps with a label and adjust its position
        for (const activity of this) {
            this.instance.connections
                .flatMap(c => Object.values(c.overlays))
                .filter(o => o.type === 'Label')
                .forEach(label => {
                    if (checkElementsOverlap(label.canvas, activity.element)) {
                        const labelBounds = getElementRelativeBounds(label.canvas);
                        setElementPos(activity.element, {
                            x: activity.getPosition().x,
                            y: labelBounds.top + (label.canvas.offsetHeight * label.location) + 20
                        });
                        this.instance.repaintEverything();
                    }
                });
        }
    }
}

function setElementPos(element, { centerX = false, centerY = false, x = null, y = null } = {}) {
    const parentRect = element.parentElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (x) {
        element.style.left = `${x}px`;
    } else if (centerX) {
        x = (parentRect.width / 2) - (elementRect.width / 2);
        element.style.left = `${x}px`;
    }

    if (y) {
        element.style.top = `${y}px`;
    } else if (centerY) {
        y = (parentRect.height / 2) - (elementRect.height / 2);
        element.style.top = `${y}px`;
    }
}

function getElementRelativeBounds(element) {
    const position = { x: element.offsetLeft, y: element.offsetTop };
    const size = { width: element.scrollWidth, height: element.scrollHeight };
    return {
        top: position.y,
        right: position.x + size.width,
        bottom: position.y + size.height,
        left: position.x,
    }
}

function checkElementsOverlap(element1, element2) {
    const rect1 = getElementRelativeBounds(element1);
    const rect2 = getElementRelativeBounds(element2);

    return !(rect1.right < rect2.left
        || rect1.left > rect2.right
        || rect1.bottom < rect2.top
        || rect1.top > rect2.bottom);
}