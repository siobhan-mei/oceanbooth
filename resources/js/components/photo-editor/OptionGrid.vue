<template>
    <div class="option-grid">
        <p class="option-grid-title">{{ title }}</p>

        <div class="option-grid-wrapper">
            <button
                v-if="scrollable"
                class="btn blue-button scroll-btn scroll-btn--left"
                :disabled="!canScrollLeft"
                aria-label="Scroll left"
                @click="scrollByAmount(-1)"
            >
                <ChevronButton/>
            </button>

            <div
                ref="scrollContainer"
                class="option-grid-boxes"
                :class="{ 'option-grid-boxes--scroll': scrollable }"
                @scroll="updateScrollState"
            >
                <button 
                    v-for="item in items"
                    :key="item.id"
                    class="option-box"
                    :class="{ 'option-box--selected': item.id === selectedId }"
                    @click="$emit('select', item)"
                >
                    <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.name" />
                </button>
            </div>

            <button
                v-if="scrollable"
                class="btn blue-button scroll-btn scroll-btn--right"
                :disabled="!canScrollRight"
                aria-label="Scroll right"
                @click="scrollByAmount(1)"
            >
                <ChevronButton class="icon-flip" />
            </button>
        </div>
    </div>
</template>

<script>
import ChevronButton from "@components/svgs/ChevronButton.vue";

    export default {
        name: "OptionGrid",
        components: {
            ChevronButton,
        },
        props: {
            title: { type: String, required: true },
            items: { type: Array, required: true },
            selectedId: { type: [String, Number], default: null},
            scrollable: { type: Boolean, required: false },
        },
        emits: ["select"],
        data() {
            return {
                canScrollLeft: false,
                canScrollRight: false,
            };
        },
        mounted() {
            if (this.scrollable) this.updateScrollState();
        },
        methods: {
            scrollByAmount(direction) {
                const el = this.$refs.scrollContainer;
                el.scrollBy({ left:direction * el.clientWidth * 0.8, behavior: "smooth" });
            },
            updateScrollState() {
                const el = this.$refs.scrollContainer;
                this.canScrollLeft = el.scrollLeft > 0;
                this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
            }
        }
    }
</script>

<style scoped>
.option-grid-title {
    font-size: 0.90rem;
}
.option-grid-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}
.option-grid-boxes {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    --option-box-size: 82px;
    flex: 1;
    min-width: 0;
}
.option-box {
    flex: 1;
    aspect-ratio: 1/1;
    background: var(--color-secondary-container, #c8e6ea);
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 20px;
    padding: 10px;
    overflow: hidden;
    cursor: pointer;
    
}
.option-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.option-box:hover {
    border-color: black;
}
.option-box--selected {
    outline: 2px solid var(--color-primary-btn, #ffe5eb);
    outline-offset: 2px;
}
.option-grid-boxes--scroll {
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type:  x mandatory;
    scrollbar-width: none;    
}
.option-grid-boxes--scroll::-webkit-scrollbar {
    display: none;
}
.option-grid-boxes--scroll .option-box {
    flex: 0 0 auto; 
    width: var(--option-box-size);
    scroll-snap-align: start;
}
.scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.6rem;
    height: 2rem;
    flex-shrink: 0;
}
.scroll-btn--left {
    left: -15px;
}
.scroll-btn--right {
    right: -15px;
}
.scroll-btn:disabled {
    background: #d8d8d8;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
}
.btn.blue-button.scroll-btn {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    z-index: 2;
    width: 2.2rem;
    height: 2.2rem;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.icon-flip {
    transform: rotate(180deg);
}
</style>