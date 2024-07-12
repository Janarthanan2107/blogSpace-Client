import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { domain } from "../constants/domain";

const BlogInteraction = () => {
    const { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper } = useContext(BlogContext);
    const { userAuth: { username, access_token } } = useContext(UserContext);
    const currentUrl = window.location.href;

    useEffect(() => {
        if (access_token) {
            axios.post(`${domain}/blog/notify/isLikedByUser`, { _id }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then((data) => {
                setIsLikedByUser(data.data.result);
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [access_token, _id, setIsLikedByUser]);

    const handleLikeFunc = () => {
        if (access_token) {
            const newIsLikedByUser = !isLikedByUser;
            setIsLikedByUser(newIsLikedByUser);
            const updatedLikes = newIsLikedByUser ? total_likes + 1 : total_likes - 1;
            setBlog({ ...blog, activity: { ...activity, total_likes: updatedLikes } });

            axios.post(domain + "/blog/notify/like", { _id, isLikedByUser }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(() => {
                // Successfully liked/unliked the post
            }).catch((err) => {
                console.error(err);
            });
        } else {
            toast.error("Please login to like the blog!");
        }
    };

    // opening the comment bar func
    const handleCommentFunc = () => {
        setCommentsWrapper(!commentsWrapper)
    }

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-6 items-center">
                    <button className={`w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "bg-red/20" : "bg-grey/80"}`} onClick={handleLikeFunc}>
                        <i className={`fi fi-${isLikedByUser ? "sr-heart text-red" : "rr-heart"}`}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={handleCommentFunc}>
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>

                <div className="flex gap-6 items-center">
                    {username === author_username && (
                        <Link to={`/editor/${blog_id}`} className="underline underline-offset-1 hover:text-purple">Edit</Link>
                    )}
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
