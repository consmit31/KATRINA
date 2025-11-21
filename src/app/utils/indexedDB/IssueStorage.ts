import Issue from "../../dataTypes/Issue";

let db: IDBDatabase;
let dbReady = false;
let dbInitPromise: Promise<void> | null = null;

// Interface for storing issues with template names instead of full template objects
interface StoredIssue {
  name: string;
  templateNames: string[];
}

// Initialize IndexedDB only in browser environment
function initializeDB(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in server environment'));
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open("IssueDB", 1);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore("issues", { keyPath: "name" });

      objectStore.createIndex("name", "name", { unique: true });
      
      // Pre-populate with some default issues
      objectStore.transaction.oncomplete = () => {
        const issueObjectStore = db.transaction("issues", "readwrite").objectStore("issues");
        
        const defaultIssues: StoredIssue[] = [
          {
            name: "Mi.gov",
            templateNames: ["MiLogin: PW", "MiLogin: Dupe. Acct", "MiLogin: Inac. Acct"]
          },
          {
            name: "Windows",
            templateNames: ["Locked account", "Password reset"]
          },
          {
            name: "Office 365",
            templateNames: ["Account locked", "Password expired", "MFA issues"]
          },
          {
            name: "VPN",
            templateNames: ["Connection failed", "Authentication error", "Network timeout"]
          }
        ];
        
        defaultIssues.forEach(issue => {
          issueObjectStore.add(issue);
        });
      };
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
  return db.transaction("issues", "readwrite");
}

function getROTransaction() {
  return db.transaction("issues", "readonly");
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
export async function addIssue(issueName: string, templateNames: string[]): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const storedIssue: StoredIssue = {
      name: issueName,
      templateNames: templateNames
    };
    
    const request = objectStore.add(storedIssue);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to add issue"));
    };
    
    transaction.onerror = () => {
      reject(new Error("Transaction failed"));
    };
  });
}

export async function getAllIssues(): Promise<StoredIssue[]> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const request = objectStore.getAll();
    
    request.onsuccess = () => {
      resolve(request.result as StoredIssue[]);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get issues"));
    };
  });
}

export async function getIssueByName(issueName: string): Promise<StoredIssue | undefined> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const request = objectStore.get(issueName);
    
    request.onsuccess = () => {
      resolve(request.result as StoredIssue | undefined);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get issue"));
    };
  });
}

export async function updateIssue(issueName: string, templateNames: string[]): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const storedIssue: StoredIssue = {
      name: issueName,
      templateNames: templateNames
    };
    
    const request = objectStore.put(storedIssue);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to update issue"));
    };
  });
}

export async function deleteIssue(issueName: string): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const request = objectStore.delete(issueName);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to delete issue"));
    };
  });
}

export async function addTemplateToIssue(issueName: string, templateName: string): Promise<void> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  if (!issue.templateNames.includes(templateName)) {
    issue.templateNames.push(templateName);
    await updateIssue(issueName, issue.templateNames);
  }
}

export async function removeTemplateFromIssue(issueName: string, templateName: string): Promise<void> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  const updatedTemplateNames = issue.templateNames.filter(name => name !== templateName);
  await updateIssue(issueName, updatedTemplateNames);
}

export async function getTemplateNamesForIssue(issueName: string): Promise<string[]> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  return issue ? issue.templateNames : [];
}

export async function getAllIssueNames(): Promise<string[]> {
  await waitForDB();
  
  const issues = await getAllIssues();
  return issues.map(issue => issue.name);
}

// Export the StoredIssue interface for use in other files
export type { StoredIssue };
