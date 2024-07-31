class JsPlumbActivity {
    static DataType = 'jsplumb/activity';

    /** @type {Number} */
    index;
    readOnly = false;
    data = null;

    /** @type {JsPlumbHelper} */
    #jsPlumb;

    /** @type {Function} */
    onAdded = null;
    /** @type {Function} */
    onRemoved = null;
    /** @type {Function} */
    onClick = null;
    /** @type{(JsPlumbActivity) => Boolean} */
    canConnect = null;

    /** @type {JsPlumbActivity[]} */
    children = [];
    /** @type {JsPlumbActivity | null} */
    parent = null;

    /** @type {Map<string, JsPlumbActivity[]>} */
    subActivities = new Map();
    /** @type {JsPlumbActivity | null} */
    base = null;

    constructor(jsPlumbHelper, options) {
        this.index = options.index;
        this.#jsPlumb = jsPlumbHelper;

        this.type = options.type;
        this.configuration = options.configuration;
        this.endpoints = [];

        /** @type {HTMLElement} */
        this.element = this.#setupElement(options);

        /** @type {HTMLElement} */
        this.contentContainer = this.element.querySelector('.jsp-content');

        this.defaultEndpoint = null;
        this.defaultEndpointEnabled = options.defaultEndpointEnabled ?? true;
        this.additionEndpointEnabled = options.additionEndpointEnabled ?? true;
        this.labelCssClass = options.labelCssClass ?? 'jsp-connector-label';
        this.managed = false;

        this.parent = options.parent ?? null;
        this.base = options.base ?? null;
        this.handlesDroppedActivities = options.handlesDroppedActivities ?? false;

        if (options.managed) {
            this.#jsPlumb.instance.manage(this.element);
        }
    }

    /**
     * Creates and sets up the activity element.
     * @param {Object} options - The activity options.
     * @returns {HTMLElement}
     */
    #setupElement(options) {
        const element = document.createElement('div');
        element.classList.add('jsp-activity', 'jsp-draggable');
        element.draggable = true;
        element.dataset.activityType = this.type;
        element.innerHTML = /*html*/ `
            <div class="jsp-content"></div>
        `;

        if (options.diamond) {
            this.shape = 'diamond';
            element.style.width = `${options.diamond.size}px`;
            element.style.height = `${options.diamond.size}px`;

            const midPoint = options.diamond.size / 2;
            element.innerHTML = /*html*/ `
                <svg viewBox="0 0 ${options.diamond.size} ${options.diamond.size}" preserveAspectRatio="none">
                    <path class="jsp-shape" data-shape="diamond" d="M ${midPoint} 0 L ${options.diamond.size} ${midPoint} L ${midPoint} ${options.diamond.size} L 0 ${midPoint} Z"></path>
                    <foreignObject width="100%" height="100%">
                        <div class="jsp-content"></div>
                    </foreignObject>
                </svg>
            `;
        }

        element.addEventListener('pointerdown', () => {
            if (this.readOnly)
                return;
            this.#setDragState(true);
        });
        element.addEventListener('pointerup', () => {
            if (this.readOnly)
                return;
            this.#setDragState(false);
        });
        element.addEventListener('dragstart', (e) => {
            if (this.readOnly)
                return;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData(JsPlumbActivity.DataType, JSON.stringify(this));

            this.#setDragState(true);
            options.onDragStart?.(e);
        });

        element.addEventListener('dragend', () => {
            if (this.readOnly)
                return;
            this.#setDragState(false);
            options.onDragEnd?.();
        });

        // Base activity is not clickable
        if (this.type !== 'base') {
            element.tabIndex = -1;

            element.addEventListener('click', () => {
                if (this.readOnly)
                    return;
                element.focus();
            });

            element.addEventListener('focus', () => {
                if (this.readOnly)
                    return;
                this.#jsPlumb.container
                    .querySelectorAll('.jsp-activity')
                    .forEach(e => e.classList.remove('jsp-focused'));
                element.classList.add('jsp-focused');
                this.onClick?.();
            });
        }

        return element;
    }

    #setDragState(state) {
        if (!this.element.classList.contains('jsp-draggable'))
            return;

        this.element.classList.toggle('jsp-dragging', state);
        this.#jsPlumb.setDropTarget(state);
        this.#jsPlumb.draggingActivity = state ? this : null;

        // Set drop target state for all activities that can be connected to this activity
        [...this.#jsPlumb]
            .filter(a => a !== this && a.handlesDroppedActivities && (!state || a.canConnectTo(this)))
            .forEach(a => a.setDropTarget(state));
    }

    #setupDropEvents() {
        this.element.addEventListener('dragover', (e) => {
            if (!this.handlesDroppedActivities || this.readOnly)
                return;

            if (e.dataTransfer.types.includes(JsPlumbActivity.DataType)) {
                e.dataTransfer.dropEffect = 'move';
                this.setDropTarget(true, !this.canConnectTo(this.#jsPlumb.draggingActivity));
                this.setDragOver(true);

                e.preventDefault();
                e.stopPropagation()
                return;
            }

            e.dataTransfer.dropEffect = 'none';
            this.setDropTarget(true, true);
            e.preventDefault();
            e.stopPropagation()
        });

        this.element.addEventListener('dragleave', (e) => {
            this.setDropTarget(this.canConnectTo(this.#jsPlumb.draggingActivity));
            this.setDragOver(false);

            e.preventDefault();
            e.stopPropagation()
            return false;
        });

        this.element.addEventListener('drop', (e) => {
            if (!this.handlesDroppedActivities)
                return;

            this.setDropTarget(false);
            this.setDragOver(false);
            e.preventDefault();
            e.stopPropagation()

            if (!e.dataTransfer.types.includes(JsPlumbActivity.DataType))
                return;

            this.connectSubActivity(JSON.parse(e.dataTransfer.getData(JsPlumbActivity.DataType)));
        });
    }

    setDropTarget(isTarget, invalid = false) {
        if (!this.handlesDroppedActivities)
            return;

        if (isTarget) {
            this.element.classList.add('jsp-drag-target');
            this.element.classList.toggle('jsp-drag-invalid', invalid);
        } else {
            this.element.classList.remove('jsp-drag-target', 'jsp-drag-invalid');
        }
    }

    setDragOver(isOver) {
        if (!this.handlesDroppedActivities)
            return;
        this.element.classList.toggle('jsp-drag-over', isOver);
        this.#jsPlumb.setDragOver(false);
    }

    connectSubActivity({ index, type }) {
        const activity = this.#jsPlumb.getActivity(type, index);
        if (!activity || !this.canConnectTo(activity) || this.readOnly)
            return;

        // attach element to activity container
        activity.manage();

        // Add activity endpoints
        activity.addDefaultEndpoint();
        activity.addAdditionEndpoint();

        // Connect to the previous sub-activity or the base activity
        const previousActivity = this.subActivities.get(activity.type)?.findLast(a => a !== null);
        this.#jsPlumb.instance.connect({
            source: previousActivity?.getAdditionEndpoint() ?? this.getAdditionEndpoint(activity.type),
            target: activity.getDefaultEndpoint(),
            detachable: false
        });

        if (!this.subActivities.has(activity.type))
            this.subActivities.set(activity.type, []);

        this.subActivities.get(activity.type).push(activity);
        activity.base = this;

        activity.onAdded?.();
        this.autoPositionChildren();
    }

    removeChild(activity) {
        const index = this.children.indexOf(activity);
        if (index === -1)
            return;

        this.children[index] = null;
        activity.parent = null;
    }

    removeSubActivity(activity) {
        const index = this.subActivities.get(activity.type).indexOf(activity);
        if (index === -1)
            return;

        this.subActivities.get(activity.type)[index] = null;
        activity.base = null;
    }

    /**
     * Returns `true` if the current activity (source) can be connected to the specified activity (target).
     * @param {JsPlumbActivity} activity - The target activity.
     * @returns {boolean}
     */
    canConnectTo(activity) {
        if (!activity || this.canConnect?.(activity) === false)
            return false;

        return this.endpoints.some(e => e.isSource && e.scope === activity.type);
    }

    /**
     * Connects the activity to the specified child activity.
     * @param {JsPlumbActivity} activity - The child activity to connect.
     * @param {boolean} autoPosition - If set to `true`, the child activity will be automatically positioned.
     */
    connectChild(activity, autoPosition = true) {
        if (this.readOnly)
            return;

        const sourceEndpoint = this.getAdditionEndpoint(activity.type);
        this.#jsPlumb.instance.connect({
            source: sourceEndpoint,
            target: activity.getDefaultEndpoint(),
            detachable: false
        });

        activity.parent = this;
        this.children.push(activity);

        if (autoPosition)
            this.autoPositionChildren();
    }

    /**
     * Automatically positions all child activities and sub-activites.
     */
    autoPositionChildren() {
        if (this.children.length > 0) {
            const activitiesGap = this.configuration.activitiesGap ?? { y: 60, x: 40 };
            const parentBounds = this.getBounds();

            // position children activities beside each other under the parent activity
            let leftBound = parentBounds.left;
            let bottomBound = parentBounds.bottom + activitiesGap.y;

            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (!child)
                    continue;

                this.#jsPlumb.instance.connect({
                    source: this.getAdditionEndpoint(child.type),
                    target: child.getDefaultEndpoint(),
                    detachable: false
                });
                setElementPos(child.element, { x: leftBound, y: bottomBound });

                this.#jsPlumb.redraw();
                child.autoPositionChildren();

                leftBound = Math.max(child.getInnerBounds(i).right, child.getBounds().right) + activitiesGap.x;
            }
        }

        // auto position sub activities
        if ([...this.subActivities.values()].some(a => a.some(s => s !== null))) {
            this.#jsPlumb.autoPosition({
                baseActivity: this,
                activityMap: this.subActivities,
                shouldIgnore: () => false,
                activitiesGap: this.configuration.subActivitiesGap ?? { y: 30, x: 30 }
            });
        }
    }

    /**
     * Adds the activity element to the container and sets jsPlumb to manage it.
     */
    manage() {
        if (this.element.parentElement !== this.#jsPlumb.container) {
            this.element.remove();
            this.#jsPlumb.container.appendChild(this.element);
        }

        this.#jsPlumb.instance.manage(this.element);
        this.managed = true;

        if (this.handlesDroppedActivities) {
            this.#setupDropEvents();
        }
    }

    /**
     * Removes the activity element from the container
     */
    remove() {
        this.#jsPlumb.removeActivity(this);
    }

    hide() {
        this.element.style.display = 'none';
        this.endpoints.forEach(e => e.setVisible(false));
    }

    show() {
        this.element.style.display = null;
        this.endpoints.forEach(e => e.setVisible(true));
    }

    hidden() {
        return this.element.style.display === 'none';
    }

    /**
     * Adds an endpoint to the activity.
     * @param {Object} configuration - The endpoint configuration.
     * @returns {Object} The added endpoint.
     */
    addEndpoint(configuration) {
        const endpoint = this.#jsPlumb.instance.addEndpoint(this.element, { ...this.configuration, ...configuration });
        endpoint.data = configuration.data;
        this.endpoints.push(endpoint);
        return endpoint;
    }

    /**
     * Adds the default target endpoint to the activity.
     * @returns {Object} The default endpoint.
     */
    addDefaultEndpoint() {
        if (this.defaultEndpoint || !this.defaultEndpointEnabled)
            return this.defaultEndpoint;

        const anchorConfig = this.shape === 'diamond'
            ? { type: 'Perimeter', options: { shape: 'Diamond' } }
            : { type: 'Continuous', options: { faces: ['top'] } };

        this.defaultEndpoint = this.addEndpoint({
            target: true,
            source: false,
            scope: this.type,
            maxConnections: 1,
            connectionsDetachable: false,
            data: { type: 'default' },
            anchor: anchorConfig,
        });

        return this.defaultEndpoint;
    }

    /**
     * Adds the addition (source) endpoint to the activity.
     * @returns {Object} The addition endpoint.
     */
    addAdditionEndpoint(configuration = {}) {
        if (!this.additionEndpointEnabled)
            return null;

        const anchorConfig = this.shape === 'diamond'
            ? { type: 'Perimeter', options: { shape: 'Diamond' } }
            : { type: 'Continuous', options: { faces: ['bottom'] } };

        return this.addEndpoint({
            target: false,
            source: true,
            scope: this.type,
            maxConnections: 1,
            connectionsDetachable: false,
            data: { type: 'addition' },
            anchor: anchorConfig,
            overlays: [
                { type: 'Label', options: { location: 0.75, label: '+', cssClass: this.labelCssClass } },
            ],
            connectorOverlays: [],
            ...configuration,
        });
    }

    /**
     * Enables or disables dragging of the activity.
     * @param {boolean} draggable - If set to `true`, the activity will be draggable.
     */
    setDraggable(draggable) {
        this.#jsPlumb.instance.setDraggable(this.element, draggable);
        this.element.classList.toggle('jsp-draggable', draggable);
    }

    /**
     * Returns the addition (source) endpoint of the activity.
     * @param {string | null} typeFilter - If specified, only addition endpoints for the specified activity type will be returned.
     * @returns {Object} The addition endpoint.
     */
    getAdditionEndpoint(typeFilter = null) {
        return this.endpoints.find(e => e.data.type === 'addition' && (!typeFilter || e.scope === typeFilter));
    }

    /**
     * Returns the default target endpoint of the activity.
     * @returns {Object} The default endpoint.
     */
    getDefaultEndpoint() {
        return this.endpoints.find(e => e.data.type === 'default');
    }

    /**
     * Returns the position of the activity element relative to the container.
     */
    getPosition() {
        return { x: this.element.offsetLeft, y: this.element.offsetTop };
    }

    /**
     * Returns the size of the activity element.
     */
    getSize() {
        return { width: this.element.scrollWidth, height: this.element.scrollHeight };
    }

    /**
     * Returns the bounds of the activity element.
     * @returns {{top: number, right: number, bottom: number, left: number}}
     */
    getBounds() {
        return getElementRelativeBounds(this.element);
    }

    setReadOnly(readOnly) {
        if (!this.managed)
            return;

        this.readOnly = !!readOnly;
        if (this.readOnly) {
            this.element.classList.add('jsp-read-only');
            this.setDraggable(false);
            this.endpoints.filter(e => e.isSource && e.connections.length === 0).forEach(c => c.setVisible(false));
        } else {
            this.element.classList.remove('jsp-read-only');
            this.setDraggable(true);
            this.endpoints.forEach(c => c.setVisible(true));
        }
    }

    /**
     * Returns the inner bounds of the activity element, which includes its children and sub-activities.
     * @param {number} maxIndex - The maximum index of child activity to include.
     * @returns {{top: number, right: number, bottom: number, left: number}}
     */
    getInnerBounds(maxIndex = -1) {
        let bounds = null;
        maxIndex = maxIndex === -1 ? this.children.length - 1 : maxIndex;

        for (let i = 0; i <= maxIndex; i++) {
            const activity = this.children[i];
            if (!activity)
                continue;

            const activityBounds = activity.getInnerBounds();
            bounds = {
                top: Math.min(bounds?.top ?? activityBounds.top, activityBounds.top),
                right: Math.max(bounds?.right ?? activityBounds.right, activityBounds.right),
                bottom: Math.max(bounds?.bottom ?? activityBounds.bottom, activityBounds.bottom),
                left: Math.min(bounds?.left ?? activityBounds.left, activityBounds.left),
            };
        }

        const subActivities = [...this.subActivities.values()].flat(1);
        for (const activity of subActivities) {
            if (!activity)
                continue;

            const activityBounds = activity.getInnerBounds();
            bounds = {
                top: Math.min(bounds?.top ?? activityBounds.top, activityBounds.top),
                right: Math.max(bounds?.right ?? activityBounds.right, activityBounds.right),
                bottom: Math.max(bounds?.bottom ?? activityBounds.bottom, activityBounds.bottom),
                left: Math.min(bounds?.left ?? activityBounds.left, activityBounds.left),
            };
        }

        return bounds ?? this.getBounds();
    }

    toJSON() {
        return {
            index: this.index,
            data: this.data,
            type: this.type
        };
    }
}