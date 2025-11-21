// "use client";

// import { createContext, useContext, useEffect, useReducer } from "react";
// import Issue from "../dataTypes/Issue";
// import Template from "../dataTypes/Template";
// import compileTemplate from "../utils/compileTemplate";

// /** Types */
// interface FocusState {
//     focusedComponent: "IssueSelector" | "TemplateForm" | "NoteField";

//     issues: Issue[];
//     focusedIssueIndex: number;
//     openIssue?: Issue;

//     templates?: Template[];
//     focusedTemplateIndex?: number;
//     selectedTemplate?: Template;

//     focusedFieldIndex?: number;

//     templateFormValues?: { [fieldLabel: string]: string };
//     compiledTemplateText?: string;

//     noteText?: string;
// }

// type FocusAction =
//     | {type: "SET_FOCUSED_COMPONENT", component: "IssueSelector" | "TemplateForm"}
//     | {type: "INCREMENT_FOCUSED_ISSUE"}
//     | {type: "DECREMENT_FOCUSED_ISSUE"}
//     | {type: "SET_OPEN_ISSUE"}
//     | {type: "CLOSE_OPEN_ISSUE"}
//     | {type: "INCREMENT_FOCUSED_TEMPLATE"}
//     | {type: "DECREMENT_FOCUSED_TEMPLATE"}
//     | {type: "SELECT_TEMPLATE"}
//     | {type: "CLEAR_FORM"}
//     | {type: "DECREMENT_FOCUSED_FIELD"}
//     | {type: "INCREMENT_FOCUSED_FIELD"}
//     | {type: "SET_TEMPLATE_FIELD_VALUE", fieldLabel: string, value: string}
//     | {type: "SUBMIT_TEMPLATE_FORM"}
//     | {type: "SET_NOTE_TEXT", text: string};

// /** Reducer */

// const FocusReducer = (
//     state: FocusState,
//     action: FocusAction
// ): FocusState => {
//     switch (action.type) {
//         case "SET_FOCUSED_COMPONENT":
//             return {...state, focusedComponent: action.component};

//         case "INCREMENT_FOCUSED_ISSUE":
//             if (state.focusedIssueIndex < state.issues.length - 1) {
//                 return {...state, focusedIssueIndex: state.focusedIssueIndex + 1};
//             }
//             return state;

//         case "DECREMENT_FOCUSED_ISSUE":
//             if (state.focusedIssueIndex > 0) {
//                 return {...state, focusedIssueIndex: state.focusedIssueIndex - 1};
//             }
//             return state;

//         case "SET_OPEN_ISSUE":
//             if (state.openIssue && state.openIssue.name === state.issues[state.focusedIssueIndex].name) {
//                 return {...state, 
//                         openIssue: undefined,
//                         templates: undefined,
//                         focusedTemplateIndex: undefined};
//             } else {
//                 const openIssue: Issue = state.issues[state.focusedIssueIndex];
//                 const templates: Template[] = openIssue.templates;
//                 return {...state, 
//                         openIssue: openIssue,
//                         templates: templates,
//                         focusedTemplateIndex: 0};
//             }
//         case "CLOSE_OPEN_ISSUE":
//             return {...state,
//                     openIssue: undefined,
//                     templates: undefined,
//                     focusedTemplateIndex: undefined,
//                     focusedComponent: "IssueSelector",
//                     selectedTemplate: undefined,
//                     focusedFieldIndex: undefined,
//                     templateFormValues: undefined,
//                     compiledTemplateText: undefined
//                 };

//         case "INCREMENT_FOCUSED_TEMPLATE":
//             if (state.focusedTemplateIndex! < state.templates!.length - 1) {
//                 return {...state, focusedTemplateIndex: state.focusedTemplateIndex! + 1};
//             }
//             return state;
        
//         case "DECREMENT_FOCUSED_TEMPLATE":
//             if (state.focusedTemplateIndex! > 0) {
//                 return {...state, focusedTemplateIndex: state.focusedTemplateIndex! - 1};
//             }
//             return state;

