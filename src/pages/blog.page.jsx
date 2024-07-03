import axios from "axios";
import { Link, useParams } from "react-router-dom"
import { domain } from "../constants/domain";
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import { createContext } from "react";
import BlogPostCard from "../components/blog-post.component";

export const blogStruct = {
    title: "",
    des: "",
    content: "",
    author: {
        personal_info: {}
    },
    banner: "",
    publishAt: ""
}

export const BlogContext = createContext({});

const BlogPage = () => {

    let { blog_id } = useParams();

    // states
    const [blog, setBlog] = useState(blogStruct);
    const [similarBlogs, setSimilarBlogs] = useState(null)
    const [loading, setLoading] = useState(true)

    // destructure
    let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt, tags } = blog;

    const fetchBlog = () => {
        axios.post(domain + "/blog/getBlogs", { blog_id }).then(({ data: { blog } }) => {
            setBlog(blog)
            axios.post(domain + "/blog/searchBlogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id }).then(({ data: { blogs } }) => {
                setSimilarBlogs(blogs)
            })
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }).catch(err => {
            console.log(err.message)
            setLoading(false)
        })
    }

    useEffect(() => {
        resetStates();
        fetchBlog();
    }, [blog_id])

    const resetStates = () => {
        setBlog(blogStruct)
        setSimilarBlogs(null)
        setLoading(true)
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader />
                    :
                    <BlogContext.Provider value={{ blog, setBlog }}>
                        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                            <img src={banner} alt="banner" className=" aspect-video" />

                            <div className="mt-12">
                                <h2>{title}</h2>

                                <div className="flex max-sm:flex-col justify-between my-8">
                                    <div className=" flex gap-5 items-start">
                                        <img src={profile_img} alt="user-dp" className="w-12 h-12 rounded-full" />

                                        <p className=" capitalize">{fullname} <br /> @ <Link to={`/user/${author_username}`} className="underline underline-offset-1">{author_username}</Link></p>
                                    </div>
                                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)} </p>
                                </div>
                            </div>

                            <BlogInteraction />

                            {/* content */}
                            <div className="my-12 font-gelasio blog-page-content" dangerouslySetInnerHTML={{ __html: content }} />

                            <BlogInteraction />

                            {
                                similarBlogs !== null && similarBlogs.length ?
                                    <>
                                        <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                                        {
                                            similarBlogs.map((blog, i) => {

                                                let { author: { personal_info } } = blog;

                                                return (
                                                    <AnimationWrapper key={i} transition={{ duration: 1, delay: 1 }}>
                                                        <BlogPostCard content={blog} author={personal_info} />
                                                    </AnimationWrapper>
                                                )
                                            })
                                        }
                                    </> : <></>
                            }
                        </div>
                    </BlogContext.Provider>
            }
        </AnimationWrapper>
    )
}

export default BlogPage