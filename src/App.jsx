import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // ================= GLOBAL =================
  const [page, setPage] = useState("home"); // home | login | admin

  // ================= LOGIN =================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setPage("admin");
    } else {
      alert("Username หรือ Password ไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    setPage("home");
    setUsername("");
    setPassword("");
  };

  // ================= DATA =================
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FORM =================
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;

  // ================= FETCH =================
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => setData(res.data.slice(0, 10)))
      .catch(() =>
        setError("ไม่สามารถดึงข้อมูลได้ กรุณาเช็คอินเทอร์เน็ต")
      )
      .finally(() => setIsLoading(false));
  }, []);

  // ================= CRUD (ADMIN) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newBody) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    if (isEditing) {
      const res = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${editingId}`,
        { title: newTitle, body: newBody }
      );

      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, ...res.data } : item
        )
      );
      setEditingId(null);
    } else {
      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        { title: newTitle, body: newBody }
      );
      setData([{ id: Date.now(), ...res.data }, ...data]);
    }

    setNewTitle("");
    setNewBody("");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewBody(item.body);
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    setData(data.filter((item) => item.id !== id));
  };

  // ================= LOADING / ERROR =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-blue-600 font-bold">
          กำลังโหลดข้อมูล S.Tech...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          {error}
        </div>
      </div>
    );
  }

  // ================= LOGIN PAGE =================
  if (page === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-md w-80"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
            🔐 Admin Login
          </h2>

          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">
            Login
          </button>

          {/* ปุ่มหน้าแรก */}
          <button
            type="button"
            onClick={() => setPage("home")}
            className="w-full mt-3 text-gray-500 text-sm hover:underline"
          >
            🏠 หน้าแรก
          </button>

          <p className="text-xs text-center text-gray-400 mt-4">
            admin / 1234
          </p>
        </form>
      </div>
    );
  }

  // ================= ADMIN PAGE =================
  if (page === "admin") {
    return (
      <div className="p-8 bg-gray-50 min-h-screen max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">
            🛠 Admin : News Manager
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setPage("home")}
              className="text-blue-600 font-medium"
            >
              🏠 หน้าแรก
            </button>

            <button
              onClick={handleLogout}
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-6">
          <h2 className="font-bold mb-2">
            {isEditing ? "✏️ แก้ไขข่าว" : "➕ เพิ่มข่าว"}
          </h2>

          <input
            className="w-full border p-2 mb-2"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="หัวข้อ"
          />

          <textarea
            className="w-full border p-2 mb-2"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="เนื้อหา"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? "อัปเดต" : "บันทึก"}
          </button>
        </form>

        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 mb-2 rounded">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.body}</p>
            <div className="mt-2 flex gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ================= HOME (PUBLIC) =================
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">ข่าวสาร S.Tech (หน้าแรก)</h1>

        <button
          onClick={() => setPage("login")}
          className="text-blue-600 font-medium"
        >
          🔐 Admin Login
        </button>
      </div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {data.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow rounded-xl">
            <h2 className="font-bold capitalize">{item.title}</h2>
            <p className="text-gray-500 mt-2">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
