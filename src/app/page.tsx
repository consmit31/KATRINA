import IssueSelector from "./components/IssueSelector"
import { FocusProvider } from "./components/FocusContext";

export default function Home() {
  

  return (
    <FocusProvider>
      <div className="h-full">
        <IssueSelector/>
      </div>
    </FocusProvider>
  );
}

