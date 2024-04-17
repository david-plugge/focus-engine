export type Direction = 'up' | 'down' | 'left' | 'right';

interface FocusEngineOptions {
	root: ParentNode;
}

export class FocusEngine {
	private readonly root: ParentNode;

	private readonly groupDataAttr = 'data-selectable-group';
	private readonly itemDataAttr = 'data-selectable';
	private readonly selectedDataAttr = 'data-selected';

	constructor(options: FocusEngineOptions) {
		this.root = options.root;
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
	): HTMLElement | null {
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
						const d = FocusEngine.getDistance(
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
		} else if (!this.root.contains(container)) {
			// last layer, nothing else to search for
			return null;
		} else {
			// go up one layer
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
		const cx = (a.left + a.right) / 2;
		const cy = (a.top + a.bottom) / 2;

		let x: number;
		let y: number;

		switch (direction) {
			case 'up':
				if (a.top < b.bottom) return Infinity;
				x = b.left > cx ? b.left : b.right < cx ? b.right : cx;
				y = b.bottom;
				break;
			case 'down':
				if (a.bottom > b.top) return Infinity;
				x = b.left > cx ? b.left : b.right < cx ? b.right : cx;
				y = b.top;
				break;
			case 'left':
				if (a.left < b.right) return Infinity;
				x = b.right;
				y = b.top > cy ? b.top : b.bottom < cy ? b.bottom : cy;
				break;
			case 'right':
				if (a.right > b.left) return Infinity;
				x = b.left;
				y = b.top > cy ? b.top : b.bottom < cy ? b.bottom : cy;
				break;
		}

		const dx = Math.abs(cx - x);
		const dy = Math.abs(cy - y);

		if (direction === 'left' || direction === 'right') {
			return dx + Math.pow(dy, 2);
		}
		return dy + Math.pow(dx, 2);
	}
}
