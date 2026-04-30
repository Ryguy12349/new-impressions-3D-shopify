<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { cart, isCartDrawerOpen, removeCartItems, isCartUpdating } from "../../stores/cart";
  import ShopifyImage from "../ShopifyImage.svelte";
  import Money from "./Money.svelte";
  import { clickOutside } from "../../utils/click-outside";

  let cartDrawerEl: HTMLDivElement = $state();

  $effect(() => {
    if ($isCartDrawerOpen) {
      document.body.classList.add("overflow-hidden");
      cartDrawerEl?.focus();
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  });

  let cartIsUpdatingClass = $derived($isCartUpdating ? "opacity-50 pointer-events-none" : "");

  function closeCartDrawer() {
    isCartDrawerOpen.set(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") closeCartDrawer();
  }
</script>

{#if $isCartDrawerOpen}
  <div class="relative z-50" role="dialog" aria-modal="true">
    <div
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300 }}
      class="fixed inset-0 bg-[var(--color-digital-bg)]/60 backdrop-blur-sm transition-opacity"
    ></div>

    <div class="fixed inset-0 overflow-hidden">
      <div 
        class="pointer-events-none fixed inset-0 fixed-control flex justify-end max-w-full pl-6 focus:outline-none"
        tabindex="-1"
        use:clickOutside={(event) => {
          if (!document.getElementById('CartBtn')?.contains(event.target)) {
              closeCartDrawer();
          }
        }}
        bind:this={cartDrawerEl}
        onkeydown={onKeyDown}
        role="none"
      >
        <div
          in:fly={{ duration: 500, x: 500, opacity: 1 }}
          out:fly={{ duration: 500, x: 500, opacity: 1 }}
          class="pointer-events-auto w-screen max-w-lg max-h-screen shadow-2xl paper_pattern flex flex-col h-full"
          style="color: var(--color-paper-content);"
        >
            <div class="flex items-center justify-between p-6 border-b border-[var(--color-paper-content)]/10">
              <h2 class="flex gap-4 items-center text-2xl font-bold tracking-tighter" id="slide-over-title">
                Your Bag
                {#if $isCartUpdating}
                  <svg class="animate-spin h-5 w-5 text-[var(--color-accent-1)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                {/if}
              </h2>
            </div>

            <div class="flex-1 overflow-y-auto px-6">
              {#if $cart && $cart.lines?.nodes.length > 0}
                <ul role="list" class="divide-y divide-[var(--color-paper-content)]/10 {cartIsUpdatingClass}">
                  {#each $cart.lines?.nodes as item}
                    <li class="grid py-8 grid-cols-12 gap-4">
                      <div class="overflow-hidden rounded-sm col-span-3 border border-[var(--color-paper-content)]/5">
                        <ShopifyImage 
                            image={item.merchandise.image} 
                            classList="object-cover h-full object-center aspect-square" 
                            sizes="120px"
                            loading="lazy" 
                        />
                      </div>
                      
                      <div class="col-span-6 flex flex-col gap-1">
                        <a class="font-bold hover:text-[var(--color-accent-1)] transition-colors leading-tight" href={`/products/${item.merchandise.product.handle}`}>
                          {item.merchandise.product.title}
                        </a>
                        <p class="text-xs opacity-60">
                            QTY: {item.quantity} &times; <Money price={item.cost.amountPerQuantity} />
                        </p>
                      </div>

                      <div class="col-span-3 items-end flex justify-between flex-col">
                        <button 
                          onclick={() => removeCartItems([item.id])} 
                          disabled={$isCartUpdating}
                          class="group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-[var(--color-accent-4)]/10"
                          style="border: 1px solid var(--color-accent-4);"
                          aria-label="remove item from cart"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="22px" 
                            viewBox="0 -960 960 960" 
                            width="22px" 
                            fill="var(--color-accent-4)"
                            class="transition-colors group-hover:fill-[var(--color-accent-4)]"
                          >
                            <path d="M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z"/>
                          </svg>
                        </button>
                        
                        <p class="font-bold">
                          <Money price={item.cost.totalAmount} />
                        </p>
                      </div>
                    </li>
                  {/each}
                </ul>
              {:else}
                <div class="text-center mt-20">
                  <p class="opacity-50 italic">Your bag is empty</p>
                  <button onclick={closeCartDrawer} class="mt-4 font-bold uppercase text-sm tracking-widest hover:text-[var(--color-accent-1)] transition-colors">
                    Explore Shop &rarr;
                  </button>
                </div>
              {/if}
            </div>

            {#if $cart && $cart.lines?.nodes.length > 0}
              <div class="border-t border-[var(--color-paper-content)]/10 py-8 px-6">
                <div class="flex justify-between text-lg font-bold uppercase tracking-tighter">
                  <p>Subtotal</p>
                  <p><Money price={$cart.cost.subtotalAmount} showCurrency={true} /></p>
                </div>
                <p class="mt-1 text-xs opacity-50 italic">
                    Shipping and taxes calculated at checkout.
                </p>
                <div class="mt-8">
                  <a 
                    href={$cart.checkoutUrl} 
                    class="block w-full py-4 text-center font-bold uppercase tracking-widest text-sm transition-all rounded-[.25rem]"
                    style="background-color: var(--color-accent-1); color: var(--color-digital-bg);"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .fixed-control {
      top: 3.5rem;
      right: 0px;
  }
</style>
