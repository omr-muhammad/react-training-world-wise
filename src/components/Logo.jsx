import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

const imgUrl = new URL('./logo.png', import.meta.url).href;

function Logo() {
  return (
    <Link to='/react-training-world-wise/'>
      <img src={imgUrl} alt='WorldWise logo' className={styles.logo} />
    </Link>
  );
}

export default Logo;
