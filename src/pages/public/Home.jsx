import ChartViewer from "@components/ChartViewer/ChartViewer";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao Dashboard</h1>
      <ChartViewer />
    </div>
  );
}
