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
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'The label of the current option item. This will not automatically show this label on the screen, its purpose is accessibility and allowing easy bounding of the choice label.',
            },
            /* wwEditor:end */
        },
        value: {
            label: { en: 'Value' },
            type: 'Text',
            bindable: true,
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'The unique value of every option item. This will be exposed outside the Select.',
            },
            /* wwEditor:end */
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
                tooltip: 'Whether the option should be automatically selected when clicked.',
            },
            propertyHelp: {
                tooltip: 'Whether the option should be automatically selected when clicked.',
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
