import AppRoutes from "./navigation/AppRoutes";
import { message } from "antd";
import "./styles/global.css";

message.config({
  top: 30, // distance from the top of the viewport (in px)
  duration: 2, // duration in seconds
  maxCount: 3, // max messages shown at once
});

function App() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <AppRoutes />;
    </div>
  );
}

export default App;
