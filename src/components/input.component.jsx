import { useState } from "react";

const InputText = ({ name, id, type, value, placeholder, icon, onChange, disable = false }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const passwordToggle = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="relative w-[100%] mb-4">
            <input
                type={type === "password" ? (passwordVisible ? "text" : "password") : type}
                name={name}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="input-box"
                disabled={disable}
            />
            <i className={`fi ${icon} input-icon`}></i>
            {type === "password" ? (
                <i
                    className={`fi ${!passwordVisible ? "fi-rr-eye-crossed" : "fi-rr-eye"} input-icon left-[auto] right-4 cursor-pointer`}
                    onClick={passwordToggle}
                ></i>
            ) : ""}
        </div>
    );
};

export default InputText;
