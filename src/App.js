import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AutoComplete,
  Spin,
  Table,
  Typography,
  Input,
  Empty,
  Image,
  Pagination,
  Space,
} from "antd";
import Logo from "./Images/CompanyLogo.png";

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (text, record) => (
        <Image
          alt={record.name}
          src={getRandomImage()}
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: filteredUsers.map((user) => ({
        text: user.name,
        value: user.name,
      })),
      onFilter: (value, record) => record.name === value,
    },
    {
      title: "Hair Color",
      dataIndex: "hair_color",
      key: "hair_color",
      filters: filteredUsers
        .map((user) => user.hair_color)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((hairColor) => ({
          text: hairColor,
          value: hairColor,
        })),
      onFilter: (value, record) => record.hair_color === value,
    },
    {
      title: "Skin Color",
      dataIndex: "skin_color",
      key: "skin_color",
      filters: filteredUsers
        .map((user) => user.skin_color)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((skinColor) => ({
          text: skinColor,
          value: skinColor,
        })),
      onFilter: (value, record) => record.skin_color === value,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: filteredUsers
        .map((user) => user.gender)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((gender) => ({
          text: gender,
          value: gender,
        })),
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Vehicles",
      dataIndex: "vehicles",
      key: "vehicles",
      filters: filteredUsers
        .map((user) => user.vehicles.length)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((numVehicles) => ({
          text: `${numVehicles} Vehicles`,
          value: numVehicles,
        })),
      onFilter: (value, record) => record.vehicles.length === value,
      render: (text, record) => record.vehicles.length,
    },
  ];

  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}?search=${value}`);
      const suggestions = response.data.results.map((user) => user.name);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
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

  return (
    <div className="App">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space align="center" style={{ width: "100%" }}>
          <Image
            src={Logo}
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Title level={1}>Namify</Title>
          <div style={{ width: 100 }}></div>
        </Space>
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
        {loading && <Spin tip="Loading..." style={{ margin: "5rem" }} />}
        {error && <p>{error}</p>}
        {filteredUsers.length === 0 && !loading && <Empty />}
        <Table
          dataSource={filteredUsers}
          columns={columns}
          loading={loading}
          pagination={false}
          rowKey={(record) => record.name}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total Users</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={4}>
                {filteredUsers.length}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <div>{renderPageNumbers()}</div>
      </Space>
    </div>
  );
};

export default App;
