export interface CustomFieldLabelsConfig {
    userIdLabels: string[];
    nameLabels: string[];
    emailLabels: string[];
    phoneLabels: string[];
}

const defaultConfig: CustomFieldLabelsConfig = {
    userIdLabels: [
        "User ID",
        "User Name",
        "Username",
        "UserID",
        "User_Id",
        "User-Id",
    ],
    nameLabels: [
        "Name",
        "Full Name",
        "Contact Name",
        "Client Name"
    ],
    emailLabels: [
        "Email",
        "Email Address",
        "Contact Email",
        "Client Email"
    ],
    phoneLabels: [
        "Phone",
        "Phone Number",
        "Contact Phone",
        "Client Phone",
        "Client's contact information"
    ],
};

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
        const request = window.indexedDB.open("CustomFieldLabelsDB", 1);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event);
            reject(new Error("Failed to open CustomFieldLabelsDB"));
        };

        request.onupgradeneeded = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            const objectStore = db.createObjectStore("customFieldLabels", { keyPath: "id" });

            // Store the default configuration on database creation
            objectStore.transaction.oncomplete = () => {
                const configObjectStore = db.transaction("customFieldLabels", "readwrite").objectStore("customFieldLabels");
                configObjectStore.add({ id: "config", ...defaultConfig });
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
    return db.transaction("customFieldLabels", "readwrite");
}

function getROTransaction() {
    return db.transaction("customFieldLabels", "readonly");
}

// Get the current configuration
export async function getCustomFieldLabelsConfig(): Promise<CustomFieldLabelsConfig> {
    if (!dbReady) {
        await initializeDB();
    }

    return new Promise((resolve, reject) => {
        const transaction = getROTransaction();
        const objectStore = transaction.objectStore("customFieldLabels");
        const request = objectStore.get("config");

        request.onerror = () => {
            reject(new Error("Failed to retrieve custom field labels configuration"));
        };

        request.onsuccess = () => {
            if (request.result) {
                const {...config } = request.result;
                resolve(config as CustomFieldLabelsConfig);
            } else {
                // If no config exists, return default and save it
                saveCustomFieldLabelsConfig(defaultConfig);
                resolve(defaultConfig);
            }
        };
    });
}

// Save the entire configuration
export async function saveCustomFieldLabelsConfig(config: CustomFieldLabelsConfig): Promise<void> {
    if (!dbReady) {
        await initializeDB();
    }

    return new Promise((resolve, reject) => {
        const transaction = getRWTransaction();
        const objectStore = transaction.objectStore("customFieldLabels");
        const request = objectStore.put({ id: "config", ...config });

        request.onerror = () => {
            reject(new Error("Failed to save custom field labels configuration"));
        };

        request.onsuccess = () => {
            resolve();
        };
    });
}

// Update specific field type labels
export async function updateFieldLabels(fieldType: keyof CustomFieldLabelsConfig, labels: string[]): Promise<void> {
    const config = await getCustomFieldLabelsConfig();
    config[fieldType] = labels;
    await saveCustomFieldLabelsConfig(config);
}

// Add a label to a specific field type
export async function addFieldLabel(fieldType: keyof CustomFieldLabelsConfig, label: string): Promise<void> {
    const config = await getCustomFieldLabelsConfig();
    if (!config[fieldType].includes(label)) {
        config[fieldType].push(label);
        await saveCustomFieldLabelsConfig(config);
    }
}

// Remove a label from a specific field type
export async function removeFieldLabel(fieldType: keyof CustomFieldLabelsConfig, label: string): Promise<void> {
    const config = await getCustomFieldLabelsConfig();
    config[fieldType] = config[fieldType].filter(l => l !== label);
    await saveCustomFieldLabelsConfig(config);
}

// Reset to default configuration
export async function resetToDefaultConfig(fieldType: keyof CustomFieldLabelsConfig): Promise<void> {
    const config = await getCustomFieldLabelsConfig();
    config[fieldType] = defaultConfig[fieldType];
    await saveCustomFieldLabelsConfig(config);
}

// Get labels for a specific field type
export async function getFieldLabels(fieldType: keyof CustomFieldLabelsConfig): Promise<string[]> {
    const config = await getCustomFieldLabelsConfig();
    return config[fieldType];
}