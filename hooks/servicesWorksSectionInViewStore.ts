let inView = false;
const listeners = new Set<() => void>();

export function setServicesWorksSectionInView(next: boolean) {
  if (inView === next) return;
  inView = next;
  listeners.forEach((l) => l());
}

export function subscribeServicesWorksSectionInView(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getServicesWorksSectionInViewSnapshot() {
  return inView;
}
