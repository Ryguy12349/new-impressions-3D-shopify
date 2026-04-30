<script>
  import ShopifyImage from "../ShopifyImage.svelte";
  export let images = { nodes: [] };

  // Set the first image as the default
  let selectedImage = images.nodes[0];

  function select(image) {
    selectedImage = image;
  }
</script>

<div class="grid gap-4 md:grid-cols-8 lg:gap-6">
  <div class="md:order-2 md:col-span-6">
    <div class="main-image-wrapper overflow-hidden rounded-lg">
      <ShopifyImage
        classList="h-full object-cover w-full"
        loading="eager"
        image={selectedImage}
        sizes="(min-width: 1540px) 475px, (min-width: 1280px) 389px, (min-width: 1040px) 304px, (min-width: 780px) 720px, (min-width: 680px) 592px, calc(94.44vw - 31px)"
      />
    </div>
  </div>

  <div
    class="grid grid-cols-4 gap-4 md:order-1 md:col-span-2 md:flex md:flex-col md:gap-6"
    style={images.nodes.length > 2 ? "justify-content: space-between" : ""}
  >
    {#each images.nodes as image, index}
      {#if index < 4} <button 
          class="overflow-hidden rounded-lg border-2 transition-all {selectedImage === image ? 'border-[#ff028f]' : 'border-transparent'}"
          on:click={() => select(image)}
          aria-label="View product image {index + 1}"
        >
          <ShopifyImage
            classList="w-full object-cover aspect-square"
            loading="eager"
            image={image}
            sizes="(min-width: 1540px) 475px, (min-width: 1280px) 389px, 304px"
          />
        </button>
      {/if}
    {/each}
  </div>
</div>

<style>
  button {
    padding: 0;
    cursor: pointer;
    background: none;
    display: block;
  }
  
  /* Prevent the main image from jumping when swapping */
  .main-image-wrapper {
    aspect-ratio: 1 / 1; 
    background-color: #272628;
  }
</style>