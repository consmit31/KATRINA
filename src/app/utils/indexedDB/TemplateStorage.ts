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
    
    const request = objectStore.put(template, id);
    
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

