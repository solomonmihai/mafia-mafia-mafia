const htmlTemplate = `
  <div>
    <input id="name-input" type="text"/>
    <button id="decrement-btn">-</button>
    <span id="counter-text">0</span>
    <button id="increment-btn">+</button>
    <button id="delete-btn">delete</button>
  </div>
`;

export default class RoleInput extends HTMLElement {
  constructor(name, count) {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = htmlTemplate;

    this.nameInput = this.shadowRoot.getElementById("name-input");
    this.counterText = this.shadowRoot.getElementById("counter-text");
    this.decrementBtn = this.shadowRoot.getElementById("decrement-btn");
    this.incrementBtn = this.shadowRoot.getElementById("increment-btn");
    this.deleteBtn = this.shadowRoot.getElementById("delete-btn");

    this.counterVal = count;
    this.nameInput.value = name || "role xxxxxx";

    this.decrementBtn.onclick = () => this.counterVal--;
    this.incrementBtn.onclick = () => this.counterVal++;
    this.deleteBtn.onclick = () => {
      this.remove();
      this.dispatchValueChangedEvent();
    };
  }

  get counterVal() {
    return parseInt(this.getAttribute("counter-value")) || 0;
  }

  set counterVal(value) {
    if (value < 1) return;

    this.setAttribute("counter-value", value);
    this.dispatchValueChangedEvent();
  }

  get roleName() {
    return this.nameInput.value;
  }

  dispatchValueChangedEvent() {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        composed: true,
      })
    );
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "counter-value" && oldVal !== newVal) {
      this.counterText.textContent = newVal;
    }
  }

  static get observedAttributes() {
    return ["counter-value"];
  }
}
