import { useState } from "react";
import "./searchBar.scss";
import { useNavigate } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = { type: query.type };
    if (query.city) params.city = query.city;
    if (query.minPrice) params.minPrice = query.minPrice;
    if (query.maxPrice) params.maxPrice = query.maxPrice;
    navigate(`/list?${new URLSearchParams(params).toString()}`);
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="city" placeholder="City Location" onChange={handleChange} />
        <input
          type="number"
          name="minPrice"
          min={0}
          placeholder="Min Price" onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          placeholder="Max Price" onChange={handleChange}
        />
        <button type="submit" className="submitButton">
          <img src="/search.png" alt="" />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
