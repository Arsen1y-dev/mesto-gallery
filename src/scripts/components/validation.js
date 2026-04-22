// Показывает ошибку
const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
};

// Скрывает ошибку
const hideInputError = (formElement, inputElement, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = "";
};

// Поля «имя / название»: допустимые символы по pattern + сообщение в data-error-message;
// проверяем значение после trim(), чтобы «   » и пробелы по краям не обходили правила.
const isTrimmedPatternTextField = (inputElement) =>
    inputElement.tagName === "INPUT" &&
    inputElement.type === "text" &&
    inputElement.hasAttribute("pattern") &&
    Boolean(inputElement.dataset.errorMessage);

// Проверяет валидность поля
const checkInputValidity = (formElement, inputElement, config) => {
    if (isTrimmedPatternTextField(inputElement)) {
        const trimmed = inputElement.value.trim();
        const minLen = inputElement.minLength;
        const maxLen = inputElement.maxLength;
        const patternAttr = inputElement.getAttribute("pattern");
        let patternRegex;

        try {
            patternRegex = new RegExp(patternAttr);
        } catch {
            patternRegex = /(?!)/;
        }

        let message = "";

        if (trimmed.length === 0) {
            if (inputElement.required) {
                message = "Заполните это поле.";
            }
        } else if (minLen > 0 && trimmed.length < minLen) {
            message = `Минимальное количество символов — ${minLen}. Сейчас — ${trimmed.length}.`;
        } else if (maxLen > 0 && trimmed.length > maxLen) {
            message = `Максимальное количество символов — ${maxLen}. Сейчас — ${trimmed.length}.`;
        } else if (/ {2,}/.test(trimmed)) {
            message = "Нельзя использовать два и более пробела подряд.";
        } else if (!patternRegex.test(trimmed)) {
            message = inputElement.dataset.errorMessage;
        }

        inputElement.setCustomValidity(message);
    } else if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity("");
    }

    if (!inputElement.validity.valid) {
        showInputError(
            formElement,
            inputElement,
            inputElement.validationMessage || inputElement.dataset.errorMessage,
            config
        );
    } else {
        hideInputError(formElement, inputElement, config);
    }
};

// Проверяет, есть ли хотя бы одно невалидное поле
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

// Отключает кнопку сабмита
const disableSubmitButton = (buttonElement, config) => {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
};

// Включает кнопку сабмита
const enableSubmitButton = (buttonElement, config) => {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
};

// Переключает состояние кнопки
const toggleButtonState = (inputList, buttonElement, config) => {
    if (hasInvalidInput(inputList)) {
        disableSubmitButton(buttonElement, config);
    } else {
        enableSubmitButton(buttonElement, config);
    }
};

// Устанавливает слушатели событий
const setEventListeners = (formElement, config) => {
    const inputList = Array.from(
        formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    // Изначально проверяем состояние кнопки
    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};

// Включение валидации для всех форм
export const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener("submit", (evt) => {
            evt.preventDefault();
        });
        setEventListeners(formElement, config);
    });
};

// Очистка валидации
export const clearValidation = (formElement, config) => {
    const inputList = Array.from(
        formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    // Сбрасываем ошибки полей и кастомные сообщения
    inputList.forEach((inputElement) => {
        inputElement.setCustomValidity("");
        hideInputError(formElement, inputElement, config);
    });

    // Делаем кнопку неактивной
    disableSubmitButton(buttonElement, config);
};