<template>
    <div class="template-card">
        <div class="template-secondary-card">
            <slot name="visual" />
        </div>
        <div class="template-card-actions">
            <button class="btn pink-button" @click="$emit('snap')">
                <SnapPhoto style="margin-right: 4px"/> Snap Photo
            </button>
            <button class="btn pink-button" @click="$emit('upload')">
                <UploadPhoto style="margin-right: 1px"/> Upload Photo
            </button>
        </div>
    </div>
</template>
<script>
import SnapPhoto from '@components/svgs/SnapPhoto.vue';
import UploadPhoto from '@components/svgs/UploadPhoto.vue';

export default {
    name: "TemplateCard",
    components: {
        SnapPhoto,
        UploadPhoto,
    },
    emits: ['snap', 'upload'],
};
</script>
<style scoped>
.template-card {
    position: relative;
    background: var(--color-secondary-container, #c8e6ea);
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
}
.template-secondary-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    padding: 15px;
}
.template-card-actions {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}
.template-card:hover .template-card-actions{
    opacity: 1;
    pointer-events: auto;
    background: var(--color-secondary-container, #c8e6ea);
}
</style>