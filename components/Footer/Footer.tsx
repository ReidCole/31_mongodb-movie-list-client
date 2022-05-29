import Link from "next/link";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Made by Reid Cole</p>
      <p>
        This site was created to showcase my skills as a web developer. See my{" "}
        <Link passHref href="https://reidcole.me">
          <a className={styles.link} rel="noreferrer noopener" target="_blank">
            portfolio site
          </a>
        </Link>{" "}
        for more of my work.
      </p>
    </footer>
  );
};

export default Footer;
