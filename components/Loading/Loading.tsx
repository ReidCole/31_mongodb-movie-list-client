import { Loading3QuartersOutlined } from "@ant-design/icons";
import styles from "./Loading.module.css";

type Props = {
  isVisible: boolean;
};

const Loading: React.FC<Props> = ({ isVisible = false }) => {
  if (isVisible) {
    return (
      <div className={styles.container}>
        <div className={styles.spinnerBox}>
          <Loading3QuartersOutlined className={styles.spinner} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Loading;
