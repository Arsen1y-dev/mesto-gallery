import {
    createCardElement,
    updateCardLikes,
    removeCardElement,
} from "./components/card.js";
import {
    openModalWindow,
    closeModalWindow,
    setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
    getUserInfo,
    getCardList,
    setUserInfo,
    updateAvatar,
    addCard,
    deleteCard,
    changeLikeCardStatus,
} from "./components/api.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");

// Попап редактирования профиля
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileFormButton = profileForm.querySelector(".popup__button");

// Попап добавления карточки
const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardFormButton = cardForm.querySelector(".popup__button");

// Попап картинки
const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

// Попап аватара
const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
const avatarFormButton = avatarForm.querySelector(".popup__button");

// Попап подтверждения удаления
const confirmModalWindow = document.querySelector(".popup_type_remove-card");
const confirmButton = confirmModalWindow.querySelector(".popup__button");

// Попап статистики
const usersStatsModalWindow = document.querySelector(".popup_type_info");
const usersStatsModalInfoList = usersStatsModalWindow.querySelector(".popup__info");
const usersStatsModalUsersList = usersStatsModalWindow.querySelector(".popup__list");

// Попап информации о карточке
const cardInfoModalWindow = document.querySelector(".popup_type_card-info");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalUsersList = cardInfoModalWindow.querySelector(".popup__list");

// Кнопки открытия
const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");
const logo = document.querySelector(".logo");

// Данные профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

// Конфигурация валидации
const validationConfig = {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
};

// Текущий пользователь
let currentUserId = null;
let cardToDeleteId = null;
let cardToDeleteElement = null;

// UX кнопки во время загрузки
const renderLoading = (button, isLoading, defaultText, loadingText) => {
    button.textContent = isLoading ? loadingText : defaultText;
};

// Форматирование даты
const formatDate = (date) =>
    date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

// Открытие картинки
const handlePreviewPicture = ({ name, link }) => {
    imageElement.src = link;
    imageElement.alt = name;
    imageCaption.textContent = name;
    openModalWindow(imageModalWindow);
};

// Сабмит профиля
const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    renderLoading(profileFormButton, true, "Сохранить", "Сохранение...");

    setUserInfo({
        name: profileTitleInput.value.trim(),
        about: profileDescriptionInput.value.trim(),
    })
        .then((userData) => {
            profileTitle.textContent = userData.name;
            profileDescription.textContent = userData.about;
            closeModalWindow(profileFormModalWindow);
        })
        .catch((err) => console.error(err))
        .finally(() => renderLoading(profileFormButton, false, "Сохранить", "Сохранение..."));
};

// Сабмит аватара
const handleAvatarFormSubmit = (evt) => {
    evt.preventDefault();
    renderLoading(avatarFormButton, true, "Сохранить", "Сохранение...");

    updateAvatar({ avatar: avatarInput.value.trim() })
        .then((userData) => {
            profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
            closeModalWindow(avatarFormModalWindow);
        })
        .catch((err) => console.error(err))
        .finally(() => renderLoading(avatarFormButton, false, "Сохранить", "Сохранение..."));
};

// Сабмит карточки
const handleCardFormSubmit = (evt) => {
    evt.preventDefault();
    renderLoading(cardFormButton, true, "Создать", "Создание...");

    addCard({
        name: cardNameInput.value.trim(),
        link: cardLinkInput.value.trim(),
    })
        .then((cardData) => {
            placesWrap.prepend(
                createCardElement(cardData, currentUserId, {
                    onPreviewPicture: handlePreviewPicture,
                    onLikeCard: handleLikeCard,
                    onDeleteCard: handleDeleteCard,
                    onInfoCard: handleInfoCard,
                })
            );
            cardForm.reset();
            closeModalWindow(cardFormModalWindow);
        })
        .catch((err) => console.error(err))
        .finally(() => renderLoading(cardFormButton, false, "Создать", "Создание..."));
};

// Лайк
const handleLikeCard = (cardId, isLiked, cardElement) => {
    changeLikeCardStatus(cardId, isLiked)
        .then((cardData) => {
            updateCardLikes(cardElement, cardData.likes, currentUserId);
        })
        .catch((err) => console.error(err));
};

// Открывает подтверждение удаления и сохраняет текущую карточку
const handleDeleteCard = (cardId, cardElement) => {
    cardToDeleteId = cardId;
    cardToDeleteElement = cardElement;
    openModalWindow(confirmModalWindow);
};

