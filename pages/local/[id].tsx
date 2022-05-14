import { NextPage } from "next";
import ListPage from "../../components/ListPage/ListPage";

const ServerListPage: NextPage = () => {
  return <ListPage listLocation="localStorage" />;
};

export default ServerListPage;
