export default {
    editor: {
        label: 'Select Option',
        icon: 'select',
    },
    properties: {
        layout: {
            label: 'Layout',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'simple', label: 'Simple' },
                    { value: 'free', label: 'Free layout' },
                ],
            },
            defaultValue: 'simple',
            section: 'settings',
        },
        value: {
            label: { en: 'Value' },
            type: 'Text',
            bindable: true,
        },
        disabled: {
            label: { en: 'Disabled' },
            type: 'OnOff',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the option is disabled: `true | false`',
            },
            /* wwEditor:end */
        },
        selectOnClick: {
            label: { en: 'Select on click' },
            type: 'OnOff',
            bindable: true,
            defaultValue: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the option is automatically selected on click: `true | false`',
            },
            /* wwEditor:end */
        },
        slot: {
            hidden: true,
            defaultValue: [],
        },
    },
};
