<script lang="ts">
  import { preventDefault } from 'svelte/legacy';
  import { addCartItem, isCartUpdating, cart } from "../../stores/cart";

  interface Props {
    variantId: string;
    variantQuantityAvailable: number;
    variantAvailableForSale: boolean;
  }

  let { variantId, variantQuantityAvailable, variantAvailableForSale }: Props = $props();

  // Check if the variant is already in the cart and if there are any units left
  let variantInCart = $derived($cart &&
    $cart.lines?.nodes.find((item) => item.merchandise.id === variantId));
    
  let noQuantityLeft = $derived(
    variantInCart && 
    variantQuantityAvailable !== null && 
    variantQuantityAvailable <= variantInCart?.quantity
  );

  function addToCart(e: Event) {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { id, quantity } = Object.fromEntries(formData);
    const item = {
      id: id as string,
      quantity: parseInt(quantity as string),
    };
    addCartItem(item);
  }
</script>

<form onsubmit={preventDefault((e) => addToCart(e))} class="w-full">
  <input type="hidden" name="id" value={variantId} />
  <input type="hidden" name="quantity" value="1" />

  <button
    type="submit"
    class="button-cta mt-10 w-full flex items-center justify-center py-4 px-6 transition-all duration-200 font-bold uppercase tracking-widest text-sm"
    disabled={$isCartUpdating || noQuantityLeft || !variantAvailableForSale}
    style="
      background-color: {!variantAvailableForSale || noQuantityLeft ? '#444' : 'var(--color-accent-1)'};
      color: {!variantAvailableForSale || noQuantityLeft ? '#888' : 'var(--color-digital-bg)'};
      cursor: {$isCartUpdating || noQuantityLeft || !variantAvailableForSale ? 'not-allowed' : 'pointer'};
    "
  >
    {#if $isCartUpdating}
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5"
        style="color: var(--color-digital-bg)"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    {/if}

    {#if !variantAvailableForSale}
      Sold out
    {:else if noQuantityLeft}
      Limit Reached
    {:else}
      Add to bag
    {/if}
  </button>

  {#if noQuantityLeft}
    <div class="mt-2 text-center" style="color: var(--color-accent-4)">
      <small class="uppercase tracking-tighter">All available units are in your bag</small>
    </div>
  {/if}
</form>

<style>
  .button-cta {
    border: none;
    outline: none;
  }

  .button-cta:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .button-cta:active:not(:disabled) {
    transform: translateY(0px);
  }
</style>