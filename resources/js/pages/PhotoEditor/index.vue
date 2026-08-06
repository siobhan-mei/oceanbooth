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
        <PhotoCropperModal
            :show="showCropper"
            :src="cropperSrc"
            @cancel="onCropCancel"
            @confirm="onCropConfirm"
        />  
    </div>
</template>
<script>
import TopHeader from "@components/TopHeader.vue";
import PhotoPreview from "@components/PhotoPreview.vue";
import PhotoCropperModal from "@components/modals/PhotoCropperModal.vue";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";
import { useUploadPhoto } from "@composables/useUploadPhoto";

export default {
    name: "PhotoEditor",
    components: {
        TopHeader,
        PhotoPreview,
        PhotoCropperModal,
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
            cropperSrc: null,
            showCropper: false,
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
                this.cropperSrc = await this.upload.handleFile(file);
                this.showCropper = true;
            } catch {}
        },
        onCropConfirm(dataUrl) {
            this.photos[this.pendingSlotIndex] = dataUrl;
            this.resetCropper();
        },
        onCropCancel() {
            this.resetCropper();
        },
        resetCropper() {
            this.showCropper = false;
            this.cropperSrc = null;
            this.pendingSlotIndex = null;
        },
    },  
};
</script>
