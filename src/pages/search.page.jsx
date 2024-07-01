import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import { useEffect, useState } from "react";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import { domain } from "../constants/domain";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
    let { query } = useParams();

    const [blogs, setBlogs] = useState(null)
    const [users, setUsers] = useState(null)

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        try {
            axios
                .post(domain + "/blog/searchBlogs", { query, page })
                .then(async ({ data }) => {

                    let formattedData = await filterPaginationData({
                        state: blogs,
                        data: data.blogs,
                        page,
                        countRoute: "/blog/searchBlogsCount",
                        data_toSend: { query },
                        create_new_arr
                    });

                    setBlogs(formattedData);
                });
        } catch (error) {
            console.error("Error fetching latest blogs:", error.message);
        }
    };

    const fetchUsers = () => {
        axios.post(domain + "/blog/searchBlogUsers", { query })
            .then((data) => {
                // console.log(data.data.users)
                setUsers(data.data.users)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const resetState = () => {
        setBlogs(null)
        setUsers(null)
    }

    useEffect(() => {
        resetState()
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUsers()
    }, [query])


    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader /> :
                        users.length ?
                            users.map((user, i) => (
                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 1 }}>
                                    <UserCard user={user} />
                                </AnimationWrapper>
                            ))
                            : <NoDataMessage message={"No User Found"} />
                }
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation
                    routes={[`Search Results for "${query}"`, "Accounts Matched"]}
                    defaultHidden={["Accounts Matched"]}>
                    <>
                        {
                            blogs == null ? (
                                <Loader />
                            ) : (
                                blogs.results.length ?
                                    (blogs.results.map((blog, i) => {
                                        return (
                                            <AnimationWrapper key={i} transition={{ duration: 1, delay: 1 }}>
                                                <BlogPostCard content={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        )
                                    }))
                                    : <NoDataMessage message={"No data are published."} />
                            )}
                        <LoadMoreDataBtn state={blogs} fetchDataFunc={searchBlogs} />

                    </>

                    <UserCardWrapper />

                </InPageNavigation>
            </div>

            <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                <h1 className='font-medium text-xl mb-8'>
                    Users related to the search
                    <i className="fi fi-rr-user"></i>
                </h1>

                <UserCardWrapper />

            </div>
        </section>
    )
}

export default SearchPage