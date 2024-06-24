import React, { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import PublishForm from "../components/publish-form.component";
import BlogEditor from "../components/blog-editor.component";

// blog structure
const blogStructure = {
    title: "",
    banner: "",
    content: "",
    tags: [],
    des: "",
    author: { personal_info: {} }
};

export const EditorContext = createContext({});

const Editor = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState("editor");
    const [textEditor, setTextEditor] = useState({ isReady: false });

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {access_token === null ? <Navigate to={"/"} /> : editorState === "editor" ? <BlogEditor /> : <PublishForm />}
        </EditorContext.Provider>
    );
};

export default Editor;
