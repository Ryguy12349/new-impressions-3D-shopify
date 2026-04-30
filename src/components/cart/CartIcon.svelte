<script lang="ts">
  import { onMount } from "svelte";
  import { initCart, cart, isCartDrawerOpen } from "../../stores/cart";
  
  let { menuOpen = $bindable() } = $props(); 

  onMount(() => {
    initCart();
  });

  function toggleCart() {
    const currentState = isCartDrawerOpen.get();
    const nextState = !currentState;
    
    isCartDrawerOpen.set(nextState);

    if (nextState && menuOpen) {
      menuOpen = false;
    }
  }
</script>

<div class="relative flex items-center">
  <button
    id="CartBtn"
    type="button"
    aria-label={$isCartDrawerOpen ? 'Close your cart' : 'Open your cart'}
    class="relative z-60 transition-transform hover:scale-110 w-10 h-10 flex justify-center items-center" 
    onclick={(e) => {
      e.stopPropagation(); 
      toggleCart();
    }}
  >

  {#if $isCartDrawerOpen}
    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="var(--color-paper-content)">
      <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/>
    </svg>

  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="28px" fill="var(--color-paper-content)">
      <path d="M231.83-102.64Q210-124.62 210-155.47q0-30.86 21.98-52.7Q253.95-230 284.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83-30.86 0-52.7-21.97Zm400 0Q610-124.62 610-155.47q0-30.86 21.98-52.7Q653.95-230 684.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83-30.86 0-52.7-21.97ZM238.67-734 344-515.33h285.33l120-218.67H238.67ZM206-800.67h589.38q22.98 0 34.97 20.84 11.98 20.83.32 41.83L693.33-490.67q-11 19.34-28.87 30.67-17.87 11.33-39.13 11.33H324l-52 96h487.33V-286H278q-43 0-63-31.83-20-31.84-.33-68.17l60.66-111.33-149.33-316H47.33V-880h121.34L206-800.67Zm138 285.34h285.33H344Z"/>
    </svg>

    {#if $cart && $cart.totalQuantity > 0}
      <div 
        class="absolute -right-1 -top-1 text-[10px] font-bold rounded-full min-w-5 h-5 flex justify-center items-center px-1 shadow-md border border-[var(--color-paper-bg)]"
        style="background-color: var(--color-accent-1); color: white;"
      >
        {$cart.totalQuantity}
      </div>
    {/if}
  {/if}
  </button>
</div>

<style>
  #CartBtn {
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    /* Ensure it feels distinct on the paper pattern */
    outline: none;
  }
</style>