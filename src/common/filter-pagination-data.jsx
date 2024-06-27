import axios from "axios";
import { domain } from "../constants/domain";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_toSend = {} }) => {
    let obj = null;

    if (state !== null && !create_new_arr) {
        obj = {
            ...state,
            results: [...state.results, ...data],
            page: page
        }
    } else {
        try {
            await axios
                .post(domain + countRoute, data_toSend)
                .then(({ data: { totalDocs } }) => {
                    obj = { results: data, page: 1, totalDocs };
                })
                .catch((err) => {
                    console.log(err)
                });
        } catch (err) {
            console.log(err.message);
        }
    }
    // console.log(obj, "obj")
    // console.log(state, "state")
    // console.log(data, "data")

    return obj;
}