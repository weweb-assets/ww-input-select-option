<template>
    <div
        class="ww-select-option"
        ref="optionRef"
        @click="handleClick"
        @keydown="handleKeyDown"
        :role="isInTrigger ? null : 'option'"
        :id="optionId"
        :aria-selected="isSelected"
        :aria-disabled="isOptionDisabled"
    >
        <wwLayout path="slot" />
    </div>
</template>

<script>
import { ref, inject, computed, watch, onBeforeUnmount } from 'vue';
import useAccessibility from './useAccessibility';

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

        const optionRef = ref(null);
        const { optionId, handleKeyDown } = useAccessibility({
            emit,
            optionRef,
            content: props.content,
        });

        const isInTrigger = inject('_wwSelectInTrigger', ref(false));
        if (isInTrigger.value) emit('update:sidepanel-content', { path: 'isInTrigger', value: true });

        const selectValue = inject('_wwSelectValue');
        const selectType = inject('_wwSelectType');
        const setValue = inject('_wwSelectSetValue');
        const isDisabled = inject('_wwSelectIsDisabled');
        const isReadonly = inject('_wwSelectIsReadonly');
        const updateValue = inject('_wwSelectUpdateValue');

        const isOptionDisabled = computed(() => props.content.disabled);
        const label = computed(() => props.content.label);
        const value = computed(() => props.content.value);
        const optionData = computed(() => props.content.data);
        const isSelected = computed(() =>
            selectType.value === 'single'
                ? selectValue.value === props.content.value
                : Array.isArray(selectValue.value) && selectValue.value.includes(props.content.value)
        );

        const option = computed(() => ({
            label: label.value,
            value: value.value,
            data: optionData.value,
            disabled: isOptionDisabled.value,
            isSelected: isSelected.value,
        }));

        const canInteract = computed(
            () => !isEditing.value && !isOptionDisabled.value && !isDisabled.value && !isReadonly.value
        );

        const handleClick = () => {
            if (isInTrigger.value && canInteract.value && props.content.unselectOnClick) {
                unselect();
            } else if (!isInTrigger.value && canInteract.value && props.content.selectOnClick) {
                updateValue(props.content.value);
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
                data: optionData,
            });

            const methods = {
                select: {
                    description: 'Select the current option',
                    method: select,
                    editor: { label: 'Select', elementName: 'Select Option', icon: 'cursor-click' },
                },
            };

            watch(
                [value, label],
                () => {
                    unregisterOption(option.value);
                    registerOption(option.value);
                },
                { immediate: true }
            );

            onBeforeUnmount(() => unregisterOption(option.value));

            wwLib.wwElement.useRegisterElementLocalContext('selectOption', data, methods);
        }

        return { optionRef, optionId, handleClick, handleKeyDown };
    },
};
</script>
