const getTemplate = () => {
    return document
        .getElementById("card-template")
        .content.querySelector(".card")
        .cloneNode(true);
};

export const updateCardLikes = (cardElement, likes, currentUserId) => {
    const likeButton = cardElement.querySelector(".card__like-button");
    const likeCount = cardElement.querySelector(".card__like-count");
    const isLiked = likes.some((user) => user._id === currentUserId);

    likeCount.textContent = likes.length;
    likeButton.classList.toggle("card__like-button_is-active", isLiked);
};

export const removeCardElement = (cardElement) => {
    cardElement.remove();
};

export const createCardElement = (
    data,
    currentUserId,
    { onPreviewPicture, onLikeCard, onDeleteCard, onInfoCard }
) => {
    const cardElement = getTemplate();
    const likeButton = cardElement.querySelector(".card__like-button");
    const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
    const infoButton = cardElement.querySelector(".card__control-button_type_info");
    const cardImage = cardElement.querySelector(".card__image");

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardElement.querySelector(".card__title").textContent = data.name;
    updateCardLikes(cardElement, data.likes, currentUserId);

    if (data.owner._id === currentUserId) {
        deleteButton.addEventListener("click", () => {
            onDeleteCard(data._id, cardElement);
        });
    } else {
        deleteButton.remove();
    }

    likeButton.addEventListener("click", () => {
        const liked = likeButton.classList.contains("card__like-button_is-active");
        onLikeCard(data._id, liked, cardElement);
    });

    if (infoButton) {
        infoButton.addEventListener("click", () => {
            onInfoCard(data);
        });
    }

    cardImage.addEventListener("click", () => {
        onPreviewPicture({ name: data.name, link: data.link });
    });

    return cardElement;
};