export default {
    editor: {
        label: 'Select Option',
        icon: 'select',
        hint: (_, sidepanelContent) => {
            if (sidepanelContent.isInSelect === false) {
                return {
                    section: 'style',
                    type: 'warning',
                    text: 'Select Options must be placed inside a Select element.',
                };
            } else {
                return null;
            }
        },
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
            section: 'settings',
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
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'The unique value of every option item. This will be exposed outside the Select.',
            },
            /* wwEditor:end */
        },
        /* wwEditor:start */
        selectTypeWarning: {
            type: 'InfoBox',
            section: 'settings',
            options: (_, sidepanelContent) => ({
                title: sidepanelContent.isInTrigger ? 'Value override' : 'Label and value override',
                content: sidepanelContent.isInTrigger
                    ? `When "Value per item" is configured in the Select root element, it will override any value defined in this Option element.`
                    : `When "Label per item" and "Value per item" are configured in the Select root element, they will override any label and value defined in this Option element.`,
            }),
        },
        /* wwEditor:end */
        disabled: {
            label: { en: 'Disabled' },
            type: 'OnOff',
            bindable: true,
            defaultValue: false,
            section: 'settings',
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
            section: 'settings',
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
        isInSelect: {
            hidden: true,
            editorOnly: true,
            defaultValue: false,
        },
    },
};
