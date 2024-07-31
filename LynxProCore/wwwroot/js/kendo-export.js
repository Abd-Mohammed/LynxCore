(function (kendoExport, undefined) {
    kendoExport.toExcel = function (sel, dateString) {
        if ($('.grid_icon_btn-sm-excl').hasClass('loading')) {
            return;
        } else {
            $('.grid_icon_btn-sm-excl').addClass('loading');
            kendo.ui.progress($(sel), true);
        }

        var isExcelExportBind = false;
        for (var event in $(sel).getKendoGrid()._events) {
            if (event === 'excelExport') {
                isExcelExportBind = true;
                break;
            }
        }

        if (!isExcelExportBind) {
            var startWithSpecialCharsRegExp = RegExp("(http(s)?:\/\/|www\.|wss:\/\/|ftp:\/\/)|^(?!((-[0-9]+.?[0-9]*,)?-?[0-9]+.?[0-9]*$))([@=+-].*)");
            $(sel).getKendoGrid().bind("excelExport", function (e) {
                if (typeof (dateString) !== 'undefined') {
                    var fileName = $(sel).getKendoGrid().options.excel.fileName;
                    var index = fileName.indexOf('_');
                    if (index !== -1) {
                        fileName = fileName.substring(0, index) + ".xlsx";
                    }
                    var date = dateString.split("/");
                    var position = fileName.indexOf(".");
                    var output = [fileName.slice(0, position), "_" + date[2] + date[1] + date[0], fileName.slice(position)].join('');
                    $(sel).getKendoGrid().options.excel.fileName = output;
                }
                var sheet = e.workbook.sheets[0];
                for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                    var row = sheet.rows[rowIndex];
                    for (var i = 0; i < row.cells.length; i++) {
                        if (startWithSpecialCharsRegExp.test(row.cells[i].value)) {
                            row.cells[i].value = "'" + row.cells[i].value;
                        }
                        if (row.cells[i].value instanceof Date) {
                            var currDate = row.cells[i].value
                            var month = currDate.getMonth() + 1;
                            row.cells[i].value = currDate.getFullYear() + '/' + month + '/' + currDate.getDate()
                                + ' ' + currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
                        }
                    }
                }
                $('.grid_icon_btn-sm-excl').removeClass('loading');
                kendo.ui.progress($(sel), false);
            });
        }
        $(sel).getKendoGrid().saveAsExcel();
    }

    kendoExport.toPdf = function (sel, dateString) {
        var isPdflExportBind = false;
        for (var event in $(sel).getKendoGrid()._events) {
            if (event === 'pdfExport') {
                isPdflExportBind = true;
                break;
            }
        }
        if (!isPdflExportBind) {
            $(sel).getKendoGrid().bind("pdfExport", function (e) {
                if (typeof (dateString) !== 'undefined') {
                    var fileName = $(sel).getKendoGrid().options.pdf.fileName;
                    var index = fileName.indexOf('_')
                    if (index !== -1) {
                        fileName = fileName.substring(0, index) + ".pdf"
                    }
                    var date = dateString.split("/");
                    var position = fileName.indexOf(".");
                    var output = [fileName.slice(0, position), "_" + date[2] + date[1] + date[0], fileName.slice(position)].join('');
                    $(sel).getKendoGrid().options.pdf.fileName = output;
                }
            });
        }

        $(sel).getKendoGrid().saveAsPDF();
    }

}(window.kendoExport = window.kendoExport || {}));