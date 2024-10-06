import { ref, watch, inject, nextTick } from 'vue';

export default function useAccessibility({ emit, optionRef, content, handleSelect }) {
    const optionId = `ww-select-option-${content.value}`;
    const activeDescendant = inject('_wwSelectActiveDescendant', ref(''));
    const focusedOptionIndex = inject('_wwSelectFocusedOptionIndex', ref(0));

    watch(activeDescendant, () => {
        if (activeDescendant.value === optionId) {
            nextTick(() => {
                if (optionRef.value) {
                    optionRef.value.focus();
                    optionRef.value.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                    emit('add-state', 'focused');
                }
            });
        } else {
            emit('remove-state', 'focused');
        }
    });

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSelect();
        }
    };

    return {
        optionId,
        focusedOptionIndex,
        handleKeyDown,
    };
}
