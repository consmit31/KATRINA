"use client"
import React, { useState, useEffect } from 'react'
import { ShortcutConfig } from '@hooks/useKeyboardShortcuts'

interface ShortcutsModalProps {
  onClose: () => void;
}

const defaultShortcuts: ShortcutConfig[] = [
  {
    id: 'newTemplate',
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

const ShortcutsModal = ({ onClose }: ShortcutsModalProps) => {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([]);
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);
  const [ , setPendingKey] = useState<string>('');
  const [ , setPendingModifiers] = useState({
    ctrl: false,
    alt: false,
    shift: false,
  });

  useEffect(() => {
    // Load shortcuts from localStorage or use defaults
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
  }, []);

  const saveShortcuts = (newShortcuts: ShortcutConfig[]) => {
    localStorage.setItem('katrina-shortcuts', JSON.stringify(newShortcuts));
    setShortcuts(newShortcuts);
    // Dispatch a custom event to notify the main app of shortcut changes
    window.dispatchEvent(new CustomEvent('shortcuts-updated', { detail: newShortcuts }));
  };

  const handleKeyCapture = (event: React.KeyboardEvent, shortcutId: string) => {
    event.preventDefault();
    
    if (event.key === 'Escape') {
      setEditingShortcut(null);
      setPendingKey('');
      setPendingModifiers({ ctrl: false, alt: false, shift: false });
      return;
    }

    // Ignore modifier-only keys
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
      return;
    }

    const newKey = event.key.toLowerCase();
    const newModifiers = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };

    // Check for conflicts with existing shortcuts
    const conflictingShortcut = shortcuts.find(s => 
      s.id !== shortcutId && 
      s.currentKey === newKey && 
      s.ctrl === newModifiers.ctrl && 
      s.alt === newModifiers.alt && 
      s.shift === newModifiers.shift
    );

    if (conflictingShortcut) {
      alert(`This shortcut conflicts with "${conflictingShortcut.name}". Please choose a different combination.`);
      return;
    }

    // Update the shortcut
    const updatedShortcuts = shortcuts.map(shortcut =>
      shortcut.id === shortcutId
        ? {
            ...shortcut,
            currentKey: newKey,
            ctrl: newModifiers.ctrl,
            alt: newModifiers.alt,
            shift: newModifiers.shift,
          }
        : shortcut
    );

    saveShortcuts(updatedShortcuts);
    setEditingShortcut(null);
    setPendingKey('');
    setPendingModifiers({ ctrl: false, alt: false, shift: false });
  };

  const resetToDefaults = () => {
    saveShortcuts([...defaultShortcuts]);
  };

  const formatShortcut = (shortcut: ShortcutConfig) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    parts.push(shortcut.currentKey.toUpperCase());
    return parts.join(' + ');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-card rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-blue-600/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Keyboard Shortcuts</h2>
              <p className="text-sm text-muted-foreground">Customize your keyboard shortcuts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors focus-ring"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-card-foreground">{shortcut.name}</div>
                  <div className="text-sm text-muted-foreground">{shortcut.description}</div>
                </div>
                <div className="flex items-center space-x-3">
                  {editingShortcut === shortcut.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        className="w-32 px-3 py-2 text-sm border rounded-md focus-ring bg-background"
                        placeholder="Press keys..."
                        value="Press keys..."
                        readOnly
                        onKeyDown={(e) => handleKeyCapture(e, shortcut.id)}
                        autoFocus
                      />
                      <button
                        onClick={() => setEditingShortcut(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingShortcut(shortcut.id)}
                      className="px-3 py-2 text-sm font-mono bg-muted rounded-md hover:bg-accent transition-colors focus-ring"
                    >
                      {formatShortcut(shortcut)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Click on a shortcut to edit it. Press Escape to cancel.
          </div>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors focus-ring"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;