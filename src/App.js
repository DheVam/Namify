import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AutoComplete,
  Spin,
  Card,
  Pagination,
  Typography,
  Input,
  Flex,
  Empty,
} from "antd";

import "antd/dist/reset.css";
import "./App.css";

const API_ENDPOINT = "https://swapi.dev/api/people";

const { Title, Paragraph } = Typography;

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestions, setSuggestions] = useState([]);

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

  const getRandomImage = () => {
    const randomKey = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/200/300?random=${randomKey}`;
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

  const handleSearch = (value) => {
    setSearchTerm(value);
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
      pageNumbers.push(i);
    }
    return (
      <Pagination
        current={currentPage}
        total={totalPages * 10}
        onChange={handlePageChange}
        pageSize={10}
        style={{ margin: "0 auto" }}
      />
    );
  };

  // Function to fetch suggestions from the API
  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}?search=${value}`);
      const suggestions = response.data.results.map((user) => user.name);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="App">
      <Title level={1}>Namify</Title>
      <Paragraph>Uncover Your Digital Identity</Paragraph>
      <AutoComplete
        value={searchTerm}
        options={suggestions.map((value) => ({ value }))}
        onSelect={(value) => handleSearch(value)}
        onSearch={fetchSuggestions}
        allowClear
        backfill={true}
      >
        <Input.Search
          placeholder="Search by name"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </AutoComplete>
      {loading && <Spin tip="Loading..." />}
      {error && <p>{error}</p>}
      {filteredUsers.length === 0 && !loading && <Empty />}
      <Flex className="user-list" gap={30} wrap="flex-wrap">
        {filteredUsers.map((user) => (
          <Card
            key={user.name}
            hoverable
            style={{
              width: 200,
              marginBottom: 16,
              backgroundColor:
                user.hair_color.toLowerCase() === "none"
                  ? "white"
                  : user.hair_color,
              color: ["brown", "black"].includes(user.hair_color.toLowerCase())
                ? "white"
                : "black",
            }}
            cover={<img alt={user.name} src={getRandomImage()} />}
          >
            <Title
              level={4}
              style={{
                color: ["brown", "black"].includes(
                  user.hair_color.toLowerCase()
                )
                  ? "white"
                  : "black",
              }}
              className="card-text"
            >
              {user.name}
            </Title>
            <Paragraph
              style={{
                color: ["brown", "black"].includes(
                  user.hair_color.toLowerCase()
                )
                  ? "white"
                  : "black",
              }}
              className="card-text"
            >
              Hair Color: ${user.hair_color}
            </Paragraph>
            <Paragraph
              style={{
                color: ["brown", "black"].includes(
                  user.hair_color.toLowerCase()
                )
                  ? "white"
                  : "black",
              }}
              className="card-text"
            >
              Skin Color: {user.skin_color}
            </Paragraph>
            <Paragraph
              style={{
                color: ["brown", "black"].includes(
                  user.hair_color.toLowerCase()
                )
                  ? "white"
                  : "black",
              }}
              className="card-text"
            >
              Gender: {user.gender}
            </Paragraph>
            <Paragraph
              style={{
                color: ["brown", "black"].includes(
                  user.hair_color.toLowerCase()
                )
                  ? "white"
                  : "black",
              }}
              className="card-text"
            >
              Vehicles: {user.vehicles.length}
            </Paragraph>
          </Card>
        ))}
      </Flex>
      <div>{renderPageNumbers()}</div>
    </div>
  );
};

export default App;
