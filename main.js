import "./style.css";

import RoleInput from "./role-input";

customElements.define("role-input", RoleInput);

// TODO:
// cant decrement less than 0
// cant have 2 roles with the same name
// design

document.addEventListener("DOMContentLoaded", () => {
  const roleInputs = document.getElementById("role-inputs");

  document.getElementById("add-role-btn").onclick = () => {
    const roleInput = new RoleInput();
    roleInputs.appendChild(roleInput);
  };

  document.getElementById("play-btn").onclick = () => {
    const roles = Array.from(roleInputs.children).map((item) => ({
      name: item.roleName,
      count: item.counterVal,
    }));

    const showOrder = roles
      .map(({ name, count }) => Array(count).fill(name))
      .flat()
      .sort(() => Math.random() - 0.5);

    document.getElementById("choose-stage").style.display = "none";

    const showStage = document.getElementById("show-stage");

    showStage.style.display = "block";
    showStage.innerHTML = showOrder.join("<br>");
  };
});
