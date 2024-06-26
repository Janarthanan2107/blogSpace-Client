import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation, { activeTabRefs } from '../components/inpage-navigation.component'
import axios from 'axios'
import { domain } from '../constants/domain'
import Loader from '../components/loader.component'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'
import NoDataMessage from '../components/nodata.component'

const Home = () => {

    const [blogs, setBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageState, setPageState] = useState("home")

    let categories = [
        "programming",
        "hollywood",
        "film making",
        "anime",
        "hokage",
        "naruto",
        "social media",
        "teach"
    ];

    // all blogs
    const fetchLatestBlogs = async () => {
        try {
            const res = await axios.get(domain + "/blog/latestBlogs");
            const data = res.data.blogs;
            // console.log(data)
            setBlogs(data)
            console.log("blogs loaded")
        } catch (error) {
            console.error("Error fetching latest blogs:", error.message);
        }
    };

    // trending blogs
    const fetchTrendingBlogs = async () => {
        try {
            const res = await axios.get(domain + "/blog/trendingBlogs");
            const data = res.data.blogs;
            // console.log(data)
            setTrendingBlogs(data)
            console.log("trending blogs loaded")
        } catch (error) {
            console.error("Error fetching latest blogs:", error.message);
        }
    };

    // search by category
    const fetchBlogsByCategory = async () => {
        try {
            const res = await axios.post(domain + "/blog/searchBlogs", { tag: pageState });
            const data = res.data.blogs;
            // console.log(data)
            setBlogs(data)
            console.log("search blogs loaded")
        } catch (error) {
            console.error("Error fetching latest blogs:", error.message);
        }
    };

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setBlogs(null)

        if (pageState == category) {
            setPageState("home");
            return;
        }

        setPageState(category)
    }

    useEffect(() => {
        console.log("Loading....")

        if (activeTabRefs.current && activeTabRefs.current[0]) {
            activeTabRefs.current[0].click();
        }

        if (pageState == "home") {
            fetchLatestBlogs();
        } else {
            fetchBlogsByCategory()
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
    }, [pageState]);

    // console.log(blogs, "blogs")
    // console.log(trendingBlogs, "trending blogs")

    return (
        <AnimationWrapper>
            <section className='h-cover flex justify-center gap-10'>
                {/* latest blog */}
                <div className='w-full'>
                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
                        {/* latest blog */}
                        <>
                            {
                                blogs == null ? (
                                    <Loader />
                                ) : (
                                    blogs.length ?
                                        (blogs.map((blog, i) => {
                                            return (
                                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 1 }}>
                                                    <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                </AnimationWrapper>
                                            )
                                        })) : <NoDataMessage message={"No data are published."} />
                                )
                            }

                        </>

                        <>
                            {/* trending blogs and tags */}
                            {
                                trendingBlogs == null ? (
                                    <Loader />
                                ) : (
                                    trendingBlogs.length ? (
                                        trendingBlogs.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 1 }}>
                                                <MinimalBlogPost blog={blog} index={i} />
                                            </AnimationWrapper>
                                        })) : <NoDataMessage message={"No data are published."} />
                                )
                            }
                        </>

                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <div className='flex flex-col gap-10 mb-3'>
                        {/* filter */}
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Stories from all interests</h1>

                            <div className='flex gap-3 flex-wrap'>
                                {
                                    categories.map((item, i) => {
                                        return <button key={i} className={`tag ${pageState == item ? "bg-black text-white" : " "}`} onClick={loadBlogByCategory}>{item}</button>;
                                    })
                                }
                            </div>
                        </div>
                        {/* trending blog */}
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Trending{" "}<i className='fi fi-rr-arrow-trend-up'></i></h1>
                            {
                                trendingBlogs == null ? (
                                    <Loader />
                                ) : (
                                    trendingBlogs.length ? (
                                        trendingBlogs.map((blog, i) => {
                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 1 }}>
                                                <MinimalBlogPost blog={blog} index={i} />
                                            </AnimationWrapper>
                                        })) : <NoDataMessage message={"No data are published."} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Home