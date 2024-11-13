<template>
    <wwLayout
        class="ww-select-option"
        ref="optionRef"
        @click="handleClick"
        @keydown="handleKeyDown"
        :role="isInTrigger ? null : 'option'"
        :id="optionId"
        :aria-selected="isSelected"
        :aria-disabled="isOptionDisabled"
        path="slot"
    />
</template>

<script>
import { ref, unref, inject, computed, watch, onBeforeUnmount } from 'vue';
import useAccessibility from './useAccessibility';
/* wwEditor:start */
import useEditorHint from './editor/useEditorHint';
/* wwEditor:end */

export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        localData: { type: Object, default: () => ({}) },
    },
    emits: ['update:sidepanel-content', 'add-state', 'remove-state'],
    setup(props, { emit }) {
        /* wwEditor:start */
        useEditorHint(emit);
        /* wwEditor:end */

        const isEditing = computed(() => {
            /* wwEditor:start */
            return props.wwEditorState.isEditing;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const registerOption = inject('_wwSelectRegisterOption', () => {});
        const unregisterOption = inject('_wwSelectUnregisterOption', () => {});
        const optionRef = ref(null);
        const optionElement = computed(() => optionRef.value?.$el);
        const isInTrigger = inject('_wwSelectInTrigger', ref(false));
        if (isInTrigger.value) emit('update:sidepanel-content', { path: 'isInTrigger', value: true });
        const selectValue = inject('_wwSelectValue', ref(''));
        const selectType = inject('_wwSelectType', ref('simple'));
        const setValue = inject('_wwSelectSetValue', () => {});
        const isDisabled = inject('_wwSelectIsDisabled', ref(false));
        const isReadonly = inject('_wwSelectIsReadonly', ref(false));
        const updateValue = inject('_wwSelectUpdateValue', () => {});
        const focusSelectElement = inject('_wwSelectFocusSelectElement', () => {});

        const isOptionDisabled = computed(() => props.content.disabled);
        const label = computed(() => props.content.label);
        const value = computed(() => props.content.value);
        const isSelected = computed(() =>
            selectType.value === 'single'
                ? selectValue.value === props.content.value
                : Array.isArray(selectValue.value) && selectValue.value.includes(props.content.value)
        );

        const { optionId, handleKeyDown, focusFromOptionId } = useAccessibility({
            emit,
            optionElement,
            content: props.content,
        });

        const option = computed(() => ({
            optionId,
            label: label.value,
            value: value.value,
            disabled: isOptionDisabled.value,
            isSelected: isSelected.value,
            data: props.localData,
        }));

        unregisterOption(optionId);
        registerOption(optionId, unref(option));

        const canInteract = computed(
            () => !isEditing.value && !isOptionDisabled.value && !isDisabled.value && !isReadonly.value
        );

        const handleClick = () => {
            if (isInTrigger.value && canInteract.value && props.content.unselectOnClick) {
                unselect();
                focusFromOptionId(null);
            } else if (!isInTrigger.value && canInteract.value && props.content.selectOnClick) {
                updateValue(props.content.value);
                focusFromOptionId(optionId);
                focusSelectElement();
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
                    editor: { label: 'Unselect', group: 'Unselect Option', icon: 'cursor-click' },
                },
            };

            wwLib.wwElement.useRegisterElementLocalContext('selectOption', null, methods);
        } else {
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
                    editor: { label: 'Select', group: 'Select Option', icon: 'cursor-click' },
                },
            };

            watch([value, label], () => {
                unregisterOption(optionId);
                registerOption(optionId, unref(option));
            });

            onBeforeUnmount(() => unregisterOption(optionId));

            const markdown = `### Select Option local informations

- \`isSelected\`: Boolean indicating if the option is selected
- \`isOptionDisabled\`: Boolean indicating if the option is disabled
- \`label\`: The label of the option
- \`value\`: The value of the option`;

            wwLib.wwElement.useRegisterElementLocalContext('selectOption', data, methods, markdown);
        }

        return { optionRef, optionId, handleClick, handleKeyDown };
    },
};
</script>
