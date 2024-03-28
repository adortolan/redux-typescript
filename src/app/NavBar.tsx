import { Link } from "react-router-dom";
export const NavBar = () => {
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/addpost">Add Post</Link>
            <Link to="/users">Users</Link>
          </div>
        </div>
      </section>
    </nav>
  );
};
