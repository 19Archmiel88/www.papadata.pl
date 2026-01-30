export const safeLocalStorage = (() => {
  try {
    const testKey = '__storage_test__';
    // sprawdź dostęp do localStorage
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    // Brak dostępu do localStorage (np. cross-origin iframe lub tryb incognito)
    let store: Record<string, string> = {};
    return {
      getItem(key: string) {
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      },
      setItem(key: string, value: string) {
        store[key] = String(value);
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {};
      },
      key(index: number) {
        const keys = Object.keys(store);
        return keys[index] ?? null;
      },
      get length() {
        return Object.keys(store).length;
      },
    } as Storage;
  }
})();

