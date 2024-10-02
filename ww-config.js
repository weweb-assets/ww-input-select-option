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
        slot: {
            hidden: true,
            defaultValue: [],
        },
    },
};
