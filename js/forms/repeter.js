import {uuidv4} from "../utility.js";

const fix_ids = (el_section) => {
    const els_labels = el_section.querySelectorAll("label");
    for (const el_label of els_labels) {
        const new_id = uuidv4();
        const el_form_element = el_section.querySelector("[id=" + el_label.htmlFor + "]");
        el_label.htmlFor = new_id;
        el_form_element.id = new_id;
    }
    return el_section;
}

class FormRepeterSection extends HTMLElement {
    #shadow;
    #el_form_section_template;
    #el_container;
    #el_button;
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#shadow.innerHTML = `
            <div>
                <div>
                    <slot id="form-slot" name="form" />
                </div>
                <div>
                    <slot id="button-slot" name="button" />
                </div>
            </div>
        `;
        this.#el_button = this.#shadow.getElementById("button-slot").assignedElements()[0].querySelector("button");
    }

    connectedCallback() {
        const do_delete = (e) => {
            e.preventDefault();
            let el_container = e.currentTarget.parentElement;
            while(!el_container.classList.contains("form-repeater__container")) {
                el_container = el_container.parentElement;
            }
            this.#el_container.removeChild(el_container);
            return false;
        }
        this.#el_container = this.#shadow.getElementById("form-slot").assignedElements()[0];
        const el_template = this.#el_container.children[0];
        this.#el_form_section_template = el_template.cloneNode(true);
        this.#el_container.removeChild(el_template);
        for (const el_existing of this.#el_container.children) {
            el_existing.querySelector(".form-repeater__delete-button").addEventListener('click', do_delete);
        }
        this.#el_button.addEventListener('click', (e) => {
            e.preventDefault();
            const el_new_section = this.#el_form_section_template.cloneNode(true);
            el_new_section.querySelector(".form-repeater__delete-button").addEventListener('click', do_delete);
            this.#el_container.appendChild(fix_ids(el_new_section));
            return false;
        });
    }

    addItem(data) {
        this.#el_button.dispatchEvent(new Event('click'));
        const el_new = this.#el_container.lastChild;
        for (const field in data) {
            const el_form_element = el_new.querySelector("[name=" + field + "]");
            el_form_element.value = data[field];
        }
    }
}

customElements.define('form-repeater', FormRepeterSection);

export {FormRepeterSection};