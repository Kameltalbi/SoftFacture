import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./container/redux/store";
import App from "./App.jsx";
import './container/translation/i18n'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