//         case "SELECT_TEMPLATE":
//             if (state.templates == undefined) {
//                 console.error("Templates not defined");
//                 return state;
//             } 

//             if (state.focusedTemplateIndex == undefined) {
//                 console.error("Focused Template Index not defined");
//                 return state;
//             }

//             const template: Template = state.templates[state.focusedTemplateIndex];
//             return {...state,
//                     selectedTemplate: template,
//                     focusedComponent: "TemplateForm",
//                     openIssue: undefined,
//                     focusedFieldIndex: 0
//                 };

//         case "INCREMENT_FOCUSED_FIELD":
//             if (state.focusedFieldIndex! < state.selectedTemplate!.fields.length - 1) {
//                 return {...state, focusedFieldIndex: state.focusedFieldIndex! + 1};
//             }
//             return state;

//         case "DECREMENT_FOCUSED_FIELD":
//             if (state.focusedFieldIndex! > 0) {
//                 return {...state, focusedFieldIndex: state.focusedFieldIndex! - 1};
//             }
//             return state;


//         case "SET_TEMPLATE_FIELD_VALUE":
//             const { fieldLabel, value } = action;
//             return {
//                 ...state,
//                 templateFormValues: {
//                     ...state.templateFormValues,
//                     [fieldLabel]: value
//                 }
//             };

//         case "SUBMIT_TEMPLATE_FORM":
//             if (!state.selectedTemplate) {
//                 console.error("No template selected");
//                 return state;
//             }

//             if (!state.templateFormValues) {
//                 console.error("No template form values");
//                 return state;
//             }

//             const compiledTemplate = compileTemplate(state.selectedTemplate, state.templateFormValues);
//             return {
//                 ...state,
//                 compiledTemplateText: compiledTemplate,
//                 focusedComponent: "NoteField"
//             };

//         default:
//             return state
//     }
// };

// /** Context */

// const FocusContext = createContext<{
//     state: FocusState;
//     dispatch: React.Dispatch<FocusAction>;
// } | undefined>(undefined);

// /** Provider */

// export const FocusProvider = ({ children }: {children: React.ReactNode }) => {
//     const initialState: FocusState = {
//         issues: [
//             {
//                 name: "Mi.gov",
//                 templates: [
//                     {
//                         name: "MiLogin: PW",
//                         kba: "KBA123",
//                         fields: [
//                             { 
//                                 type: 'text',
//                                 label: "Username", 
//                                 allowCustom: true,
//                             },
//                             { 
//                                 type: 'selector',
//                                 label: "Password", 
//                                 options: ["password", "text", "email"],
//                                 allowCustom: false
//                             },
//                         ]
//                     },
//                     {
//                         name: "MiLogin: Dupe. Acct",
//                         kba: "KBA124",
//                         fields: [
//                             {
//                                 type: 'text',
//                                 label: "Username",
//                                 allowCustom: true,
//                             },
//                             {
//                                 type: 'selector',
//                                 label: "Password", options: ["password"], allowCustom: false }
//                         ]
//                     },
//                     {
//                         name: "MiLogin: Inac. Acct",
//                         kba: "KBA125",
//                         fields: [
//                             {
//                                 type: 'text',
//                                 label: "Username",
//                                 allowCustom: true,
//                             },
//                             {
//                                 type: 'selector',
//                                 label: "Password", options: ["password"], allowCustom: false
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name: "Windows",
//                 templates: [
//                     {
//                         name: "Locked account",
//                         kba: "KBA126",
//                         fields: [
//                             {
//                                 type: 'text',
//                                 label: "Username",
//                                 options: ["text"],
//                                 allowCustom: true
//                             },
//                             {
//                                 type: 'selector',
//                                 label: "Password",
//                                 options: ["password"],
//                                 allowCustom: false
//                             }
//                         ]
//                     },
//                     {
//                         name: "Password reset",
//                         kba: "KBA127",
//                         fields: [
//                             {
//                                 type: 'text',
//                                 label: "Username",
//                                 options: ["text"],
//                                 allowCustom: true
//                             },
//                             {
//                                 type: 'selector',
//                                 label: "Password",
//                                 options: ["password"],
//                                 allowCustom: false
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
// ,
//         focusedIssueIndex: 0,
//         focusedComponent: "IssueSelector"
//     };



