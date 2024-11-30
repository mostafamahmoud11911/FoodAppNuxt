import { jwtDecode } from "jwt-decode";

export const userData = () =>{
    const token = useCookie("token");

     const data = jwtDecode(token.value ? token.value : "");
    return {
        data,
        token
    }
}



