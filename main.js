import "./style.css";

import RoleInput from "./role-input";

customElements.define("role-input", RoleInput);

function query(q) {
  const els = Array.from(document.querySelectorAll(q));

  if (els.length === 0) {
    return null;
  }

  if (els.length === 1) {
    return els[0];
  }

  return els;
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

const elements = {
  roleInputsDiv: query("#role-inputs"),
  rolesError: query("#roles-error"),

  totalPlayersText: query("#total-player-count"),
  roleText: query("#role-text"),
  roleIndexText: query("#role-index-text"),

  addRoleBtn: query("#add-role-btn"),
  playBtn: query("#play-btn"),
  nextRoleBtn: query("#next-role-btn"),

  chooseStage: query("#choose-stage"),
  showStage: query("#show-stage"),
  restartStage: query("#restart-stage"),
};

function showError(msg) {
  const { rolesError } = elements;
  rolesError.innerText = msg;
  rolesError.style.display = "block";
}

function calcTotalPlayersCount() {
  const { totalPlayersText, roleInputsDiv } = elements;

  totalPlayersText.innerText = Array.from(roleInputsDiv.children).reduce(
    (acc, element) => acc + element.counterVal,
    0
  );
}

function checkDuplicateRoles(roles) {
  for (let i = 0; i < roles.length; i++) {
    for (let j = i + 1; j < roles.length; j++) {
      if (roles[i].name == roles[j].name) {
        return true;
      }
    }
  }

  return false;
}

/**
 *
 * @param {string} oldStage
 * @param {string} newStage
 */
function changeStage(oldStage, newStage, newStageDisplay = "flex") {
  elements[oldStage].style.display = "none";
  elements[newStage].style.display = newStageDisplay;
}

function createRole(name, count = 1) {
  const roleInput = new RoleInput(name, count);
  elements.roleInputsDiv.appendChild(roleInput);
  roleInput.addEventListener("value-changed", calcTotalPlayersCount);
}

function setNextBtnVisible(value) {
  elements.nextRoleBtn.style.opacity = value ? 1 : 0;
  elements.nextRoleBtn.disabled = value ? false : true;
}

function createRoles(inputs) {
  const roles = Array.from(inputs).map((item) => ({
    name: item.roleName,
    count: item.counterVal,
  }));

  if (checkDuplicateRoles(roles)) {
    showError("can't have 2 or more roles with the same name");
    return;
  }

  if (roles.length === 0) {
    showError("can't start game with 0 players");
    return;
  }

  return roles;
}

function createShowOrder(roles) {
  const showOrder = roles.map(({ name, count }) => Array(count).fill(name)).flat();
  shuffle(showOrder);
  return showOrder;
}

document.addEventListener("DOMContentLoaded", () => {
  const localRoles = JSON.parse(localStorage.getItem("roles"));

  if (localRoles) {
    localRoles.forEach(({ name, count }) => {
      createRole(name, count);
    });
  }

  elements.addRoleBtn.onclick = () => {
    const roleCount = elements.roleInputsDiv.children.length;
    createRole(`role ${roleCount + 1}`);
    calcTotalPlayersCount();
  };

  elements.playBtn.onclick = () => {
    const roles = createRoles(elements.roleInputsDiv.children);
    if (!roles) {
      return;
    }

    const showOrder = createShowOrder(roles);

    localStorage.setItem("roles", JSON.stringify(roles));

    changeStage("chooseStage", "showStage");
    setNextBtnVisible(false);

    let currentRoleIndex = 0;

    elements.roleIndexText.innerText = `${currentRoleIndex + 1}/${showOrder.length}`;

    document.body.onpointerdown = (evt) => {
      if (evt.target.id == "next-role-btn") return;

      elements.roleText.innerText = showOrder[currentRoleIndex];
    };

    document.body.onpointerup = () => {
      elements.roleText.innerText = "your role";
      setNextBtnVisible(true);
    };

    elements.nextRoleBtn.onclick = () => {
      currentRoleIndex++;
      elements.roleIndexText.innerText = `${currentRoleIndex + 1}/${showOrder.length}`;

      if (currentRoleIndex > showOrder.length - 1) {
        document.body.onpointerdown = null;
        document.body.onpointerup = null;
        changeStage("showStage", "restartStage");
      } else {
        setNextBtnVisible(false);
      }
    };
  };
});
