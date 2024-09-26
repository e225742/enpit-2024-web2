import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>OS課題相談広場</h1>
        <p>
          OSの課題について質問をたくさん聞いてね〜 <br />
          匿名で授業や課題について分からないことを質問できるよ！ <br />
          学サポのTAや友人が答えてくれるよ！！
        </p>
        <button className={styles.questionButton}>＋質問する</button>
      </header>
      
      <aside className={styles.sidebar}>
        <p>過去ログ</p>
        {/* ログのリストを追加 */}
      </aside>
      
      <main className={styles.main}>
        <div className={styles.question}>
          <h2>課題8.1: Perlスクリプト実行時のSSHエラーとIllegal division by zeroエラーについて</h2>
          <p>
            質問があります。課題8.1のperl display_is.pl {'>'} data1.htmlを実行した際に、ssh: Could not resolve
            hostname amane.u-ryukyu.ac.jp: nodename nor servname provided, or not known Illegal division by zero at
            display_is.pl line 35. というエラーが起こります。ssh amane接続でもエラーが発生してしまうのですが、どう対処すれば良いでしょうか？
          </p>
        </div>
        <div className={styles.question}>
          <h2>課題11.1: virshコマンド実行時の’Failed to start domain’エラーと解決方法</h2>
          <p>
            11.20課題に取り組んでいるのですが、amane仮想マシンを立ち上げようとしていますが、起動できません。
            virsh start os-11-1 uid: 19835 gid: 1001 name: e225718 error: Failed to start domain 'e225718-os-11-1' error:
            Requested operation is not valid: Setting different DAC user or group on /mnt/file-vol/e225718/os-11-1.qcow2
            which is already in use。解決方法を教えていただけませんか？
          </p>
        </div>
      </main>
    </div>
  );
}
