class WorkflowBuilder {
    static #classNames = {
        activity: 'workflow-activity',
        container: 'workflow-container',
        connectorLabel: 'connector-label',
        toolbar: 'workflow-toolbar',
        removeBtn: 'workflow-btn-remove',
        editBtn: 'workflow-btn-edit',
        autoPositionBtn: 'workflow-btn-auto-position',
        lockBtn: 'workflow-btn-lock',
    };

    static #types = {
        action: {
            name: 'actions',
            label: 'Actions',
            color: '#6794dc',
        },
        notification: {
            name: 'notifications',
            label: 'Notifications',
            color: '#a0dc67',
        },
        sla: {
            name: 'sla',
            label: 'SLA',
            color: '#dcaf67',
        },
        workflowOption: {
            name: 'options',
            label: 'Options',
            color: '#919ab1',
        },
        escalationChain: {
            name: 'escalationChain',
            label: 'Escalation Chain',
            color: '#dc6967',
        },
        escalationRule: {
            name: 'escalationRule',
            label: 'Escalation Rule',
            color: '#8067dc',
            addToBaseActivity: false,
        },
    }

    constructor(options, data = null) {
        this.escalationChainActionUri = options.escalationChainActionUri ?? null;
        this.builderEnabled = options.builderEnabled ?? true;
        this.data = data;

        this.jsPlumbContainer = document.querySelector(`.${WorkflowBuilder.#classNames.container}`)
        this.jsPlumb = new JsPlumbHelper(this.jsPlumbContainer, {
            labelClass: WorkflowBuilder.#classNames.connectorLabel,
            activityClass: WorkflowBuilder.#classNames.activity,
            containerClass: WorkflowBuilder.#classNames.container,
        });

        if (this.builderEnabled) {
            $(document).ready(() => $('input[type="checkbox"]').uniform());

            this.#setupToolbar();
            this.form = document.querySelector('#workflow_form');
            this.form.onsubmit = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.submit();
            }
        }

        $(document).ready(() => this.jsPlumb.init().then(() => {
            this.jsPlumb.setBatch(true);
            this.#setupWorkflowActivity();
            this.#setupWorkflowType();
            this.#setupActions();
            this.#setupNotifications();
            this.#setupEsclaionChain();
            this.#setupSlaAlertRule();
            this.#setupWorkflowOptions();
            this.jsPlumb.setBatch(false);

            if (this.shouldAutoPosition)
                setTimeout(() => this.jsPlumb.autoPosition() && this.jsPlumb.redraw(), 100);

            if (!this.builderEnabled)
                this.jsPlumb.setReadOnly(true);
        }));
    }

    #setupToolbar() {
        this.toolbar = document.querySelector(`.${WorkflowBuilder.#classNames.toolbar}`);
        this.removeBtn = this.toolbar.querySelector(`.${WorkflowBuilder.#classNames.removeBtn}`);
        this.editBtn = this.toolbar.querySelector(`.${WorkflowBuilder.#classNames.editBtn}`);

        this.autoPositionBtn = this.toolbar.querySelector(`.${WorkflowBuilder.#classNames.autoPositionBtn}`);
        this.autoPositionBtn.onclick = () => this.jsPlumb.autoPosition();

        this.lockBtn = this.toolbar.querySelector(`.${WorkflowBuilder.#classNames.lockBtn}`);
        this.lockBtn.title = '[[[[Lock]]]]';

        const lockBtnIcon = this.lockBtn.querySelector('span');
        this.lockBtn.onclick = () => {
            if (this.jsPlumb.readOnly) {
                this.jsPlumb.setReadOnly(false);
                this.autoPositionBtn.disabled = false;
                this.autoPositionBtn.classList.remove('disabled');

                this.lockBtn.classList.remove('active');
                this.lockBtn.title = '[[[[Lock]]]]';

                lockBtnIcon.classList.remove('fa-lock');
                lockBtnIcon.classList.add('fa-unlock');
            } else {
                this.jsPlumb.setReadOnly(true);
                this.#setActiveActivity(null);
                this.autoPositionBtn.disabled = true;
                this.autoPositionBtn.classList.add('disabled');

                this.lockBtn.classList.add('active');
                this.lockBtn.title = '[[[[Unlock]]]]';

                lockBtnIcon.classList.remove('fa-unlock');
                lockBtnIcon.classList.add('fa-lock');
            }
        };
    }

    #setupWorkflowActivity() {
        const workflowActivity = this.jsPlumb.baseActivity;

        const workflowContent = this.#createElement(/*html*/ `
            <div class="activity-content">
                <span data-display="workflowName" class="title"></span>
                <div class="dl-horizontal">
                    <dt>[[[[Type]]]]</dt>
                    <dd data-display="WorkflowType"></dd>
                </div>
            </div>
        `);
        const workflowNameDisplay = $(workflowContent).find('[data-display="workflowName"]');
        const workflowTypeDisplay = $(workflowContent).find('[data-display="WorkflowType"]');

        if (this.builderEnabled) {
            const workflowName = $('#Name');
            const workflowType = $('#WorkflowType');

            // Bind the workflow name and type changes to the activity content
            workflowName.change(() => updateContent());
            workflowType.change(() => {
                updateContent();
                // Remove existing activities
                [...this.jsPlumb].forEach(a => a.remove());
            });
        }

        const updateContent = () => {
            const name = this.workflowName;
            const type = this.workflowType;

            workflowNameDisplay.text(name);
            workflowNameDisplay.attr('title', name);
            workflowTypeDisplay.text(type.text);

            if (name && type.value) {
                workflowActivity.show();
                this.jsPlumb.redraw();
            } else {
                workflowActivity.hide();
            }
        }

        workflowActivity.contentContainer.appendChild(workflowContent);
        setTimeout(updateContent);

        // Register the activity types
        for (const type of Object.values(WorkflowBuilder.#types)) {
            this.jsPlumb.registerType(type.name, {
                maxConnections: 1,
                paintStyle: { fill: type.color },
                connectorStyle: { stroke: type.color, strokeWidth: 2 },
                addToBaseActivity: type.addToBaseActivity ?? true,
                connectorOverlays: [
                    {
                        type: 'Label',
                        options: {
                            location: 0.5,
                            label: type.label,
                            cssClass: WorkflowBuilder.#classNames.connectorLabel
                        }
                    },
                ]
            });
        }
    }

    #setupWorkflowType() {
        if (!this.builderEnabled)
            return;

        const vehicleOnlyElements = () => $('[data-workflow-type="vehicle"]');
        const trackedAssetOnlyElements = () => $('[data-workflow-type="trackedAsset"]');
        const OnWorkflowTypeChange = () => {
            this.clearActivities();
            this.refreshSelectLists();
            switch (this.workflowType.value) {
                case 1:
                    this.#hideElement(trackedAssetOnlyElements());
                    this.#showElement(vehicleOnlyElements());
                    break;
                case 2:
                    this.#hideElement(vehicleOnlyElements());
                    this.#showElement(trackedAssetOnlyElements());
                    break;
            }
        };

        // Set initial form state
        this.#hideElement(trackedAssetOnlyElements());
        this.#hideElement(vehicleOnlyElements());
        OnWorkflowTypeChange();

        const workflowType = $('[name="WorkflowType"]');
        workflowType.change(OnWorkflowTypeChange);
    }

    #setupActions() {
        this.action = {
            /** @type {JsPlumbActivity | null} */
            current: null,
            validation: $('[data-valmsg-for="Actions"]'),
            dropdown: $('#Actions').data('kendoDropDownList'),
            collapse: () => $('#collapse_actions').data('bs.collapse'),
            discardButton: $(`[data-type="${WorkflowBuilder.#types.action.name}"] .activity-discard`),
            activityContainer: $(`.activity-builder-container[data-type="${WorkflowBuilder.#types.action.name}"]`),
            clear() {
                this.discardButton.hide();
                this.dropdown.value('');
                this.validation.text('');

                // If the activity isn't managed (not added yet), remove it
                if (this.current && !this.current.managed)
                    this.current.remove();
            },
            createAction: (id, name) => {
                const action = this.jsPlumb.createActivity(WorkflowBuilder.#types.action.name);
                action.contentContainer.appendChild(this.#createElement(/*html*/ `
                    <div class="activity-header">
                        <span class="fa fa-users"></span>
                        [[[[Action]]]]
                    </div>
                    <div class="activity-content">
                        <span title="${name}" data-display="action" data-action-id="${id}" class="title">${name}</span>
                    </div>
                `));

                action.data = { id, name };
                action.onAdded = () => {
                    this.action.current = null;
                    if (this.builderEnabled)
                        this.action.clear();
                };
                action.onClick = () => this.#setActiveActivity(action, {
                    remove: { enabled: true, callback: () => this.action.clear() },
                });
                action.onRemoved = () => this.#setActiveActivity(null);

                return action;
            },
            initBuilder: () => {
                this.action.clear();
                this.action.discardButton.bind('click', () => this.action.clear());
                this.action.dropdown.bind('change', () => {
                    this.action.discardButton.hide();
                    this.action.current?.remove();
                    this.action.validation.text('');

                    const selected = this.action.dropdown.dataItem();
                    if (!selected?.Value) {
                        this.action.clear();
                        return;
                    }

                    this.action.current = this.action.createAction(selected.Value, selected.Text);
                    this.action.activityContainer.append(this.action.current.element);

                    this.action.discardButton.show();
                });
            },
            initData: () => {
                if (this.data.Actions?.length > 0) {
                    for (const action of this.data.Actions) {
                        const activity = this.action.createAction(action.ActionId, action.Name);
                        this.jsPlumb.connectActivity(activity);
                    }
                    this.shouldAutoPosition = true;
                }
            },
        };

        if (this.builderEnabled)
            this.action.initBuilder();
        this.action.initData();
    }

    #setupNotifications() {
        this.notification = {
            /** @type {JsPlumbActivity | null} */
            current: null,
            collapse: () => $('#collapse_notifications').data('bs.collapse'),
            typeDropdown: $('#NotificationType').data('kendoDropDownList'),
            discardButton: $(`[data-type="${WorkflowBuilder.#types.notification.name}"] .activity-discard`),
            activityContainer: $(`.activity-builder-container[data-type="${WorkflowBuilder.#types.notification.name}"]`),
            containers: $('[data-notification-type]'),
            email: {
                dropdown: $('#EmailNotificationRuleId').data('kendoDropDownList'),
                validation: $('[data-valmsg-for="EmailNotificationRuleId"]'),
                container: $(`[data-notification-type="${WorkflowBuilder.#notificationTypes.email.value}"]`),
            },
            sms: {
                dropdown: $('#SmsNotificationRuleId').data('kendoDropDownList'),
                validation: $('[data-valmsg-for="SmsNotificationRuleId"]'),
                container: $(`[data-notification-type="${WorkflowBuilder.#notificationTypes.sms.value}"]`),
            },
            event: {
                dropdown: $('#EventNotificationRuleId').data('kendoDropDownList'),
                validation: $('[data-valmsg-for="EventNotificationRuleId"]'),
                container: $(`[data-notification-type="${WorkflowBuilder.#notificationTypes.event.value}"]`),
            },
            driver: {
                validation: $('[data-valmsg-for="DriverNotificationsEnabled"]'),
                container: $(`[data-notification-type="${WorkflowBuilder.#notificationTypes.driver.value}"]`),
                helpText: $(`[data-notification-type="${WorkflowBuilder.#notificationTypes.driver.value}"] .help-block`),
            },
            clear(keepDropdownValue = false) {
                this.email.validation.text('');
                this.sms.validation.text('');
                this.event.validation.text('');
                this.driver.validation.text('');
                this.driver.helpText.show();

                this.email.dropdown.value('');
                this.sms.dropdown.value('');
                this.event.dropdown.value('');

                this.containers.hide();
                this.discardButton.hide();

                if (!keepDropdownValue)
                    this.typeDropdown.value('');

                // If the activity isn't managed (not added yet), remove it
                if (this.current && !this.current.managed)
                    this.current.remove();

                this.current = null;
            },
            getByType(type) {
                switch (type.value) {
                    case WorkflowBuilder.#notificationTypes.email.value:
                        return this.email;
                    case WorkflowBuilder.#notificationTypes.sms.value:
                        return this.sms;
                    case WorkflowBuilder.#notificationTypes.event.value:
                        return this.event;
                    case WorkflowBuilder.#notificationTypes.driver.value:
                        return this.driver;
                }
            },
            clearType(type) {
                const notificationControl = this.getByType(type);

                notificationControl.validation.text('');
                notificationControl.dropdown?.value('');
                this.discardButton.hide();
                this.current?.remove();
                this.helpText?.show();

                // If the activity isn't managed (not added yet), remove it
                if (this.current && !this.current.managed)
                    this.current.remove();

                this.current = null;
            },
            create: (id, name, type) => {
                // Handle default notifications
                if (id <= 0) {
                    id = -1;
                    name = `${type.text} [[[[Notification]]]]`;
                    type = { ...type, text: '' };
                }

                const activity = this.jsPlumb.createActivity(WorkflowBuilder.#types.notification.name);
                activity.contentContainer.appendChild(this.#createElement(/*html*/ `
                    <div class="activity-header">
                        <span class="fa ${type.icon ?? 'fa-bell'}"></span>
                        ${type.text ?? ''} [[[[Notification]]]]
                    </div>
                    <div class="activity-content">
                        <span title="${name}" data-display="notification" data-notification-id="${id}" data-notification-type="${type.value}" class="title">${name}</span>
                    </div>
                `));

                activity.data = { id, name, type };
                activity.onAdded = () => {
                    this.notification.current = null;

                    if (this.builderEnabled) {
                        this.notification.clear();

                        // Check if we're adding a non-default notification for the base activity
                        if (id > 0 && activity.base === null)
                            this.notification.removeDefaultNotification(type);
                    }
                };
                activity.onClick = () => this.#setActiveActivity(activity, {
                    remove: { enabled: true, callback: () => this.notification.clear() },
                });
                activity.onRemoved = () => this.#setActiveActivity(null);

                return activity;
            },
            createDefaultNotification: (type) => {
                const existingNotification = this.jsPlumb.activities(WorkflowBuilder.#types.notification.name)
                    .some(n => n.managed && n.data.type.value === type.value && n.base == null);

                // Only create the default notification activity if there's no existing activity of the same type
                if (!existingNotification) {
                    this.notification.current = this.notification.create(-1, '[[[[Default]]]]', type);
                    this.notification.activityContainer.append(this.notification.current.element);
                    this.notification.discardButton.show();
                } else if (type.value === WorkflowBuilder.#notificationTypes.driver.value) {
                    this.notification.driver.validation.text('[[[[In-Vehicle notification is already added.]]]]');
                    this.notification.driver.helpText.hide();
                }
            },
            removeDefaultNotification: (type) => {
                const existingDefaultNotification = this.jsPlumb.activities(WorkflowBuilder.#types.notification.name)
                    .find(n => n.managed && n.base == null && n.data.type.value === type.value && n.data.id <= 0);

                existingDefaultNotification?.remove();
            },
            initBuilder: () => {
                this.notification.clear();
                this.notification.discardButton.bind('click', () => this.notification.clear());

                const onNotificationTypeChange = () => {
                    this.notification.clear(true);

                    const selected = Number(this.notification.typeDropdown.value());
                    const type = WorkflowBuilder.#notificationTypes.getByValue(selected);
                    if (!selected) {
                        this.notification.clear();
                        return;
                    }

                    // We need to display the notification rule dropdown
                    const notificationControl = this.notification.containers.filter(`[data-notification-type="${selected}"]`);
                    notificationControl.show();

                    if (type.value === WorkflowBuilder.#notificationTypes.driver.value && this.workflowType.value !== 1) {
                        this.notification.driver.validation.text('[[[[In-Vehicle notifications can only be added to vehicle workflows.]]]]');
                        this.notification.driver.helpText.hide();
                        return;
                    }

                    this.notification.createDefaultNotification(type);
                };
                const onNotificationRuleChange = (type) => {
                    const notificationControl = this.notification.getByType(type);

                    notificationControl.validation.text('');
                    this.notification.discardButton.hide();
                    this.notification.current?.remove();

                    const selected = notificationControl.dropdown.dataItem();
                    if (!selected?.Value) {
                        this.notification.clearType(type);
                        this.notification.createDefaultNotification(type);
                        return;
                    }

                    this.notification.current = this.notification.create(selected.Value, selected.Text, type);
                    this.notification.activityContainer.append(this.notification.current.element);

                    this.notification.discardButton.show();
                }

                this.notification.typeDropdown.bind('change', onNotificationTypeChange);
                this.notification.email.dropdown.bind('change', onNotificationRuleChange.bind(null, WorkflowBuilder.#notificationTypes.email));
                this.notification.sms.dropdown.bind('change', onNotificationRuleChange.bind(null, WorkflowBuilder.#notificationTypes.sms));
                this.notification.event.dropdown.bind('change', onNotificationRuleChange.bind(null, WorkflowBuilder.#notificationTypes.event));
            },
            initData: () => {
                // Add existing notifications
                const notifications = [
                    ...this.data.SmsNotifications,
                    ...this.data.EmailNotifications,
                    ...this.data.EventNotifications,
                ].filter(n => n !== null);

                if (this.data.DriverNotificationsEnabled)
                    notifications.push({ Type: WorkflowBuilder.#notificationTypes.driver.value, NotificationId: -1 });

                for (const notification of notifications) {
                    const type = WorkflowBuilder.#notificationTypes.getByValue(notification.Type);
                    const activity = this.notification.create(notification.NotificationId, notification.Name, type);
                    this.jsPlumb.connectActivity(activity);
                    this.shouldAutoPosition = true;
                }
            }
        }

        if (this.builderEnabled)
            this.notification.initBuilder();
        this.notification.initData();
    }

    #setupEsclaionChain() {
        this.escalationChain = {
            /** @type {JsPlumbActivity | null} */
            current: null,
            selector: {
                container: $('#existingEscalationChain'),
                dropdown: $('#EscalationChainId').data('kendoDropDownList'),
                validation: $('[data-valmsg-for="EscalationChainId"]'),
                toolbar: $(`[data-type="existingEscalationChain"].activity-builder-toolbar`),
                discardButton: $(`[data-type="existingEscalationChain"] .activity-discard`),
                activityContainer: $(`.activity-builder-container[data-type="existingEscalationChain"]`),
            },
            divider: $('#escalationChainDivider'),
            builder: {
                container: $('#escalationChain'),
                label: $('#escalationChain .control-label'),
                nameField: $('#EscalationChainName'),
                nameValidation: $('[data-valmsg-for="EscalationChainName"]'),
                discardButton: $(`.activity-builder-toolbar[data-type="escalationChain"] .activity-discard`),
                saveButton: $(`.activity-builder-toolbar[data-type="escalationChain"] .activity-save`),
                activityContainer: $(`.activity-builder-container[data-type="escalationChain"]`),
                scroll: () => document.querySelector('.activity-builder-toolbar[data-type="escalationChain"]').scrollIntoView({ behavior: 'smooth' }),
            },
            ruleBuilder: {
                container: $('#escalationRuleBuilder'),
                listView: $('#EscalationRuleBuilderList'),
                addButton: $('.activity-builder-toolbar[data-type="escalationRule"] .activity-add'),
                discardButton: $('.activity-builder-toolbar[data-type="escalationRule"] .activity-discard'),
                eventDropdown: $('#EscalationRuleEvent'),
                valueValidation: $('[data-valmsg-for="EscalationRuleValue"]'),
                valueFields: $(`.escalation-rule-control`),
                valueField() {
                    return $(`.escalation-rule-control[data-rule-event="${this.eventDropdown.val()}"]`);
                },
                valueContainer: $('.escalation-rule-value.form-group'),
                valueFieldContainers(eventValue = null) {
                    return eventValue
                        ? $(`.escalation-rule-value[data-rule-event="${eventValue}"]`)
                        : $('.escalation-rule-value[data-rule-event]');
                },
                currentEvent() {
                    return this.eventDropdown.val() ? {
                        value: this.eventDropdown.val(),
                        text: this.eventDropdown.find(':selected').text()
                    } : null;
                },
            },
            /** @returns {JsPlumbActivity[]} */
            rules: () => this.escalationChain.current?.children.filter(a => a !== null) ?? [],
            collapse: () => $('#collapse_escalation_chain').data('bs.collapse') ?? $('#collapse_escalation_chain').collapse(),
            createActivity: (id, name, callbacks = null) => {
                const chainActivity = this.jsPlumb.createActivity(WorkflowBuilder.#types.escalationChain.name, { additionEndpointEnabled: false });
                chainActivity.contentContainer.appendChild(this.#createElement(/*html*/ `
                    <div class="activity-header">
                        <span class="fa fa-chain"></span>
                        [[[[Escalation Chain]]]]
                    </div>
                    <div class="activity-content">
                        <span title="${name}" data-display="escalationChain" class="title">${name}</span>
                    </div>
                `));

                chainActivity.data = { id: id, name: name };

                chainActivity.onAdded = () => {
                    if (this.builderEnabled) {
                        this.escalationChain.builder.reset();
                        this.escalationChain.builder.nameField.val(chainActivity.data.name);
                        this.escalationChain.builder.nameField.prop('disabled', true);
                        this.escalationChain.builder.container.show();
                        this.escalationChain.builder.scroll();
                    }

                    // Add the escalation chain rule endpoint
                    chainActivity.addEndpoint({
                        target: false,
                        source: true,
                        scope: WorkflowBuilder.#types.escalationRule.name,
                        maxConnections: 100,
                        connectionsDetachable: false,
                        paintStyle: { fill: WorkflowBuilder.#types.escalationRule.color },
                        connectorStyle: { stroke: WorkflowBuilder.#types.escalationRule.color, strokeWidth: 2 },
                        data: { type: 'addition', activityType: WorkflowBuilder.#types.escalationRule.name },
                        anchor: { type: 'Continuous', options: { faces: ['bottom'] } },
                        overlays: [],
                        connectorOverlays: []
                    });

                    callbacks?.onAdded?.();
                };
                chainActivity.onClick = () => {
                    this.#setActiveActivity(chainActivity, {
                        remove: { enabled: true, callback: this.escalationChain.builder.reset },
                        edit: {
                            enabled: true,
                            callback: () => {
                                this.escalationChain.builder.container.show();
                                this.escalationChain.ruleBuilder.container.hide();
                                this.escalationChain.collapse().show();
                                this.escalationChain.builder.nameField.prop('disabled', false);
                                this.escalationChain.builder.nameField.focus();
                                this.escalationChain.builder.saveButton.show();
                                this.escalationChain.builder.discardButton.show();
                                this.escalationChain.builder.scroll();
                            }
                        },
                    });
                    callbacks?.onClick?.();
                };
                chainActivity.onRemoved = () => {
                    this.#setActiveActivity(null);
                    callbacks?.onRemoved?.();
                };

                return chainActivity;
            }
        };

        this.#setupEscalationChainSelector();
        this.#setupEscalationChainBuilder();
        this.#setupEscalationRuleBuilder();
    }

    #setupEscalationChainSelector() {
        const chainSelector = this.escalationChain.selector;

        chainSelector.reset = () => {
            chainSelector.setEnabled?.(true);
            chainSelector.container.show();
            chainSelector.toolbar.hide();
            chainSelector.dropdown.value('');
            chainSelector.validation.text('');
            this.escalationChain.divider.show();
            this.escalationChain.builder.container.show();
            this.escalationChain.current?.remove();
            this.escalationChain.current = null;
        };
        chainSelector.setEnabled = enabled => {
            chainSelector.toolbar.hide();
            chainSelector.dropdown.enable(enabled);
        }

        if (!this.builderEnabled)
            return;

        chainSelector.toolbar.hide();
        chainSelector.discardButton.bind('click', chainSelector.reset);
        chainSelector.dropdown.bind('change', () => {
            const selected = chainSelector.dropdown.dataItem();

            if (!selected?.Value) {
                chainSelector.reset();
                return;
            }

            this.escalationChain.builder.container.hide();
            this.escalationChain.divider.hide();
            chainSelector.validation.text('');

            Metronic.blockUI({ target: chainSelector.container, animate: true })
            fetch(`${this.escalationChainActionUri}?escalationChainId=${selected.Value}`)
                .then(response => response.json())
                .then(response => {
                    if (response.Status !== 'success')
                        throw new Error(response.Status);

                    // Make sure the escalation chain dropdown hasn't changed
                    if (response.EscalationChain.EscalationChainId !== Number(chainSelector.dropdown.value()))
                        return;

                    if (!this.data)
                        this.data = {};
                    this.data.EscalationChain = response.EscalationChain;

                    // reset existing state
                    this.escalationChain.current?.remove();
                    this.escalationChain.builder.container.hide();
                    this.escalationChain.divider.hide();
                    chainSelector.validation.text('');

                    const callbacks = {
                        onAdded: () => {
                            // Add the rules activities after adding the escalation chain activity
                            setTimeout(this.escalationChain.ruleBuilder.initData, 100)
                            chainSelector.setEnabled?.(false);
                            chainSelector.container.hide();
                        },
                        onRemoved: () => {
                            chainSelector.setEnabled?.(true);
                            chainSelector.container.show();
                            this.escalationChain.selector.dropdown.value('');
                        }
                    };

                    this.escalationChain.selector.dropdown.value(response.EscalationChain.EscalationChainId);
                    this.escalationChain.current = this.escalationChain.createActivity(this.data.EscalationChain.EscalationChainId, this.data.EscalationChain.Name, callbacks);
                    chainSelector.activityContainer.append(this.escalationChain.current.element);
                    chainSelector.toolbar.show();
                })
                .catch(() => chainSelector.validation.text('[[[[Failed to load escalation chain.]]]]'))
                .finally(() => Metronic.unblockUI(chainSelector.container));
        });
    }

    #setupEscalationChainBuilder() {
        const chainBuilder = this.escalationChain.builder;

        // Escalation chain builder methods
        chainBuilder.reset = () => {
            chainBuilder.label.text('[[[[Create a new Escalation Chain]]]]');
            chainBuilder.nameField.val('');
            chainBuilder.nameValidation.text('');
            chainBuilder.discardButton.hide();
            chainBuilder.saveButton.hide();

            // Reset and hide the escalation chain rule builder
            this.escalationChain.ruleBuilder.reset?.();
            this.escalationChain.ruleBuilder.container.hide();

            this.escalationChain.divider.show();
            this.escalationChain.selector.container.show();
            this.escalationChain.selector.dropdown.value('');
            chainBuilder.container.show();

            if (this.escalationChain.current) {
                chainBuilder.label.text('[[[[Name]]]]');
                chainBuilder.nameField.val(this.escalationChain.current.data.name);
                chainBuilder.nameField.prop('disabled', !!this.escalationChain.current.managed);
                this.escalationChain.ruleBuilder.container.show();
                this.escalationChain.ruleBuilder.reset?.();

                this.escalationChain.selector.container.hide();
                this.escalationChain.divider.hide();

                if (!this.escalationChain.current.managed) {
                    this.escalationChain.current.remove();
                    this.escalationChain.current = null;
                    chainBuilder.reset();
                }
            }
        };
        chainBuilder.validateName = (value) => {
            if (!value)
                return { valid: false, reason: '[[[[The field Name is required.]]]]' };
            else if (value.length > 50)
                return { valid: false, reason: '[[[[The field Name must be a string with a maximum length of 50.]]]]' };
            else
                return { valid: true };
        }
        chainBuilder.initBuilder = () => {
            // Setup escalation chain builder discard button
            chainBuilder.discardButton.hide();
            chainBuilder.discardButton.bind('click', chainBuilder.reset);

            // Setup escalation chain builder save button (used when editing an added escalation chain)
            chainBuilder.saveButton.hide();
            chainBuilder.saveButton.bind('click', () => {
                chainBuilder.saveButton.hide();
                chainBuilder.discardButton.hide();

                if (!this.escalationChain.current)
                    return;

                const value = chainBuilder.nameField.val().trim();
                if (!value) {
                    this.escalationChain.current.remove();
                    this.escalationChain.current = null;
                    chainBuilder.reset();
                    return;
                }

                // Update the value
                this.escalationChain.current.data.name = value;
                const element = this.escalationChain.current.contentContainer.querySelector('[data-display="escalationChain"]');
                element.textContent = value;
                element.title = value;

                chainBuilder.reset();
            });

            // Setup escalation chain builder name field
            chainBuilder.nameField.bind('input', () => {
                const value = chainBuilder.nameField.val().trim();
                const validation = chainBuilder.validateName(value);

                if (!validation.valid) {
                    chainBuilder.nameValidation.text(validation.reason);
                    chainBuilder.saveButton.hide();

                    if (this.escalationChain.current && !this.escalationChain.current.managed) {
                        this.escalationChain.current.remove();
                        this.escalationChain.current = null;
                    }

                    return;
                }

                this.escalationChain.divider.hide();
                this.escalationChain.selector.container.hide();

                chainBuilder.nameValidation.text('');
                chainBuilder.discardButton.show();

                // Check if there's no escalation chain activity yet
                if (!this.escalationChain.current) {
                    const chainActivity = this.escalationChain.createActivity(0, value);
                    this.escalationChain.current = chainActivity;

                    chainBuilder.activityContainer.append(chainActivity.element);
                    chainBuilder.scroll();
                    return;
                }

                // Check if we're editing an escalation chain that was already added
                if (this.escalationChain.current.managed) {
                    // Editing activities relies on the save button to update the value
                    chainBuilder.saveButton.show();
                } else {
                    // Update the value directly
                    this.escalationChain.current.data.name = value;
                    const element = this.escalationChain.current.contentContainer.querySelector('[data-display="escalationChain"]');
                    element.textContent = value;
                    element.title = value;
                }
            });
        }
        chainBuilder.initData = () => {
            // Add existing escalation chain
            if (this.data.EscalationChain) {
                const chainActivity = this.escalationChain.createActivity(this.data.EscalationChain.EscalationChainId, this.data.EscalationChain.Name);
                this.escalationChain.current = chainActivity;
                this.escalationChain.ruleBuilder.container?.show();
                this.escalationChain.ruleBuilder.reset?.();

                this.jsPlumb.connectActivity(chainActivity);
                this.shouldAutoPosition = true;
            }
        }

        if (this.builderEnabled)
            chainBuilder.initBuilder();
        chainBuilder.initData();
    }

    #setupEscalationRuleBuilder() {
        const ruleBuilder = this.escalationChain.ruleBuilder;
        const kendoListView = ruleBuilder.listView.data('kendoListView');

        // Escalation chain rule builder methods
        ruleBuilder.reset = () => {
            ruleBuilder.eventDropdown.val('');
            ruleBuilder.valueFieldContainers().hide();
            ruleBuilder.valueContainer.hide();
            ruleBuilder.valueFields.each((_, el) => this.#setSelectValue(el, ''))
            ruleBuilder.valueValidation.text('');
            ruleBuilder.discardButton.hide();
            ruleBuilder.addButton.hide();
        };

        ruleBuilder.createRuleActivity = (data) => {
            const rule = WorkflowBuilder.#escalationRuleEvents.getByValue(data.event.value);

            let ruleTemplate = rule.ruleTemplate;
            ruleTemplate = ruleTemplate.replace('{Value}', data.value);
            ruleTemplate = ruleTemplate.replace('{TextValue}', data.valueText);

            const ruleActivity = this.jsPlumb.createActivity(WorkflowBuilder.#types.escalationRule.name, {
                handlesDroppedActivities: true,
                diamond: { size: 170 }
            });
            ruleActivity.contentContainer.append(...this.#createElement(/*html*/ `
                <div class="activity-header">
                    <span class="fa fa-bolt"></span>
                    [[[[Escalation Rule]]]]
                </div>
                <div class="activity-content">
                    <div title="${rule.text}: ${data.valueText}" data-display="escalationRule" data-rule-event="${data.event.value}" data-rule-value="${data.value}" class="title">${ruleTemplate}</div>
                    <div>
                        [[[[Level]]]]:
                        <span data-display="escalationRuleLevel">${data.level}</span>
                    </div>
                </div>
            `, false));

            // Create the list view item for the rule
            const ruleListViewItem = kendoListView?.dataSource.add({
                EventText: `${rule.text}: ${data.valueText}`,
                ValueText: `[[[[Level]]]] ${data.level}`,
                Value: data.level,
            });
            kendoListView?.dataSource.sync();

            ruleActivity.manage();
            ruleActivity.data = {
                level: data.level,
                event: data.event,
                value: data.value,
                valueText: data.valueText,
                id: data.id
            };
            ruleActivity.onClick = () => this.#setActiveActivity(ruleActivity, {
                remove: { enabled: true },
            });
            ruleActivity.onRemoved = () => {
                this.#setActiveActivity(null);
                kendoListView?.dataSource.remove(ruleListViewItem);
                ruleBuilder.updateLevels();
            };
            ruleActivity.canConnect = (activity) => {
                if (activity.type === WorkflowBuilder.#types.notification.name) {
                    // Only allow notification rule activities to be dropped (and not default notifications)
                    return activity.data.id > 0;
                }

                return true;
            };

            ruleActivity.addEndpoint({
                target: true,
                source: false,
                scope: WorkflowBuilder.#types.escalationRule.name,
                maxConnections: 1,
                connectionsDetachable: false,
                paintStyle: { fill: WorkflowBuilder.#types.escalationRule.color },
                connectorStyle: { stroke: WorkflowBuilder.#types.escalationRule.color, strokeWidth: 2 },
                data: { type: 'default', activityType: WorkflowBuilder.#types.escalationRule.name },
                anchor: { type: 'Continuous', options: { faces: ['top'] } },
                overlays: [],
                connectorOverlays: []
            });

            ruleActivity.addAdditionEndpoint({
                scope: WorkflowBuilder.#types.action.name,
                paintStyle: { fill: WorkflowBuilder.#types.action.color },
                connectorStyle: { stroke: WorkflowBuilder.#types.action.color, strokeWidth: 2 }
            });
            ruleActivity.addAdditionEndpoint({
                scope: WorkflowBuilder.#types.notification.name,
                paintStyle: { fill: WorkflowBuilder.#types.notification.color },
                connectorStyle: { stroke: WorkflowBuilder.#types.notification.color, strokeWidth: 2 }
            });

            return ruleActivity;
        }

        ruleBuilder.updateLevels = () => {
            if (!kendoListView)
                return;

            const rules = this.escalationChain.rules()
                .map(r => ({ level: r.data.level, rule: r }))

            kendoListView.dataSource.data().forEach((item, index) => {
                const newLevel = index + 1;
                const rule = rules.find(a => a.level === item.Value)?.rule;
                if (!rule)
                    return;

                const element = rule.element.querySelector('[data-display="escalationRuleLevel"]');
                element.textContent = newLevel;
                rule.data.level = newLevel;

                item.Value = newLevel;
                item.ValueText = `[[[[Level]]]] ${newLevel}`;
            });

            this.escalationChain.current.children.sort((a, b) => {
                if (a && b)
                    return a.data.level - b.data.level;
                else
                    return -1;
            });

            kendoListView.dataSource.sync();
        }

        ruleBuilder.initBuilder = () => {
            ruleBuilder.listView.kendoSortable({
                filter: '.escalation-rule-item',
                hint: (element) => element.clone().css({
                    width: element.width(),
                    height: element.height(),
                }),
                change: (e) => {
                    const dataArray = kendoListView.dataSource.data();

                    // Reorder the data
                    const item = dataArray.splice(e.oldIndex, 1)[0];
                    dataArray.splice(e.newIndex, 0, item);

                    // Update the data in the list view
                    kendoListView.dataSource.data(dataArray);
                    ruleBuilder.updateLevels();
                }
            });

            if (!this.escalationChain?.current)
                ruleBuilder.container.hide();
            ruleBuilder.reset();
            ruleBuilder.discardButton.bind('click', ruleBuilder.reset);

            ruleBuilder.eventDropdown.bind('change', () => {
                ruleBuilder.valueFieldContainers().hide();
                ruleBuilder.valueContainer.hide();
                ruleBuilder.valueFields.val('');
                ruleBuilder.valueValidation.text('');

                const value = ruleBuilder.eventDropdown.val();
                if (!value) {
                    ruleBuilder.reset();
                    return;
                }

                ruleBuilder.valueFieldContainers(value).show();
                ruleBuilder.valueContainer.show();
                ruleBuilder.valueFields.val('');
                ruleBuilder.discardButton.show();
                ruleBuilder.addButton.show();
                this.escalationChain.builder.scroll();
            });

            ruleBuilder.addButton.bind('click', () => {
                const event = ruleBuilder.currentEvent();
                const value = ruleBuilder.valueField().val();
                const valueText = ruleBuilder.valueField().data('kendoDropDownList')?.text() ?? value.toString();

                if (!value || value === '0') {
                    ruleBuilder.valueValidation.text('[[[[The field Value is required.]]]]');
                    return;
                }

                if (this.escalationChain.current.readOnly || this.jsPlumb.readOnly) {
                    ruleBuilder.valueValidation.text('[[[[Escalation rules cannot be added while the workflow is locked.]]]]');
                    return;
                }

                ruleBuilder.reset();
                const level = 1 + this.escalationChain.rules()
                    .reduce((max, rule) => Math.max(max, rule.data.level), 0);
                const ruleActivity = ruleBuilder.createRuleActivity({ event, level, value, valueText, id: 0 });
                ruleActivity.element.click();

                this.escalationChain.current.connectChild(ruleActivity);
            });
        }

        ruleBuilder.initData = () => {
            // Add existing escalation chain rules
            if (this.data.EscalationChain?.Rules?.length > 0) {
                const rules = this.data.EscalationChain.Rules.sort((a, b) => a.Level - b.Level);
                for (const rule of rules) {
                    const event = WorkflowBuilder.#escalationRuleEvents.getByValue(rule.Event);
                    const ruleActivity = ruleBuilder.createRuleActivity({
                        event,
                        id: rule.EscalationRuleId ?? 0,
                        level: rule.Level,
                        value: rule.Value,
                        valueText: rule.ValueText ?? rule.Value.toString()
                    });
                    this.escalationChain.current.connectChild(ruleActivity);

                    for (const action of rule.Actions) {
                        const activity = this.action.createAction(action.ActionId, action.Name);
                        ruleActivity.connectSubActivity(activity);
                    }

                    for (const notification of rule.Notifications) {
                        const type = WorkflowBuilder.#notificationTypes.getByValue(notification.Type);
                        const activity = this.notification.create(notification.NotificationId, notification.Name, type);
                        ruleActivity.connectSubActivity(activity);
                    }
                }
                this.shouldAutoPosition = true;
            }
        }

        if (this.builderEnabled)
            ruleBuilder.initBuilder();
        ruleBuilder.initData();
    }

    #setupSlaAlertRule() {
        this.sla = {
            /** @type {JsPlumbActivity | null} */
            current: null,
            collapse: () => $('#collapse_sla_rule').data('bs.collapse'),
            dropdown: $('#SlaAlertRuleId').data('kendoDropDownList'),
            validation: $('[data-valmsg-for="SlaAlertRuleId"]'),
            discardButton: $(`[data-type="${WorkflowBuilder.#types.sla.name}"] .activity-discard`),
            activityContainer: $(`.activity-builder-container[data-type="${WorkflowBuilder.#types.sla.name}"]`),
            clear() {
                this.discardButton.hide();
                this.dropdown.value('');
                this.validation.text('');

                // If the activity isn't managed (not added yet), remove it
                if (this.current && !this.current.managed)
                    this.current.remove();
            },
            createActivity: (id, name) => {
                const sla = this.jsPlumb.createActivity(WorkflowBuilder.#types.sla.name);
                sla.contentContainer.appendChild(this.#createElement(/*html*/ `
                    <div class="activity-header">
                        <span class="fa fa-flask"></span>
                        [[[[SLA Alert Rule]]]]
                    </div>
                    <div class="activity-content">
                        <span title="${name}" data-display="sla" data-sla-id="${id}" class="title">${name}</span>
                    </div>
                `));

                sla.data = { id, name };
                sla.onAdded = () => {
                    this.sla.current = null;
                    if (this.builderEnabled)
                        this.sla.clear();
                };
                sla.onClick = () => this.#setActiveActivity(sla, {
                    remove: { enabled: true, callback: () => this.sla.clear() },
                });
                sla.onRemoved = () => this.#setActiveActivity(null);

                return sla;
            },
            initBuilder: () => {
                this.sla.clear();
                this.sla.discardButton.bind('click', () => this.sla.clear());
                this.sla.dropdown.bind('change', () => {
                    this.sla.discardButton.hide();
                    this.sla.current?.remove();
                    this.sla.validation.text('');

                    const selected = this.sla.dropdown.dataItem();
                    if (!selected?.Value) {
                        this.sla.clear();
                        return;
                    }

                    // Check if an SLA alert rule has already been added
                    if ([...this.jsPlumb].some(a => a.type === WorkflowBuilder.#types.sla.name)) {
                        this.sla.validation.text('[[[[Only one SLA alert rule can be added.]]]]');
                        return;
                    }

                    this.sla.current = this.sla.createActivity(selected.Value, selected.Text);
                    this.sla.activityContainer.append(this.sla.current.element);

                    this.sla.discardButton.show();
                });
            },
            initData: () => {
                if (this.data.SlaAlertRule) {
                    const sla = this.sla.createActivity(this.data.SlaAlertRule.SlaAlertRuleId, this.data.SlaAlertRule.Name);
                    this.jsPlumb.connectActivity(sla);
                    this.shouldAutoPosition = true;
                }
            }
        }

        if (this.builderEnabled)
            this.sla.initBuilder();
        this.sla.initData();
    }

    #setupWorkflowOptions() {
        this.options = {
            /** @type {JsPlumbActivity | null} */
            current: null,
            dropdown: $('#WorkflowOption'),
            collapse: () => $('#collapse_options').data('bs.collapse'),
            validation: $('[data-valmsg-for="WorkflowOption"]'),
            discardButton: $(`.activity-builder-toolbar[data-type="options"] .activity-discard`),
            activityContainer: $(`.activity-builder-container[data-type="options"]`),
            builderContainers: $('.workflow-option-builder[data-workflow-option]'),
            fields: (func) => $(`.workflow-option-builder[data-workflow-option] input`).each((i, b) => {
                const builder = $(b).data('kendoNumericTextBox');
                if (builder)
                    func(builder);
            }),
            autoClose: {
                dayField: $('#AutoCloseDays').data('kendoNumericTextBox'),
                hourField: $('#AutoCloseHours').data('kendoNumericTextBox'),
                minuteField: $('#AutoCloseMinutes').data('kendoNumericTextBox'),
                title: '[[[[Auto Close Alerts]]]]',
                getValue() {
                    const days = Number(this.dayField.value());
                    const hours = Number(this.hourField.value());
                    const minutes = Number(this.minuteField.value());

                    const total = days * 1440 + hours * 60 + minutes;
                    const text = this.getTextValue(total);
                    return { text: text, value: total };
                },
                getTextValue(value) {
                    const days = Math.floor(value / 1440);
                    const hours = Math.floor((value - days * 1440) / 60);
                    const minutes = value - days * 1440 - hours * 60;

                    let text = `[[[[After]]]]`;
                    if (days > 0)
                        text += ` ${days} [[[[Day(s)]]]],`;
                    if (hours > 0)
                        text += ` ${hours} [[[[Hour(s)]]]],`;
                    if (minutes > 0)
                        text += ` ${minutes} [[[[Minute(s)]]]],`;
                    text = value > 0 ? text.slice(0, -1) : '';

                    return text;
                }
            },
            acknowledgedAutoClose: {
                field: $('#AcknowledgedAutoClose').data('kendoNumericTextBox'),
                title: '[[[[Close Acknowledged Alerts]]]]',
                getValue() {
                    return { text: this.getTextValue(this.field.value()), value: Number(this.field.value()) };
                },
                getTextValue(value) {
                    return `[[[[After]]]] ${value} [[[[Hours]]]]`;
                }
            },
            failedActionFalseAlert: {
                field: $('#FailedActionCountThreshold').data('kendoNumericTextBox'),
                title: '[[[[Mark as false alert]]]]',
                getValue() {
                    return { text: this.getTextValue(this.field.value()), value: Number(this.field.value()) };
                },
                getTextValue(value) {
                    return `[[[[After]]]] ${value} [[[[Failed Actions]]]]`;
                }
            },
            AggregatedTimeThreshold: {
                timeField: $('#AggregatedTimeThreshold').data('kendoNumericTextBox'),
                uniteField: $('#AlertGroupingUnit').data('kendoDropDownList'),
                title: '[[[[Create new alert when no incidents for]]]]',
                getValue() {
                    let timeValue = Number(this.timeField.value());
                    if (this.uniteField.value() == 'Hours') {
                        timeValue = timeValue * 60
                    }

                    return { text: this.getTextValue(timeValue), value: timeValue };
                },
                getTextValue(value) {
                    let unit = value > 60 ? "[[[[Hours]]]]" : "[[[[Minutes]]]]"
                    value = value > 60 ? (value / 60) : value

                    return `${value} ${unit}`;
                },
                onInit: () => {
                    const { value } = this.options.AggregatedTimeThreshold.getValue();
                    this.options.current = this.options.createActivity(WorkflowBuilder.#workflowOptions.AggregatedTimeThreshold.value, value);
                    this.options.activityContainer.append(this.options.current.element);
                    this.options.discardButton.show();
                }
            },
            getOption(type) {
                switch (type) {
                    case WorkflowBuilder.#workflowOptions.autoClose.value:
                        return this.autoClose;
                    case WorkflowBuilder.#workflowOptions.acknowledgedAutoClose.value:
                        return this.acknowledgedAutoClose;
                    case WorkflowBuilder.#workflowOptions.failedActionFalseAlert.value:
                        return this.failedActionFalseAlert;
                    case WorkflowBuilder.#workflowOptions.AggregatedTimeThreshold.value:
                        return this.AggregatedTimeThreshold;
                }
            },
            clear() {
                this.discardButton.hide();
                this.dropdown.val('');
                this.validation.text('');
                this.builderContainers.hide();
                this.fields(b => b.value(0));

                // If the activity isn't managed (not added yet), remove it
                if (this.current && !this.current.managed) {
                    this.current.remove();
                    this.current = null;
                }
            },
            scroll() {
                document.querySelector('.activity-builder-toolbar[data-type="options"]').scrollIntoView({ behavior: 'smooth' });
            },
            createActivity: (type, value) => {
                const option = this.jsPlumb.createActivity(WorkflowBuilder.#types.workflowOption.name);
                option.contentContainer.appendChild(this.#createElement(/*html*/ `
                    <div class="activity-header">
                        <span class="fa fa-cog"></span>
                        Option
                    </div>
                `));

                const optionObj = this.options.getOption(type);
                option.contentContainer.appendChild(this.#createElement(/*html*/ `
                    <div class="activity-content">
                        <div class="title">${optionObj.title}</div>
                        <div data-display="workflowOption" class="subtitle">${optionObj.getTextValue(value)}</div>
                    </div>
                `));

                option.data = { type, value };
                option.onAdded = () => {
                    this.options.current = null;
                    if (this.builderEnabled)
                        this.options.clear();
                };
                option.onRemoved = () => this.#setActiveActivity(null);
                option.onClick = () => this.#setActiveActivity(option, {
                    remove: { enabled: true, callback: () => this.options.clear() },
                });

                return option;
            },
            initBuilder: () => {
                this.options.clear();
                this.options.discardButton.bind('click', () => this.options.clear());
                this.options.dropdown.bind('change', () => {
                    this.options.builderContainers.hide();
                    this.options.discardButton.hide();
                    this.options.validation.text('');
                    this.options.fields(b => b.value(0));
                    this.options.current?.remove();
                    this.options.current = null;

                    const selected = this.#getSelectValue(this.options.dropdown);
                    if (!selected.value) {
                        this.options.clear();
                        return;
                    }

                    // Check if this workflow option has already been added
                    if ([...this.jsPlumb].some(a => a.type === WorkflowBuilder.#types.workflowOption.name && a.data.type === selected.value)) {
                        this.options.validation.text('[[[[This workflow option has already been added.]]]]');
                        return;
                    }

                    this.options.builderContainers.filter(`[data-workflow-option="${selected.value}"]`).show();
                    this.options.discardButton.show();
                    this.options.scroll();
                    this.options.getOption(selected.value).onInit?.()
                });

                const valueChange = (e) => {
                    const optionType = Number(e.sender.element.data('workflowOption'));
                    const option = this.options.getOption(optionType);
                    const { text, value } = option.getValue();

                    if (value === 0) {
                        this.options.current?.remove();
                        this.options.current = null;
                        return;
                    }

                    if (this.options.current?.data.type === optionType) {
                        // Update the value directly
                        const element = this.options.current.contentContainer.querySelector('[data-display="workflowOption"]');
                        element.textContent = text;
                        element.title = text;

                        this.options.current.data.value = value;
                        return;
                    }

                    this.options.current?.remove();
                    this.options.current = this.options.createActivity(optionType, value);

                    this.options.activityContainer.append(this.options.current.element);
                    this.options.discardButton.show();
                    this.options.scroll();
                }

                this.options.autoClose.dayField.bind('change', valueChange);
                this.options.autoClose.dayField.bind('spin', valueChange);

                this.options.autoClose.hourField.bind('change', valueChange);
                this.options.autoClose.hourField.bind('spin', valueChange);

                this.options.autoClose.minuteField.bind('change', valueChange);
                this.options.autoClose.minuteField.bind('spin', valueChange);

                this.options.acknowledgedAutoClose.field.bind('change', valueChange);
                this.options.acknowledgedAutoClose.field.bind('spin', valueChange);

                this.options.failedActionFalseAlert.field.bind('spin', valueChange);
                this.options.failedActionFalseAlert.field.bind('change', valueChange);

                this.options.AggregatedTimeThreshold.timeField.bind('spin', valueChange);
                this.options.AggregatedTimeThreshold.timeField.bind('change', valueChange);

                this.options.AggregatedTimeThreshold.uniteField.bind('spin', valueChange);
                this.options.AggregatedTimeThreshold.uniteField.bind('change', valueChange);
            },
            initData: () => {
                if (this.data.AutoClose > 0) {
                    const option = this.options.createActivity(WorkflowBuilder.#workflowOptions.autoClose.value, this.data.AutoClose);
                    this.jsPlumb.connectActivity(option);
                    this.shouldAutoPosition = true;
                }

                if (this.data.AcknowledgedAutoClose > 0) {
                    const option = this.options.createActivity(WorkflowBuilder.#workflowOptions.acknowledgedAutoClose.value, this.data.AcknowledgedAutoClose);
                    this.jsPlumb.connectActivity(option);
                    this.shouldAutoPosition = true;
                }

                if (this.data.FailedActionCountThreshold > 0) {
                    const option = this.options.createActivity(WorkflowBuilder.#workflowOptions.failedActionFalseAlert.value, this.data.FailedActionCountThreshold);
                    this.jsPlumb.connectActivity(option);
                    this.shouldAutoPosition = true;
                }

                if (this.data.AggregatedTimeThreshold > 0) {
                    const option = this.options.createActivity(WorkflowBuilder.#workflowOptions.AggregatedTimeThreshold.value, this.data.AggregatedTimeThreshold);
                    this.jsPlumb.connectActivity(option);
                    this.shouldAutoPosition = true;
                }
            }
        };

        if (this.builderEnabled)
            this.options.initBuilder();
        this.options.initData();
    }

    #setActiveActivity(activity, options = {}) {
        if (!this.builderEnabled)
            return
        this.removeBtn.onclick = null;
        this.removeBtn.classList.add('disabled');
        this.editBtn.onclick = null;
        this.editBtn.classList.add('disabled');

        if (options.remove?.enabled) {
            this.removeBtn.classList.remove('disabled');
            this.removeBtn.onclick = () => {
                activity.remove();
                options.remove?.callback?.();
                this.#setActiveActivity(null);
            };
        }

        if (options.edit?.enabled) {
            this.editBtn.classList.remove('disabled');
            this.editBtn.onclick = () => {
                options.edit?.callback?.();
            };
        }
    }

    clearActivities() {
        this.jsPlumb.removeActivities();
        this.action?.clear();
        this.notification?.clear();
        this.escalationChain?.builder.reset();
        this.sla?.clear();
        this.options?.clear();
    }

    refreshSelectLists() {
        $('#Actions').data('kendoDropDownList')?.dataSource.read();
        $('#SlaAlertRuleId').data('kendoDropDownList')?.dataSource.read();
        $('#EscalationChainId').data('kendoDropDownList')?.dataSource.read();
        $('#SmsNotificationRuleId').data('kendoDropDownList')?.dataSource.read();
        $('#EventNotificationRuleId').data('kendoDropDownList')?.dataSource.read();
        $('#EmailNotificationRuleId').data('kendoDropDownList')?.dataSource.read();
    }

    submit() {
        if (!$(this.form).valid())
            return;

        const defaultErrorMessage = '[[[[An error occurred while saving the workflow.]]]]';
        const data = this.workflowData;
        const request = new Request(this.form.action, {
            method: this.form.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        Metronic.blockUI({ target: this.form, animate: true })
        fetch(request)
            .then(response => response.json())
            .then(json => {
                alertBox.show(json.resultMessageType ?? 'error', '', json.resultMessage ?? defaultErrorMessage);
                if (json.result === 1) { // Success
                    setTimeout(() => {
                        window.location.href = json.redirectUrl;
                    }, 500);
                }
            })
            .catch(err => {
                console.log(err);
                alertBox.show('error', '', defaultErrorMessage);
            })
            .finally(() => Metronic.unblockUI(this.form));
    }

    get workflowData() {
        const workflowType = this.workflowType;
        const data = {
            Name: this.workflowName,
            WorkflowType: workflowType.value,
            WorkflowTypeText: workflowType.text,
        }

        const actions = this.jsPlumb.activities(WorkflowBuilder.#types.action.name)
            .filter(a => a.managed && a.base === null)
            .map(a => ({ ActionId: a.data.id }));
        if (actions.length > 0)
            data.Actions = actions;

        const slaAlertRule = this.jsPlumb.activities(WorkflowBuilder.#types.sla.name)
            .filter(a => a.managed && a.base === null)
            .at(0);
        if (slaAlertRule)
            data.SlaAlertRule = { SlaAlertRuleId: slaAlertRule.data.id };

        const notifications = this.jsPlumb.activities(WorkflowBuilder.#types.notification.name)
            .filter(a => a.managed && a.base === null);

        if (notifications.some(n => n.data.type.value === WorkflowBuilder.#notificationTypes.driver.value))
            data.DriverNotificationsEnabled = true;

        const emailNotification = notifications.filter(n => n.data.type.value === WorkflowBuilder.#notificationTypes.email.value);
        if (emailNotification.length > 0)
            data.EmailNotifications = emailNotification.map(n => ({ NotificationId: n.data.id }));

        const smsNotification = notifications.filter(n => n.data.type.value === WorkflowBuilder.#notificationTypes.sms.value);
        if (smsNotification.length > 0)
            data.SmsNotifications = smsNotification.map(n => ({ NotificationId: n.data.id }));

        const eventNotification = notifications.filter(n => n.data.type.value === WorkflowBuilder.#notificationTypes.event.value);
        if (eventNotification.length > 0)
            data.EventNotifications = eventNotification.map(n => ({ NotificationId: n.data.id }));

        const escalationChain = this.jsPlumb.activities(WorkflowBuilder.#types.escalationChain.name)
            .filter(a => a.managed && a.base === null)
            .at(0);

        if (escalationChain) {
            data.EscalationChain = {
                EscalationChainId: escalationChain.data.id,
                Name: escalationChain.data.name,
                Rules: this.jsPlumb.activities(WorkflowBuilder.#types.escalationRule.name)
                    .filter(a => a.managed)
                    .map(r => ({
                        EscalationRuleId: r.data.id,
                        Level: r.data.level,
                        Event: r.data.event.value,
                        Value: r.data.value,
                        Actions: r.subActivities.get(WorkflowBuilder.#types.action.name)?.filter(a => a !== null && a.managed).map(a => ({ ActionId: a.data.id })),
                        Notifications: r.subActivities.get(WorkflowBuilder.#types.notification.name)?.filter(n => n !== null && n.managed).map(n => ({
                            NotificationId: n.data.id,
                            Type: n.data.type.value
                        }))
                    }))
            };
        }

        const options = this.jsPlumb.activities(WorkflowBuilder.#types.workflowOption.name)
            .filter(a => a.managed && a.base === null);

        const autoClose = options
            .filter(o => o.data.type === WorkflowBuilder.#workflowOptions.autoClose.value)
            .at(0);
        if (autoClose)
            data.AutoClose = autoClose.data.value;

        const acknowledgedAutoClose = options
            .filter(o => o.data.type === WorkflowBuilder.#workflowOptions.acknowledgedAutoClose.value)
            .at(0);
        if (acknowledgedAutoClose)
            data.AcknowledgedAutoClose = acknowledgedAutoClose.data.value;

        const failedActionFalseAlert = options
            .filter(o => o.data.type === WorkflowBuilder.#workflowOptions.failedActionFalseAlert.value)
            .at(0);
        if (failedActionFalseAlert)
            data.FailedActionCountThreshold = failedActionFalseAlert.data.value;

        const AggregatedTimeThreshold = options
            .filter(o => o.data.type === WorkflowBuilder.#workflowOptions.AggregatedTimeThreshold.value)
            .at(0);
        if (AggregatedTimeThreshold)
            data.AggregatedTimeThreshold = AggregatedTimeThreshold.data.value;

        return data;
    }

    get workflowType() {
        return this.builderEnabled ? this.#getSelectValue($('[name="WorkflowType"]')) : {
            value: Number(this.data.WorkflowType),
            text: this.data.WorkflowTypeText
        };
    }

    get workflowName() {
        return this.builderEnabled ? $('#Name').val().trim() : this.data.Name;
    }

    async export() {
        this.jsPlumbContainer.style.width = `${this.jsPlumbContainer.scrollWidth}px`;
        this.jsPlumbContainer.style.height = `${this.jsPlumbContainer.scrollHeight}px`;
        this.jsPlumbContainer.style.overflow = 'visible';

        return htmlToImage.toBlob(this.jsPlumbContainer).then(blob => {
            this.#saveBlob(blob, `${this.workflowName}.png`);
            this.jsPlumbContainer.style.width = '';
            this.jsPlumbContainer.style.height = '';
            this.jsPlumbContainer.style.overflow = '';
        })
    }

    #saveBlob(blob, fileName) {
        const fileUrl = window.URL.createObjectURL(blob)
        const anchorElement = document.createElement('a')

        anchorElement.href = fileUrl
        anchorElement.download = fileName
        anchorElement.style.display = 'none'

        document.body.appendChild(anchorElement)

        anchorElement.click()
        anchorElement.remove()

        window.URL.revokeObjectURL(fileUrl)
    }

    #setSelectValue(el, val) {
        const kendo = $(el).data('kendoDropDownList');
        if (kendo)
            kendo.value(val);
        else
            $(el).val(val);
    }

    #getSelectValue(el) {
        const kendo = $(el).data('kendoDropDownList');
        if (kendo) {
            const selected = kendo.dataItem();
            return { value: Number(selected?.Value), text: selected?.Value > 0 ? selected?.Text : '' };
        } else {
            const selected = $(el).find(':selected');
            return { value: Number(selected.val()), text: selected.val() > 0 ? selected.text() : '' };
        }
    }

    #hideElement(element) {
        element.css('display', 'none');
    }

    #showElement(element) {
        element.css('display', '');
    }

    #createElement(htmlStr, wrapElements = true) {
        const template = document.createElement('template');
        template.innerHTML = htmlStr.trim();

        // If there are multiple elements, wrap them in a div
        if (template.content.children.length > 1) {
            if (wrapElements) {
                const wrapper = document.createElement('div');
                wrapper.append(...template.content.children);
                return wrapper;
            } else {
                return template.content.children;
            }
        }

        return template.content.firstChild;
    }

    static #notificationTypes = {
        event: { value: 1, text: '[[[[Event]]]]', icon: 'fa-bell' },
        email: { value: 2, text: '[[[[Email]]]]', icon: 'fa-envelope' },
        sms: { value: 3, text: '[[[[SMS]]]]', icon: 'fa-comment' },
        driver: { value: 4, text: '[[[[In-Vehicle]]]]', icon: 'fa-car' },
        getByValue(value) {
            for (const type of Object.values(WorkflowBuilder.#notificationTypes))
                if (type.value === Number(value))
                    return type;
            return null;
        }
    };

    static #escalationRuleEvents = {
        incidentCount: {
            value: 1,
            text: '[[[[Incident Count]]]]',
            ruleTemplate: '[[[[Incident Count]]]] ≥ {Value}'
        },
        duration: {
            value: 2,
            text: '[[[[Duration]]]]',
            ruleTemplate: '[[[[Duration]]]] ≥ {Value} [[[[minutes]]]]'
        },
        resolutionStateChange: {
            value: 3,
            text: '[[[[Resolution State Change]]]]',
            ruleTemplate: '[[[[Resolution State]]]] ➝ {TextValue}'
        },
        period: {
            value: 4,
            text: '[[[[Period]]]]',
            ruleTemplate: '[[[[Period]]]] ≥ {Value} [[[[minutes]]]]'
        },
        succeededAction: {
            value: 5,
            text: '[[[[Succeeded Action]]]]',
            ruleTemplate: '[[[[Succeeded Actions]]]] ≥ {Value}'
        },
        failedAction: {
            value: 6,
            text: '[[[[Failed Action]]]]',
            ruleTemplate: '[[[[Failed Actions]]]] ≥ {Value}'
        },
        getByValue(value) {
            for (const event of Object.values(WorkflowBuilder.#escalationRuleEvents))
                if (event.value === Number(value))
                    return event;
            return null;
        }
    };

    static #workflowOptions = {
        autoClose: { value: 1, text: '[[[[Auto Close]]]]' },
        acknowledgedAutoClose: { value: 2, text: '[[[[Acknowledged Auto Close]]]]' },
        failedActionFalseAlert: { value: 3, text: '[[[[Failed Action False Alert]]]]' },
        AggregatedTimeThreshold: { value: 4, text: '[[[[Aggregated Time Threshold]]]]' },
    }
}