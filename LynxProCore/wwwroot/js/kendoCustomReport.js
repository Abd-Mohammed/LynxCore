var typedateParameter, datatype, addId, fromDateTime, toDateTime;
function customMatch(parameter) {
    datatype = parameter.type;
    return parameter.type === "System.DateTime" || parameter.availableValues != null;
}
function checkInputs(elements) {
    elements.each(function () {
        var element = $(this);
        var input = element.children("input");

        input.prop("checked", (element.hasClass("k-item k-state-selected") || element.hasClass("k-item k-state-hover k-state-focused k-state-selected")));
    });
};
function createCustomEditor(placeholder, options) {
    if (datatype == "System.DateTime" && typedateParameter == "datetime") {
        $(placeholder).html('<input type="datetime"/>');
        var dateTimePicker = $(placeholder),
            parameter,
            valueChangedCallback = options.parameterChanged,
            dropDownList;

        function onChange() {
            var dtv = this.value();
            if (null !== dtv) {
                dtv = myadjustTimezone(dtv);
            }
            valueChangedCallback(parameter, dtv);
        }

        return {
            beginEdit: function (param) {
                parameter = param;
                addId = param.name;
                var date = new Date();

                var dt = null;
                if (param.value != null) {
                    dt = myunadjustTimezone(param.value);
                }
                try {
                    if (param.name == "fromDate" && param.value == null) {
                        dt = fromDateTime;
                    }
                    if (param.name == "toDate" && param.value == null) {
                        dt = toDateTime;
                    }
                } catch (e) {
                    dt = null;
                }
                //you can configure the widget
                $(dateTimePicker).find("input").kendoDateTimePicker({
                    change: onChange,
                    value: dt
                });
                dropDownList = $(dateTimePicker).attr("id", addId).find("input").data("kendoDateTimePicker");
                $(dateTimePicker).find("input").attr("readonly", true);
                dropDownList.wrapper[0].style.width = "185px";
            }
        };
    }
    else if (datatype != "System.DateTime") {
        var dropDownElement = $(placeholder).html('<div></div>');
        var parameter,
            valueChangedCallback = options.parameterChanged,
            dropDownList;

        function onChange() {
            var val = dropDownList.value();
            valueChangedCallback(parameter, val);
            var items = this.ul.find("li");
            checkInputs(items);
        }

        return {
            beginEdit: function (param) {
                parameter = param;
                addId = param.name;
                var strPlaceholder = "[[[[All]]]]";
                if (addId == "alertsList") {
                    strPlaceholder = "[[[[Select]]]]";
                }
                if (param != undefined && param.multivalue) {
                    $(dropDownElement).kendoMultiSelect({
                        itemTemplate: "<input type='checkbox'/> #:data.name#",
                        dataTextField: "name",
                        dataValueField: "value",
                        value: parameter.value,
                        dataSource: parameter.availableValues,
                        placeholder: strPlaceholder,
                        change: onChange,
                        //autoClose: false,
                        filter: "contains",
                        dataBound: function () {
                            var items = this.ul.find("li");
                            setTimeout(function () {
                                checkInputs(items);
                            });
                        }
                    });


                    dropDownList = $(dropDownElement).attr("id", addId).data("kendoMultiSelect");
                    if (addId == "alertsList" || addId == "tagIds" || addId == "alertList" || addId == "alerts") {
                        dropDownList.options.maxSelectedItems = 5;
                    }
                }
                else {
                    $(dropDownElement).kendoDropDownList({
                        dataTextField: "name",
                        dataValueField: "value",
                        value: parameter.value,
                        dataSource: parameter.availableValues,
                        optionLabel: "All",
                        change: onChange,

                    });

                    dropDownList = $(dropDownElement).attr("id", addId).data("kendoDropDownList");
                    dropDownList.wrapper[0].style.width = "185px";
                    if (addId == "resolutionState") {
                        dropDownList.text("Open");
                    }
                }

            }
        }
    }
    else if (datatype == "System.DateTime" && typedateParameter != "datetime") {
        $(placeholder).html('<input type="datetime"/>');
        var dateTimePicker = $(placeholder),
            parameter,
            valueChangedCallback = options.parameterChanged,
            dropDownList;

        function onChange() {
            var dtv = this.value();
            if (null !== dtv) {
                dtv = myadjustTimezone(dtv);
            }
            valueChangedCallback(parameter, dtv);
        }

        return {
            beginEdit: function (param) {
                parameter = param;

                var dt = null;
                try {
                    if (param.value) {
                        dt = myunadjustTimezone(param.value);
                    }
                } catch (e) {
                    dt = null;
                }
                //you can configure the widget
                $(dateTimePicker).find("input").kendoDatePicker({
                    change: onChange,
                    value: dt
                });
                dropDownList = $(dateTimePicker).find("input").data("kendoDatePicker")
                dropDownList.wrapper[0].style.width = "185px";
            }
        };
    }
}

function myadjustTimezone(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
};
function myunadjustTimezone(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
};

