import { createContext, useEffect, useReducer } from "react";

const PostReducer = (state, action) => {
    switch (action.type) {
        case "SHOW": {
            return {
                currentPost: action.payload,
            };
        }
        default:
            return state;
    }
};

const INITIAL_STATE = {
    currentPost: JSON.parse(localStorage.getItem("post")) || null,
};

export const PostContext = createContext(INITIAL_STATE);

export const PostContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(PostReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("post", JSON.stringify(state.currentPost));
    }, [state.currentPost]);

    return (
        <PostContext.Provider value={{ currentPost: state.currentPost, dispatch }}>
            {children}
        </PostContext.Provider>
    );
};