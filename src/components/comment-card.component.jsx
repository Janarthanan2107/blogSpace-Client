import { getDay } from "../common/date";

const CommentCard = ({ index, leftVal, commentData }) => {
    let { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment } = commentData;
    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border-grey">
                {/* commented by */}
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full" />
                    <p className=" line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>

                {/* comment */}
                <p className="font-inter text-xl ml-3">{comment}</p>

                {/* <div className="">

                </div> */}
            </div>
        </div>
    )
}


export default CommentCard