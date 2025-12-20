import type { StateStorage } from 'zustand/middleware'

/**
 * IndexedDB storage adapter for Zustand persist middleware
 * 
 * Provides better storage capacity and performance compared to localStorage
 */
export const createIndexedDBStorage = (dbName: string, storeName: string): StateStorage => {
  let db: IDBDatabase | null = null

  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
        return
      }

      const request = indexedDB.open(dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        db = request.result
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName)
        }
      }
    })
  }

  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const database = await initDB()
        return new Promise((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readonly')
          const store = transaction.objectStore(storeName)
          const request = store.get(name)

          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve(request.result || null)
        })
      } catch (error) {
        console.error('IndexedDB getItem error:', error)
        return null
      }
    },

    setItem: async (name: string, value: string): Promise<void> => {
      try {
        const database = await initDB()
        return new Promise((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readwrite')
          const store = transaction.objectStore(storeName)
          const request = store.put(value, name)

          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve()
        })
      } catch (error) {
        console.error('IndexedDB setItem error:', error)
      }
    },

    removeItem: async (name: string): Promise<void> => {
      try {
        const database = await initDB()
        return new Promise((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readwrite')
          const store = transaction.objectStore(storeName)
          const request = store.delete(name)

          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve()
        })
      } catch (error) {
        console.error('IndexedDB removeItem error:', error)
      }
    },
  }
}

/**
 * Pre-configured IndexedDB storage for auth
 */
export const authStorage = createIndexedDBStorage('school-admin-db', 'auth-store')

/**
 * Pre-configured IndexedDB storage for settings
 */
export const settingsStorage = createIndexedDBStorage('school-admin-db', 'settings-store')
