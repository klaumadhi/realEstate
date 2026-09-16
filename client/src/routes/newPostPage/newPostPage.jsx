import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

async function geocodeAddress(street, city) {
  const query = encodeURIComponent(`${street}, ${city}`);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`
  );
  const data = await res.json();
  if (!data.length) {
    throw new Error(
      "Couldn't find that address on the map. Please check the street and city."
    );
  }
  return { latitude: data[0].lat, longitude: data[0].lon };
}

function NewPostPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target)
    const inputs = Object.fromEntries(formData)

    try{
      setLocating(true);
      const { latitude, longitude } = await geocodeAddress(inputs.street, inputs.city);
      setLocating(false);

      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.street,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude,
          longitude,
          images : images
        },
        postDetail: {
          desc: value,
          utilities : inputs.utilities,
          pet : inputs.pet,
          income : inputs.income,
          size : parseInt(inputs.size),
          school : parseInt(inputs.school),
          bus : parseInt(inputs.bus),
          restaurant : parseInt(inputs.restaurant),
        },

      })
      navigate("/"+res.data.id)
    }catch(err){
      console.error(err)
      setLocating(false);
      setError(err.response?.data?.message || err.message) }

  };
  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="street">Street</label>
              <input id="street" name="street" type="text" placeholder="e.g. Rheinstraße" required />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <p className="hint">
              We'll automatically locate this address on the map — no need to
              enter coordinates or a house number.
            </p>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value}/>
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" id="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" id="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" id="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" id="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (m2)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School (m away)</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Stop (m away)</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant (m away)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton" disabled={locating}>
              {locating ? "Locating address..." : "Add"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image,index) =>
          <img src={image} key={index} alt="" />
        )}
        <UploadWidget uwConfig={
          {
            cloudName: "daiyy64ih",
          uploadPreset: "estate",
          multiple: true,

          folder: "posts"
          }

        }setState={setImages}/>
      </div>
    </div>
  );
}

export default NewPostPage;
