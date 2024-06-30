import React from "react";
import Skeleton from "react-loading-skeleton";

const Loading = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((num, index) => {
        return (
          <div key={index} className="item skeleton">
            <div className="avatar">
              <Skeleton height={208} />
            </div>
            <div className="details">
              <Skeleton
                width={132}
                height={17}
                style={{ marginBottom: "4px" }}
              />
              <Skeleton
                width={218}
                height={28}
                style={{ marginBottom: "4px" }}
              />
              <Skeleton
                width={241}
                height={17}
                style={{ marginBottom: "30px" }}
              />
              <Skeleton
                width={74}
                height={17}
                style={{ marginBottom: "4px" }}
              />
              <Skeleton
                width={98}
                height={22}
                style={{ marginBottom: "4px" }}
              />
              <Skeleton width={45} height={17} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Loading;
