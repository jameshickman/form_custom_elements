class FormDependantSection extends HTMLElement {
    #shadow;
    #el_controller;
    #el_container;
    #active_values = [];
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#shadow.innerHTML = `
            <style>
                .show {
                    display: block;
                }
                .hide {
                    display: none;
                }
            </style>
            <div class="hide" id="container">
                <slot/>
            </div>
        `;
        this.#el_container = this.#shadow.getElementById("container");
        this.#active_values = this.dataset.activate.split(',');
        this.#el_controller = document.querySelector(this.dataset.controller);
        this.#el_controller.addEventListener('change', (e) => {
            if (this.#active_values.includes(this.#el_controller.value)) {
                this.#el_container.classList.remove("hide");
                this.#el_container.classList.add("show");
            }
            else {
                this.#el_container.classList.remove("show");
                this.#el_container.classList.add("hide");
            }
        });
    }

    connectedCallback() {
        
    }
}

customElements.define('form-section', FormDependantSection);

export {FormDependantSection};