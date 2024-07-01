import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ className, bio, socialLinks, joinedAt }) => {
    return (
        <div className={`md:w-[90%] md:mt-7 ${className}`}>
            <p className="text-xl leading-7">
                {bio.length ? bio : "Nothing to read here"}
            </p>

            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {
                    Object.keys(socialLinks).map((key, i) => {

                        let link = socialLinks[key];

                        return link ? <Link to={link} key={i} target="_blank">
                            <i className={"fi " + (key != "webiste" ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl hover:text-black"}></i>
                        </Link> : ""
                    })
                }
            </div>

            <p className="text-xl leading-7 text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
        </div >
    )
}

export default AboutUser