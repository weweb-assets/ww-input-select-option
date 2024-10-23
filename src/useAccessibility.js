import { ref, watch, inject, nextTick } from 'vue';

export default function useAccessibility({ emit, optionRef, content }) {
    const optionId = `ww-select-option-${content.value}`;
    const activeDescendant = inject('_wwSelectActiveDescendant', ref(''));

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

    return {
        optionId,
    };
}
