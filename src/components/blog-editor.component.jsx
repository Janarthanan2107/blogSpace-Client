import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import { Editor } from 'primereact/editor';
import axios from "axios";
import { UserContext } from "../App";
import { domain } from "../constants/domain";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebase } from "../common/firebase";


const BlogEditor = () => {
    const { userAuth: { access_token } } = useContext(UserContext)
    const { blog, setBlog, setEditorState } = useContext(EditorContext);
    let { title } = blog;
    let navigate = useNavigate()

    // states
    const [bannerUrl, setBannerUrl] = useState(blog.banner || defaultBanner);
    const [contentText, setContentText] = useState(blog.content || "");
    const [uploading, setUploading] = useState(false);

    // handle functions
    const handleBannerOnChange = async (e) => {
        let selectedImage = e.target.files[0];

        if (selectedImage) {
            try {
                setUploading(true);
                let loadingToast = toast.loading("Uploading...");
                const storage = getStorage(firebase)
                const storageRef = ref(storage, "images/" + selectedImage.name);
                await uploadBytes(storageRef, selectedImage);
                const downloadUrl = await getDownloadURL(storageRef)
                console.log(downloadUrl)
                setBannerUrl(downloadUrl)
                setBlog({ ...blog, banner: downloadUrl });
                toast.dismiss(loadingToast);
                toast.success("Uploaded👍");
            } catch (error) {
                toast.error(error.message)
            } finally {
                setUploading(false);
            }
        } else {
            toast.error("No image selected")
        }
    };


    // // handle functions
    // const handleBannerOnChange = (e) => {
    //     let image = e.target.files[0];
    //     if (image) {
    //         setUploading(true);
    //         let loadingToast = toast.loading("Uploading...");
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setTimeout(() => {
    //                 setBannerUrl(reader.result);
    //                 setBlog({ ...blog, banner: reader.result });
    //                 toast.dismiss(loadingToast);
    //                 toast.success("Uploaded👍");
    //                 setUploading(false);
    //             }, 2000);
    //         };
    //         reader.readAsDataURL(image);
    //     }
    // };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) { // enter key
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;

        // turning off the resize
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value });
    };

    const contentOnchange = (e) => {
        const newContent = e.htmlValue;
        setContentText(newContent);
        setBlog({ ...blog, content: newContent });
    };

    // publish call
    const handlePublish = async () => {
        if (bannerUrl == defaultBanner) {
            return toast.error("Upload a banner to publish it");
        }

        if (!title.length) {
            return toast.error("Write blog title to publish it");
        }

        if (contentText === "") {
            return toast.error("Write something in your Blog to publish it");
        }

        const payload = JSON.stringify({ ...blog, banner: bannerUrl, content: contentText }, null, 2);

        console.log(payload)

        if (payload) {
            setEditorState("publish");
        }
    };

    const handleSaveDraft = (e) => {
        e.preventDefault();

        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("Write blog title to save to draft");
        }

        let loadingToast = toast.loading("Saving to draft...");

        e.target.classList.add('disable');

        let blogObject = {
            title,
            banner: bannerUrl,
            content: contentText,
            draft: true
        };

        axios.post(domain + "/blog/create", blogObject, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(() => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Saved 👍");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        }).catch(({ response }) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response.data.error);
        });

    };


    return (
        <>
            <Toaster />
            <nav className="navbar">
                <Link to={"/"} className="flex-none w-10">
                    <img src={logo} alt="logo" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublish}>
                        Publish
                    </button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-8 rounded-3xl border-grey">
                            {uploading && (
                                <div className="absolute inset-0 bg-dark-grey opacity-50 z-10"></div>
                            )}
                            <label htmlFor="uploadBanner">
                                <img
                                    src={bannerUrl} alt="banner" className="rounded-[15px] z-20"
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerOnChange}
                                />
                            </label>
                        </div>

                        <textarea value={title} placeholder="Blog Title" className="mt-10 text-3xl font-medium w-full h-20 outline-none resize-none leading-tight placeholder:opacity-80" onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}></textarea>
                        <hr className="w-full opacity-10 my-2" />

                        <p className="mt-10 mb-2 font-medium text-2xl text-[#9ca3af]">Content</p>
                        <div className="border-grey rounded-lg border-4 mb-5">
                            <Editor value={contentText} onTextChange={(e) => contentOnchange(e)} style={{ minHeight: '120px', borderRadius: "0 0 6px 6px" }} />
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;
