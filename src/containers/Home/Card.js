import React from "react";
import Skeleton from "react-loading-skeleton";

import BedroomIcon from "assets/images/icons/bedroom.svg";
import BathroomIcon from "assets/images/icons/bathroom.svg";
import PoolIcon from "assets/images/icons/pool.svg";
import UserIcon from "assets/images/icons/user.svg";
import UpIcon from "assets/images/icons/up.svg";
import DownIcon from "assets/images/icons/down.svg";

const HomeCard = (props) => {
  return (
    <div className="item">
      <div className="avatar">
        <img src={props.photos[0].url} alt="avatar" />
      </div>
      <div className="details">
        <p className="region">
          {props.cityName} • {props.regionName}, {props.stateCode}
        </p>
        <p className="title">{props.title}</p>
        <ul className="occupancy">
          <li>
            <img src={BedroomIcon} alt="bedroom" />
            <span>{props.bedsCount} Bedrooms</span>
          </li>
          <li>
            <img src={BathroomIcon} alt="bathroom" />
            <span>{props.bathroomsCount} Bathrooms</span>
          </li>
          {props.hasPool && (
            <li>
              <img src={PoolIcon} alt="pool" />
              <span>Pool</span>
            </li>
          )}
          <li>
            <img src={UserIcon} alt="guests" />
            <span>{props.maxOccupancy} Guests</span>
          </li>
        </ul>
        <div className="price">
          {!props.period ? (
            <>
              <div>
                <p className="label">
                  <img src={DownIcon} alt="down" />
                  <span>Budget Season</span>
                </p>
                <p className="price">
                  {`$${props.seasonPricing.lowSeason.minPrice} - $${props.seasonPricing.lowSeason.maxPrice}`}
                </p>
                <p className="unit">per night</p>
              </div>
              <div>
                <p className="label">
                  <img src={UpIcon} alt="down" />
                  <span>Prime Season</span>
                </p>
                <p className="price">
                  {`$${props.seasonPricing.highSeason.minPrice} - $${props.seasonPricing.highSeason.maxPrice}`}
                </p>
                <p className="unit">per night</p>
              </div>
            </>
          ) : (
            <div>
              {!props.total ? (
                <div className="loading-price">
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
              ) : (
                <>
                  <p className="label">Total • {props.numberOfNights} nights</p>
                  <p className="price">${props.total}</p>
                  <p className="unit">
                    ${Math.round(props.total / props.numberOfNights)} per night
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
