import styles from './Header.module.sass';
import logo from './Logo-Master.jpg';
import { Link } from 'react-router-dom';


function Header() {
  const handleClick = () => {
    window.location.reload(); // This will reload the entire page
  };
  const isHomePage = window.location.pathname === '/';
  return (
    <div className={styles.headerWrapper}>
      {isHomePage ? (
        <a onClick={handleClick}>
          <img src={logo} alt="xyzdisplays" />
        </a>
      ) : (
        <Link to="/">
          <img src={logo} alt="xyzdisplays" />
        </Link>
      )}
    </div>
  )
}

export default Header

// 