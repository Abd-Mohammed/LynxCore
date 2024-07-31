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

        let rows = this.grid.dataSource.data().filter(d => d.HashCode == marker.hashCode);
        let tableRows = [];
        rows.forEach(row => {
            tableRows.push(this.grid.tbody.find("tr[data-uid='" + row.uid + "']")[0]);
        });

        var selectedMarker = new SelectedMarker(marker, tableRows, this.iconBuilder);

        selectedMarker.select();
        this.selectedMarkers.push(selectedMarker);
        this.onSelect(marker);
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
    constructor(marker, tableRows, iconBuilder) {
        this.hashCode = marker.hashCode;
        this.marker = marker;
        this.originalMarkerIcon = Object.assign({}, this.marker.icon); // cloned version of the icon.
        this.tableRows = [];
        this.iconBuilder = iconBuilder;

        tableRows.forEach(r => {
            this.tableRows.push(new SelectedMarkerRow(r));
        });
    }

    /**
     * Select the marker and highlight the visual properties.
     */
    select() {
        // Highlight the row.
        this.tableRows.forEach(r => { r.highlight(); });
        this.tableRows[0]?.row.scrollIntoView({ block: "center", behavior: "instant" })

        // Change the marker icon.
        var newIcon = this.marker.icon;
        if (typeof newIcon !== "undefined") {
            newIcon.url = this.iconBuilder('gray', this.marker.angle, this.marker.index, this.marker.type);
            this.marker.setIcon(newIcon);
        }
        this.marker.originalIcon_ = this.originalMarkerIcon
    }

    /**
     * Deselect the marker and return the visual properties to original values.
     */
    deselect() {
        // Reset rows highlighting.
        this.tableRows.forEach(r => { r.reset(); });
        this.tableRows = [];

        // Return the original marker icon.
        if (Object.keys(this.originalMarkerIcon).length !== 0) {
            this.marker.setIcon(this.originalMarkerIcon);
        }
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
        this.row.style.backgroundColor = '#4c5462';
    }

    /**
     * Remove the highlight from the table row for the given marker.
     */
    reset() {
        this.row.style.backgroundColor = "";
    }
}