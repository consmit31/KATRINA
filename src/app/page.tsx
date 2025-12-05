"use client";
import { Provider } from "react-redux";
import { useEffect, useRef } from "react";

import IssueSelector from "@components/IssueSelector/IssueSelector"
import TemplateForm from "@components/TemplateForm/TemplateForm";
import NoteField from "@components/NoteField/NoteField";
import NewTemplateModal from "@components/NewTemplateModal/NewTemplateModal";
import ContactInfo, { ContactInfoRef } from "@components/ContactInfo/ContactInfo";
import AutomationModal from "@components/AutomationModal/AutomationModal";

import { store } from "@redux/store";
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { setActiveComponent } from '@redux/activeComponentSlice'
import { resetActiveTemplate } from '@redux/activeTemplateSlice';
import { clearContactInfo } from '@redux/contactInformationSlice';
import { 
  toggleNewTemplateModal, 
  toggleToolsModal, 
  toggleAutomationModal,
  closeNewTemplateModal, 
  closeToolsModal,
  closeAutomationModal,
  selectIsNewTemplateModalOpen,
  selectIsToolsModalOpen,
  selectIsAutomationModalOpen,
  selectTemplateToCopy
} from '@redux/modalSlice';

import ToolsModal from "@components/ToolsModal/ToolsModal";
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';

function HomeContent() {
  const dispatch = useAppDispatch();
  const { matchesShortcut } = useKeyboardShortcuts();
  const contactInfoRef = useRef<ContactInfoRef>(null);

  // Redux selectors
  const showNewTemplateModal = useAppSelector(selectIsNewTemplateModalOpen);
  const showToolsModal = useAppSelector(selectIsToolsModalOpen);
  const showAutomationModal = useAppSelector(selectIsAutomationModalOpen);
  const templateToCopy = useAppSelector(selectTemplateToCopy);

  const handleCloseNewTemplateModal = () => {
    dispatch(closeNewTemplateModal());
  };

  const handleCloseToolsModal = () => {
    dispatch(closeToolsModal());
  };

  const handleCloseAutomationModal = () => {
    dispatch(closeAutomationModal());
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show New Template Modal
      if (matchesShortcut(event, 'newTemplate')) {
        event.preventDefault();
        dispatch(toggleNewTemplateModal());
      }

      // Show Tools Modal
      if (matchesShortcut(event, 'toolsModal')) {
        event.preventDefault();
        dispatch(toggleToolsModal());
      }

      // Show Automation Modal
      if (matchesShortcut(event, 'automationModal')) {
        event.preventDefault();
        dispatch(toggleAutomationModal());
      }

      // Reset selected template
      if (matchesShortcut(event, 'resetTemplate')) {
        event.preventDefault();
        dispatch(resetActiveTemplate());
        dispatch(clearContactInfo());
        contactInfoRef.current?.resetFields();
        dispatch(setActiveComponent("IssueSelector"));
      }

    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, matchesShortcut]);

  return (
    <div className="h-full bg-background">
      {showNewTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <NewTemplateModal 
            onClose={handleCloseNewTemplateModal}
            copyFromTemplate={templateToCopy}
          />
        </div>
      )}

      {showToolsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <ToolsModal
            onClose={handleCloseToolsModal}
          />
        </div>
      )}

      {showAutomationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <AutomationModal
            onClose={handleCloseAutomationModal}
          />
        </div>
      )}

      <div className="h-full flex flex-col p-4 gap-4 max-w-7xl mx-auto">
        <div className="animate-fadeIn">
          <ContactInfo ref={contactInfoRef}/> 
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

