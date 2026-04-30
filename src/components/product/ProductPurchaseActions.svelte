<script>
  import ProductVariantSelector from "./ProductVariantSelector.svelte";
  import AddToCartForm from "../cart/AddToCartForm.svelte";
  import Money from "../cart/Money.svelte"; // Assuming Money is Svelte

  export let product;
  
  let selectedVariant = product.variants.nodes[0];

  function updateVariant(e) {
    selectedVariant = e.detail;
  }
</script>

<div class="space-y-4">
  <h1 class="text-4xl font-bold text-(--color-paper-content) sm:text-6xl">
    {product.title}
  </h1>

  <p class="text-3xl font-bold text-(--color-paper-content)">
    <Money price={selectedVariant.price} />
  </p>

  <ProductVariantSelector 
    variants={product.variants.nodes} 
    options={product.options}
    on:change={updateVariant}
  />

  <div class="pt-4">
    <AddToCartForm
      variantId={selectedVariant.id}
      variantQuantityAvailable={selectedVariant.quantityAvailable}
      variantAvailableForSale={selectedVariant.availableForSale}
    />
  </div>
</div>