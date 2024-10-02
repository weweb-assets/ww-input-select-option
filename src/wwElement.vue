<template>
    <wwLayout class="ww-select-option" path="slot" @click="selectOnClick" />
</template>

<script>
import { ref, inject, computed } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    setup(props) {
        const isEditing = computed(() => {
            /* wwEditor:start */
            return props.wwEditorState.isEditing;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const value = inject('_wwSelectValue');
        const selectType = inject('_wwSelectType');
        const setValue = inject('_wwSelectSetValue');
        const isDisabled = inject('_wwSelectIsDisabled');
        const isReadonly = inject('_wwSelectIsReadonly');

        const isOptionDisabled = computed(() => props.content.disabled);

        function updateValue(optionValue) {
            if (selectType.value === 'single') {
                console.log('single', optionValue);
                setValue(optionValue);
            } else if (selectType.value === 'multi') {
                const currentValue = Array.isArray(value.value) ? value.value : [];
                const index = currentValue.indexOf(optionValue);
                if (index === -1) {
                    setValue([...currentValue, optionValue]);
                } else {
                    setValue(currentValue.filter(v => v !== optionValue));
                }
                console.log('multi', optionValue);
            }
        }

        function selectOnClick() {
            if (isEditing.value || !props.content.selectOnClick) return;
            if (!isOptionDisabled.value && !isDisabled.value && !isReadonly.value) {
                updateValue(props.content.value);
            }
        }

        function select() {
            if (isEditing.value) return;
            if (!isOptionDisabled.value && !isDisabled.value && !isReadonly.value) {
                updateValue(props.content.value);
            }
        }

        const data = ref({
            selectValue: value,
            isOptionDisabled: isOptionDisabled.value,
        });

        const methods = {
            select: {
                description: 'Selects the current option',
                method: select,
                editor: {
                    label: 'Select',
                    elementName: 'Select Option',
                    icon: 'cursor-click',
                },
            },
        };

        wwLib.wwElement.useRegisterElementLocalContext('selectOption', data, methods);

        return { selectOnClick };
    },
};
</script>

<style lang="scss" scoped></style>
