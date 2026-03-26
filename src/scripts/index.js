import { initialCards } from "./cards.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import {
    openModalWindow,
    closeModalWindow,
    setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");

// Попап редактирования профиля
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
    ".popup__input_type_description"
);

// Попап добавления карточки
const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

// Попап картинки
const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

// Кнопки открытия
const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

// Данные профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

// Попап аватара
const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

// Конфигурация валидации
const validationConfig = {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
};

// Функция открытия картинки
const handlePreviewPicture = ({ name, link }) => {
    imageElement.src = link;
    imageElement.alt = name;
    imageCaption.textContent = name;
    openModalWindow(imageModalWindow);
};

// Сабмит профиля
const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileTitle.textContent = profileTitleInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModalWindow(profileFormModalWindow);
};

// Сабмит аватара
const handleAvatarFromSubmit = (evt) => {
    evt.preventDefault();
    profileAvatar.style.backgroundImage = `url(${avatarInput.value})`;
    closeModalWindow(avatarFormModalWindow);
};

// Сабмит карточки
const handleCardFormSubmit = (evt) => {
    evt.preventDefault();
    placesWrap.prepend(
        createCardElement(
            {
                name: cardNameInput.value,
                link: cardLinkInput.value,
            },
            {
                onPreviewPicture: handlePreviewPicture,
                onLikeIcon: likeCard,
                onDeleteCard: deleteCard,
            }
        )
    );

    closeModalWindow(cardFormModalWindow);
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

// Открытие профиля
openProfileFormButton.addEventListener("click", () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;

    // Очищаем ошибки валидации перед открытием
    clearValidation(profileForm, validationConfig);

    openModalWindow(profileFormModalWindow);
});

// Открытие аватара
profileAvatar.addEventListener("click", () => {
    avatarForm.reset();

    // Очищаем ошибки валидации
    clearValidation(avatarForm, validationConfig);

    openModalWindow(avatarFormModalWindow);
});

// Открытие добавления карточки
openCardFormButton.addEventListener("click", () => {
    cardForm.reset();

    // Очищаем ошибки валидации
    clearValidation(cardForm, validationConfig);

    openModalWindow(cardFormModalWindow);
});

// Отображение карточек
initialCards.forEach((data) => {
    placesWrap.append(
        createCardElement(data, {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: likeCard,
            onDeleteCard: deleteCard,
        })
    );
});

// Обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
    setCloseModalWindowEventListeners(popup);
});

// Включение валидации
enableValidation(validationConfig);