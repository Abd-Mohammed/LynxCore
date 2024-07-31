class FormWizard {
    form;
    wizard;
    #bootstrapWizard;
    #wizardSelector;
    #displayConfirm;
    #onNextCallback;
    #onPrevCallback;
    #onSubmitCallback;
    #customValidation;

    constructor({ wizardSelector, form, customValidation, displayConfirm, onNextCallback, onPrevCallback, onSubmitCallback }) {
        if (!jQuery().bootstrapWizard) {
            return;
        }

        this.form = form;
        this.wizard = $(wizardSelector);
        this.#wizardSelector = wizardSelector;
        this.#displayConfirm = displayConfirm;
        this.#onPrevCallback = onPrevCallback;
        this.#onNextCallback = onNextCallback;
        this.#onSubmitCallback = onSubmitCallback;
        this.#customValidation = customValidation;

        this.form.validate({
            focusInvalid: false, // do not focus the last invalid input
            submitHandler: form => {
                this.form.find('.form-disabled[name]')
                    .each((index, element) => $(element).removeAttr('disabled'));

                if (!this.#onSubmitCallback || this.#onSubmitCallback(this.form))
                    form.submit();
            }
        });

        // default form wizard
        this.#bootstrapWizard = this.wizard.bootstrapWizard({
            'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            'lastSelector': '.button-confirm',
            onTabClick: () => false,
            onInit: this.#onInit.bind(this),
            onLast: this.#onLast.bind(this),
            onNext: this.#onNext.bind(this),
            onPrevious: this.#onPrevious.bind(this),
            onTabShow: this.#onTabShow.bind(this)
        });

        this.wizard.find('.button-previous').hide();
        this.wizard.find('.button-submit')
            .click(() => this.form.submit())
            .hide();
    }

    #onInit() {
        if (this.#wizardSelector.includes('edit')) {
            this.wizard.find('.button-confirm').show();
        } else {
            this.wizard.find('.button-confirm').hide();
        }
    }

    #onLast(tab, navigation, index) {
        if (this.form.valid() === false) {
            return false;
        }

        for (let i = 1; i < 6; i++) {
            if (!this.#customValidation(i)) {
                return false;
            }
        }

        this.#onNextCallback(index);
        this.#handleTitle(tab, navigation, index);
    }

    #onNext(tab, navigation, index) {
        if (this.form.valid() === false) {
            return false;
        }

        if (this.#customValidation(index) === false) {
            return false;
        }

        this.#onNextCallback(index);
        this.#handleTitle(tab, navigation, index);
    }

    #onPrevious(tab, navigation, index) {
        this.#onPrevCallback(index);
        this.#handleTitle(tab, navigation, index);
    }

    #onTabShow(tab, navigation, index) {
        const total = navigation.find('li').length;
        const current = index + 1;
        const $percent = (current / total) * 100;
        this.wizard.find('.progress-bar').css({
            width: $percent + '%'
        });
    }

    #handleTitle(tab, navigation, index) {
        const total = navigation.find('li').length;
        const current = index + 1;

        // set wizard title                
        $('.step-title_index', this.wizard).text(current);
        $('.step-title_total', this.wizard).text(total);

        // set done steps
        jQuery('li', this.wizard).removeClass('done');
        const li_list = navigation.find('li');
        for (let i = 0; i < index; i++) {
            jQuery(li_list[i]).addClass('done');
        }

        if (current === 1) {
            this.wizard.find('.button-previous').hide();
        } else {
            this.wizard.find('.button-previous').show();
        }

        if (this.#wizardSelector.includes('edit')) {
            if (current < total) {
                this.wizard.find('.button-confirm').show();
            } else {
                this.wizard.find('.button-confirm').hide();
            }
        } else {
            if (current > 1 && current < total) {
                this.wizard.find('.button-confirm').show();
            } else {
                this.wizard.find('.button-confirm').hide();
            }
        }

        if (current >= total) {
            this.wizard.find('.button-next').hide();
            this.wizard.find('.button-submit').show();
            this.#displayConfirm();
        } else {
            this.wizard.find('.button-next').show();
            this.wizard.find('.button-submit').hide();
        }
        Metronic.scrollTo($('.page-title'));
    }

    resetFormValidation() {
        this.form.removeData('validator');
        this.form.removeData('unobtrusiveValidation');
        $.validator.unobtrusive.parse(this.form);
    }
}