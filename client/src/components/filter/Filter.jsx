import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    property: searchParams.get("property") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minPrice: searchParams.get("minPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleFilter = (overrides = {}) => {
    const nextQuery = { ...query, ...overrides };
    setQuery(nextQuery);

    const params = {};
    Object.entries(nextQuery).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    setSearchParams(params);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    handleFilter({ [name]: value });
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city") || "all cities"}</b>
      </h1>
      <div className="top">
        <div className="item city">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleSelectChange}
            defaultValue={query.type}
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleSelectChange}
            defaultValue={query.property}
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button className="searchButton" onClick={() => handleFilter()}>
          <img src="/search.png" alt="" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}

export default Filter;