// Подтверждает удаление текущей сохраненной карточки
const handleConfirmDelete = () => {
    if (!cardToDeleteId || !cardToDeleteElement) {
        return;
    }

    renderLoading(confirmButton, true, "Да", "Удаление...");

    deleteCard(cardToDeleteId)
        .then(() => {
            removeCardElement(cardToDeleteElement);
            closeModalWindow(confirmModalWindow);
            cardToDeleteId = null;
            cardToDeleteElement = null;
        })
        .catch((err) => console.error(err))
        .finally(() => {
            renderLoading(confirmButton, false, "Да", "Удаление...");
        });
};

// Вспомогательные функции для шаблонов
const createInfoString = (templateId, term, definition) => {
    const template = document.getElementById(templateId);
    const item = template.content.cloneNode(true);
    item.querySelector(".popup__info-term").textContent = term;
    item.querySelector(".popup__info-description").textContent = definition;
    return item;
};

const createUserItem = (name) => {
    const template = document.getElementById("popup-info-user-preview-template");
    const item = template.content.cloneNode(true);
    item.querySelector(".popup__list-item").textContent = name;
    return item;
};

// Информация о карточке
const handleInfoCard = (data) => {
    cardInfoModalInfoList.replaceChildren();
    cardInfoModalUsersList.replaceChildren();

    cardInfoModalInfoList.append(
        createInfoString("popup-card-info-template", "Описание:", data.name)
    );
    cardInfoModalInfoList.append(
        createInfoString("popup-card-info-template", "Дата создания:", formatDate(new Date(data.createdAt)))
    );
    cardInfoModalInfoList.append(
        createInfoString("popup-card-info-template", "Владелец:", data.owner.name)
    );
    cardInfoModalInfoList.append(
        createInfoString("popup-card-info-template", "Количество лайков:", data.likes.length)
    );

    data.likes.forEach((user) => {
        cardInfoModalUsersList.append(createUserItem(user.name));
    });

    openModalWindow(cardInfoModalWindow);
};

// Статистика пользователей
const handleLogoClick = () => {
    getCardList()
        .then((cards) => {
            usersStatsModalInfoList.replaceChildren();
            usersStatsModalUsersList.replaceChildren();

            usersStatsModalInfoList.append(
                createInfoString("popup-info-definition-template", "Всего карточек:", cards.length)
            );
            usersStatsModalInfoList.append(
                createInfoString(
                    "popup-info-definition-template",
                    "Первая создана:",
                    formatDate(new Date(cards[cards.length - 1].createdAt))
                )
            );
            usersStatsModalInfoList.append(
                createInfoString(
                    "popup-info-definition-template",
                    "Последняя создана:",
                    formatDate(new Date(cards[0].createdAt))
                )
            );

            const usersMap = {};
            cards.forEach((card) => {
                const id = card.owner._id;
                if (!usersMap[id]) {
                    usersMap[id] = { name: card.owner.name, count: 0 };
                }
                usersMap[id].count += 1;
            });

            const users = Object.values(usersMap);
            const maxCards = Math.max(...users.map((u) => u.count));

            usersStatsModalInfoList.append(
                createInfoString("popup-info-definition-template", "Всего пользователей:", users.length)
            );
            usersStatsModalInfoList.append(
                createInfoString("popup-info-definition-template", "Максимум карточек от одного:", maxCards)
            );

            users.forEach((user) => {
                usersStatsModalUsersList.append(createUserItem(user.name));
            });

            openModalWindow(usersStatsModalWindow);
        })
        .catch((err) => console.error(err));
};

// EventListeners форм
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Открытие профиля
openProfileFormButton.addEventListener("click", () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    clearValidation(profileForm, validationConfig);
    openModalWindow(profileFormModalWindow);
});

// Открытие аватара
profileAvatar.addEventListener("click", () => {
    avatarForm.reset();
    clearValidation(avatarForm, validationConfig);
    openModalWindow(avatarFormModalWindow);
});

// Открытие добавления карточки
openCardFormButton.addEventListener("click", () => {
    cardForm.reset();
    clearValidation(cardForm, validationConfig);
    openModalWindow(cardFormModalWindow);
});

// Логотип — статистика
logo.addEventListener("click", handleLogoClick);
confirmButton.addEventListener("click", handleConfirmDelete);

// Обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
    setCloseModalWindowEventListeners(popup);
});

// Включение валидации
enableValidation(validationConfig);

// Загрузка данных с сервера
Promise.all([getCardList(), getUserInfo()])
    .then(([cards, userData]) => {
        currentUserId = userData._id;

        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

        cards.forEach((cardData) => {
            placesWrap.append(
                createCardElement(cardData, currentUserId, {
                    onPreviewPicture: handlePreviewPicture,
                    onLikeCard: handleLikeCard,
                    onDeleteCard: handleDeleteCard,
                    onInfoCard: handleInfoCard,
                })
            );
        });
    })
    .catch((err) => console.error(err));