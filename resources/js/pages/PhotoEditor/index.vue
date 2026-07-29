<template>
    <div class="main-bg">
        <TopHeader variant="page" @back-click="playClickSound" />
        <PhotoPreview
            :mode="mode"
            :template-id="templateId"
            :photos="photos"
        />
    </div>
</template>
<script>
import TopHeader from "@components/TopHeader.vue";
import PhotoPreview from "@components/PhotoPreview.vue";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";

export default {
    name: "PhotoEditor",
    components: {
        TopHeader,
        PhotoPreview,
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        return { playClickSound };
    },
    data() {
        return {
            photos: [],
        };
    },  
    computed: {
        mode() {
            return this.$route.query.mode || 'camera';
        },
        templateId() {
            return Number(this.$route.query.template) || 1;
        },
    },
};
</script>