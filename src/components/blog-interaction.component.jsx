import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const BlogInteraction = () => {
    let { blog, blog: { title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog } = useContext(BlogContext);
    let { userAuth: { username } } = useContext(UserContext);

    const currentUrl = window.location.href;

    return (
        <>
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-6 items-center">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className="fi fi-rr-heart"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>

                <div className="flex gap-6 items-center">

                    {
                        username == author_username ? <Link to={`/editor/${blog_id}`} className="underline underline-offset-1 hover:text-purple">Edit</Link> : ""
                    }

                    <a href={`https://twitter.com/intent/tweet?text=read ${title} ${currentUrl}`} target="_blank" rel="noopener noreferrer">
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`} target="_blank" rel="noopener noreferrer">
                        <i className="fi fi-brands-linkedin text-xl hover:text-linkedin"></i>
                    </a>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    );
}

export default BlogInteraction;
