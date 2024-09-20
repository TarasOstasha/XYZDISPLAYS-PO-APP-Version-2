import styles from './Header.module.sass';
import logo from './Logo-Master.jpg';


function Header() {
  const handleClick = () => {
    window.location.reload(); // This will reload the entire page
  };
  return (
    <div className={styles.headerWrapper}>
      {/* <img src="https://www.xyzdisplays.com/v/vspfiles/templates/Charmed/images/template/header_bg.jpg" alt="xyzdisplays" /> */}
      <a onClick={handleClick}>
      <img src={logo} alt="xyzdisplays" />
      </a>
      {/* <h4 className={styles.test}>XYZ Displays Shipping Freight</h4> */}
    </div>
  )
}

export default Header

// 