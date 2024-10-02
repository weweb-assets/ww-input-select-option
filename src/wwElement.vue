<template>
    <wwLayout class="ww-select-option" path="slot" />
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['triggerClick'],
    setup(props, { emit }) {},
};
</script>

<style lang="scss" scoped></style>
