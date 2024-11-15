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
import { ref, unref, toValue, inject, computed, watch, onBeforeUnmount } from 'vue';
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
    emits: ['update:content', 'update:sidepanel-content', 'add-state', 'remove-state'],
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

        const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

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

        const mappingLabel = inject('_wwSelectMappingLabel', ref(null));
        const mappingValue = inject('_wwSelectMappingValue', ref(null));

        const label = computed(
            () => resolveMappingFormula(toValue(mappingLabel), props.localData) || props.content.label
        );
        const value = computed(
            () => resolveMappingFormula(toValue(mappingValue), props.localData) || props.content.value
        );

        const isSelected = computed(() =>
            selectType.value === 'single'
                ? selectValue.value === value.value
                : Array.isArray(selectValue.value) && selectValue.value.includes(value.value)
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
            _data: props.localData,
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
                updateValue(value.value);
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
                    setValue(currentValue.filter(v => v !== value.value));
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
                    updateValue(value.value);
                }
            };

            /*
             * Create a data ref with initial empty values, then use a watcher to update it.
             * This pattern prevents circular dependencies that can occur when reactive refs
             * directly reference each other. Instead of creating a complex web of reactive
             * dependencies, we:
             * 1. Start with a clean slate (empty values)
             * 2. Use a watcher to explicitly update all values when any dependency changes
             * 3. Keep the data flow unidirectional (computed props -> watcher -> data ref)
             *
             * The previous approach of directly referencing computed properties in the ref
             * created an infinite loop because:
             * - The ref would try to access the computed properties
             * - The computed properties would trigger updates
             * - These updates would cause the ref to update
             * - Which would trigger the computed properties again... and so on
             */
            const data = ref({
                isSelected: false,
                isOptionDisabled: false,
                label: '',
                value: '',
                _data: {},
            });

            watch(
                [isSelected, isOptionDisabled, label, value],
                ([newIsSelected, newIsOptionDisabled, newLabel, newValue]) => {
                    data.value = {
                        isSelected: newIsSelected,
                        isOptionDisabled: newIsOptionDisabled,
                        label: newLabel,
                        value: newValue,
                        _data: props.localData,
                    };
                },
                { immediate: true }
            );

            const methods = {
                select: {
                    description: 'Select the current option',
                    method: select,
                    editor: { label: 'Select', group: 'Select Option', icon: 'cursor-click' },
                },
            };

            onBeforeUnmount(() => unregisterOption(optionId));

            const markdown = `### Select Option local informations

- \`isSelected\`: Boolean indicating if the option is selected
- \`isOptionDisabled\`: Boolean indicating if the option is disabled
- \`label\`: The label of the option (will be overwritten if defined in the Select root element)
- \`value\`: The value of the option (will be overwritten if defined in the Select root element)`;

            wwLib.wwElement.useRegisterElementLocalContext('selectOption', data, methods, markdown);
        }

        return { optionRef, optionId, handleClick, handleKeyDown };
    },
};
</script>
