// src/main.tsx
import ReactDOM from "react-dom/client";
import BountyModal from "./components/BountyModal";
import "./index.css";

const mountGitEarnModal = () => {
  if (document.getElementById("git-earn-modal-root")) return;

  const div = document.createElement("div");
  div.id = "git-earn-modal-root";
  document.body.appendChild(div);

  const root = ReactDOM.createRoot(div);
  root.render(<BountyModal
    onClose={() => {
      div.remove();
    }}
    walletAddress="FAHAD123abc...xyz"
    balance="3.25"
  />);
};

export default mountGitEarnModal;