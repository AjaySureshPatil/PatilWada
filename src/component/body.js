import RestaurentCard  from "./RestaurentCard.js";
import RestaurentTestType  from "./RestaurentTestType.js";
import { useState,useEffect } from "react";
import Shimmer from "./shimmer.js";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
// import data from "../utils/RestaurantData.js";

const getRestaurants = (json) => {
  const cards = json?.data?.cards || [];

  for (const card of cards) {
    const restaurants =
      card?.card?.card?.gridElements?.infoWithStyle?.restaurants ||
      card?.card?.gridElements?.infoWithStyle?.restaurants ||
      card?.gridElements?.infoWithStyle?.restaurants||
      card?.card?.header?.gridElements?.infoWithStyle?.restaurants ;    //New

    if (Array.isArray(restaurants) && restaurants.length > 0) {
      return restaurants;
    }
  }

  return [];
};

const getRestTestType = (json) => {
  const cards = json?.data?.cards || [];

  // {console.log(cards)}

  for (const card of cards) {
    const restaurantsTestType =
      // card?.card?.gridElements?.infoWithStyle;  //New
      card?.card?.card?.gridElements?.infoWithStyle?.info ;    //New

        {console.log(restaurantsTestType)}
    if (Array.isArray(restaurantsTestType) && restaurantsTestType.length > 0) {
      return restaurantsTestType;
    }
  }

  return [];
};


const Body=()=>{
  const [listOfRestaurent,setListOfRestaurent]=useState([]);
  const [filteredrestaurent,setfilteredrestaurent]=useState([]);
  const [testType,setTestType] = useState([]);

  const [searchtxt,setsearchtxt]=useState("");

  useEffect(()=>{
    fetchData();
  },[])

  const fetchData=async()=>
  {
    try {
      // First is old working.
      // const data= await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=21.1119261&lng=79.0878065&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING ");
      const data= await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=19.07480&lng=72.88560&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING ");
      const json= await data.json();
      const restaurants = getRestaurants(json);
      const restTestType = getRestTestType(json);
      setListOfRestaurent(restaurants);
      setfilteredrestaurent(restaurants);
      setTestType(restTestType);
      // {console.log(restTestType)}

    } catch (error) {
      console.error("Unable to fetch restaurants", error);
      setListOfRestaurent([]);
      setfilteredrestaurent([]);
      setTestType([]);
    }
  };

  const onlinestatus=useOnlineStatus();
  if(onlinestatus===false) return (
    <h1>Look's Like you are offline!! Plz Check internet</h1>
  );
  
  
  return listOfRestaurent?.length === 0 ? (
    <Shimmer/>
  ) : (
        <div className="grow min-h-[70vh]">
          <div className="flex justify-center my-5"> 
           <div className="mr-6">
             <input 
              type="text" 
              data-testid="searchInput" 
              className="border border-solid border-black px-3" 
              value={searchtxt} onChange={(e)=>{
                 setsearchtxt(e.target.value);
              }}
            />
             <button className="px-3 py-1 rounded-md  bg-orange-600 m-2" onClick={()=>{
                  const filteredRes=listOfRestaurent.filter((res)=>
                  res.info.name.toLowerCase().includes(searchtxt.toLowerCase())
                  );
                    setfilteredrestaurent(filteredRes);
             }}
             >Search</button>
          </div>
  
          <div className="px-3 py-1 bg-orange-600 rounded-md m-2">
            <button className=" " onClick={()=>{
              const filteredList=listOfRestaurent.filter(
                (res)=>res.info.avgRating > 4
                );
                setfilteredrestaurent(filteredList)
              }
             }
            >Top rated restaurent
             </button>
          </div>
          </div>

          {/* Ajay Top Restaurent */}
          <div className="flex flex-wrap ">
             {/* <h1>What's on your mind?</h1> */}
             {filteredrestaurent.map((restaurent)=>(
                <Link style={{textDecoration: 'none'}} key={restaurent.info.id}to={"restaurent/"+restaurent.info.id}><RestaurentTestType  resData={restaurent}/></Link>
             ))}
          </div>

          {/* Original */}
          <div className="flex flex-wrap ">
          {
            filteredrestaurent.map((restaurent)=>(
            <Link style={{textDecoration: 'none'}} key={restaurent.info.id}to={"restaurent/"+restaurent.info.id}><RestaurentCard  resData={restaurent}/></Link>))
          }
          </div>
        </div>
    )
}

export default Body;