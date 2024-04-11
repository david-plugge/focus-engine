<script lang="ts" context="module">
	const randInt = (max: number) => Math.round(Math.random() * max);
</script>

<script lang="ts">
	export let index: number;

	const length = 1 + randInt(5);
	const init = randInt(length);
</script>

{#each { length } as item, i}
	<div
		data-selectable-init={index === 0 && i === init ? '' : undefined}
		data-selectable-group={index > 0 ? '' : undefined}
		data-selectable-item={index === 0 ? '' : undefined}
		class="m-4 inline-block w-fit bg-green-500/25 p-4 data-[selected]:bg-red-500"
	>
		{#if index}
			<svelte:self index={index - 1} />
		{:else}
			I
		{/if}
	</div>
{/each}
