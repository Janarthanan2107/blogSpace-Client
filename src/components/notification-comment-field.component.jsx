import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { domain } from '../constants/domain'
import axios from 'axios'
import { UserContext } from '../App'

const NotificationCommentField = ({ _id, blog_author, index = undefined, replyingTo = undefined, setReplying, notification_id, notificationData }) => {

    let [comment, setComment] = useState('')

    let { _id: user_id } = blog_author
    let { userAuth: { access_token } } = useContext(UserContext);
    let { notifications, notifications: { results }, setNotifications } = notificationData


    const handleCommentSubmit = () => {
        console.log("Clicked");

        if (!comment.length) {
            return toast.error("Write something to leave a comment...")
        }

        axios.post(domain + "/blog/comment/add",
            { _id, blog_author: user_id, comment, "replying_to": replyingTo, notification_id },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data }) => {
                // console.log(data);
                setReplying(false);

                results[index].reply = { comment, _id: data._id }

                setNotifications({ ...notifications, results })
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
            <button className="btn-dark mt-5 px-10" onClick={handleCommentSubmit}>Reply</button>
        </>
    )
}

export default NotificationCommentField