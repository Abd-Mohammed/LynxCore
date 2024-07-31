(function (cascadeDropDown, undefined) {

    cascadeDropDown.ajaxBind = function (args) {

        var $target = $(args.target);

        $target.empty();
        $target.append($('<option/>', {
            value: '',
            text: args.defaultOption
        }));

        $.ajax({
            url: args.url,
            contentType: 'application/json; charset=utf-8',
            data: args.data,
            type: 'GET',
        }).done(function (results) {

            $.each(results, function (index, result) {
                $target.append($('<option/>', {
                    value: result.Value,
                    text: result.Text
                }));
            });

            if (typeof args.val !== 'undefined' && args.val !== 0 && args.val !== '') {
                $target.val(args.val);
            }
        });
    }

}(window.cascadeDropDown = window.cascadeDropDown || {}));