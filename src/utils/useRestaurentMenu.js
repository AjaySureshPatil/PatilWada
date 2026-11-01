import { useState,useEffect } from "react";
import { API_BASE_URL } from "./api.js";


const useRestaurentMenu=(resId)=>{
    const [resInfo,setResInfo]=useState(null);
    useEffect(()=>{
    fetchData();
    },[resId]);
    const fetchData= async()=>{
    try {
      // OLD CODE: Restaurant menu was requested directly from Swiggy.
      // This also causes a browser CORS error on a deployed frontend.
      // const data = await fetch(Menu_Api + resId);
      // const json = await data.json();
      // setResInfo(json.data);

      // NEW CODE: Call the same-origin Vercel menu API.
      // api/menu.js securely fetches the real Swiggy menu on the server.
      const data= await fetch(`${API_BASE_URL}/api/menu?restaurantId=${encodeURIComponent(resId)}`);
      if (!data.ok) {
        throw new Error(`Menu API returned ${data.status}`);
      }
      const json= await data.json();
      setResInfo(json.data);
    } catch (error) {
      console.error("Unable to fetch restaurant menu", error);
      setResInfo(null);
    }
    };
    return resInfo;
}
export default useRestaurentMenu