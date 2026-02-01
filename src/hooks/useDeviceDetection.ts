import { useSyncExternalStore } from "react";

function subscribeToMedia(query: MediaQueryList, callback: () => void) {
	query.addEventListener("change", callback);
	return () => query.removeEventListener("change", callback);
}

function getIsMac() {
	if (typeof navigator === "undefined") return false;
	return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

function getIsDesktop() {
	if (typeof window === "undefined") return false;
	const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
	const canHover = window.matchMedia?.("(hover: hover)").matches ?? false;
	const isLargeScreen =
		window.matchMedia?.("(min-width: 1024px)").matches ?? false;
	return (finePointer && canHover) || isLargeScreen;
}

export const useDeviceDetection = () => {
	const isMac = getIsMac();

	const isDesktop = useSyncExternalStore(
		(cb) => {
			const q = window.matchMedia?.("(min-width: 1024px)");
			const qPointer = window.matchMedia?.("(pointer: fine)");
			const qHover = window.matchMedia?.("(hover: hover)");
			if (!q) return () => {};
			const onChange = () => cb();
			q.addEventListener("change", onChange);
			qPointer?.addEventListener("change", onChange);
			qHover?.addEventListener("change", onChange);
			return () => {
				q.removeEventListener("change", onChange);
				qPointer?.removeEventListener("change", onChange);
				qHover?.removeEventListener("change", onChange);
			};
		},
		getIsDesktop,
		() => false,
	);

	const isMobile = !isDesktop;

	const isNarrow = useSyncExternalStore(
		(cb) => {
			const q = window.matchMedia?.("(max-width: 639px)");
			return q ? subscribeToMedia(q, cb) : () => {};
		},
		() =>
			typeof window !== "undefined" &&
			(window.matchMedia?.("(max-width: 639px)").matches ?? false),
		() => false,
	);

	return { isMac, isDesktop, isMobile, isNarrow };
};
