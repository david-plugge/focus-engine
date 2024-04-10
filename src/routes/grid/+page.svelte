<script lang="ts">
	import { handleNextFocus } from '$lib';

	function handleKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowLeft': {
				handleNextFocus('left');
				break;
			}
			case 'ArrowUp': {
				handleNextFocus('up');
				break;
			}
			case 'ArrowRight': {
				handleNextFocus('right');
				break;
			}
			case 'ArrowDown': {
				handleNextFocus('down');
				break;
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid h-screen w-screen grid-cols-6 grid-rows-3 gap-6 p-6 text-6xl">
	<button class="item col-span-2 row-span-1" data-initial-focus> 1 </button>
	<button class="item col-span-1 row-span-2"> 2 </button>
	<button class="item col-span-3 row-span-1"> 3 </button>
	<button class="item col-span-2 row-span-1"> 4 </button>
	<button class="item col-span-1 row-span-2"> 5 </button>
	<button class="item col-span-2 row-span-1"> 6 </button>
	<button class="item col-span-3 row-span-1"> 7 </button>
	<button class="item col-span-2 row-span-1"> 8 </button>
</div>
