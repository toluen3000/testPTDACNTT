import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DangNhap.css"


const DangNhap = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem('access_token');
    if (token) {
      navigate('/');
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8888/api/manager/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng nhập thất bại");
      }
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token); // Lưu token
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate('/'); // điều hướng user sang trang home.
      window.location.reload();     
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>Tài khoản:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            placeholder="Nhập tài khoản"
            required
          />

        </div>
        <div className="input-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            placeholder="Nhập mật khẩu"
            required
          />

        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default DangNhap;