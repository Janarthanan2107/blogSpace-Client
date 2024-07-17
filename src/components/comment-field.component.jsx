import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { domain } from "../constants/domain";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action }) => {
    let { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext)
    let { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext)
    // state for text area
    const [comment, setComment] = useState("")

    // handle submit button
    const handleCommentSubmit = () => {

        // validation weather user is logged in or not
        if (!access_token) {
            return toast.error("Login first to leave a comment")
        }

        if (!comment.length) {
            return toast.error("Write something to leave a comment...")
        }

        axios.post(domain + "/blog/comment/add",
            { _id, blog_author, comment },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data }) => {
                // console.log(data, "data");
                // reset comment box
                setComment("")

                data.commented_by = { personal_info: { username, fullname, profile_img } };

                let newCommentArr;

                // defining the comment level 
                data.childrenLevel = 0;

                newCommentArr = [data, ...commentsArr];

                let parentCommentIncrementLoaded = 1;

                // modifying the data struct of the blog getting from the api response
                // adding the result key in blog object

                setBlog({
                    ...blog,
                    comments: {
                        ...comments,
                        results: newCommentArr
                    },
                    activity: {
                        ...activity,
                        total_comments: total_comments + 1,
                        total_parent_comments: total_parent_comments + parentCommentIncrementLoaded
                    }
                })

                setTotalParentCommentsLoaded(prev => prev + parentCommentIncrementLoaded)

            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Toaster />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            ></textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleCommentSubmit}>{action}</button>
        </>
    )
}

export default CommentField;