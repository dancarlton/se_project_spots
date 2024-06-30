const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileCloseButton = document.querySelector("#close-profile-modal");
const profileFormElement = document.querySelector("#edit-profile-form");
const profileNameInput = document.querySelector("#edit-profile-input-name");
const profileJobInput = document.querySelector(
  "#edit-profile-input-description"
);
const profileNameElement = document.querySelector(".profile__title");
const profileJobElement = document.querySelector(".profile__description");

// New Post Elements
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = document.querySelector("#close-new-post-modal");
const newPostLinkInput = document.querySelector("#new-post-image-link");
const newPostprofileNameInput = document.querySelector(
  "#new-post-input-description"
);
const newPostFormElement = document.querySelector("#new-post-form");
const newPostLink = document.querySelector("#card-link");
const newPostName = document.querySelector("#card-name");

// Functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEsc);
  document.addEventListener("keydown", closeModalOnOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEsc);
  document.removeEventListener("keydown", closeModalOnOverlayClick);
}

const closeModalOnEsc = (event) => {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
};

const closeModalOnOverlayClick = () => {
  const modalMain = document.querySelector(".modal");
  if (modalMain.contains(".model_opened")) {
    closeModal(modalMain);
  }
};

// Event Listeners
profileEditButton.addEventListener("click", () => {
  profileNameInput.value = profileNameElement.textContent;
  profileJobInput.value = profileJobElement.textContent;
  openModal(editProfileModal);
});

profileCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

newPostFormElement.addEventListener("submit", handleNewPostFormSubmit);

// Form Submissions
function handleProfileFormSubmit(event) {
  event.preventDefault();

  profileNameElement.textContent = profileNameInput.value;
  profileJobElement.textContent = profileJobInput.value;

  closeModal(editProfileModal);
}

function handleNewPostFormSubmit(event) {
  event.preventDefault();

  const newCardData = {
    name: newPostprofileNameInput.value,
    link: newPostLinkInput.value,
  };

  const cardElement = getCardElement(newCardData);
  cardList.prepend(cardElement);

  newPostFormElement.reset();
  // toggleButtonState(buttonElement);
  closeModal(newPostModal);
}

// Card Element
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");
const cardModal = document.querySelector("#preview-modal");
const cardModalImage = cardModal.querySelector(".modal__image");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardModalCaption = cardModal.querySelector(".modal__caption");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    cardModalCaption.textContent = data.name;
    cardModalImage.src = data.link;
    cardModalImage.alt = data.name;
    openModal(cardModal);
  });

  return cardElement;
}

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

cardModalImage.addEventListener("click", () => {
  closeModal(cardModal);
});

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardList.append(cardElement);
});
