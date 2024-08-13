import "./index.css";
import { enableValidation, validationConfig } from "../scripts/validation.js";
import Api from "../utils/Api.js";

// Initial Cards Data
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
const profileElements = {
  editButton: document.querySelector(".profile__edit-button"),
  modal: document.querySelector("#edit-profile-modal"),
  closeButton: document.querySelector("#close-profile-modal"),
  form: document.querySelector("#edit-profile-form"),
  nameInput: document.querySelector("#edit-profile-input-name"),
  jobInput: document.querySelector("#edit-profile-input-description"),
  nameElement: document.querySelector(".profile__title"),
  jobElement: document.querySelector(".profile__description"),
};

// New Post Elements
const newPostElements = {
  button: document.querySelector(".profile__add-button"),
  modal: document.querySelector("#new-post-modal"),
  closeButton: document.querySelector("#close-new-post-modal"),
  linkInput: document.querySelector("#new-post-image-link"),
  nameInput: document.querySelector("#new-post-input-description"),
  form: document.querySelector("#new-post-form"),
};

// Card Elements
const cardElements = {
  template: document.querySelector("#card-template"),
  list: document.querySelector(".cards__list"),
  modal: document.querySelector("#preview-modal"),
  modalImage: document.querySelector(".modal__image"),
  modalCloseButton: document.querySelector(".modal__close-button"),
  modalCaption: document.querySelector(".modal__caption"),
};

// Utility Functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEsc);
  modal.addEventListener("click", closeModalOnOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEsc);
  modal.removeEventListener("click", closeModalOnOverlayClick);
}

const closeModalOnEsc = (event) => {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
};

const closeModalOnOverlayClick = (event) => {
  const openedModal = document.querySelector(".modal_opened");
  if (
    openedModal &&
    !openedModal
      .querySelector(".modal__container, .modal__content")
      .contains(event.target)
  ) {
    closeModal(openedModal);
  }
};

// Event Listeners
profileElements.editButton.addEventListener("click", () => {
  profileElements.nameInput.value = profileElements.nameElement.textContent;
  profileElements.jobInput.value = profileElements.jobElement.textContent;
  openModal(profileElements.modal);
});

profileElements.closeButton.addEventListener("click", () => {
  closeModal(profileElements.modal);
});

newPostElements.button.addEventListener("click", () => {
  openModal(newPostElements.modal);
});

newPostElements.closeButton.addEventListener("click", () => {
  closeModal(newPostElements.modal);
});

profileElements.form.addEventListener("submit", handleProfileFormSubmit);
newPostElements.form.addEventListener("submit", handleNewPostFormSubmit);

cardElements.modalCloseButton.addEventListener("click", () => {
  closeModal(cardElements.modal);
});

cardElements.modalImage.addEventListener("click", () => {
  closeModal(cardElements.modal);
});

// Form Submission Handlers
function handleProfileFormSubmit(event) {
  event.preventDefault();

  profileElements.nameElement.textContent = profileElements.nameInput.value;
  profileElements.jobElement.textContent = profileElements.jobInput.value;

  closeModal(profileElements.modal);
}

function handleNewPostFormSubmit(event) {
  event.preventDefault();

  const newCardData = {
    name: newPostElements.nameInput.value,
    link: newPostElements.linkInput.value,
  };

  const cardElement = getCardElement(newCardData);
  cardElements.list.prepend(cardElement);

  newPostElements.form.reset();
  closeModal(newPostElements.modal);
}

// Card Creation Function
function getCardElement(data) {
  const cardElement = cardElements.template.content
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
    cardElements.modalCaption.textContent = data.name;
    cardElements.modalImage.src = data.link;
    cardElements.modalImage.alt = data.name;
    openModal(cardElements.modal);
  });

  return cardElement;
}

// API Setup
const api = new Api({
  baseURL: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "85d7a969-7c91-4070-b3f0-78f45cb1eb48",
    "Content-Type": "application/json",
  },
});

api
  .getInitialCards()
  .then((cards) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardElements.list.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

api.getAppInfo().then((cards) => {
  console.log(cards);
});

// Enable Form Validation
enableValidation(validationConfig);
