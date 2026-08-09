<template>
    <div class="main-bg">
        <TopHeader variant="page" @back-click="playClickSound" />
        <PhotoPreview
            :mode="mode"
            :template-id="templateId"
            :photos="photos"
            :camera-ready="camera.isReady.value"
            :activeSlotIndex="pendingSlotIndex"
            @snap="onSlotSelected"
            @video-ref="onVideoRef"
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
        <ConfirmModal
            :show="showCameraPermission"
            title="Permission to use camera"
            message="Allow OceanBooth to use your camera to snap a photo?"
            confirm-text="Allow"
            cancel-text="Deny"
            @cancel="onCameraPermissionCancel"
            @confirm="onCameraPermissionConfirm"
        />
        <ConfirmModal
            :show="showCameraDenied"
            title="Camera access denied"
            message="We can't reach your camera. Please enable camera access in your browser settings, then try again."
            @cancel="onCameraDeniedClose"
            @confirm="onCameraDeniedClose"
        />
        <ConfirmModal
            :show="showCameraNotFound"
            title="Camera not found"
            message="We couldn't find a camera on this device. Please connect a camera and try again."
            @cancel="onCameraNotFoundClose"
            @confirm="onCameraNotFoundClose"
        />
    </div>
</template>
<script>
import TopHeader from "@components/TopHeader.vue";
import PhotoPreview from "@components/PhotoPreview.vue";
import PhotoCropperModal from "@components/modals/PhotoCropperModal.vue";
import ConfirmModal from "@components/modals/ConfirmModal.vue";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";
import { useUploadPhoto } from "@composables/useUploadPhoto";
import { useSnapPhoto } from "@composables/useSnapPhoto";

export default {
    name: "PhotoEditor",
    components: {
        TopHeader,
        PhotoPreview,
        PhotoCropperModal,
        ConfirmModal,
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        const upload = useUploadPhoto();
        const camera =  useSnapPhoto();

        return { playClickSound, upload, camera };
    },
    data() {
        return {
            photos: [null],
            pendingSlotIndex: null,
            cropperSrc: null,
            showCropper: false,
            showCameraPermission: false,
            showCameraDenied: false,
            showCameraNotFound: false,
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
    watch: {
        templateId: {
            immediate: true,
            handler(id) {
                const slotCount = { 1: 1, 2: 2, 3: 3 }[id] ?? 1;
                this.photos = Array(slotCount).fill(null);
            },
        },
    },
    methods: {
        onSlotSelected(index) {
            if (this.mode === "upload"){
                this.pendingSlotIndex = index;
                this.$refs.fileInput.click();
                return;
            }

            if (!this.camera.isReady.value) {
                this.pendingSlotIndex = index;
                this.showCameraPermission = true;
                return;
            }

            if (this.pendingSlotIndex === index) {
                const dataUrl = this.camera.capture();
                if (dataUrl) {
                    this.photos[index] = dataUrl;
                    this.pendingSlotIndex = null;
                }
            } else {
                this.pendingSlotIndex = index;
            }
        },
        async onCameraPermissionConfirm() {
            this.showCameraPermission = false;
            const granted = await this.camera.requestCameraAccess();
            if (!granted) {
                if (this.camera.error.value === "no-camera") {
                    this.showCameraNotFound = true;
                } else {
                    this.showCameraDenied = true;
                }
            }
        },
        onCameraPermissionCancel () {
            this.showCameraPermission = false;
            this.pendingSlotIndex = null;
        },
        onCameraDeniedClose() {
            this.showCameraDenied = false;
            this.pendingSlotIndex = null;
        },
        onCameraNotFoundClose() {
            this.showCameraNotFound = false;
            this.pendingSlotIndex = null;
        },
        onVideoRef(el) {
            if (el) this.camera.attach(el);
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
    beforeUnmount() {
            this.camera.stop();
    },
};
</script>
