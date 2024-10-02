<template>
    <wwLayout class="ww-select-option" path="slot" @click="selectOnClick" />
</template>

<script>
import { ref, inject, computed, onMounted, onBeforeUnmount } from 'vue';

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

        const selectValue = inject('_wwSelectValue');
        const selectType = inject('_wwSelectType');
        const setValue = inject('_wwSelectSetValue');
        const isDisabled = inject('_wwSelectIsDisabled');
        const isReadonly = inject('_wwSelectIsReadonly');
        const canUnselect = inject('_wwSelectCanUnselect');
        const registerOption = inject('registerOption');
        const unregisterOption = inject('unregisterOption');

        const isOptionDisabled = computed(() => props.content.disabled);
        const label = computed(() => props.content.label);
        const value = computed(() => props.content.value);

        const option = computed(() => ({
            label: label.value,
            value: value.value,
            disabled: isOptionDisabled.value,
        }));

        function updateValue(optionValue) {
            if (selectType.value === 'single') {
                setValue(canUnselect.value && selectValue.value === optionValue ? null : optionValue);
            } else {
                const currentValue = Array.isArray(selectValue.value) ? selectValue.value : [];
                const newValue = currentValue.includes(optionValue)
                    ? canUnselect.value
                        ? currentValue.filter(v => v !== optionValue)
                        : currentValue
                    : [...currentValue, optionValue];

                setValue(newValue);
            }
        }

        function selectOnClick() {
            if (isEditing.value || !props.content.selectOnClick) return;
            if (!isOptionDisabled.value || !isDisabled.value || !isReadonly.value) {
                updateValue(props.content.value);
            }
        }

        function select() {
            if (isEditing.value) return;
            if (!isOptionDisabled.value || !isDisabled.value || !isReadonly.value) {
                updateValue(props.content.value);
            }
        }

        const isSelected = computed(() =>
            selectType.value === 'single'
                ? selectValue.value === props.content.value
                : Array.isArray(selectValue.value) && selectValue.value.includes(props.content.value)
        );

        const data = ref({
            isSelected: isSelected.value,
            isOptionDisabled: isOptionDisabled.value,
            label: label.value,
            value: value.value,
        });

        const methods = {
            select: {
                description: 'Select the current option',
                method: select,
                editor: {
                    label: 'Select',
                    elementName: 'Select Option',
                    icon: 'cursor-click',
                },
            },
        };

        onMounted(() => {
            registerOption(option.value);
        });

        onBeforeUnmount(() => {
            unregisterOption(option.value.value);
        });

        wwLib.wwElement.useRegisterElementLocalContext('selectOption', data, methods);

        return { selectOnClick };
    },
};
</script>

<style lang="scss" scoped></style>
