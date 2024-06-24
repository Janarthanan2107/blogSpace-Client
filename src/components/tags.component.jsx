import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ tag, tagIndex }) => {
    let { blog, blog: { tags }, setBlog } = useContext(EditorContext);

    const editable = (e) => {
        e.target.setAttribute("contentEditable", true);
        e.target.focus();
    }

    const editTag = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) { // enter key or comma key
            e.preventDefault();

            let currentTag = e.target.innerText.trim();
            tags[tagIndex] = currentTag;
            setBlog({ ...blog, tags: [...tags] });
            
            e.target.setAttribute("contentEditable", false);
        }
    };

    const deleteTag = (tagToDelete) => {
        const newTags = tags.filter(t => t !== tagToDelete);
        setBlog({ ...blog, tags: newTags });
    };

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
            <p className="outline-none" onKeyDown={editTag} onClick={editable}>{tag}</p>
            <button className="mx-1 rounded-full absolute right-2 top-1/2 -translate-y-1/2" onClick={() => deleteTag(tag)}>
                <i className="fi fi-br-cross text-[10px] pointer-event-none"></i>
            </button>
        </div>
    );
};

export default Tag;
