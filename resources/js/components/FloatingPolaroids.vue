<template>
    <div class="absolute-bg-container">
        <img
            v-for="(item, index) in images"
            :key="index"
            :src="item.src"
            class="float-fade"
            :style="{
                width: item.width + 'px',
                marginLeft: item.marginLeft ? item.marginLeft + 'px' : undefined,
                marginBottom: item.marginBottom ? item.marginBottom + 'px' : undefined,
                animationDelay: `${0.8 + index * 0.15}s, ${1.4 + index * 0.5}s`,
            }"
            alt="polaroid"
        />
    </div>
</template>

<script>
export default {
    name: "FloatingPolaroids",
    props: {
        images: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped>
.absolute-bg-container {
    position: absolute;
    bottom: 0;
    z-index: 0;
}
.float-fade {
    animation:
        fade-in-blur 0.6s ease 0.5s both,
        float 3s ease-in-out infinite;
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
}
@keyframes fade-in-blur {
    from { opacity: 0; transform: translateY(15px); filter: blur(6px); }
    to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>