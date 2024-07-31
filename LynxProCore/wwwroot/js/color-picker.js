function setColorPickerValue(memberName, color) {
    let hash = "#";
    let memberValue = ($("#" + memberName).val()).replace("#", "");
    $("#" + memberName + "-" + memberValue).removeClass("selected");

    $("#btn-color-bk-"+memberName).css({ backgroundColor: hash + color });
    $("#" + memberName).val(hash+color);
    $("#" + memberName + "-" + color).addClass("selected");
    $('#' + memberName).minicolors('value', hash+color);
}