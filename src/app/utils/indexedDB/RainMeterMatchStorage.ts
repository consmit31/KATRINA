export interface RainMeterMatchConfig {
    workstation: RainMeterParameter;
    operatingSystem: RainMeterParameter;
    osVersion: RainMeterParameter;
    osBuild: RainMeterParameter;
    ipAddress: RainMeterParameter;
    macAddress: RainMeterParameter;
}

export interface RainMeterParameter {
    name: string;
    configKey: keyof RainMeterMatchConfig;
    pattern: RegExp; 
    fields: string[];
}

const defaultRainMeterConfig: RainMeterMatchConfig = {
    workstation: {
        name: "Workstation",
        configKey: "workstation",
        pattern: /^[TW][A-Z0-9]{10,12}$/,
        fields: [
            "Workstation",
            "Workstation Name",
            "PC Name",
            "Computer Name"
        ]
    },
    operatingSystem: {
        name: "Operating System",
        configKey: "operatingSystem",
        pattern: /Windows.*11/,
        fields: [
            "Operating System",
            "OS",
            "OS Type",
            "System OS"
        ],
    },
    osVersion: {
        name: "OS Version",
        configKey: "osVersion",
        pattern: /^Version\s+[0-9A-Z]{4}$/,
        fields: [
            "OS Version",
            "Operating System Version",
            "System Version",
            "OS Ver"
        ]
    },
    osBuild: {
        name: "OS Build",
        configKey: "osBuild",
        pattern: /^Build\s+[0-9.]{10}$/,
        fields: [
            "OS Build",
            "Operating System Build",
            "System Build"
        ]
    },
    ipAddress: {
        name: "IP Address",
        configKey: "ipAddress",
        pattern: /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3})$/,
        fields: [
            "IP Address",
            "IP",
            "Network IP",
            "Local IP"
        ],
    },
    macAddress: {
        name: "MAC Address",
        configKey: "macAddress",
        pattern: /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$|^([0-9a-fA-F]{4}\.){2}([0-9a-fA-F]{4})$/,
        fields: [
            "MAC Address",
            "MAC",
            "Physical Address",
            "Network MAC"
        ]
    },
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
        const request = window.indexedDB.open("RainMeterMatchDB", 1);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event);
            reject(new Error("Failed to open RainMeterMatchDB"));
        };

        request.onupgradeneeded = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            const objectStore = db.createObjectStore("RainMeterMatchConfigStore", { keyPath: "id" });
            
            objectStore.transaction.oncomplete = () => {
                const configObjectStore = db.transaction("RainMeterMatchConfigStore", "readwrite").objectStore("RainMeterMatchConfigStore");
                configObjectStore.add({ id: "config", ...defaultRainMeterConfig });
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
    return db.transaction("RainMeterMatchConfigStore", "readwrite");
}

function getROTransaction() {
    return db.transaction("RainMeterMatchConfigStore", "readonly");
}

type StoredRegExpPattern = RegExp | string | { source: string; flags?: string };

function reconstructRegExp(storedPattern: StoredRegExpPattern): RegExp {
    if (storedPattern instanceof RegExp) {
        return storedPattern;
    }
    
    // Handle cases where pattern is stored as an object with source and flags
    if (typeof storedPattern === 'object' && storedPattern.source) {
        return new RegExp(storedPattern.source, storedPattern.flags || '');
    }
    
    // Handle cases where pattern is stored as a string
    if (typeof storedPattern === 'string') {
        return new RegExp(storedPattern);
    }
    
    // Fallback - return a pattern that matches nothing
    console.warn('Could not reconstruct RegExp from:', storedPattern);
    return new RegExp('(?:)'); // matches empty string
}

export async function getRainMeterMatchConfig(): Promise<RainMeterMatchConfig> {
    if (!dbReady) {
        await initializeDB();
    }

    return new Promise<RainMeterMatchConfig>((resolve, reject) => {
        const transaction = getROTransaction();
        const objectStore = transaction.objectStore("RainMeterMatchConfigStore");
        const request = objectStore.get("config");

        request.onerror = (event) => {
            reject(new Error(`Failed to retrieve RainMeter match config ${event}`));
        };

        request.onsuccess = () => {
            if (request.result) {
                const rawConfig = request.result;
                // Reconstruct RegExp objects from stored data
                const config: RainMeterMatchConfig = {
                    workstation: {
                        ...rawConfig.workstation,
                        pattern: reconstructRegExp(rawConfig.workstation.pattern)
                    },
                    operatingSystem: {
                        ...rawConfig.operatingSystem,
                        pattern: reconstructRegExp(rawConfig.operatingSystem.pattern)
                    },
                    osVersion: {
                        ...rawConfig.osVersion,
                        pattern: reconstructRegExp(rawConfig.osVersion.pattern)
                    },
                    osBuild: {
                        ...rawConfig.osBuild,
                        pattern: reconstructRegExp(rawConfig.osBuild.pattern)
                    },
                    ipAddress: {
                        ...rawConfig.ipAddress,
                        pattern: reconstructRegExp(rawConfig.ipAddress.pattern)
                    },
                    macAddress: {
                        ...rawConfig.macAddress,
                        pattern: reconstructRegExp(rawConfig.macAddress.pattern)
                    }
                };
                resolve(config);
            } else {
                saveRainMeterMatchConfig(defaultRainMeterConfig);
                resolve(defaultRainMeterConfig);
            }
        };
    });
}

export async function saveRainMeterMatchConfig(config: RainMeterMatchConfig): Promise<void> {
    if (!dbReady) {
        await initializeDB();
    }

    return new Promise<void>((resolve, reject) => {
        const transaction = getRWTransaction();
        const objectStore = transaction.objectStore("RainMeterMatchConfigStore");
        const request = objectStore.put({ id: "config", ...config });

        request.onerror = () => {
            reject(new Error("Failed to save RainMeter match config"));
        };

        request.onsuccess = () => {
            resolve();
        };

    });
}

export async function setRegexForParameter(paramName: keyof RainMeterMatchConfig, regex: RegExp): Promise<void> {
    if (!dbReady) {
        await initializeDB();
    }

    // Get current config
    const currentConfig = await getRainMeterMatchConfig();
    
    // Update the specific parameter's pattern
    currentConfig[paramName] = {
        ...currentConfig[paramName],
        pattern: regex
    };

    // Save the updated config
    await saveRainMeterMatchConfig(currentConfig);
}

export async function setFieldsForParameter(paramName: keyof RainMeterMatchConfig, fields: string[]): Promise<void> {
    if (!dbReady) {
        await initializeDB();
    }

    // Get current config
    const currentConfig = await getRainMeterMatchConfig();
    
    // Update the specific parameter's fields
    currentConfig[paramName] = {
        ...currentConfig[paramName],
        fields: fields
    };

    // Save the updated config
    await saveRainMeterMatchConfig(currentConfig);
}

export async function resetParameterToDefault(paramName: keyof RainMeterMatchConfig): Promise<void> {
    if (!dbReady) {
        await initializeDB();
    }

    // Get current config
    const currentConfig = await getRainMeterMatchConfig();
    
    // Reset the specific parameter to its default value
    currentConfig[paramName] = { ...defaultRainMeterConfig[paramName] };

    // Save the updated config
    await saveRainMeterMatchConfig(currentConfig);
}