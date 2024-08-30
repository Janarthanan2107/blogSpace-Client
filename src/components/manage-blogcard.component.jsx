import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../common/date'
import { UserContext } from '../App'
import { domain } from '../constants/domain';
import axios from 'axios';


const BlogStats = ({ stats }) => {
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
            {
                Object.keys(stats).map((info, i) => {
                    return !info.includes('parent') ? <div className={`flex flex-col items-center w-full h-full justify-center p-4 px-6 ${i !== 0 ? "border-l border-grey" : ""}`} key={i}>
                        <h1 className="text-xl lg:text-2xl mb-2">{stats[info].toLocaleString()}</h1>
                        <p className='max-lg:text-dark-grey capitalize'>{info.split("_")[1]}</p>
                    </div> : ""
                })
            }
        </div>
    )
}

const blogDelete = (blog, access_token, target) => {
    let { index, blog_id, setStateFun } = blog;

    target.setAttribute("disabled", true);

    axios.post(domain + "/blog/deleteUserWrittenBlog", { blog_id }, { headers: { 'Authorization': `Bearer ${access_token}` } })
        .then((data) => {
            target.removeAttribute("disabled")

            setStateFun(prev => {
                let { deletedDocCount, totalDocs, results } = prev;

                results.splice(index, 1);
                
                if (!deletedDocCount) {
                    deletedDocCount = 0;
                }


                if (!results.length && totalDocs - 1 > 0) {
                    return null
                }

                return { ...prev, totalDocs: totalDocs - 1, deletedDocCount: deletedDocCount + 1 }
            })
        })
        .catch(err => {
            console.log(err);
        })
}

export const ManagePublishedBlogCard = ({ blog }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    let { banner, blog_id, title, publishedAt, activity, index, setStateFun } = blog;

    const [showStats, setShowStats] = useState(false);

    return (
        <>
            <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
                <img src={banner} alt="banner" className='max-md:hidden lg:hidden xl:block w-32 h-32 flex-none bg-grey object-cover rounded-sm' />

                <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                    <div>
                        <Link to={`/blog/${blog_id}`} className='text-[17px] font-medium hover:underline'>{title}</Link>

                        <p className='text-dark-grey line-clamp-1'>Published on {getDay(publishedAt)}</p>
                    </div>

                    <div className='flex gap-6 mt-3'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 underline underline-offset-2'>Edit</Link>

                        <button className='lg:hidden pr-4 py-2 underline underline-offset-2' onClick={() => { setShowStats(!showStats) }}>Stats</button>

                        <button className='text-red pr-4 py-2 underline underline-offset-2' onClick={(e) => blogDelete(blog, access_token, e.target)}>Delete</button>
                    </div>
                </div>

                <div className='max-lg:hidden'>
                    <BlogStats stats={activity} />
                </div>
            </div >

            {
                showStats ? <div>
                    < BlogStats stats={activity} />
                </div > : ""
            }
        </>

    )
}

export const ManageDraftBlogCard = ({ blog }) => {
    const { userAuth: { access_token } } = useContext(UserContext);
    let { banner, blog_id, title, publishedAt, des, index, setStateFun } = blog;

    return (
        <>
            <div className='flex gap-5 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>

                <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>
                    {
                        index < 10 ? "0" + (index + 1) : index
                    }
                </h1>

                <img src={banner} alt="banner" className='max-md:hidden lg:hidden xl:block w-32 h-32 flex-none bg-grey object-cover rounded-sm' />

                <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                    <div>
                        <Link to={`/blog/${blog_id}`} className='text-[17px] font-medium hover:underline'>{title}</Link>
                        {/* <p className='text-dark-grey line-clamp-2 text-[13px]'>{des.length ? des : "No Description"}</p> */}
                        <p className='text-dark-grey/50 line-clamp-1 text-[12px] mt-2'>Published on {getDay(publishedAt)}</p>
                    </div>
                    <div className='flex gap-6 mt-3'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 underline underline-offset-2'>Edit</Link>

                        <button className='text-red pr-4 py-2 underline underline-offset-2' onClick={(e) => blogDelete(blog, access_token, e.target)}>Delete</button>
                    </div>
                </div>

            </div>
        </>

    )
}