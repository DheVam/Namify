import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Images/logo.png";

const API_ENDPOINT = "https://swapi.dev/api/people";
const RANDOM_IMAGE_API = "https://picsum.photos/200/300";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllUsers = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINT}?page=${page}`);
      setUsers(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedFetch = debounce(fetchAllUsers, 500);

  useEffect(() => {
    fetchAllUsers(currentPage);
  }, [currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    debouncedFetch(1);
  };
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = window.innerWidth < 600 ? 3 : totalPages;

    for (let i = 1; i <= maxPages; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="App">
      <h1 className="header">Namify</h1>
      <p>Uncover Your Digital Identity</p>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="input-field"
        />
        <FontAwesomeIcon icon={faSearch} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="user-list">
        {filteredUsers.map((user) => (
          <div
            key={user.name}
            className={`user-card ${
              user.hair_color.toLowerCase() === "brown" ||
              user.hair_color.toLowerCase() === "black"
                ? "black-hair"
                : "other-hair"
            }`}
            style={{ backgroundColor: user.hair_color }}
          >
            <img src={RANDOM_IMAGE_API} alt={user.name} />
            <h2>{user.name}</h2>
            <p>Hair Color: {user.hair_color}</p>
            <p>Skin Color: {user.skin_color}</p>
            <p>Gender: {user.gender}</p>
            <p>Vehicles: {user.vehicles.length}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="pagination-icons"
        />
        <div
          style={{ display: "flex", marginLeft: "1rem", marginRight: "1rem" }}
        >
          {renderPageNumbers()}
        </div>
        <FontAwesomeIcon
          icon={faArrowRight}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="pagination-icons"
        />
      </div>
    </div>
  );
}

export default App;
