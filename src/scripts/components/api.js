const config = {
    baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
    headers: {
        authorization: "93002ca7-31c0-49d2-8813-41c36f60a9f4",
        "Content-Type": "application/json",
    },
};

const getResponseData = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

// Получение данных пользователя
export const getUserInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers,
    }).then(getResponseData);
};

// Получение карточек
export const getCardList = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers,
    }).then(getResponseData);
};

// Обновление профиля
export const setUserInfo = ({ name, about }) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: "PATCH",
        headers: config.headers,
        body: JSON.stringify({ name, about }),
    }).then(getResponseData);
};

// Обновление аватара
export const updateAvatar = ({ avatar }) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: config.headers,
        body: JSON.stringify({ avatar }),
    }).then(getResponseData);
};

// Добавление карточки
export const addCard = ({ name, link }) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({ name, link }),
    }).then(getResponseData);
};

// Удаление карточки
export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: config.headers,
    }).then(getResponseData);
};

// Лайк / дизлайк
export const changeLikeCardStatus = (cardId, isLiked) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: isLiked ? "DELETE" : "PUT",
        headers: config.headers,
    }).then(getResponseData);
};