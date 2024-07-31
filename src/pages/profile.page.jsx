import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { domain } from "../constants/domain";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import NotFound from "./404.page";

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        email: "",
        username: "",
        profile_img: "",
        bio: ""
    },
    social_links: {
        youtube: "",
        instagram: "",
        facebook: "",
        twitter: "",
        github: "",
        website: ""
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    joinedAt: "",
    __v: 0
};

const ProfilePage = () => {
    const { id: profileId } = useParams();
    const { userAuth: { username } } = useContext(UserContext);

    const [profile, setProfile] = useState(profileDataStructure);
    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState("");
    const [notFound, setNotFound] = useState(false); // State for not found

    const fetchUserProfile = async () => {
        setLoading(true);
        setNotFound(false); // Reset not found state
        try {
            const { data: user } = await axios.post(`${domain}/getUserProfile`, { username: profileId });
            if (user) {
                setProfile(user);
                setProfileLoaded(profileId);
                fetchBlogs({ userId: user._id });
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error.message);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogs = async ({ page = 1, userId }) => {
        const currentUserId = userId || blogs?.userId;
        try {
            const { data } = await axios.post(`${domain}/blog/searchBlogs`, { page, author: currentUserId });
            const formattedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/blog/searchBlogsCount",
                data_toSend: { author: currentUserId, page }
            });
            formattedData.userId = currentUserId;
            setBlogs(formattedData);
        } catch (error) {
            console.error("Error fetching blogs:", error.message);
        }
    };

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
        if (!blogs) {
            resetProfile();
            fetchUserProfile();
        }
    }, [profileId, blogs]);

    const resetProfile = () => {
        setProfile(profileDataStructure);
        setLoading(false);
        setProfileLoaded("");
    };

    if (notFound) {
        return <NotFound />;
    }

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:top-[100px] md:py-10">
                        <img src={profile.personal_info.profile_img} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" alt={`${profile.personal_info.username}'s profile`} />
                        <h1 className="text-2xl font-medium">@{profile.personal_info.username}</h1>
                        <p className="text-xl capitalize h-6">{profile.personal_info.fullname}</p>
                        <p>{profile.account_info.total_posts.toLocaleString()} Blogs - {profile.account_info.total_reads.toLocaleString()} Reads</p>
                        {profileId === username && (
                            <Link to="/settings/edit-profile" className="btn-light rounded-md">
                                Edit Profile
                            </Link>
                        )}
                        <AboutUser className="max-md:hidden" bio={profile.personal_info.bio} socialLinks={profile.social_links} joinedAt={profile.joinedAt} />
                    </div>
                    <div className="max-md:mt-12 w-full">
                        <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
                            <>
                                {blogs === null ? (
                                    <Loader />
                                ) : blogs.results.length ? (
                                    blogs.results.map((blog, index) => (
                                        <AnimationWrapper key={index} transition={{ duration: 1, delay: index }}>
                                            <BlogPostCard content={blog} author={blog.author.personal_info} />
                                        </AnimationWrapper>
                                    ))
                                ) : (
                                    <NoDataMessage message="No data are published." />
                                )}
                                <LoadMoreDataBtn state={blogs} fetchDataFunc={fetchBlogs} />
                            </>
                            <AboutUser bio={profile.personal_info.bio} socialLinks={profile.social_links} joinedAt={profile.joinedAt} />
                        </InPageNavigation>
                    </div>
                </section>
            )}
        </AnimationWrapper>
    );
};

export default ProfilePage;
