<template>
    <div class="main-bg">
        <TopHeader variant="page" @back-click="playClickSound" />
        <PhotoPreview
            :mode="mode"
            :template-id="templateId"
            :photos="photos"
            @snap="onSlotSelected"
        />
        <input
            ref="fileInput"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            class="d-none"
            @change="onFileSelected"
        />
    </div>
</template>
<script>
import TopHeader from "@components/TopHeader.vue";
import PhotoPreview from "@components/PhotoPreview.vue";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";
import { useUploadPhoto } from "@composables/useUploadPhoto";

export default {
    name: "PhotoEditor",
    components: {
        TopHeader,
        PhotoPreview,
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        const upload = useUploadPhoto();
        return { playClickSound, upload };
    },
    data() {
        return {
            photos: [],
            pendingSlotIndex: null,
        };
    },
    computed: {
        mode() {
            return this.$route.query.mode || "camera";
        },
        templateId() {
            return Number(this.$route.query.template) || 1;
        },
    },
    methods: {
        onSlotSelected(index) {
            if (this.mode === "upload") {
                this.pendingSlotIndex = index;
                this.$refs.fileInput.click();
            } else {
                // camera flow goes here later
            }
        },
        async onFileSelected(event) {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;

            try {
                const dataUrl = await this.upload.handleFile(file);
                this.photos[this.pendingSlotIndex] = dataUrl;
            } catch {}
        },
    },
};
</script>
