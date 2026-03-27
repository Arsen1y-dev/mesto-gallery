const getTemplate = () => {
    return document
        .getElementById("card-template")
        .content.querySelector(".card")
        .cloneNode(true);
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
    const likeCount = cardElement.querySelector(".card__like-count");

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardElement.querySelector(".card__title").textContent = data.name;

    likeCount.textContent = data.likes.length;

    const isLiked = data.likes.some((user) => user._id === currentUserId);
    if (isLiked) {
        likeButton.classList.add("card__like-button_is-active");
    }

    if (data.owner._id !== currentUserId) {
        deleteButton.remove();
    }

    likeButton.addEventListener("click", () => {
        const liked = likeButton.classList.contains("card__like-button_is-active");
        onLikeCard(data._id, liked, likeButton, likeCount);
    });

    if (data.owner._id === currentUserId) {
        deleteButton.addEventListener("click", () => {
            onDeleteCard(data._id, cardElement);
        });
    }

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