import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { DateRangePicker } from "materialui-daterange-picker";
import { format } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

import Card from "./Card";
import Navbar from "./Navbar";
import Empty from "./Empty";
import Loading from "./Loading";

import API from "apis/api";
import "assets/scss/Home.scss";

const Home = () => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const [homes, setHomes] = useState(null); // search result
  const [isLoading, setIsLoading] = useState(false); // loading status when search
  const [regions, setRegions] = useState(null); // all regions for where in search field
  const [coupon, setCoupon] = useState("");
  const [filter, setFilter] = useState({
    // search fields(where, when, who, order)
    region: query.get("region") || null,
    period:
      (query.get("period") && {
        checkIn: query.get("period")?.split(",")?.[0],
        checkOut: query.get("period")?.split(",")?.[1],
      }) ||
      null,
    guests: query.get("guests") || 1,
    order: query.get("order") || "RELEVANCE",
    page: 1,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState("");
  const toggle = () => setOpen(!open);

  // daterangepicker change function(when field)
  const handleChangeDatePicker = (range) => {
    const checkIn = format(new Date(range.startDate), "yyyy-MM-dd");
    const checkOut = format(new Date(range.endDate), "yyyy-MM-dd");
    setFilter({ ...filter, period: { checkIn, checkOut }, page: 1 });
    setDateRange(
      `${format(new Date(checkIn), "MMM dd, yyyy")} - ${format(
        new Date(checkOut),
        "MMM dd, yyyy"
      )}`
    );
  };

  const handleCoupon = (event) => {
    setCoupon(event.target.value);
  };

  // change the search field values
  const handleFilter = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value, page: 1 });
  };

  // search function
  useEffect(() => {
    setIsLoading(true);
    API.homes.get(filter).then((response) => {
      const homes = response.data.data.homes;
      setHomes(() => homes);
      setIsLoading(() => false);

      if (filter.period) {
        API.homes
          .getHomesPricing({
            ids: homes.results.map((home) => home.id),
            period: filter.period,
            coupon,
          })
          .then((response) => {
            const homesPricing = response.data.data.homesPricing;
            setHomes((homes) => {
              return {
                ...homes,
                results: homes.results.map((home) => {
                  return {
                    ...home,
                    ...homesPricing.filter((price) => {
                      return price.homeId === home.id;
                    })[0],
                  };
                }),
              };
            });
          });
      }
    });

    // change the url after search the homes
    const query = `${filter.region ? `region=${filter.region}&` : ``}${
      filter.period
        ? `period=${filter.period.checkIn},${filter.period.checkOut}&`
        : ``
    }guests=${filter.guests}&order=${filter.order}`;
    history.push(`${location.pathname}?${query}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    // get the all regions for where field
    API.regions.all().then((response) => {
      setRegions(() => response.data.data.regions);
    });
    query.get("period") &&
      setDateRange(
        `${format(
          new Date(query.get("period").split(",")[0]),
          "MMM dd, yyyy"
        )} - ${format(
          new Date(query.get("period").split(",")[1]),
          "MMM dd, yyyy"
        )}`
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // infinite scroll(load more data when scroll)
  const fetchMoreHomes = () => {
    console.log("load more");
    setFilter({ ...filter, page: filter.page++ });
    API.homes.get(filter).then((response) => {
      let moreHomes = response.data.data.homes;
      filter.period &&
        API.homes
          .getHomesPricing({
            ids: moreHomes.results.map((home) => home.id),
            period: filter.period,
            coupon,
          })
          .then((response) => {
            const homesPricing = response.data.data.homesPricing;
            moreHomes = {
              ...moreHomes,
              results: moreHomes.results.map((home) => {
                return {
                  ...home,
                  ...homesPricing.filter((price) => {
                    return price.homeId === home.id;
                  })[0],
                };
              }),
            };
            setHomes({
              ...homes,
              results: homes.results.concat(moreHomes.results),
            });
          });
      setHomes({
        ...homes,
        results: homes.results.concat(moreHomes.results),
      });
    });
  };

  return (
    <>
      <div className="header">
        <Navbar />
        <div className="filter">
          <div>
            <div>
              <label>Where</label>
              <select
                onChange={handleFilter}
                name="region"
                value={filter.region || ""}
              >
                <option value=""></option>
                {regions &&
                  regions.map((region, index) => {
                    return (
                      <option
                        value={region.id}
                        key={index}
                      >{`${region.name}, ${region.stateName}`}</option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label>When</label>
              <input type="text" onClick={toggle} value={dateRange} readOnly />
              <div className="datepicker">
                <DateRangePicker
                  open={open}
                  initialDateRange={
                    filter.period
                      ? {
                          startDate: new Date(filter.period.checkIn),
                          endDate: new Date(filter.period.checkOut),
                        }
                      : null
                  }
                  toggle={toggle}
                  onChange={(range) => handleChangeDatePicker(range)}
                />
              </div>
            </div>
            <div>
              <label>Who</label>
              <select
                onChange={handleFilter}
                name="guests"
                value={filter.guests}
              >
                {[...Array(30)].map((num, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} guests
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Order</label>
              <select onChange={handleFilter} name="order" value={filter.order}>
                <option value="RELEVANCE">Relevant(default)</option>
                <option value="PRICE_ASC">Price:lowest first</option>
                <option value="PRICE_DESC">Price:highest first</option>
              </select>
            </div>
          </div>
          <div>
            <label>Coupon</label>
            <input
              type="text"
              value={coupon}
              onChange={handleCoupon}
              placeholder="Got a code?"
            />
          </div>
        </div>
      </div>
      <div className="body">
        {isLoading ? (
          <div className="homes">
            <div className="homes-header">
              <p className="title">please wait</p>
              <p className="count">
                <span>Loading</span> homes
              </p>
            </div>
            <div className="homes-body">
              <Loading />
            </div>
          </div>
        ) : (
          <>
            {homes?.count > 0 ? (
              <div className="homes">
                <div className="homes-header">
                  <p className="title">your stay in one of</p>
                  <p className="count">
                    <span>{homes.count}</span> homes
                  </p>
                </div>
                <div className="homes-body">
                  <InfiniteScroll
                    dataLength={homes.count}
                    next={fetchMoreHomes}
                    hasMore={homes.count !== homes.results.length}
                    scrollThreshold={0.9}
                    loader={
                      <span className="loading-text">
                        Loading more homes...
                      </span>
                    }
                  >
                    {homes.results.map((home, index) => {
                      return (
                        <Card key={index} {...home} period={filter.period} />
                      );
                    })}
                  </InfiniteScroll>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
