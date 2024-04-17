type SpatialNavigationDirection = 'up' | 'down' | 'left' | 'right';
type FocusableAreaSearchMode = 'visible' | 'all';

interface FocusableAreasOptions {
	mode?: FocusableAreaSearchMode;
}

interface SpatialNavigationSearchOptions {}

interface Window {
	navigate(direction: SpatialNavigationDirection): void;
}

interface Element {
	getSpatialNavigationContainer(): Node;
	focusableAreas(options?: FocusableAreasOptions): Node[];
	spatialNavigationSearch(
		dir: SpatialNavigationDirection,
		options?: SpatialNavigationSearchOptions
	): Node | null;
}

class SpatialNavigation {
	navigate() {}

	getSpatialNavigationContainer(node: Node): Node {
		return {} as any;
	}

	focusableAreas(node: Node, options?: FocusableAreasOptions): Node[] {
		return {} as any;
	}

	spatialNavigationSearch(
		node: Node,
		dir: SpatialNavigationDirection,
		options?: SpatialNavigationSearchOptions
	): Node | null {
		return {} as any;
	}
}

function isFocusable(element: HTMLElement) {
	if (
		element.tabIndex < 0 ||
		isAtagWithoutHref(element) ||
		isActuallyDisabled(element) ||
		isExpresslyInert(element) ||
		!isBeingRendered(element)
	)
		return false;

	return true;
}

function isAtagWithoutHref(element: HTMLElement) {
	return (
		element.tagName === 'A' &&
		element.getAttribute('href') === null &&
		element.getAttribute('tabIndex') === null
	);
}

function isActuallyDisabled(element: HTMLElement) {
	switch (element.tagName) {
		case 'BUTTON':
		case 'INPUT':
		case 'SELECT':
		case 'TEXTAREA':
		case 'OPTGROUP':
		case 'OPTION':
		case 'FIELDSET':
			return (element as HTMLInputElement).disabled;
		default:
			return false;
	}
}

function isExpresslyInert(element: HTMLElement) {
	return element.inert && !element.ownerDocument.documentElement.inert;
}

function isBeingRendered(element: HTMLElement) {
	if (element.parentElement && !isVisibleStyleProperty(element.parentElement))
		return false;
	if (
		!isVisibleStyleProperty(element) ||
		element.style.opacity === '0' ||
		window.getComputedStyle(element).height === '0px' ||
		window.getComputedStyle(element).width === '0px'
	)
		return false;
	return true;
}

function isVisibleStyleProperty(element: HTMLElement) {
	const elementStyle = window.getComputedStyle(element, null);
	const thisVisibility = elementStyle.getPropertyValue('visibility');
	const thisDisplay = elementStyle.getPropertyValue('display');
	const invisibleStyle = ['hidden', 'collapse'];

	return thisDisplay !== 'none' && !invisibleStyle.includes(thisVisibility);
}

const p = {
	x: 100,
	y: 100,
};

const angle = (Math.PI / 180) * 45;

const cos = Math.cos(angle);
const sin = Math.cos(angle);

const p2 = {
	x: cos * p.x + sin * p.y,
	y: cos * p.y - sin * p.x,
};

console.log(p2);
