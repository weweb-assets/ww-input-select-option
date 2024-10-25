export default {
    editor: {
        label: 'Select Option',
        icon: 'select',
    },
    inherit: {
        type: 'ww-layout',
    },
    options: {
        autoByContent: true,
        displayAllowedValues: ['flex', 'grid', 'inline-flex', 'inline-grid'],
    },
    states: ['focused'],
    properties: {
        label: {
            label: { en: 'Label' },
            type: 'Text',
            bindable: true,
            hidden: (_, sidepanelContent) => sidepanelContent.isInTrigger,
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
            hidden: (_, sidepanelContent) => sidepanelContent.isInTrigger,
        },
        unselectOnClick: {
            label: { en: 'Unselect on click' },
            type: 'OnOff',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the option is automatically unselected on click: `true | false`',
            },
            /* wwEditor:end */
            hidden: (_, sidepanelContent) => !sidepanelContent.isInTrigger,
        },
        slot: {
            hidden: true,
            defaultValue: [],
        },
        isInTrigger: {
            hidden: true,
            editorOnly: true,
            defaultValue: false,
        },
    },
};
