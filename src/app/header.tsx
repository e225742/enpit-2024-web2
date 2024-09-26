import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>OS課題相談広場</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>過去ログ</li>
          <li>使い方</li>
          <li>
            <button className={styles.questionButton}>＋質問する</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
