import { createContext, useEffect, useReducer } from "react";

const PropsReducer = (state, action) => {
    switch (action.type) {
        case "SEARCH": {
            return {
                currentProps: action.payload,
            };
        }
        default:
            return state;
    }
};

const INITIAL_STATE = {
    currentProps: JSON.parse(localStorage.getItem("props")) || null,
};

export const PropsContext = createContext(INITIAL_STATE);

export const PropsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(PropsReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("props", JSON.stringify(state.currentProps));
    }, [state.currentProps]);

    return (
        <PropsContext.Provider value={{ currentProps: state.currentProps, dispatch }}>
            {children}
        </PropsContext.Provider>
    );
};