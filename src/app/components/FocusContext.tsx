"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import Issue from "../dataTypes/Issue";
import Template from "../dataTypes/Template";

/** Types */
interface FocusState {
    issues: Issue[];
    focusedIssueIndex: number;
    openIssue?: Issue;

    templates?: Template[];
    focusedTemplateIndex?: number;
}

type FocusAction =
    | {type: "INCREMENT_FOCUSED_ISSUE"}
    | {type: "DECREMENT_FOCUSED_ISSUE"}
    | {type: "SET_OPEN_ISSUE"}
    | {type: "CLOSE_OPEN_ISSUE"}
    | {type: "INCREMENT_FOCUSED_TEMPLATE"}
    | {type: "DECREMENT_FOCUSED_TEMPLATE"}
    | {type: "SELECT_TEMPLATE"}

/** Reducer */

const FocusReducer = (
    state: FocusState,
    action: FocusAction
): FocusState => {
    switch (action.type) {
        case "INCREMENT_FOCUSED_ISSUE":
            if (state.focusedIssueIndex < state.issues.length - 1) {
                return {...state, focusedIssueIndex: state.focusedIssueIndex + 1};
            }
            return state;

        case "DECREMENT_FOCUSED_ISSUE":
            if (state.focusedIssueIndex > 0) {
                return {...state, focusedIssueIndex: state.focusedIssueIndex - 1};
            }
            return state;

        case "SET_OPEN_ISSUE":
            if (state.openIssue && state.openIssue.name === state.issues[state.focusedIssueIndex].name) {
                return {...state, 
                        openIssue: undefined,
                        templates: undefined,
                        focusedTemplateIndex: undefined};
            } else {
                const openIssue: Issue = state.issues[state.focusedIssueIndex];
                const templates: Template[] = openIssue.templates;
                return {...state, 
                        openIssue: openIssue,
                        templates: templates,
                        focusedTemplateIndex: 0};
            }
        case "CLOSE_OPEN_ISSUE":
            return {...state,
                    openIssue: undefined,
                    templates: undefined,
                    focusedTemplateIndex: undefined};

        case "INCREMENT_FOCUSED_TEMPLATE":
            if (state.focusedTemplateIndex! < state.templates!.length - 1) {
                return {...state, focusedTemplateIndex: state.focusedTemplateIndex! + 1};
            }
            return state;
        
        case "DECREMENT_FOCUSED_TEMPLATE":
            if (state.focusedTemplateIndex! > 0) {
                return {...state, focusedTemplateIndex: state.focusedTemplateIndex! - 1};
            }
            return state;

        case "SELECT_TEMPLATE":
            if (state.templates == undefined) {
                console.error("Templates not defined");
                return state;
            } 

            if (state.focusedTemplateIndex == undefined) {
                console.error("Focused Template Index not defined");
                return state;
            }

            const template: Template = state.templates[state.focusedTemplateIndex];
            console.log(`Selected template: ${template.name}`)
            return state;
        default:
            return state
    }
};

/** Context */

const FocusContext = createContext<{
    state: FocusState;
    dispatch: React.Dispatch<FocusAction>;
} | undefined>(undefined);

/** Provider */

export const FocusProvider = ({ children }: {children: React.ReactNode }) => {
    const initialState: FocusState = {
        issues: [
            {
                name: "Mi.gov",
                templates: [
                    {name: "MiLogin: PW", content: ""},
                    {name: "MiLogin: Dupe. Acct", content: ""},
                    {name: "MiLogin: Inac. Acct", content: ""}
                ]
            },
            {
                name: "Windows",
                templates: [
                    {name: "Locked account", content: ""},
                    {name: "Password reset", content: ""}
                ]
            }
        ],
        focusedIssueIndex: 0,
    };



    const [state, dispatch] = useReducer(FocusReducer, initialState);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "k":
                    // Move focus index up
                    e.preventDefault();
                    if (state.openIssue != undefined) {
                        dispatch({type: "DECREMENT_FOCUSED_TEMPLATE"});
                    } else {
                        dispatch({ type: "DECREMENT_FOCUSED_ISSUE" });
                    }
                    
                    break;
                case "j":
                    // Move focus index down
                    e.preventDefault();
                    if (state.openIssue != undefined) {
                        dispatch({ type: "INCREMENT_FOCUSED_TEMPLATE" });
                    } else {
                        dispatch({ type: "INCREMENT_FOCUSED_ISSUE" });
                    }
                    break;
                case "Enter":
                    e.preventDefault();
                    if (e.shiftKey) {
                        dispatch({ type: "CLOSE_OPEN_ISSUE" });
                    } else if (!state.openIssue) {
                        dispatch({ type: "SET_OPEN_ISSUE" });
                    } else {
                        dispatch({type: "SELECT_TEMPLATE"});
                    }
                   
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [state.focusedIssueIndex, state.openIssue]);

    return (
        <FocusContext.Provider value={{ state, dispatch }}>
            {children}
        </FocusContext.Provider>
    );
};

/** Hook */
export const useFocusContext = () => {
    const context = useContext(FocusContext);
    if (!context) {
        throw new Error("useFocusContext must be used within FocusProvider")
    }
    return context;
}