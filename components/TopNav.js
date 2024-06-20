import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import { AppstoreOutlined, LoginOutlined, ProfileOutlined, UserAddOutlined } from "@ant-design/icons";
import 'dotenv/config';
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    toast.success("Logout successfully!");
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`);
    router.push("/login");
  };

  return <Menu
    theme="dark"
    mode="horizontal"
    selectedKeys={[current]}
    className="mb-2">
    <Item
      key="/"
      onClick={(e) => setCurrent(e.key)}
      icon={<AppstoreOutlined />}>
      <Link href="/"><a>App</a></Link>
    </Item>

    {user == null && <>
      <Item
        className="float-right"
        key="/register"
        onClick={(e) => setCurrent(e.key)}
        icon={<UserAddOutlined />}>
        <Link href="/register"><a>Đăng ký</a></Link>
      </Item>

      <Item
        className="float-right"
        key="/login"
        onClick={(e) => setCurrent(e.key)}
        icon={<LoginOutlined />}>
        <Link href="/login"><a>Đăng nhập</a></Link>
      </Item>
    </>}

    {user != null && <SubMenu
      icon={<ProfileOutlined />}
      title={user && user.data.name}
      className="float-right">
      <ItemGroup>
        <Item key="/user">
          <Link href="/user"><a>Hồ sơ</a></Link>
        </Item>
        <Item onClick={logout}>Đăng xuất</Item>
        <Item key={`/courses`}>
          <Link href='/courses'><a>Khóa học</a></Link>
        </Item>
        <Item key={`/leaderboard`}>
          <Link href='/leaderboard'><a>Bảng xếp hạng</a></Link>
        </Item>
        {String(user.data.email).endsWith(`@hust.edu.vn`) ? <Item key={`/scoring`}>
          <Link href='/scoring'><a>Chấm điểm</a></Link>
        </Item> : <>
          <Item key={`/vstep`}>
            <Link href='/vstep'><a>Thi thử VSTEP</a></Link>
          </Item>
          <Item key={`/view-test`}>
            <Link href='/view-test'><a>Xem điểm thi VSTEP</a></Link>
          </Item>
        </>}
      </ItemGroup>
    </SubMenu>}
  </Menu>
};

export default TopNav;
