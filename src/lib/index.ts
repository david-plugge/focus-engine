export type Direction = 'up' | 'down' | 'left' | 'right';

export function getDistance(a: DOMRect, b: DOMRect, direction: Direction) {
	if (direction === 'up' && a.top <= b.bottom) return Infinity;
	if (direction === 'down' && a.bottom >= b.top) return Infinity;
	if (direction === 'left' && a.left <= b.right) return Infinity;
	if (direction === 'right' && a.right >= b.left) return Infinity;

	const x = (a.left + a.right) / 2;
	const y = (a.top + a.bottom) / 2;

	if (direction === 'up' && a.left >= b.left && a.right <= b.right) return Math.abs(y - b.bottom);
	if (direction === 'down' && a.left >= b.left && a.right <= b.right) return b.top - y;
	if (direction === 'left' && a.top >= b.top && a.bottom <= b.bottom) return x - b.right;
	if (direction === 'right' && a.top >= b.top && a.bottom <= b.bottom) return b.left - x;

	const dx = Math.abs((a.left + a.right - b.left - b.right) / 2);
	const dy = Math.abs((a.top + a.bottom - b.top - b.bottom) / 2);

	if (direction === 'left' || direction === 'right') {
		return dx + Math.pow(dy, 2);
	}
	return dy + Math.pow(dx, 2);
}

export function handleNextFocus(dir: Direction) {
	let active =
		(document.activeElement as HTMLElement) ||
		document.querySelector<HTMLElement>('[data-initial-focus="true"]');

	if (!active) return;

	function run(active: HTMLElement) {
		let boundry = active.closest<HTMLElement>('[data-focus-boundry]');

		if (!boundry) {
			boundry = document.documentElement;
		}

		console.log('in boundry');

		const items = getFocusableElements(boundry).filter((item) => {
			return item.closest('[data-focus-boundry]') === boundry && !active.contains(item);
		});

		const closest = calculateClosest(active, items, dir);

		if (closest) {
			console.log('has closest');

			focus(closest);
			return;
		}
		console.log('no closest in boundry');

		const newBoundry = boundry.closest('[data-focus-boundry]')?.parentElement;
		if (newBoundry) {
			run(newBoundry);
		}
	}
	run(active);

	// const container = boundry || document;
	// const items = getFocusableElements(container);

	// const rect = active.getBoundingClientRect();

	// let distance = Infinity;
	// let index = -1;

	// items.forEach((item, i) => {
	// 	if (item === active) return;

	// 	const d = getDistance(rect, item.getBoundingClientRect(), dir);

	// 	if (d < distance) {
	// 		index = i;
	// 		distance = d;
	// 	}
	// });
	// if (index === -1) return null;

	// const next = items[index];
	// focus(next);
}

function calculateClosest(active: HTMLElement, items: HTMLElement[], dir: Direction) {
	const rect = active.getBoundingClientRect();

	let distance = Infinity;
	let index = -1;

	items.forEach((item, i) => {
		if (item === active) return;

		const d = getDistance(rect, item.getBoundingClientRect(), dir);

		if (d < distance) {
			index = i;
			distance = d;
		}
	});
	if (index === -1) return null;

	return items[index];
}

export function focus(target: HTMLElement | string) {
	const el = target instanceof HTMLElement ? target : document.querySelector<HTMLElement>(target);

	if (el) {
		el.focus({ preventScroll: true });
		el.scrollIntoView({ inline: 'center', block: 'center' });
	}
}

const focusableSelector = [
	'a[href]',
	'button',
	'input',
	'textarea',
	'select',
	'details',
	'[tabindex]:not([tabindex="-1"])'
].join(', ');

function getFocusableElements(element: ParentNode = document) {
	const elements = Array.from(element.querySelectorAll<HTMLElement>(focusableSelector)).filter(
		(el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
	);

	return elements;
}
