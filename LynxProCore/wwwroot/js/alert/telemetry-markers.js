class TelemetryMarkersSelector {
    /**
     * Create a selection manager instance.
     * @param {any} grid : kendo grid object.
     */
    constructor(grid, iconBuilder, onSelect = null, onDeselect = null) {
        this.selectedMarkers = [];
        this.grid = grid;
        this.iconBuilder = iconBuilder;
        this.onDeselect = onDeselect;
        this.onSelect = onSelect;
    }

    /**
     * Toggle the selection for the given google marker.
     * @param {any} marker : google map marker.
     */
    toggleSelection(marker) {
        // If the marker is not selected then select it.
        if (!this.isSelected(marker)) {
            this.selectMarker(marker);
            return;
        }

        // If the marker is selected then deselect it.
        this.deselectMarker(marker);
    }

    /**
     * Select the given google map marker, if not selected.
     *
     * @param {any} marker : google maps marker.
     */
    selectMarker(marker) {
        // if the marker is already selected then just return.
        if (this.isSelected(marker)) {
            return;
        }

        let rows = this.grid.dataSource.data().filter(d => d.AlertId == marker.hashCode);
        let tableRows = [];
        let lockedTableRows = [];

        rows.forEach(row => {
            lockedTableRows.push(this.grid.lockedContent.find("tr[data-uid='" + row.uid + "']")[0]);
            tableRows.push(this.grid.tbody.find("tr[data-uid='" + row.uid + "']")[0]);
        });

        var selectedMarker = new SelectedMarker(marker, tableRows, this.iconBuilder, lockedTableRows);

        selectedMarker.select();
        this.selectedMarkers.push(selectedMarker);
        if (this.onSelect != null) {
            this.onSelect(marker);
        }
    }

    /**
     * Deselect the marker for the given google maps marker, if selected.
     *
     * @param {any} marker
     */
    deselectMarker(marker) {
        // Try to find the selected marker object for the given google map marker.
        var selectedMarker = this.getSelectedMarkerByHashCode(marker.hashCode);

        // If the marker is not selected already then just return.
        if (selectedMarker == null) {
            return;
        }

        // Deselect the marker.
        selectedMarker.deselect();

        // Remove the selected marker from the selected markers array.
        this.selectedMarkers.splice(this.selectedMarkers.indexOf(selectedMarker), 1);

        // Trigger the event listener if exists.
        if (this.onDeselect != null) {
            this.onDeselect(marker);
        }
    }

    /**
     * Clear all markers selection.
     */
    clearSelection() {
        // deselect every selected marker.
        this.selectedMarkers.forEach(marker => {
            marker.deselect();
        });

        // clear the array.
        this.selectedMarkers = [];
    }

    /**
     * Check whether the given google map marker is selected.
     * @param {any} marker : google marker
     */
    isSelected(marker) {
        return this.getSelectedMarkerByHashCode(marker.hashCode) != null;
    }

    /**
     * Try to get selected marker by its hash code.
     *
     * @param {any} hashCode : google marker hash code.
     */
    getSelectedMarkerByHashCode(hashCode) {
        var markers = this.selectedMarkers.filter(sm => sm.hashCode == hashCode);

        if (markers.length == 0) {
            return null;
        }

        return markers[0];
    }
}

class SelectedMarker {
    /**
     * Create a selected marker object.
     * @param {any} marker : the google maps marker to be selected.
     * @param {any} tableRows : the table rows corresponding to the given marker to be highlighted.
     */
    constructor(marker, tableRows, iconBuilder, lockedTablesRows = []) {
        this.hashCode = marker.hashCode;
        this.marker = marker;
        this.originalMarkerIcon = Object.assign({}, this.marker.icon); // cloned version of the icon.
        this.tableRows = [];
        this.lockedTablesRows = [];
        this.iconBuilder = iconBuilder;

        tableRows.forEach(r => {
            this.tableRows.push(new SelectedMarkerRow(r));
        });

        lockedTablesRows.forEach(r => {
            this.lockedTablesRows.push(new SelectedMarkerRow(r));
        });
    }

    /**
     * Select the marker and highlight the visual properties.
     */
    select() {
        // Highlight the row.
        this.tableRows.forEach(r => {
            r.highlight();
            $('#gridActiveAlerts').data('kendoGrid')._scrollTo(r.row, document.getElementsByClassName("k-virtual-scrollable-wrap")[0]);
        });

        this.lockedTablesRows.forEach(r => {
            r.highlight();
        });

        // Change the marker icon.
        var newIcon = this.marker.icon;
        newIcon.url = this.iconBuilder('#fff', this.marker.selectedColor, this.marker.index);
        this.marker.setIcon(newIcon);
    }

    /**
     * Deselect the marker and return the visual properties to original values.
     */
    deselect() {
        // Reset rows highlighting.
        this.tableRows.forEach(r => { r.reset(); });

        this.tableRows = [];

        this.lockedTablesRows.forEach(r => { r.reset(); });
        this.lockedTablesRows = [];

        // Return the original marker icon.
        this.marker.setIcon(this.originalMarkerIcon);
    }
}

class SelectedMarkerRow {
    constructor(tableRow) {
        this.row = tableRow;
        this.originalColor = this.row.style.backgroundColor;
    }

    /**
     * Hightlight the table row for the selected marker.
     */
    highlight() {
        this.row.style.backgroundColor = '#1e2124';
    }

    /**
     * Remove the highlight from the table row for the given marker.
     */
    reset() {
        this.row.style.backgroundColor = '#2d3035';
    }
}