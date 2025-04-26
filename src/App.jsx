import AppRoutes from "./navigation/AppRoutes";
import { message } from 'antd';

message.config({
  top: 30,         // distance from the top of the viewport (in px)
  duration: 2,     // duration in seconds
  maxCount: 3,     // max messages shown at once
});

function App() {
  return <AppRoutes />;
}

export default App;
