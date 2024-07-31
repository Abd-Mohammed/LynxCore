(function (kendoGrid, undefined) {

    kendoGrid.read = function (sel, url) {

        // url will not be used, but will keep it because it might be used in th future
        $(sel).data('kendoGrid').dataSource.read();
    }

}(window.kendoGrid = window.kendoGrid || {}));