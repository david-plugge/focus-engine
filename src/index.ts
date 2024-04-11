export type Direction = 'up' | 'down' | 'left' | 'right';

type GetDistanceFn = (a: DOMRect, b: DOMRect, dir: Direction) => number;

interface FocusManagerOptions {
	root: ParentNode;
	getDistance: GetDistanceFn;
}

export class FocusManager {
	private readonly root: ParentNode;
	private readonly getDistance: GetDistanceFn;

	private readonly groupDataAttr = 'data-selectable-group';
	private readonly itemDataAttr = 'data-selectable';
	private readonly selectedDataAttr = 'data-selected';

	constructor(options: FocusManagerOptions) {
		this.root = options.root;
		this.getDistance = options.getDistance;
	}

	nextFocus(dir: Direction) {
		const selected = this.root.querySelector<HTMLElement>(
			`[${this.selectedDataAttr}]:not([${this.selectedDataAttr}="false"])`
		);

		if (!selected) {
			this.getInitialSelectable(this.root)?.setAttribute(
				this.selectedDataAttr,
				''
			);
			return;
		}
		const closest = this._handleNextFocus(dir, selected, selected);

		if (closest) {
			if (closest.hasAttribute(this.itemDataAttr)) {
				selected.removeAttribute('data-selected');
				closest.setAttribute('data-selected', '');
			} else {
				const firstSelectable = this.getInitialSelectable(closest);

				if (firstSelectable) {
					selected.removeAttribute('data-selected');
					firstSelectable.setAttribute('data-selected', '');
				}
			}
		}
	}

	private _handleNextFocus(
		dir: Direction,
		selected: HTMLElement,
		current: HTMLElement
	) {
		const container =
			current.parentElement?.closest<HTMLElement>(
				`[${this.groupDataAttr}]`
			) || document.body;

		let distance = Infinity;
		let closest: HTMLElement | null = null;

		const selectedBox = selected.getBoundingClientRect();

		const walker = document.createTreeWalker(
			container,
			NodeFilter.SHOW_ELEMENT,
			{
				acceptNode: (_node) => {
					const node = _node as HTMLElement;

					if (node.isSameNode(current))
						return NodeFilter.FILTER_REJECT;

					if (
						node.hasAttribute(this.groupDataAttr) ||
						node.hasAttribute(this.itemDataAttr)
					) {
						const d = this.getDistance(
							selectedBox,
							node.getBoundingClientRect(),
							dir
						);

						if (d < distance) {
							distance = d;
							closest = node;
						}

						return NodeFilter.FILTER_REJECT;
					}
					return NodeFilter.FILTER_SKIP;
				},
			}
		);

		while (walker.nextNode());

		if (closest) {
			return closest as HTMLElement;
		} else if (container === document.body) {
			return null;
		} else {
			return this._handleNextFocus(dir, selected, container);
		}
	}

	private getInitialSelectable(container: ParentNode) {
		return (
			container.querySelector<HTMLElement>('[data-selectable-init]') ||
			container.querySelector<HTMLElement>('[data-selectable-item]')
		);
	}

	static getDistance(a: DOMRect, b: DOMRect, direction: Direction) {
		if (direction === 'up' && a.top <= b.bottom) return Infinity;
		if (direction === 'down' && a.bottom >= b.top) return Infinity;
		if (direction === 'left' && a.left <= b.right) return Infinity;
		if (direction === 'right' && a.right >= b.left) return Infinity;

		const x = (a.left + a.right) / 2;
		const y = (a.top + a.bottom) / 2;

		if (direction === 'up' && a.left >= b.left && a.right <= b.right)
			return Math.abs(y - b.bottom);
		if (direction === 'down' && a.left >= b.left && a.right <= b.right)
			return b.top - y;
		if (direction === 'left' && a.top >= b.top && a.bottom <= b.bottom)
			return x - b.right;
		if (direction === 'right' && a.top >= b.top && a.bottom <= b.bottom)
			return b.left - x;

		const dx = Math.abs((a.left + a.right - b.left - b.right) / 2);
		const dy = Math.abs((a.top + a.bottom - b.top - b.bottom) / 2);

		if (direction === 'left' || direction === 'right') {
			return dx + Math.pow(dy, 2);
		}
		return dy + Math.pow(dx, 2);
	}
}
