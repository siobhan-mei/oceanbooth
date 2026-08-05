import { ref } from "vue";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useUploadPhoto() {
    const photo = ref(null);
    const error = ref(null);


    function validateFile(file) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return "Please upload a valid image file.";
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return `Image must be smaller than ${MAX_SIZE_MB}MB.`;
        }
        return null;
    }

    function handleFile(file) {
        return new Promise((resolve, reject) => {
            error.value = null;
            const validationError = validateFile(file);
            if (validationError) {
                error.value = validationError;
                reject(validationError);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject("Failed to read the image file.");
            reader.readAsDataURL(file);
        });
    }

    function handleInputChange(event) {
        const file = event.target.files?.[0];
        if (file) handleFile(file);
        event.target.value = "";
    }

    function reset() {
        photo.value = null;
        error.value = null;
    }

    return { photo, error, handleFile, handleInputChange, reset};
}
