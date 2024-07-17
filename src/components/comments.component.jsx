import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import { domain } from "../constants/domain";
import CommentCard from "./comment-card.component";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
    let res;

    await axios.post(domain + "/blog/comment/getComments", { blog_id, skip })
        .then(({ data }) => {
            // includes children level key in data for identify the parent (level = 0 ==> parent || level !== 0 ==> children)
            data.forEach(comment => {
                comment.childrenLevel = 0;
            });

            setParentCommentCountFun((prev) => {
                let preVal = prev || 0;
                let lengthVal = data.length;
                let newVal = preVal + lengthVal;
                return newVal;
            });

            if (comment_array == null) {
                res = { results: data };
            } else {
                res = { results: [...comment_array, ...data] };
            }
        })
        .catch((err) => {
            console.log(err.message);
            res = { results: comment_array || [] };
        });

    return res;
}

const CommentsContainer = () => {
    let { blog, blog: { _id, title, comments: { results: commentArr }, activity: { total_parent_comments } }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setBlog } = useContext(BlogContext);

    const handleCommentWrapperCloseFunc = () => {
        setCommentsWrapper(!commentsWrapper)
    }

    const handleLoadMore = async () => {
        let newCommentArr = await fetchComments({ skip: totalParentCommentsLoaded, blog_id: _id, setParentCommentCountFun: setTotalParentCommentsLoaded, comment_array: commentArr })

        setBlog({ ...blog, comments: newCommentArr })
    }

    return (
        <div className={"max-sm:w-full fixed " + (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>

            {/* heading and close button */}
            <div className=" relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>

                {/* button */}
                <button className=" absolute top-0 right-0 flex justify-center items-center w-10 h-10 rounded-full bg-grey" onClick={handleCommentWrapperCloseFunc}>
                    <i className="fi fi-br-cross text-md mt-1"></i>
                </button>
            </div>

            <hr className="border-grey my-8 w-[120%] -ml-10" />

            {/* text area to interact with blog */}
            <CommentField action="Comment" />

            {
                commentArr && commentArr.length ?
                    commentArr.map((comment, i) => {
                        return (
                            <AnimationWrapper key={i}>
                                <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                            </AnimationWrapper>
                        )
                    })
                    :
                    <NoDataMessage message={"No Comments"} />
            }

            {
                total_parent_comments > totalParentCommentsLoaded ?
                    <button className="text-dark-grey p-2 hover:bg-grey/30 rounded-md items-center gap-2" onClick={handleLoadMore}>Load more</button>
                    : ""
            }
        </div>
    );
};

export default CommentsContainer;
