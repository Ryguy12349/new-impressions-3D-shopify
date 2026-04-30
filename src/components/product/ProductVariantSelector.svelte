<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let variants = [];
  export let options = []; // e.g., [{name: "Size", values: ["S", "M"] }]

  // Determine if we should show the UI
  // Hides if only 1 variant exists OR if the only option is the default "Title"
  const hasMultipleVariants = variants.length > 1 || (options.length > 0 && options[0].name !== 'Title');

  let selectedOptions = {};

  // INITIALIZATION: Build the default state
  if (variants.length > 0 && variants[0].selectedOptions) {
    // Standard Shopify behavior: map existing selections
    variants[0].selectedOptions.forEach(opt => {
      selectedOptions[opt.name] = opt.value;
    });
  } else if (options.length > 0) {
    // FALLBACK: If selectedOptions is missing from the query, use the general options
    options.forEach(opt => {
      selectedOptions[opt.name] = opt.values[0];
    });
  }

  // REACITIVITY: Find the variant object that matches the current button selections
  $: selectedVariant = variants.find(v => 
    v.selectedOptions?.every(opt => selectedOptions[opt.name] === opt.value)
  ) || variants[0];

  // BUBBLE UP: Tell the parent component (ProductPurchaseActions) that the ID/Price changed
  $: dispatch('change', selectedVariant);

  function handleOptionChange(name, value) {
    selectedOptions[name] = value;
    // Svelte 5/Vite reactivity trigger
    selectedOptions = { ...selectedOptions }; 
  }
</script>

{#if hasMultipleVariants}
  <div class="space-y-6 mt-6">
    {#each options as option}
      <div class="option-group">
        <label 
          class="text-xs uppercase tracking-widest mb-3 block" 
          style="color: color-mix(in srgb, var(--color-paper-content), transparent 40%)"
          for={option.name}
        >
          {option.name}
        </label>
        
        <div class="flex flex-wrap gap-3">
          {#each option.values as value}
            <button
              type="button"
              class="px-5 py-2 text-sm font-medium border transition-all duration-200"
              style="
                background: {selectedOptions[option.name] === value 
                  ? 'color-mix(in srgb, var(--color-accent-1), transparent 90%)' 
                  : 'transparent'};
                color: {selectedOptions[option.name] === value 
                  ? 'var(--color-accent-1)' 
                  : 'var(--color-paper-content)'};
                border-color: {selectedOptions[option.name] === value 
                  ? 'var(--color-accent-1)' 
                  : '#555'};
              "
              class:active:scale-95={true}
              on:click={() => handleOptionChange(option.name, value)}
            >
              {value}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  /* Fallback for hover states since tailwind JIT sometimes struggles with raw CSS vars in brackets */
  button:hover:not(:disabled) {
    border-color: var(--color-digital-content);
  }
  
  button {
    touch-action: manipulation;
    user-select: none;
  }
</style>