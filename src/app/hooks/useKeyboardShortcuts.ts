import { useState, useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
}

const defaultShortcuts: ShortcutConfig[] = [
  {
    id: 'newTemplateModal',
    name: 'New Template Modal',
    description: 'Open the new template creation modal',
    defaultKey: 'y',
    currentKey: 'y',
    ctrl: true,
    alt: false,
    shift: false,
  },
  {
    id: 'toolsModal',
    name: 'Tools Modal',
    description: 'Open the tools and utilities modal',
    defaultKey: 't',
    currentKey: 't',
    ctrl: true,
    alt: false,
    shift: false,
  },
  {
    id: 'automationModal',
    name: 'Automation Modal',
    description: 'Open the automation settings modal',
    defaultKey: 'a',
    currentKey: 'a',
    ctrl: true,
    alt: false,
    shift: false,
  },
  {
    id: 'resetTemplate',
    name: 'Reset Template',
    description: 'Reset the currently selected template',
    defaultKey: 'r',
    currentKey: 'r',
    ctrl: true,
    alt: false,
    shift: false,
  },
];

export const useKeyboardShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([]);

  useEffect(() => {
    // Load shortcuts from localStorage or use defaults
    const loadShortcuts = () => {
      const savedShortcuts = localStorage.getItem('katrina-shortcuts');
      if (savedShortcuts) {
        try {
          setShortcuts(JSON.parse(savedShortcuts));
        } catch {
          setShortcuts([...defaultShortcuts]);
        }
      } else {
        setShortcuts([...defaultShortcuts]);
      }
    };

    loadShortcuts();

    // Listen for shortcut updates
    const handleShortcutsUpdate = (event: CustomEvent) => {
      setShortcuts(event.detail);
    };

    window.addEventListener('shortcuts-updated', handleShortcutsUpdate as EventListener);

    return () => {
      window.removeEventListener('shortcuts-updated', handleShortcutsUpdate as EventListener);
    };
  }, []);

  const getShortcut = useCallback((id: string) => {
    return shortcuts.find(shortcut => shortcut.id === id);
  }, [shortcuts]);

  const matchesShortcut = useCallback((event: KeyboardEvent, id: string): boolean => {
    const shortcut = getShortcut(id);
    if (!shortcut) return false;

    return (
      event.key.toLowerCase() === shortcut.currentKey.toLowerCase() &&
      event.ctrlKey === shortcut.ctrl &&
      event.altKey === shortcut.alt &&
      event.shiftKey === shortcut.shift
    );
  }, [getShortcut]);

  const formatShortcut = useCallback((id: string): string => {
    const shortcut = getShortcut(id);
    if (!shortcut) return 'N/A';

    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    parts.push(shortcut.currentKey.toUpperCase());
    return parts.join(' + ');
  }, [getShortcut]);

  return {
    shortcuts,
    getShortcut,
    matchesShortcut,
    formatShortcut,
  };
};