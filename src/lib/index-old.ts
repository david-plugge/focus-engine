type Direction = 'up' | 'down' | 'left' | 'right';

function getDistance(a: DOMRect, b: DOMRect, direction: Direction) {
	if (direction === 'up' && a.top <= b.top) return Infinity;
	if (direction === 'down' && a.bottom >= b.bottom) return Infinity;
	if (direction === 'left' && a.left <= b.left) return Infinity;
	if (direction === 'right' && a.right >= b.right) return Infinity;

	const dx = Math.abs((a.left + a.right - b.left - b.right) / 2);
	const dy = Math.abs((a.top + a.bottom - b.top - b.bottom) / 2);

	if (direction === 'left' || direction === 'right') {
		return dx + Math.pow(dy, 2);
	}
	return dy + Math.pow(dx, 2);
}

export function handleNextFocus(dir: Direction) {
	let active = document.activeElement || document.querySelector('[data-initial-focus]');
	if (!active) return;

	console.log(active);

	const boundry = active.closest<HTMLElement>('[data-focus-boundry]') || document;
	const items = getFocusableElements(boundry);

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

	const next = items[index];
	focus(next);
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
