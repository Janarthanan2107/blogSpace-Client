import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import PublishForm from "../components/publish-form.component";
import BlogEditor from "../components/blog-editor.component";
import Loader from "../components/loader.component";
import axios from "axios";
import { domain } from "../constants/domain";

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
    let { id: blog_id } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState("editor");
    const [textEditor, setTextEditor] = useState({ isReady: false });
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!blog_id) {
            return setLoading(false);
        }

        axios.post(domain + "/blog/getBlogs", { blog_id, draft: true, mode: 'true' }).then(({ data: { blog } }) => {
            setBlog(blog)
            setLoading(false)
        }).catch(err => {
            setBlog(blogStructure)
            setLoading(false)
        })

    }, [])

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor, blog_id }}>
            {access_token === null ? <Navigate to={"/"} /> : loading ? <Loader /> : editorState === "editor" ? <BlogEditor /> : <PublishForm />}
        </EditorContext.Provider>
    );
};

export default Editor;
