

class FormRepeterSection extends HTMLElement {
    #shadow;
    #el_form_section_template;
    #el_container;
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
        this.#shadow.getElementById("button-slot").assignedElements()[0].querySelector("button").addEventListener('click', (e) => {
            e.preventDefault();
            const el_new_section = this.#el_form_section_template.cloneNode(true);
            el_new_section.querySelector(".form-repeater__delete-button").addEventListener('click', do_delete);
            this.#el_container.appendChild(el_new_section);
            return false;
        });
    }
}

customElements.define('form-repeater', FormRepeterSection);

export {FormRepeterSection};