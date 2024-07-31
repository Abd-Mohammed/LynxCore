class RuleBuilder {
    #workflowUri;
    /** @type {HTMLElement} */
    #workflowContainer;
    /** @type {HTMLElement} */
    #workflowHelpMsg;

    constructor({ workflowUri, workflowContainer }) {
        this.#workflowUri = workflowUri;
        this.#workflowContainer = workflowContainer;
        this.#workflowHelpMsg = document.getElementById('EmptyWorkflowMsg');
        this.#onWorkflowChange(Number($('#AlertWorkflowId').val()));
    }

    #onWorkflowChange(value) {
        if (value) {
            this.#workflowContainer.style.display = null;
            if (this.#workflowHelpMsg)
                this.#workflowHelpMsg.style.display = 'none';
        } else {
            this.#workflowContainer.style.display = 'none';
            if (this.#workflowHelpMsg)
                this.#workflowHelpMsg.style.display = null;
        }
    }

    addAlertRule(unit) {
        const form = $('#alert_form');
        if (form.valid() === false) {
            if ($('input[name="RuleExpressions.Type"]').val() === 'UNION' && $('select[name="RuleExpressions.Value"]').val() === null) {
                $('.validation-summary-errors ul').append(`<li>The field Value is required.</li>`);
            }

            return false;
        }

        if ($('input[name="RuleExpressions.Type"]').val() === 'UNION' && $('select[name="RuleExpressions.Value"]').val() === null) {
            $('.validation-summary-errors ul').html('');
            $('.validation-summary-valid ul').html('');

            $('.validation-summary-valid ul').append(`<li>The field Value is required.</li>`);
            $('.validation-summary-errors ul').append(`<li>The field Value is required.</li>`);
            return false;
        }

        // To handle external data alerts
        if (unit == null && typeof ($('#hdnBaseUnit').val()) != 'undefined') {
            unit = $('#hdnBaseUnit').val();
        }

        let option = $('select[name="RuleExpressions.Option"]').children('option').filter(':selected').val();
        let name = '';
        $.each($('div[data-role="alert-rule"]').children(), function (i, e) {
            const elm = $(e);
            // The reason we use not equal, because in the most cases 'ignore' will be undefined
            if (elm.is('select')) {
                name += ' ';
                name += elm.children('option').filter(':selected').text();
            }
            if (elm.is('div') || elm.is('span.multiselect-native-select')) {
                name += ' ';
                $(elm.children('select').children('option').filter(':selected')).each(function () {
                    name += `${this.text}, `;
                });
                name = name.slice(0, -2);
            } else if (elm.is('label')) {
                name += ' ';
                name += elm.text();
            } else if (elm.is('input') && !elm.is(':hidden')) {
                name += ' ';
                if (elm.data('type') === 'float') {
                    name += parseFloat(elm.val()).toFixed(2);
                } else if (elm.data('type') === 'text') {
                    name += elm.val();
                } else {
                    name += parseFloat(elm.val()).toFixed(0);
                }
            }
        });

        let config = { name, option, unit };
        let expressionObj;
        switch ($('input[name="RuleExpressions.Type"]').val()) {
            case 'THRESHOLD':
                expressionObj = this.#buildThresholdExpression(config);
                break;
            case 'UNION':
                expressionObj = this.#buildUnionExpression(config);
                break;
            case 'DIFF_THRESHOLD':
                expressionObj = this.#buildDiffThresholdExpression(config);
                break;
            case 'AGGREGATE_DIFF_THRESHOLD':
                expressionObj = this.#buildAggregateDiffThresholdExpression(config);
                break;
            case 'CONTINUOUS_AGGREGATE_DIFF_THRESHOLD':
                expressionObj = this.#buildContinuousAggregateDiffThresholdExpression(config);
                break;
            case 'ABS_DIFF_THRESHOLD': // For External Data Last Time Sync
                expressionObj = this.#buildAbsDiffThresholdExpression(config);
                break;
            case 'DIFF_GEOMETRY':
                expressionObj = this.#buildDiffGeometryExpression(config);
                break;
            case 'RECURRING_THRESHOLD':
                expressionObj = this.#buildRecurringThresholdExpression(config);
                break;
            case 'TIME_THRESHOLD':
                expressionObj = this.#buildTimeThresholdExpression(config);
                break;
            case 'EQUALITY':
                expressionObj = this.#buildEqualityExpression(config);
                break;
            case 'ASSERT':
                expressionObj = this.#buildAssertExpression(config);
                break;
            case 'GEOMETRY':
                expressionObj = this.#buildGeometryExpression(config);
                break;
            case 'AGGREGATE_GEOMETRY':
                expressionObj = this.#buildAggregateGeometryExpression(config);
                break;
            case 'AGGREGATE_EQUALITY':
                break;
            case 'CONTINUOUS_AGGREGATE_EQUALITY':
                expressionObj = this.#buildAggregateEqualityExpression(config);
                break;
            case 'AGGREGATE_THRESHOLD':
                expressionObj = this.#buildAggregateThresholdExpression(config);
                break;
            case 'CONTINUOUS_AGGREGATE_THRESHOLD':
                expressionObj = this.#buildContinuousAggregateThresholdExpression(config);
                break;
            case 'AGGREGATE_PROXIMITY':
                expressionObj = this.#buildAggregateProximityExpression(config);
                break;
            case 'VARIANCE_THRESHOLD':
                expressionObj = this.#buildVarianceThresholdExpression(config);
                break;
            case 'ROUTE_PROGRESS':
                expressionObj = this.#buildRouteProgressExpression(config);
                break;
            case 'RANGE':
                expressionObj = this.#buildRangeExpression(config);
                break;
            case 'FLAGS':
                expressionObj = this.#buildFlagsExpression(config);
                break;
            case 'DIFF_PCT_THRESHOLD':
                expressionObj = this.#buildDiffPctThresholdExpression(config);
        }

        // Add rule summary item, revert rule selected index and clear container
        this.addRuleSummaryItem(`rule-summary-${$('div[data-role="alert-rule-summary"]').length}`, expressionObj);
        this.discardAlertRule();
        $('#rule-type-sel').data('kendoDropDownList').select(0);
        $('#alert-rule-container').html('');
        $('#external-data-sel').data('kendoDropDownList').select(0);
        $('#external-data-container').hide();
        $('#vision-data-container').hide();
        $('#harshDriving-data-container').hide();
        $('#devicehealth-data-container').hide();
        $('#adas-data-container').hide();
        $('#trip-data-container').hide();
    }

    discardAlertRule() {
        $('#rule-type-sel').data('kendoDropDownList').select(0);
        $('#alert-rule-container').html('');

        $('#external-data-sel').data('kendoDropDownList').select(0);
        $('#external-data-container').hide();
        $('#vision-data-container').hide();
        $('#harshDriving-data-container').hide();
        $('#devicehealth-data-container').hide();
        $('#adas-data-container').hide();
        $('#trip-data-container').hide();
    }

    addRuleSummaryItem(summaryId, expression) {
        document.getElementById('alert-rule-list').appendChild(this.#createRuleSummaryItem(summaryId));
        const newContainer = $(`#${summaryId}`);
        newContainer.append(this.#createDeleteTag());
        newContainer.append('&nbsp;');
        newContainer.append('&nbsp;');
        if (typeof expression['variable'] !== 'undefined' && (expression['variable']['name'].includes('behaviors')
            || expression['variable']['name'].includes('emotions')
            || expression['variable']['name'].includes('cameraDisturbances'))) {
            expression['variable']['name'] = expression['variable']['name'].replace(/'/g, '\\"');
        }

        newContainer.append(`<label data-expression='${JSON.stringify(expression)}'>${expression.displayName}</label>`);
    }

    displayConfirm() {
        // TODO: Rewrite to get info from stored workflow object
        $('dd[data-display="Name"]').text($('input[name="Name"]').val());
        $('dd[data-display="Severity"]').text($('select[name="Severity"]').children('option').filter(':selected').text());
        $('dd[data-display="VehicleGroup"]').text($('select[name="VehicleGroupId"]').children('option').filter(':selected').text());
        $('dd[data-display="trackedItemGroup"]').text($('select[name="TrackedItemGroupId"]').children('option').filter(':selected').text());
        $('dd[data-display="Description"]').text($('textarea[name="Description"]').val());

        if ($('#Tags').val() && $('#Tags').val().length > 0) {
            $('dd[data-display="Tags"]').text($('#Tags').select2('val').toString());
        } else {
            $('dd[data-display="Tags"]').text('[[[[None]]]]');
        }

        $('dd[data-display="RecurringDay"]').text('');
        for (let i = 0; i <= $(".recurring-index").last().data("index"); i++) {

            const recurringDay = $(`input[name="RulePeriodViewModel[${i}].RecurringDay"]`);
            const recurringTime = $(`input[name="RulePeriodViewModel[${i}].RecurringTime"]`);
            let addNewLine = false;

            if (typeof recurringDay.data('kendoDropDownList') !== 'undefined' && recurringDay.val() !== '') {
                addNewLine = true;
                $('dd[data-display="RecurringDay"]').append('<span>&#10022 </span>');
                const selectedValues = [];
                $(`select[name="RulePeriodViewModel[${i}].DayValues"]`).children('option').filter(':selected').each(function () {
                    selectedValues.push($(this).text());
                });

                $('dd[data-display="RecurringDay"]').append(`${recurringDay.data('kendoDropDownList').text()} : ${selectedValues.join('-')}`);
            }

            if (typeof recurringTime.data('kendoDropDownList') !== 'undefined' && recurringTime.val() !== '') {
                if (!addNewLine) {
                    $('dd[data-display="RecurringDay"]').append('<span>&#10022 </span>');
                }
                addNewLine = true;
                $('dd[data-display="RecurringDay"]').append(` ${recurringTime.data('kendoDropDownList').text()} : ${$(`input[name="RulePeriodViewModel[${i}].FromTime"]`).val()} - ${$(`input[name="RulePeriodViewModel[${i}].ToTime"]`).val()}`);
            }

            if (addNewLine) {
                $('dd[data-display="RecurringDay"]').append('<br />');
            }
        }

        if ($('dd[data-display="RecurringDay"]').text() === '') {
            $('dd[data-display="RecurringDay"]').text('[[[[None]]]]');
        }

        const rulesSummary = $('dd[data-display="Rules"]');
        rulesSummary.empty();
        $('div[data-role="alert-rule-summary"]').each(function () {
            rulesSummary.append(`- ${$(this).find('label').text()}`);
            rulesSummary.append('<br />');
        });

        if ($('input[name="IsEnabled"]').prop('checked')) {
            $('dd[data-display="IsEnabled"]').text('[[[[Yes]]]]');
        } else {
            $('dd[data-display="IsEnabled"]').text('[[[[No]]]]');
        }

        if ($('input[name="IsBookmarked"]').prop('checked')) {
            $('dd[data-display="IsBookmarked"]').text('[[[[Yes]]]]');
        } else {
            $('dd[data-display="IsBookmarked"]').text('[[[[No]]]]');

        }

        if ($('input[name="IsViolation"]').prop('checked')) {
            $('dd[data-display="IsViolation"]').text('[[[[Yes]]]]');
        } else {
            $('dd[data-display="IsViolation"]').text('[[[[No]]]]');
        }

        if ($('#AlertWorkflowId').data('kendoDropDownList').value()) {
            $('dd[data-display="Workflow"]').text($('#AlertWorkflowId').data('kendoDropDownList').text());
        } else {
            $('dd[data-display="Workflow"]').text('[[[[None]]]]');
        }
    }

    getExternalDataItem(link, parameter) {
        $.get(`${link}?name=${parameter}`, function (data) {
            $.each(data, function (index, option) {
                $('#externalDataItems').append($('<option />', {
                    value: option.Number, text: option.Name
                }));
            });
        }).done(function () {
            $('#externalDataItems').multiselect({
                buttonWidth: '450px',
            });
        });
    }

    customValidation(index) {
        if (index === 1) {
            let validationErrorCount = 0;
            for (let i = 0; i <= $(".recurring-index").last().data("index"); i++) {

                const recurringDay = $(`input[name="RulePeriodViewModel[${i}].RecurringDay"]`).val();
                const recurringtime = $(`input[name="RulePeriodViewModel[${i}].RecurringTime"]`).val();
                const dayValues = $(`select[name="RulePeriodViewModel[${i}].DayValues"]`).val();

                if ((recurringDay !== '' && typeof recurringDay !== 'undefined') && (dayValues === '' || dayValues === null)) {
                    $(`span[data-valmsg-for="RulePeriodViewModel[${i}].DayValues"]`).text('[[[[Select Recurring day(s)]]]]');
                    validationErrorCount++;
                } else {
                    $(`span[data-valmsg-for="RulePeriodViewModel[${i}].DayValues"]`).text('');
                }

                const fromTime = $(`input[name="RulePeriodViewModel[${i}].FromTime"]`).val();
                const totime = $(`input[name="RulePeriodViewModel[${i}].ToTime"]`).val();

                if (recurringtime !== '' && typeof recurringtime !== 'undefined') {
                    if (fromTime === '') {
                        $(`span[data-valmsg-for="RulePeriodViewModel[${i}].FromTime"]`).text('[[[[The From Time field is required.]]]]');
                        validationErrorCount++;
                    } else {
                        $(`span[data-valmsg-for="RulePeriodViewModel[${i}].FromTime"]`).text('');
                    }


                    if (totime === '') {
                        $(`span[data-valmsg-for="RulePeriodViewModel[${i}].ToTime"]`).text('[[[[The To Time field is required.]]]]');
                        validationErrorCount++;
                    } else {
                        $(`span[data-valmsg-for="RulePeriodViewModel[${i}].ToTime"]`).text('');
                    }

                    if (this.#checkTimeValid(fromTime) && this.#checkTimeValid(totime) && (fromTime !== '' && totime !== '') && (typeof fromTime !== 'undefined' && typeof totime !== 'undefined')) {
                        if (kendo.parseDate(totime).getTime() <= kendo.parseDate(fromTime).getTime()) {
                            $(`span[data-valmsg-for="RulePeriodViewModel[${i}].FromTime"]`).text('[[[[The to time field must be greater than from time field.]]]]');
                            validationErrorCount++;
                        } else {
                            $(`span[data-valmsg-for="RulePeriodViewModel[${i}].FromTime"]`).text('');
                        }
                    } else {
                        if (!this.#checkTimeValid(fromTime) && fromTime !== '') {
                            $(`span[data-valmsg-for="RulePeriodViewModel[${i}].FromTime"]`).text('[[[[The From Time field is invalid.]]]]');
                            validationErrorCount++;
                        }
                        if (!this.#checkTimeValid(totime) && totime !== '') {
                            $(`span[data-valmsg-for="RulePeriodViewModel[${i}].ToTime"]`).text('[[[[The To Time field is invalid.]]]]');
                            validationErrorCount++;
                        }
                    }
                } else {
                    $(`span[data-valmsg-for="RulePeriodViewModel[${i}].FromTime"]`).text('');
                    $(`span[data-valmsg-for="RulePeriodViewModel[${i}].ToTime"]`).text('');
                }
            }

            if (validationErrorCount !== 0) {
                return false;
            }
        }

        if (index === 2) {
            if ($('#external-data-container').is(':visible') && $('#external-data-sel').data('kendoDropDownList').value() === '') {
                $('span[data-valmsg-for="external-data-sel"]').text('[[[[The External data field is required.]]]]');
                return false;
            } else if ($('div[data-role="alert-rule-summary"]').length === 0) {
                $('#one-required').show();
                return false;
            } else {
                $('#one-required').hide();

                const ruleExpressions = [];
                $.each($('#alert-rule-list label'), function (elmIndex, e) {
                    ruleExpressions.push($(e).data('expression'));
                });

                $('input[name="RuleExpressions"]').val(JSON.stringify(ruleExpressions));
                $('#RuleExpressions').val($('input[name="RuleExpressions"]').val().replace(/\\\\"/g, '\"'));
                $('#alert-rule-container').html('');
                $('#rule-type-sel').val('');
            }
        }

        return true;
    }

    onNextCallback(index) {
        $('#back-to-index').hide();

        if (index === 2) {
            const workflowId = Number($('#AlertWorkflowId').val());
            if (workflowId)
                this.setWorkflow(workflowId);
        }
    }

    onPrevCallback(index) {
        if (index === 0) {
            $('#back-to-index').show();
            $('#one-required').hide();
        }

        if (index === 2) {
            const workflowId = Number($('#AlertWorkflowId').val());
            if (workflowId)
                this.setWorkflow(workflowId);
        }
    }

    tabValidator() {
        //Overview tab
        if ($('#tabOverview').hasClass('active')) {
            this.customValidation(1)
        }
    }

    #checkTimeValid(time) {
        const is24HourMode = $('#FromToTime24HoursFormat').val().toLowerCase() === 'true';
        const regex = is24HourMode ? /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/gm : /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/gm;

        return regex.test(time);
    }

    #createRuleSummaryItem(id) {
        const ruleSummary = document.createElement('div');

        ruleSummary.id = id;
        ruleSummary.setAttribute('data-role', 'alert-rule-summary');
        ruleSummary.setAttribute('style', 'margin-bottom:2px;');

        return ruleSummary;
    }

    setWorkflow(id) {
        const currentId = Number(this.#workflowContainer.querySelector('[data-workflow-id]')?.dataset.workflowId);
        if (id === currentId)
            return;

        this.#onWorkflowChange(id);
        this.#workflowContainer.replaceChildren();
        if (!id)
            return;

        const uri = new URL(this.#workflowUri, window.location.origin);
        uri.searchParams.append('id', id);

        Metronic.blockUI({ target: this.#workflowContainer, animate: true })
        fetch(uri)
            .then(response => response.text())
            .then(text => $(this.#workflowContainer).html(text))
            .catch(error => {
                alertBox.show('error', '', '[[[[Error loading workflow]]]]');
                console.log('Workflow error:', error);
            })
            .finally(() => {
                Metronic.unblockUI(this.#workflowContainer);
            });
    }

    #createDeleteTag() {
        const aTag = document.createElement('a');
        aTag.setAttribute('href', 'javascript:');
        aTag.setAttribute('class', 'btn tooltips');

        aTag.innerHTML = '<i class="fa fa-trash"></i>';
        aTag.addEventListener('click', () => {
            $(aTag).parent().remove();
            // Update rule summary ids
            $.each($('#alert-rule-list').children(), (i, div) => {
                const jqDiv = $(div);
                jqDiv.attr('id', `rule-summary-${i}`);
            });
        });

        return aTag;
    }

    #buildThresholdExpression({ name, option, unit }) {
        let variableName;
        if (typeof $('input[name="RuleExpressions.Variable.Property"]').val() === 'undefined') {
            variableName = $('select[name="RuleExpressions.Variable.Property"]').val();
        } else {
            variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        }

        // Get value of input, if no input found try found selected value
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val() || $('select[name="RuleExpressions.Value"] option:selected').val()); // Don't round here becuase of HDOP  
        if (typeof (option) === 'undefined') {
            option = $('input[name="RuleExpressions.Option"]').val();
        }

        switch (option) {
            case '1':
                option = 'Less Than';
                break
            case '2':
                option = 'Less Than Or Equal';
                break;
            case '3':
                option = 'Greater Than';
                break;
            case '4':
                option = 'Greater Than Or Equal';
                break;
            case '5':
                option = 'Equal';
                break;
            case '6':
                option = 'Not Equal';
                break;
            default:
                break;
        }

        let expressionObj = {
            displayName: name.trim(), type: 'THRESHOLD', option: option, variable: {
                name: variableName
            }
        };

        switch (variableName) {

            case 'Distance': // Convert to base unit where distance base unit is m and speed is km/h  
            case 'PhysicalOdometer':
            case 'DistanceSinceLastTrip':
            case '$.trip.distance':
                expressionValue = expressionValue.toFixed(0);
                expressionObj.value = unitConverter.convertByAbbreviation(expressionValue, 'length', unit, 'm', 2);
                expressionObj.displayValue = expressionValue;
                break;
            case 'Speed':
            case 'PhysicalSpeed':
                expressionValue = expressionValue.toFixed(0);
                expressionObj.value = unitConverter.convertByAbbreviation(expressionValue, 'speed', unit, 'km/h', 2);
                expressionObj.displayValue = expressionValue;
                break;
            case 'Temperature':
            case 'EngineCoolantTemperature':
            case 'IntakeAirTemperature':
            case 'AmbientAirTemperature':
            case 'EngineOilTemperature':
            case 'EngineTemperature':
            case 'CpuTemperature':
            case 'DeviceTemperature':
                expressionValue = expressionValue.toFixed(0);
                expressionObj.value = unitConverter.convertByAbbreviation(expressionValue, 'Temperature', unit, '℃', 2);
                expressionObj.displayValue = expressionValue;
                break;
            case 'Accelerometer':
                expressionObj.value = expressionValue.toFixed(2);

                // force renaming the vairable name to match the accelartion direction.
                // note this is based on the acceleration type enum.
                const directionValue = parseInt($('select[name="AccelerometerType"]').val());
                switch (directionValue) {
                    case 1:
                        expressionObj.variable.name = 'XAcceleration';
                        break;
                    case 2:
                        expressionObj.variable.name = 'YAcceleration';
                        break;
                    case 3:
                        expressionObj.variable.name = 'ZAcceleration';
                        break;
                }
                break;
            case 'Hdop': // Round to two decimal points because float is allowed in HDOP 
            case 'Pdop':
                expressionObj.value = expressionValue.toFixed(2);
                break;
            case 'ShiftExceededBreakTime':
            case '$.vision.detection.peopleCount':
                expressionObj.value = parseInt($('select[name="RuleExpressions.Value"]').children('option').filter(':selected').val());
                break;
            default:
                expressionObj.value = expressionValue.toFixed(0);
                break;
        }

        return expressionObj;
    }

    #buildUnionExpression({ name, option }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();

        // Get value of input, if no input found, try to find the selected value
        let expressionValue = $('select[name="RuleExpressions.Value"]').val();

        return {
            displayName: name.trim(),
            type: 'UNION',
            option: option === '1' ? 'In' : 'NotIn',
            values: expressionValue,
            variable: {
                name: variableName
            }
        };
    }

    #buildDiffThresholdExpression({ name, unit }) {
        let variableName = $('input[name="RuleExpressions.Variable1.Property"]').val();
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val());

        let expressionObj = {
            displayName: name.trim(),
            type: 'DIFF_THRESHOLD',
            value: expressionValue,
            variable1: { name: '' },
            variable2: { name: '' }
        };

        if (isNaN(expressionValue)) {
            expressionObj.variable1.name = variableName;
            expressionObj.value = $('select[name="RuleExpressions.Value"]').val();
        }

        if (variableName === 'RoadSpeedLimit') {
            expressionValue = expressionValue.toFixed(0);
            expressionObj.value = parseFloat(unitConverter.convertByAbbreviation(expressionValue, 'speed', unit, 'km/h', 2));
            expressionObj.displayValue = parseFloat(expressionValue);
            expressionObj.variable1.name = $('input[name="RuleExpressions.Variable1.Entity"]').val();
            expressionObj.variable1.minValue = 60; // A value that will be used to ensure speeds are greater or equal to 60                 
            expressionObj.variable2.name = $('input[name="RuleExpressions.Variable2.Entity"]').val();
        } else {
            expressionObj.variable1.name = $('input[name="RuleExpressions.Variable1.Property"]').val() || $('select[name="RuleExpressions.Variable1.Property"]').val();
            expressionObj.variable2.name = $('input[name="RuleExpressions.Variable2.Property"]').val() || $('select[name="RuleExpressions.Variable2.Property"]').val();
        }

        return expressionObj;
    }

    #buildAggregateDiffThresholdExpression({ name, unit }) {
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val());
        let expressionTimePeriod = parseFloat($('select[name="RuleExpressions.TimePeriod"]').val());
        let expressionObj = {
            displayName: name.trim(),
            type: 'AGGREGATE_DIFF_THRESHOLD',
            timePeriod: expressionTimePeriod,
            variable1: { name: '' },
            variable2: { name: '' },
            value: expressionValue,
        };

        expressionValue = expressionValue.toFixed(0);
        expressionObj.value = parseFloat(unitConverter.convertByAbbreviation(expressionValue, 'speed', unit, 'km/h', 2));
        expressionObj.displayValue = parseFloat(expressionValue);
        expressionObj.variable1.name = $('input[name="RuleExpressions.Variable1.Entity"]').val();
        expressionObj.variable1.minValue = 60; // A value that will be used to ensure speeds are greater or equal to 60                 
        expressionObj.variable2.name = $('input[name="RuleExpressions.Variable2.Entity"]').val();

        let predicateMethod = $('input[name="PredicateMethod"]').val();
        if (typeof predicateMethod !== 'undefined' && predicateMethod === 'Count') {
            expressionObj.predicate = {
                method: $('input[name="PredicateMethod"]').val(),
                value: parseInt($('select[name="PredicateSelect"]').val())
            };
        }

        return expressionObj;
    }

    #buildContinuousAggregateDiffThresholdExpression({ name, unit }) {
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val());
        let expressionTimePeriod = parseFloat($('select[name="RuleExpressions.TimePeriod"]').val());
        let expressionObj = {
            displayName: name.trim(),
            type: 'CONTINUOUS_AGGREGATE_DIFF_THRESHOLD',
            value: expressionValue,
            timePeriod: expressionTimePeriod,
            variable1: { name: '' },
            variable2: { name: '' }
        };

        expressionValue = expressionValue.toFixed(0);
        expressionObj.value = parseFloat(unitConverter.convertByAbbreviation(expressionValue, 'speed', unit, 'km/h', 2));
        expressionObj.displayValue = parseFloat(expressionValue);
        expressionObj.variable1.name = $('input[name="RuleExpressions.Variable1.Entity"]').val();
        expressionObj.variable1.minValue = 60; // A value that will be used to ensure speeds are greater or equal to 60                 
        expressionObj.variable2.name = $('input[name="RuleExpressions.Variable2.Entity"]').val();

        return expressionObj;
    }

    #buildAbsDiffThresholdExpression({ name, option }) {
        let expressionValue = $('select[name="RuleExpressions.Value"]').val();
        let expressionObj = {
            displayName: name.trim(),
            type: 'ABS_DIFF_THRESHOLD',
            value: expressionValue,
            variable1: { name: $('input[name="RuleExpressions.Variable1.Entity"]').val() },
            variable2: { name: $('input[name="RuleExpressions.Variable2.Entity"]').val() }
        };

        if (typeof (option) !== 'undefined') {
            switch (option) {
                case '1':
                    option = 'Less Than';
                    break
                case '2':
                    option = 'Less Than Or Equal';
                    break;
                case '3':
                    option = 'Greater Than';
                    break;
                case '4':
                    option = 'Greater Than Or Equal';
                    break;
                case '5':
                    option = 'Equal';
                    break;
                case '6':
                    option = 'Not Equal';
                    break;
                default:
                    break;
            }
            expressionObj.option = option;
        }

        return expressionObj;
    }

    #buildDiffGeometryExpression({ name, unit }) {
        let variableName = $('input[name="RuleExpressions.Variable1.Entity"]').val();
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val());
        expressionValue = expressionValue.toFixed(0);

        return {
            displayName: name.trim(),
            type: 'DIFF_GEOMETRY',
            value: parseFloat(unitConverter.convertByAbbreviation(expressionValue, 'length', unit, 'm', 2)),
            variable1: { name: variableName },
            variable2: { name: $('input[name="RuleExpressions.Variable2.Entity"]').val() },
            displayValue: parseFloat(expressionValue)
        };
    }

    #buildRecurringThresholdExpression({ name, unit }) {
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val());
        let expressionObj = {
            displayName: name.trim(),
            type: 'RECURRING_THRESHOLD',
            variable1: { name: $('input[name="RuleExpressions.Variable1.Entity"]').val() },
            variable2: { name: $('input[name="RuleExpressions.Variable2.Entity"]').val() },
            displayValue: expressionValue
        };

        switch (expressionObj.variable1.name) {
            case 'Odometer':
                expressionObj.value = parseFloat(unitConverter.convertByAbbreviation(expressionValue, 'length', unit, 'm', 2));
                expressionObj.maxValue = expressionObj.value + 1000;
                break;

            case 'EngineHours':
                expressionObj.value = expressionValue;
                expressionObj.maxValue = expressionObj.value + 1;
                break;

            case 'Time':
                expressionObj.value = expressionValue * 30 * 24;
                expressionObj.maxValue = expressionObj.value + 1;
                break;

            default:
                break;
        }

        return expressionObj;
    }

    #buildTimeThresholdExpression({ name, unit, option }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        let value = $('select[name="RuleExpressions.Value"]').children('option').filter(':selected').val();
        let expressionObj = {
            displayName: name.trim(), type: 'TIME_THRESHOLD', variable: {
                name: variableName
            }
        };

        if (typeof (option) === 'undefined') {
            option = $('input[name="RuleExpressions.Option"]').val();
        }

        // This is a workaround due to limitation in how external rules are being built.
        if (variableName[0] === '{') {
            const pathTokens = JSON.parse(variableName.replace(/(&quot;)/g, '"').replace('&quot', '"')).path.split('.');
            const externalPathVariable = `${pathTokens[pathTokens.length - 2]}.${pathTokens[pathTokens.length - 1]}`;

            switch (externalPathVariable) {
                case 'vehicleDetails.lastContactTime': // last event time.
                case 'shiftDetails.signOnTime':
                case 'shiftDetails.signOffTime':
                case 'shiftDetails.lastDropoffTime':
                    switch (option) {
                        case '1':
                            option = 'Less Than';
                            break
                        case '2':
                            option = 'Less Than Or Equal';
                            break;
                        case '3':
                            option = 'Greater Than';
                            break;
                        case '4':
                            option = 'Greater Than Or Equal';
                            break;
                        case '5':
                            option = 'Equal';
                            break;
                        case '6':
                            option = 'Not Equal';
                            break;
                        default:
                            break;
                    }
                    expressionObj.value = parseFloat($('input[name="RuleExpressions.Value"]').val()) * 60;
                    expressionObj.option = option;
                    break;
            }
        } else {
            switch (variableName) {
                case 'Distance':
                    let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val()); // Don't round here becuase of HDOP
                    switch (option) {
                        case '1':
                            option = 'Less Than';
                            break
                        case '2':
                            option = 'Less Than Or Equal';
                            break;
                        case '3':
                            option = 'Greater Than';
                            break;
                        case '4':
                            option = 'Greater Than Or Equal';
                            break;
                        case '5':
                            option = 'Equal';
                            break;
                        case '6':
                            option = 'Not Equal';
                            break;
                        default:
                            break;
                    }
                    expressionObj.timePeriod = parseFloat($('input[name="RuleExpressions.TimePeriod"]').val());
                    expressionObj.option = option;

                    expressionValue = expressionValue.toFixed(0);
                    expressionObj.value = unitConverter.convertByAbbreviation(expressionValue, 'length', unit, 'm', 2);
                    expressionObj.displayValue = expressionValue;
                    break;

                case 'ShiftStartTime':
                    switch (option) {
                        case '1':
                            option = 'Less Than';
                            break
                        case '2':
                            option = 'Less Than Or Equal';
                            break;
                        case '3':
                            option = 'Greater Than';
                            break;
                        case '4':
                            option = 'Greater Than Or Equal';
                            break;
                        case '5':
                            option = 'Equal';
                            break;
                        case '6':
                            option = 'Not Equal';
                            break;
                        default:
                            break;
                    }
                    expressionObj.option = option;
                    expressionObj.value = parseFloat($('input[name="RuleExpressions.TimePeriod"]').val()) * 60;
                    break;

                case 'LastTimeUpdated':
                case 'Timestamp':
                case '$.vision.timestamp':
                    switch (option) {
                        case '1':
                            option = 'Less Than';
                            break
                        case '2':
                            option = 'Less Than Or Equal';
                            break;
                        case '3':
                            option = 'Greater Than';
                            break;
                        case '4':
                            option = 'Greater Than Or Equal';
                            break;
                        case '5':
                            option = 'Equal';
                            break;
                        case '6':
                            option = 'Not Equal';
                            break;
                        default:
                            break;
                    }
                    expressionObj.value = parseFloat(value);
                    expressionObj.option = option;
                    break;
            }
        }

        return expressionObj;
    }

    #buildEqualityExpression({ name }) {
        let eqVal = $('select[name="RuleExpressions.Value"]').val();

        let variableName;
        if (typeof $('input[name="RuleExpressions.Variable.Property"]').val() === 'undefined') {
            variableName = $('select[name="RuleExpressions.Variable.Property"]').val();
        } else {
            variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        }

        if (variableName === 'DinChange') {
            switch (eqVal) {
                case '1':
                    variableName = 'Din01Change';
                    break;
                case '2':
                    variableName = 'Din02Change';
                    break;
                case '3':
                    variableName = 'Din03Change';
                    break;
                case '4':
                    variableName = 'Din04Change';
                    break;
            }
            eqVal = true;
        }

        if (variableName === '$.vision.advancedBehaviors') {
            variableName = variableName.replace('.advancedBehaviors', '.behaviors');
            variableName += `[?(@.behavior == "${eqVal}")].description`;
            eqVal = $('select[name="RuleExpressions.ValueDescription"]').val();
        }

        if (variableName === '$.vision.behaviors') {
            variableName += `[?(@.behavior == "${eqVal}")].behavior`;
        }

        if (variableName === '$.vision.detection.cameraDisturbances') {
            variableName += `[?(@.type == "${eqVal}")].type`;
        }

        if (variableName === '$.vision.faces[*].advancedEmotions') {
            variableName = variableName.replace('.advancedEmotions', '.emotions');
            variableName += `[?(@.emotion == "${eqVal}")].description`;
            eqVal = $('select[name="RuleExpressions.ValueDescription"]').val();
        }

        if (variableName === '$.vision.faces[*].emotions') {
            variableName += `[?(@.emotion == "${eqVal}")].emotion`;
        }

        let expressionObj = {
            displayName: name.trim(), type: 'EQUALITY', variable: {
                name: variableName
            }
        };

        if (variableName === 'QuarantineActive') {
            expressionObj.displayName = expressionObj.displayName.slice(0, -29);
        }

        if (typeof (eqVal) === 'undefined') {
            eqVal = $('input[name="RuleExpressions.Value"]').val();
        }

        if (eqVal === 'True') {
            expressionObj.value = true;
        } else if (eqVal === 'False') {
            expressionObj.value = false;
        } else {
            // No need to check variable name since the only rule for equality is "AlarmTypeCode"(int?) | "EventTypeCode"(string) for Event Type Code | "ConditionCode"(int) for Vehicle Condition Code
            const eqValInt = parseInt(eqVal);
            if (isNaN(eqValInt)) {
                expressionObj.value = eqVal;
            } else {
                expressionObj.value = eqValInt;
            }
        }

        return expressionObj;
    }

    #buildAssertExpression({ name }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        let expressionObj = {
            displayName: name.trim(), type: 'ASSERT', variable: {
                name: variableName
            }
        };

        expressionObj.value = $('select[name="RuleExpressions.Value"]').val();
        return expressionObj;
    }

    #buildGeometryExpression({ name, option, unit }) {
        const geometryValue = $('select[name="RuleExpressions.Variable2.Value"]').val();
        const variable2Entity = $('input[name="RuleExpressions.Variable2.Entity"]').val();

        let optionValue;
        let proximety = false;
        if (option === '1' && (variable2Entity === 'Poi' || variable2Entity === 'PoiGroup')) {
            optionValue = 'Less Than';
            proximety = true;
        } else if (option === '2' && (variable2Entity === 'Poi' || variable2Entity === 'PoiGroup')) {
            optionValue = 'More Than';
            proximety = true;
        } else if (variable2Entity === 'Area' || variable2Entity === 'AreaForTimePeriod' || variable2Entity === 'AreaGroup') {
            switch (option) {
                case '1':
                case '2':
                    optionValue = 'Enter';
                    break;
                case '3':
                case '4':
                    optionValue = 'Leave';
                    break;
            }
        }

        let expressionObj = {
            displayName: name.trim(),
            type: proximety === false && (option === '1' || option === '3') ? 'COMPARABLE_GEOMETRY' : 'GEOMETRY', // 1 and 3 refers to leave/enter geometry
            option: optionValue,
            variable1: {
                name: $('input[name="RuleExpressions.Variable1.Property"]').val()
            },
            variable2: {
                entity: $('input[name="RuleExpressions.Variable2.Entity"]').val(),
                name: $('input[name="RuleExpressions.Variable2.Property"]').val(),
                value: parseInt($('select[name="RuleExpressions.Variable2.Value"]').val())
            }
        };

        if ($('input[name="RuleExpressions.Variable2.Entity"]').val() === 'AreaForTimePeriod') {
            expressionObj.TimePeriod = parseInt($('input[name="RuleExpressions.Variable1.Value"]').val());
        }

        // Value will be undefined in case of area or area group since there is no input
        if (typeof geometryValue !== 'undefined' && (optionValue !== 'Enter' && optionValue !== 'Leave')) {
            const floatGeoValue = parseFloat($('input[name="RuleExpressions.Value"]').val()).toFixed(0);

            expressionObj.value = unitConverter.convertByAbbreviation(floatGeoValue, 'length', unit, 'm', 2);
            expressionObj.displayValue = floatGeoValue;
        }

        return expressionObj;
    }

    #buildAggregateGeometryExpression({ name, option, unit }) {
        let geometryValue = $('input[name="RuleExpressions.Value"]').val();
        switch (option) {
            case '1':
                option = 'Enter';
                break;
            case '2':
                option = 'Leave';
                break;
        }

        let expressionTimePeriod = parseFloat($('input[name="RuleExpressions.TimePeriod"]').val());
        if (typeof ($('input[name="RuleExpressions.TimePeriod"]').val()) == 'undefined') {
            expressionTimePeriod = parseInt($('select[name="RuleExpressions.TimePeriod"]').val());
        }

        let expressionObj = {
            displayName: name.trim(),
            type: 'AGGREGATE_GEOMETRY',
            option: option,
            timePeriod: expressionTimePeriod,
            variable1: {
                name: $('input[name="RuleExpressions.Variable1.Property"]').val()
            },
            variable2: {
                entity: $('input[name="RuleExpressions.Variable2.Entity"]').val(),
                name: $('input[name="RuleExpressions.Variable2.Property"]').val(),
                value: parseInt($('select[name="RuleExpressions.Variable2.Value"]').val())
            }
        };

        // Value will be undefined in case of area or area group since there is no input
        if (typeof geometryValue !== 'undefined') {
            const floatAggrGeoValue = parseFloat(geometryValue).toFixed(0);

            expressionObj.value = unitConverter.convertByAbbreviation(floatAggrGeoValue, 'length', unit, 'm', 2);
            expressionObj.displayValue = floatAggrGeoValue;
        }

        return expressionObj;
    }

    #buildAggregateEqualityExpression({ name }) {
        let eqVal = $('select[name="RuleExpressions.Option"]').val();
        if (typeof ($('select[name="RuleExpressions.Option"]').val()) == 'undefined') {
            eqVal = $('input[name="RuleExpressions.Option"]').val();
        }

        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        if (variableName === '$.vision.behaviors') {
            eqVal = $('select[name="RuleExpressions.Variable.Value"]').val();
            variableName += `[?(@.behavior == "${eqVal}")].behavior`;
        }

        let expressionValue = parseInt($('select[name="RuleExpressions.Value"]').val());
        let expressionObj = {
            displayName: name.trim(),
            type: $('input[name="RuleExpressions.Type"]').val(),
            timePeriod: expressionValue,
            variable: {
                name: variableName
            },
        };

        if (eqVal === 'True') {
            expressionObj.value = true;
        } else if (eqVal === 'False') {
            expressionObj.value = false;
        } else if (variableName.includes('$.vision.behaviors') || variableName.includes('$.adas')) {
            expressionObj.value = $('select[name="RuleExpressions.Variable.Value"]').val();
        } else {
            expressionObj.value = parseInt($('select[name="RuleExpressions.Option"]').val());
        }

        let predicateMethod = $('input[name="PredicateMethod"]').val();
        if (typeof predicateMethod !== 'undefined' && predicateMethod === 'Count') {
            expressionObj.predicate = {
                method: $('input[name="PredicateMethod"]').val(),
                value: parseInt($('select[name="PredicateSelect"]').val())
            };
        }

        return expressionObj;
    }

    #buildAggregateThresholdExpression({ name, unit, option }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val()); // Don't round here becuase of HDOP

        switch (option) {
            case '1':
                option = 'Less Than';
                break
            case '2':
                option = 'Less Than Or Equal';
                break;
            case '3':
                option = 'Greater Than';
                break;
            case '4':
                option = 'Greater Than Or Equal';
                break;
            case '5':
                option = 'Equal';
                break;
            case '6':
                option = 'Not Equal';
                break;
            default:
                break;
        }

        return {
            displayName: name.trim(),
            type: 'AGGREGATE_THRESHOLD',
            option: option,
            timePeriod: parseFloat($('input[name="RuleExpressions.TimePeriod"]').val()).toFixed(0),
            variable: {
                name: variableName, value: unitConverter.convertByAbbreviation(expressionValue, 'length', unit, 'm', 2)
            }
        };
    }

    #buildContinuousAggregateThresholdExpression({ name, option }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val()); // Don't round here becuase of HDOP

        switch (option) {
            case '1':
                option = 'Less Than';
                break
            case '2':
                option = 'Less Than Or Equal';
                break;
            case '3':
                option = 'Greater Than';
                break;
            case '4':
                option = 'Greater Than Or Equal';
                break;
            case '5':
                option = 'Equal';
                break;
            case '6':
                option = 'Not Equal';
                break;
            default:
                break;
        }

        return {
            displayName: name.trim(),
            type: 'CONTINUOUS_AGGREGATE_THRESHOLD',
            option: option,
            timePeriod: parseFloat($('input[name="RuleExpressions.TimePeriod"]').val()).toFixed(0),
            variable: {
                name: variableName
            },
            value: expressionValue
        };
    }

    #buildAggregateProximityExpression({ name }) {
        return {
            displayName: name.trim(),
            type: 'AGGREGATE_PROXIMITY',
            timePeriod: parseFloat($('input[name="RuleExpressions.TimePeriod"]').val()),
            variable1: { name: $('input[name="RuleExpressions.Variable1.Property"]').val() },
            variable2: { name: $('input[name="RuleExpressions.Variable2.Property"]').val() },
            value: 15,  // A value that will be used to ensure all locations are inside within 15 meters                        
        };
    }

    #buildVarianceThresholdExpression({ name, option }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        let ainChange = $('select[name="RuleExpressions.Variable.Value"]').children('option').filter(':selected').val();
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val()); // Don't round here becuase of HDOP

        if (option === '1') {
            option = 'Decreased By';
        } else {
            option = 'Increased By';
        }

        let expressionObj = {
            displayName: name.trim(),
            type: 'VARIANCE_THRESHOLD',
            option: option,
            timePeriod: parseFloat($('input[name="RuleExpressions.TimePeriod"]').val()).toFixed(0),
            variable: {
                name: variableName
            }
        };

        if (variableName === 'Ain') {
            expressionObj.variable.name = `${variableName}0${ainChange}`;
            expressionObj.variable.value = expressionValue.toFixed(0);
        } else if (variableName === 'PowerSupplyVoltage') {
            expressionObj.variable.value = expressionValue.toFixed(0);
        }

        return expressionObj;
    }

    #buildRouteProgressExpression({ name, option }) {
        let expressionValue = parseFloat($('input[name="RuleExpressions.Value"]').val()); // Don't round here becuase of HDOP
        expressionValue = expressionValue.toFixed(0);
        option = 'Arrival In';

        return {
            displayName: name.trim(),
            type: 'ROUTE_PROGRESS',
            option: option,
            value: expressionValue,
            displayValue: `${expressionValue} mins`,
        };
    }

    #buildRangeExpression({ name }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();

        // Fill main object data
        let expressionObj = {
            displayName: name.trim(), type: 'RANGE', variable: {
                name: variableName
            }
        };

        // Resolve range attributes
        if (variableName.includes('$.bleBeacons')) {
            const selValue = $('select[name="RuleExpressions.Value"]').val();
            switch (selValue) {
                case 'excellent':
                    expressionObj.minValue = -60;
                    expressionObj.maxValue = 0;
                    break;
                case 'good':
                    expressionObj.minValue = -80;
                    expressionObj.maxValue = -61;
                    break;
                case 'fair':
                    expressionObj.minValue = -88;
                    expressionObj.maxValue = -81;
                    break;
                case 'poor':
                    expressionObj.minValue = -99;
                    expressionObj.maxValue = -89;
                    break;
                case 'nosignal':
                    expressionObj.minValue = -150;
                    expressionObj.maxValue = -100;
                    expressionObj.variable.fallbackValue = -150;
                    break;
            }
        }

        return expressionObj;
    }

    #buildFlagsExpression({ name, option }) {
        let variableName = $('input[name="RuleExpressions.Variable.Property"]').val();
        let expressionValue = parseFloat($('select[name="RuleExpressions.Value"]').val());

        if (option === '1') {
            option = 'HasFlag';
        } else {
            option = 'NotHasFlag';
        }

        return {
            displayName: name.trim(), type: 'FLAGS', option: option, variable: {
                name: variableName
            }, value: expressionValue
        };
    }

    #buildDiffPctThresholdExpression({ name, option }) {
        let expressionValue = $('input[name="RuleExpressions.Value"]').val();

        switch (option) {
            case '1':
                option = 'Less Than';
                break
            case '2':
                option = 'Less Than Or Equal';
                break;
            case '3':
                option = 'Greater Than';
                break;
            case '4':
                option = 'Greater Than Or Equal';
                break;
            case '5':
                option = 'Equal';
                break;
            case '6':
                option = 'Not Equal';
                break;
            default:
                break;
        }

        return {
            displayName: name.trim(),
            type: 'DIFF_PCT_THRESHOLD',
            option: option,
            value: parseFloat(expressionValue) / 100.0,
            variable1: { name: $('input[name="RuleExpressions.Variable1.Entity"]').val() },
            variable2: { name: $('input[name="RuleExpressions.Variable2.Entity"]').val() }
        };
    }
}