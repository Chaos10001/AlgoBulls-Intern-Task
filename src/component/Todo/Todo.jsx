import {
  Table,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import "antd/dist/antd";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!description || !tag || !status) {
      message.error("Please fill all the mandatory fields.");
      return;
    }
    const newTodo = {
      id: todos.length + 1,
      description,
      dueDate: dueDate ? dueDate.format("DD MMM YYYY") : "",
      tag,
      status,
      createdDate: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
    setDescription("");
    setDueDate(null);
    setTag("");
    setStatus("");
  };

  //Handles the Delete Button
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  //Handles the Search Button
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };
  
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  //Handles the Edit Button
  const handleEditTodo = (taskId, newName) => {
    const updatedTodolist = todos.map((task) =>
      task.id === taskId ? { ...task, name: newName } : task
    );
    setTodos(updatedTodolist)
  };

  const handleFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm }) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${searchColumn}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, searchColumn)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, searchColumn)}
          size="small"
          style={{ width: 90, marginRight: 8 }}>
          Search
        </Button>
        <Button
          onClick={() => handleReset()}
          size="small"
          style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  };

  const columns = [
    {
      title: "Description *",
      dataIndex: "description",
      key: "description",
      filterDropdown: handleFilterDropdown,
      onFilter: (value, record) =>
        record.description.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Tag *",
      dataIndex: "tag",
      key: "tag",
      filters: [
        { text: "Personal", value: "Personal" },
        { text: "Work", value: "Work" },
        { text: "Shopping", value: "Shopping" },
        { text: "Others", value: "Others" },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.tag === value,
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Status *",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Open", value: "Open" },
        { text: "Working", value: "Working" },
        { text: "Done", value: "Done" },
        { text: "Overdue", value: "Overdue" },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status === value,
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text, record) => (
        <div>{new Date(text).toLocaleDateString()}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, task) => (
        <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleEditTodo(task.id, "new Task")}>
              Edit
            </Button>
          <Button type="danger" onClick={() => handleDeleteTodo(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Form style={{ padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: 16 }}
        />
        <RangePicker
          placeholder={["Due Date"]}
          onChange={(dates) => setDueDate(dates ? dates[0] : null)}
          style={{ marginRight: 16 }}
        />
        <Select
          placeholder="Tag *"
          value={tag}
          onChange={(value) => setTag(value)}
          style={{ marginRight: 16 }}>
          <Option value="Personal">Personal</Option>
          <Option value="Work">Work</Option>
          <Option value="Shopping">Shopping</Option>
          <Option value="Others">Others</Option>
        </Select>
        <Select
          placeholder="Status *"
          value={status}
          onChange={(value) => setStatus(value)}
          style={{ marginRight: 16 }}>
          <Option value="Open">Open</Option>
          <Option value="Working">Working</Option>
          <Option value="Done">Done</Option>
          <Option value="Overdue">Overdue</Option>
        </Select>
        <Button type="primary" onClick={handleAddTodo}>
          Add
        </Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => setSearchColumn("")}
          style={{ width: 200, marginRight: 16 }}
        />
        <Select
          placeholder="Search Column"
          value={searchColumn}
          onChange={(value) => setSearchColumn(value)}
          style={{ width: 200, marginRight: 16 }}>
          {columns.map((column) => (
            <Option key={column.dataIndex} value={column.dataIndex}>
              {column.title}
            </Option>
          ))}
        </Select>
      </div>
      <Table
        dataSource={todos}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.id}
      />
    </Form>
  );
};

export default Todo;
