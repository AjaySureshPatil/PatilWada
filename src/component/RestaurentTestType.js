import { Test_type } from "../utils/constant";
const RestaurentTestType = (props) => {
  const { resData } = props;
  const { cloudinaryImageId, name, cuisines, avgRating, locality } =
    resData?.info;
  return (
    <>
      <div
        data-testid="resCard"
        className="ml-10 h- p-4  w-64 hover:shadow-2xl flex flex-col   rounded-lg "
      >
        <img
          className="rounded-md overflow-hidden min-h-[180px] h-20 object-cover overlay"
          src={Test_type + cloudinaryImageId}
          alt={name}
        />
        <h3 className="font-bold p-1 text-lg">{name}</h3>
        <h4 className="text-base truncate ">{cuisines.join(", ")}</h4>
        <h4 className="text-base truncate ">{locality}</h4>
        <h5 className="">{avgRating}⭐</h5>
      </div>

      {console.log(resData)}

    </>
  );
};
export default RestaurentTestType; //hover:shadow-2xl
