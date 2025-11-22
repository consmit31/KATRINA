import Template from "../../dataTypes/Template";

let db: IDBDatabase;
let dbReady = false;
let dbInitPromise: Promise<void> | null = null;

// Initialize IndexedDB only in browser environment
function initializeDB(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in server environment'));
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open("TemplateDB", 1);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore("templates", { keyPath: "name"});

      objectStore.createIndex("name", "name", {unique: true});
      objectStore.createIndex("kba", "kba", {unique: false});
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      dbReady = true;
      resolve();
    };
  });

  return dbInitPromise;
}

function getRWTransaction() {
  return db.transaction("templates", "readwrite");
}

function getROTransaction() {
  return db.transaction("templates", "readonly");
}

// Wait for database to be ready
async function waitForDB(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is not available in server environment');
  }

  if (!dbReady) {
    await initializeDB();
  }
}

// CRUD Operations
export async function addTemplate(template: Template): Promise<number> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("templates");
    
    const request = objectStore.add(template);
    
    request.onsuccess = () => {
      resolve(request.result as number);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to add template"));
    };
    
    transaction.onerror = () => {
      reject(new Error("Transaction failed"));
    };
  });
}

export async function getAllTemplates(): Promise<Template[]> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("templates");
    
    const request = objectStore.getAll();
    
    request.onsuccess = () => {
      resolve(request.result as Template[]);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get templates"));
    };
  });
}

export async function getTemplateByName(name: string): Promise<Template | undefined> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("templates");
    
    const request = objectStore.get(name);
    
    request.onsuccess = () => {
      resolve(request.result as Template | undefined);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get template"));
    };
  });
}

export async function updateTemplate(id: number, template: Template): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("templates");
    
    // Since keyPath is "name", we don't need to pass the id parameter
    const request = objectStore.put(template);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to update template"));
    };
  });
}

export async function deleteTemplate(id: number): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("templates");
    
    const request = objectStore.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to delete template"));
    };
  });
}

// New function to delete template by name (more appropriate for this keyPath setup)
export async function deleteTemplateByName(name: string): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("templates");
    
    const request = objectStore.delete(name);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to delete template"));
    };
  });
}

// New function to update template, handling potential name changes
export async function updateTemplateByName(originalName: string, template: Template): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("templates");
    
    // If name changed, we need to delete the old entry first
    if (originalName !== template.name) {
      const deleteRequest = objectStore.delete(originalName);
      deleteRequest.onsuccess = () => {
        const addRequest = objectStore.put(template);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(new Error("Failed to update template with new name"));
      };
      deleteRequest.onerror = () => reject(new Error("Failed to delete old template entry"));
    } else {
      // Same name, just update
      const request = objectStore.put(template);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to update template"));
    }
  });
}

export async function getTemplatesByKba(kba: string): Promise<Template[]> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("templates");
    const index = objectStore.index("kba");
    
    const request = index.getAll(kba);
    
    request.onsuccess = () => {
      resolve(request.result as Template[]);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get templates by KBA"));
    };
  });
}

