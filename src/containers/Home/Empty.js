import React from "react";
import EmptyImage from "assets/images/empty.png";

const Empty = () => {
  return (
    <div className="empty">
      <img src={EmptyImage} alt="Not found" />
      <p>
        Oops! We haven’t found anything mathing your search.
        <br />
        Try something else or reset the filters to see all 'region' homes.
      </p>
      <button>See all 'region' homes</button>
    </div>
  );
};

export default Empty;
