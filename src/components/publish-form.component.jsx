import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { domain } from "../constants/domain";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
    const { userAuth: { access_token } } = useContext(UserContext)
    let { blog, blog: { title, tags, banner, des, content }, setBlog, setEditorState, blog_id } = useContext(EditorContext)
    let charLimit = 200;
    let tagLimit = 10;
    let navigate = useNavigate()

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) => {
        const input = e.target;
        setBlog({ ...blog, title: input.value })
    }

    const handleBlogDesChange = (e) => {
        const input = e.target;
        setBlog({ ...blog, des: input.value })
    }

    const handlePreventKeyDown = (e) => {
        if (e.keyCode === 13) { // enter key
            e.preventDefault();
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188 || e.keyCode === 32) { // enter key, comma key, or space key
            e.preventDefault();
            let tag = e.target.value.trim();

            if (tag === "") {
                toast.error("Add some Topics");
            } else if (tag && tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog({ ...blog, tags: [...tags, tag] });
                }
            } else {
                toast.error(`You can add maximum ${tagLimit} tags`);
            }
            e.target.value = "";
        }
    }

    const blogSubmit = async (e) => {
        e.preventDefault();

        if (e.target.className.includes("disable")) {
            return
        }

        if (!title.length) {
            return toast.error("Write blog title to publish it");
        }

        if (!banner.length) {
            return toast.error("Upload a banner to publish it");
        }

        if (!content.length) {
            return toast.error("Write something in your blog to publish it");
        }

        if (!des.length || des.length > charLimit) {
            return toast.error(`Write something short description to publish it withing ${charLimit} to publish it`);
        }

        if (!tags.length) {
            return toast.error("Add at least 1 tag to rank your blog");
        }

        let loadingToast = toast.loading("Publishing...");

        e.target.classList.add('disable');

        let blogObject = {
            title,
            banner,
            content,
            des,
            tags,
            draft: false,
            id: blog_id
        }

        // console.log(JSON.stringify(blogObject, null, 2))

        axios.post(domain + "/blog/create", blogObject, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }).then(() => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Published Successfully👍");

            setTimeout(() => {
                navigate("/dashboard/blogs")
            }, 500);
        }).catch(({ response }) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response.data.error)
        })

    };

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleCloseEvent}><i className="fi fi-br-cross"></i></button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-gray mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="prev-banner" />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                    <p className="line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog title</p>
                    <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4 placeholder:text-dark-grey" onChange={handleBlogTitleChange} />
                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>
                    <textarea type="text" maxLength={charLimit} placeholder="Blog Description" defaultValue={des} className="h-40 resize-none leading-7 input-box pl-4 placeholder:text-dark-grey" onChange={handleBlogDesChange} onKeyDown={handlePreventKeyDown} />
                    <p className="text-sm text-right mt-1 text-dark-grey">{charLimit - des.length} charactors left.</p>
                    <p className="text-dark-grey mb-2 mt-9">Topics - (Help in searching and ranking your blog post)</p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Topic" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" onKeyDown={handleKeyDown} />
                        {tags.map((item, index) => {
                            return <Tag tag={item} tagIndex={index} key={index} />
                        })}
                    </div>
                    <p className="text-sm text-right mt-1 mb-4 text-dark-grey">{tagLimit - tags.length} Tags left</p>

                    <button className="btn-dark px-8" onClick={blogSubmit}>Publish</button>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;