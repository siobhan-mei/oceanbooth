<template>
<button
    v-if="mode === 'camera'"
    class="btn pink-button camera-button"
    aria-label="Snap photo"
    @click="$emit('snap', nextEmptyIndex)"
>
    <SnapPhoto />
</button>
</template>
<script>
import SnapPhoto from "@components/svgs/SnapPhoto.vue";

export default {
    name: "PhotoPreview",
    components: {
        SnapPhoto,
    },
    props: {
        mode: {
            type: String,
            required: true,
            validator: (v) => ["camera", "upload"].includes(v),
        },
        photos: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['snap'],
    computed: {
        nextEmptyIndex() {
            const index = this.photos.findIndex((p) => !p);
            return index === 1 ? this.photos.length : index;
        },
    },
};
</script>