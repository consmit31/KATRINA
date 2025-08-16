import IssueSelector from "./components/IssueSelector"
import { FocusProvider } from "./components/FocusContext";
import TemplateForm from "./components/TemplateForm";

export default function Home() {
  

  return (
    <FocusProvider>
      <div className="h-full">
        <IssueSelector/>
        <span className="w-full">
          <TemplateForm/>
        </span>
      </div>
    </FocusProvider>
  );
}

