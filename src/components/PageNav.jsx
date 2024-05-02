import { NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';
import Logo from './Logo';

export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to='react-training-world-wise/pricing'>Pricing</NavLink>
        </li>
        <li>
          <NavLink to='react-training-world-wise/product'>Product</NavLink>
        </li>
        <li>
          <NavLink
            to='react-training-world-wise/login'
            className={styles.ctaLink}
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