//     const [state, dispatch] = useReducer(FocusReducer, initialState);

//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             switch (e.key) {
//                 case "Tab":
//                     if (e.shiftKey) {
//                         // Move focus index up; Previous item
//                         e.preventDefault();

//                         // Previous issue if no issue is open and focused component is issue selector
//                         if (state.openIssue === undefined && state.focusedComponent === "IssueSelector") {
//                             dispatch({ type: "DECREMENT_FOCUSED_ISSUE" });
//                             break;
//                         }

//                         // Previous template if issue is open and focused component is issue selector
//                         if (state.openIssue !== undefined && state.focusedComponent === "IssueSelector") {
//                             dispatch({ type: "DECREMENT_FOCUSED_TEMPLATE" });
//                             break;
//                         }

//                         // Previous field if template is selected and focus is on template form
//                         if (state.selectedTemplate !== undefined && state.focusedComponent !== "IssueSelector") {
//                             dispatch({ type: "DECREMENT_FOCUSED_FIELD" });
//                             break;
//                         }

//                     }

//                     // Move focus index up; Next item
//                     e.preventDefault();

//                     // Next issue if no issue is open and focused component is issue selector
//                     if (state.openIssue === undefined && state.focusedComponent === "IssueSelector") {
//                         console.log("Incrementing focused issue index");
//                         dispatch({ type: "INCREMENT_FOCUSED_ISSUE" });
//                         break;
//                     }

//                     // Next template if issue is open and focused component is issue selector
//                     if (state.openIssue !== undefined && state.focusedComponent === "IssueSelector") {
//                         console.log("Incrementing focused template index");
//                         dispatch({ type: "INCREMENT_FOCUSED_TEMPLATE" });
//                         break;
//                     }

//                     // Next field if template is selected and focus is not on issue selector
//                     if (state.selectedTemplate !== undefined && state.focusedComponent === "TemplateForm") {
//                         dispatch({ type: "INCREMENT_FOCUSED_FIELD" });
//                         break;
//                     }

                    
//                     break;
//                 case "Enter":
//                     if (state.focusedComponent === "NoteField") {
//                         console.log("Enter key pressed while focused on note field")
//                         e.preventDefault();
//                     }

//                     if (e.shiftKey) {
//                         dispatch({ type: "CLOSE_OPEN_ISSUE" });
//                     } else if (!state.openIssue && state.focusedComponent === "IssueSelector") {
//                         dispatch({ type: "SET_OPEN_ISSUE" });
//                     } else if (state.openIssue && state.focusedComponent === "IssueSelector") {
//                         dispatch({type: "SELECT_TEMPLATE"});
//                     } else if (state.selectedTemplate && state.focusedComponent === "TemplateForm") {
//                         dispatch({type: "SUBMIT_TEMPLATE_FORM"});
//                     }
//                     break;
//             }
//         }

//         window.addEventListener("keydown", handleKeyDown);
//         return () => {
//             window.removeEventListener("keydown", handleKeyDown);
//         }
//     }, [state.focusedIssueIndex, state.openIssue]);

//     return (
//         <FocusContext.Provider value={{ state, dispatch }}>
//             {children}
//         </FocusContext.Provider>
//     );
// };

// /** Hook */
// export const useFocusContext = () => {
//     const context = useContext(FocusContext);
//     if (!context) {
//         throw new Error("useFocusContext must be used within FocusProvider")
//     }
//     return context;
// }