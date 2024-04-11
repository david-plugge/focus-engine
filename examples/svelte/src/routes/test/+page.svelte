<script lang="ts" context="module">
	import { getDistance, type Direction } from '$lib';
	import { onMount } from 'svelte';

	function getInitialSelectable(container: HTMLElement) {
		return (
			container.querySelector<HTMLElement>('[data-selectable-init]') ||
			container.querySelector<HTMLElement>('[data-selectable-item]')
		);
	}

	function handleNextFocus(dir: Direction) {
		const selected = document.querySelector<HTMLElement>('[data-selected]');

		if (!selected) {
			getInitialSelectable(document.body)?.setAttribute('data-selected', '');
			return;
		}
		const closest = _handleNextFocus(dir, selected, selected);

		if (closest) {
			if (closest.hasAttribute('data-selectable-item')) {
				selected.removeAttribute('data-selected');
				closest.setAttribute('data-selected', '');
			} else {
				const firstSelectable = getInitialSelectable(closest);

				if (firstSelectable) {
					selected.removeAttribute('data-selected');
					firstSelectable.setAttribute('data-selected', '');
				}
			}
		}
	}

	function _handleNextFocus(dir: Direction, selected: HTMLElement, current: HTMLElement) {
		const container =
			current.parentElement?.closest<HTMLElement>('[data-selectable-group]') || document.body;

		let distance = Infinity;
		let closest: HTMLElement | null = null;

		const selectedBox = selected.getBoundingClientRect();

		const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
			acceptNode(_node) {
				const node = _node as HTMLElement;

				if (node.isSameNode(current)) return NodeFilter.FILTER_REJECT;

				if (
					node.hasAttribute('data-selectable-group') ||
					node.hasAttribute('data-selectable-item')
				) {
					console.log(node);

					const d = getDistance(selectedBox, node.getBoundingClientRect(), dir);

					if (d < distance) {
						distance = d;
						closest = node;
					}

					return NodeFilter.FILTER_REJECT;
				}
				return NodeFilter.FILTER_SKIP;
			}
		});

		while (walker.nextNode());

		if (closest) {
			return closest as HTMLElement;
		} else if (container === document.body) {
			return null;
		} else {
			return _handleNextFocus(dir, selected, container);
		}
	}
</script>

<script lang="ts">
	import Item from './Item.svelte';

	function handleKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowLeft': {
				e.preventDefault();
				handleNextFocus('left');
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				handleNextFocus('up');
				break;
			}
			case 'ArrowRight': {
				e.preventDefault();
				handleNextFocus('right');
				break;
			}
			case 'ArrowDown': {
				e.preventDefault();
				handleNextFocus('down');
				break;
			}
		}
	}

	onMount(() => {
		document.querySelector('[data-selectable-item]')?.setAttribute('data-selected', '');
	});
</script>

<svelte:window on:keydown={handleKeyDown} />

<Item index={3}></Item>
