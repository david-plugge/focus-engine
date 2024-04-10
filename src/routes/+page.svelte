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

<div class="flex h-screen w-screen flex-col">
	{#each { length: 3 } as _, i}
		<div class="flex h-full gap-6 p-6" data-focus-boundry>
			{#each { length: 3 } as _, j}
				<button data-initial-focus={j === 0 ? 'true' : undefined} class="item h-full w-full">
					{i * 3 + j + 1}
				</button>
			{/each}
		</div>
	{/each}
</div>
