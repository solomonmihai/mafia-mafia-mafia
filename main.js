import "./style.css";

import RoleInput from "./role-input";

customElements.define("role-input", RoleInput);

// TODO:
// design
// dont allow 2 of the same role
// save role distribution to local storage
// and reassign after refresh

document.addEventListener("DOMContentLoaded", () => {
  const roleInputs = document.getElementById("role-inputs");
  const rolesError = document.getElementById("roles-error");
  const totalPlayerText = document.getElementById("total-player-count");
  const roleText = document.getElementById("role-text");
  const roleIndexText = document.getElementById("role-index-text");

  function calcTotalPlayersCount() {
    totalPlayerText.innerText = Array.from(roleInputs.children).reduce((acc, element) => acc + element.counterVal, 0);
  }

  document.getElementById("add-role-btn").onclick = () => {
    const roleInput = new RoleInput();
    roleInputs.appendChild(roleInput);
    roleInput.addEventListener("value-changed", calcTotalPlayersCount);

    calcTotalPlayersCount();
  };

  document.getElementById("play-btn").onclick = () => {
    const roles = Array.from(roleInputs.children).map((item) => ({
      name: item.roleName,
      count: item.counterVal,
    }));

    if (roles.length == 0) return;

    const showOrder = roles
      .map(({ name, count }) => Array(count).fill(name))
      .flat()
      .sort(() => Math.random() - 0.5);

    // if (new Set(showOrder).size !== showOrder.length) {
      // rolesError.style.display = "block";
      // return;
    // }

    document.getElementById("choose-stage").style.display = "none";

    const showStage = document.getElementById("show-stage");

    showStage.style.display = "block";
    // showStage.innerHTML = showOrder.join("<br>");

    const showRoleBtn = document.getElementById("show-role-btn");

    let currentRoleIndex = 0;
    roleIndexText.innerText = currentRoleIndex + 1 + ". ";

    showRoleBtn.onpointerdown = () => {
      roleText.innerText = showOrder[currentRoleIndex];
    };

    showRoleBtn.onpointerup = () => {
      roleText.innerText = "your role";
    };

    document.getElementById("next-role-btn").onclick = () => {
      currentRoleIndex++;
      roleIndexText.innerText = currentRoleIndex + 1 + ". ";

      if (currentRoleIndex > showOrder.length - 1) {
        showStage.style.display = "none";
        document.getElementById("restart-stage").style.display = "block";
      }
    };
  };
});
