<template>
    <wwLayout class="ww-select-option" path="slot" @click="handleClick" />
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
    emits: ['update:sidepanel-content'],
    setup(props, { emit }) {
        const isEditing = computed(() => {
            /* wwEditor:start */
            return props.wwEditorState.isEditing;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const isInTrigger = inject('_wwSelectInTrigger', ref(false));
        if (isInTrigger.value) emit('update:sidepanel-content', { path: 'isInTrigger', value: true });

        const selectValue = inject('_wwSelectValue');
        const selectType = inject('_wwSelectType');
        const setValue = inject('_wwSelectSetValue');
        const isDisabled = inject('_wwSelectIsDisabled');
        const isReadonly = inject('_wwSelectIsReadonly');
        const canUnselect = inject('_wwSelectCanUnselect');

        const isOptionDisabled = computed(() => props.content.disabled);
        const label = computed(() => props.content.label);
        const value = computed(() => props.content.value);

        const canInteract = computed(
            () => !isEditing.value && !isOptionDisabled.value && !isDisabled.value && !isReadonly.value
        );

        const isSelected = computed(() =>
            selectType.value === 'single'
                ? selectValue.value === props.content.value
                : Array.isArray(selectValue.value) && selectValue.value.includes(props.content.value)
        );

        const updateValue = optionValue => {
            if (selectType.value === 'single') {
                setValue(canUnselect.value && selectValue.value === optionValue ? null : optionValue);
            } else {
                const currentValue = Array.isArray(selectValue.value) ? selectValue.value : [];
                if (currentValue.includes(optionValue)) {
                    setValue(canUnselect.value ? currentValue.filter(v => v !== optionValue) : currentValue);
                } else {
                    setValue([...currentValue, optionValue]);
                }
            }
        };

        const handleClick = () => {
            if (canInteract.value && props.content.selectOnClick) {
                if (isInTrigger.value) {
                    unselect();
                } else {
                    updateValue(props.content.value);
                }
            }
        };

        const unselect = () => {
            if (canInteract.value) {
                if (selectType.value === 'single') {
                    setValue(null);
                } else {
                    const currentValue = Array.isArray(selectValue.value) ? [...selectValue.value] : [];
                    setValue(currentValue.filter(v => v !== props.content.value));
                }
            }
        };

        if (isInTrigger.value) {
            const methods = {
                unselect: {
                    description: 'Unselect the current option',
                    method: unselect,
                    editor: { label: 'Unselect', elementName: 'Unselect Option', icon: 'cursor-click' },
                },
            };

            wwLib.wwElement.useRegisterElementLocalContext('selectOption', null, methods);
        } else {
            const registerOption = inject('_wwRegisterOption');
            const unregisterOption = inject('_wwUnregisterOption');

            const option = computed(() => ({
                label: label.value,
                value: value.value,
                disabled: isOptionDisabled.value,
            }));

            const select = () => {
                if (canInteract.value) {
                    updateValue(props.content.value);
                }
            };

            const data = ref({
                isSelected,
                isOptionDisabled,
                label,
                value,
            });

            const methods = {
                select: {
                    description: 'Select the current option',
                    method: select,
                    editor: { label: 'Select', elementName: 'Select Option', icon: 'cursor-click' },
                },
            };

            onMounted(() => registerOption(option.value));
            onBeforeUnmount(() => unregisterOption(option.value.value));

            wwLib.wwElement.useRegisterElementLocalContext('selectOption', data, methods);
        }

        return { handleClick };
    },
};
</script>

<style lang="scss" scoped></style>
