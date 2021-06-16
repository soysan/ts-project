import Cmp from './base-component';
import * as validation from '../util/validation';
import { autobind as Autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';


export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    mandayInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input')

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.mandayInputElement = this.element.querySelector('#manday')! as HTMLInputElement;


        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    renderContent() { }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredManday = this.mandayInputElement.value;

        const titleValidatable: validation.Validatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable: validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const mandayValidatable: validation.Validatable = {
            value: +enteredManday,
            required: true,
            min: 1,
            max: 1000,
        }
        if (
            !validation.validate(titleValidatable) ||
            !validation.validate(descriptionValidatable) ||
            !validation.validate(mandayValidatable)
        ) {
            alert('wrong input try again');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredManday]
        }
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, manday] = userInput;
            projectState.addProject(title, desc, manday);
            this.clearInputs();
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.mandayInputElement.value = '';
    }
}
