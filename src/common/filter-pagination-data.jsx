import axios from "axios";
import { domain } from "../constants/domain";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_toSend = {} }) => {
    let obj = null;

    if (state !== null && !create_new_arr) {
        obj = {
            ...state,
            results: [...state.results, ...data],
            page: page
        };
    } else {
        try {
            const response = await axios.post(domain + countRoute, data_toSend);
            const { totalDocs } = response.data;
            obj = { results: data, page: 1, totalDocs };
        } catch (err) {
            console.error("Error fetching total document count:", err.message);
        }
    }

    return obj;
};
