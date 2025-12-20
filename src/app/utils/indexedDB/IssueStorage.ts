import IssueMetric from "@dataTypes/IssueMetric";
import Issue from "@dataTypes/Issue";

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
    const request = window.indexedDB.open("IssueDB", 1);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore("issues", { keyPath: "name" });

      objectStore.createIndex("name", "name", { unique: true });
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
export async function addIssue(issueName: string, templateNames: string[], metrics?: IssueMetric): Promise<void> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");

    if (!metrics) {
      metrics = { usageCount: 0, usagePerDay: 0 };
    }
    
    const storedIssue: Issue = {
      name: issueName,
      templateNames: templateNames,
      metrics: metrics
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

export async function getAllIssues(): Promise<Issue[]> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const request = objectStore.getAll();
    
    request.onsuccess = () => {
      const issues = request.result as Issue[];
      // Ensure all issues have metrics
      const issuesWithMetrics = issues.map(issue => ({
        ...issue,
        metrics: issue.metrics || { usageCount: 0, usagePerDay: 0 }
      }));
      resolve(issuesWithMetrics);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get issues"));
    };
  });
}

export async function getAllIssueNames(): Promise<string[]> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const request = objectStore.getAllKeys();
    
    request.onsuccess = () => {
      resolve(request.result as string[]);
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get issue names"));
    };
  });
}

export async function getIssueByName(issueName: string): Promise<Issue | undefined> {
  await waitForDB();
  
  return new Promise((resolve, reject) => {
    const transaction = getROTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const request = objectStore.get(issueName);
    
    request.onsuccess = () => {
      const issue = request.result as Issue | undefined;
      if (issue) {
        // Ensure issue has metrics
        const issueWithMetrics = {
          ...issue,
          metrics: issue.metrics || { usageCount: 0, usagePerDay: 0 }
        };
        resolve(issueWithMetrics);
      } else {
        resolve(undefined);
      }
    };
    
    request.onerror = () => {
      reject(new Error("Failed to get issue"));
    };
  });
}

export async function updateIssueName(oldName: string, newName: string): Promise<void> {
  await waitForDB();

  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");

    const getRequest = objectStore.get(oldName);

    getRequest.onsuccess = () => {
      const issue = getRequest.result as Issue | undefined;

      if (!issue) {
        reject(new Error(`Issue "${oldName}" not found`));
        return;
      }

      const updatedIssue: Issue = {
        ...issue,
        name: newName
      };

      const deleteRequest = objectStore.delete(oldName);
      deleteRequest.onsuccess = () => {
        const addRequest = objectStore.add(updatedIssue);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(new Error("Failed to update issue name"));
      };
      deleteRequest.onerror = () => reject(new Error("Failed to delete old issue entry"));
    };

    getRequest.onerror = () => {
      reject(new Error("Failed to retrieve existing issue"));
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
    const updatedTemplateNames = [...issue.templateNames, templateName];
    await updateIssueTemplates(issueName, updatedTemplateNames);
  }
}

export async function removeTemplateFromIssue(issueName: string, templateName: string): Promise<void> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  const updatedTemplateNames = issue.templateNames.filter(name => name !== templateName);
  await updateIssueTemplates(issueName, updatedTemplateNames);
}

async function updateIssueTemplates(issueName: string, templateNames: string[]): Promise<void> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const updatedIssue: Issue = {
      ...issue,
      templateNames: templateNames
    };
    
    const request = objectStore.put(updatedIssue);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to update issue templates"));
    };
  });
}

export async function incrementIssueUsage(issueName: string): Promise<void> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  // Ensure metrics exist
  const currentMetrics = issue.metrics || { usageCount: 0, usagePerDay: 0 };
  const updatedMetrics: IssueMetric = {
    ...currentMetrics,
    usageCount: currentMetrics.usageCount + 1
  };
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const updatedIssue: Issue = {
      ...issue,
      metrics: updatedMetrics
    };
    
    const request = objectStore.put(updatedIssue);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to increment issue usage"));
    };
  });
}

export async function decrementIssueUsage(issueName: string): Promise<void> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  // Ensure metrics exist
  const currentMetrics = issue.metrics || { usageCount: 0, usagePerDay: 0 };
  const updatedMetrics: IssueMetric = {
    ...currentMetrics,
    usageCount: Math.max(0, currentMetrics.usageCount - 1)
  };
  
  return new Promise((resolve, reject) => {
    const transaction = getRWTransaction();
    const objectStore = transaction.objectStore("issues");
    
    const updatedIssue: Issue = {
      ...issue,
      metrics: updatedMetrics
    };
    
    const request = objectStore.put(updatedIssue);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error("Failed to decrement issue usage"));
    };
  });
}

export async function getIssueMetrics(issueName: string): Promise<IssueMetric> {
  await waitForDB();
  
  const issue = await getIssueByName(issueName);
  if (!issue) {
    throw new Error(`Issue "${issueName}" not found`);
  }
  
  // Ensure metrics exist
  return issue.metrics || { usageCount: 0, usagePerDay: 0 };
}