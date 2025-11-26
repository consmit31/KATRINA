"use client";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

import IssueSelector from "./components/IssueSelector"
import TemplateForm from "./components/TemplateForm";
import NoteField from "./components/NoteField";
import NewTemplateModal from "./components/NewTemplateModal";

import { store } from "./redux/store";
import { useAppDispatch } from '@redux/hooks'
import { setActiveComponent } from '@redux/activeComponentSlice'
import { resetActiveTemplate } from '@redux/activeTemplateSlice';

import ToolsModal from "./components/ToolsModal";

function HomeContent() {
  const dispatch = useAppDispatch();

  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show New Template Modal on Ctrl+Y
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        setShowNewTemplateModal(prev => !prev);
      }

      // Show Tools Modal on Ctrl+T
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        setShowToolsModal(prev => !prev);
      }

      // Reset selected template on Ctrl+R
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        dispatch(resetActiveTemplate());
        dispatch(setActiveComponent("IssueSelector"));
      }

    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="h-full bg-background">
      {showNewTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <NewTemplateModal 
            onClose={() => setShowNewTemplateModal(false)}
          />
        </div>
      )}

      {showToolsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <ToolsModal
            onClose={() => setShowToolsModal(false)}
          />
        </div>
      )}
      
      <div className="h-full flex flex-col p-4 gap-4 max-w-7xl mx-auto">
        <div className="animate-fadeIn">
          <IssueSelector/>
        </div>
        
        <div className="flex flex-row lg:flex-row gap-4 flex-1 animate-slideInFromRight">
          <TemplateForm/>
          <NoteField/>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Provider store={store}>
      <HomeContent />
    </Provider>
  );
}

