import "./index.css";
import { enableValidation, validationConfig } from "../scripts/validation.js";
import Api from "../utils/Api.js";

// Initial Cards Data
const initialCards = [
  // Initial card objects go here...
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
  modal.addEventListener("click", closeModalOnButtonClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEsc);
  modal.removeEventListener("click", closeModalOnOverlayClick);
  modal.removeEventListener("click", closeModalOnButtonClick);
}

const closeModalOnEsc = (event) => {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
};

const closeModalOnOverlayClick = (event) => {
  if (event.target.classList.contains("modal")) {
    closeModal(event.currentTarget);
  }
};

const closeModalOnButtonClick = (event) => {
  if (event.target.classList.contains("modal__close-button")) {
    closeModal(event.currentTarget);
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

// Form Submission Handlers
function handleProfileFormSubmit(event) {
  event.preventDefault();

  const submitButton = profileElements.form.querySelector(
    ".modal__submit-button"
  );
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: profileElements.nameInput.value,
      about: profileElements.jobInput.value,
    })
    .then((data) => {
      profileElements.nameElement.textContent = data.name;
      profileElements.jobElement.textContent = data.about;
      closeModal(profileElements.modal);
    })
    .catch((err) => console.error(`Error: ${err}`))
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleNewPostFormSubmit(event) {
  event.preventDefault();

  const submitButton = newPostElements.form.querySelector(
    ".modal__submit-button"
  );
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .addNewCard({
      name: newPostElements.nameInput.value,
      link: newPostElements.linkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardElements.list.prepend(cardElement);
      newPostElements.form.reset();
      closeModal(newPostElements.modal);
    })
    .catch((err) => console.error(`Error: ${err}`))
    .finally(() => {
      submitButton.textContent = originalText;
    });
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

  const cardID = data._id;
  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", () => {
    const isLiked = cardLikeButton.classList.contains(
      "card__like-button_liked"
    );

    if (isLiked) {
      api
        .deleteLike(cardID)
        .then(() => {
          cardLikeButton.classList.remove("card__like-button_liked");
        })
        .catch((err) => console.error(`Error: ${err}`));
    } else {
      api
        .addLike(cardID)
        .then(() => {
          cardLikeButton.classList.add("card__like-button_liked");
        })
        .catch((err) => console.error(`Error: ${err}`));
    }
  });

  cardDeleteButton.addEventListener("click", () => {
    currentCardElement = cardElement;
    currentCardID = cardID;
    openModal(deleteModal);
  });

  cardImage.addEventListener("click", () => {
    cardElements.modalCaption.textContent = data.name;
    cardElements.modalImage.src = data.link;
    cardElements.modalImage.alt = data.name;
    openModal(cardElements.modal);
  });

  return cardElement;
}

// Edit Avatar Modal
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarProfileButton = document.querySelector(".profile__avatar-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarInput = avatarModal.querySelector("#edit-avatar-input-link");
const profileAvatarImage = document.querySelector(".profile__avatar");

avatarProfileButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = avatarForm.querySelector(".modal__submit-button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  const avatarUrl = avatarInput.value;

  api
    .editAvatar(avatarUrl)
    .then((data) => {
      profileAvatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => console.error(`Error: ${err}`))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteModalForm = document.querySelector("#delete-modal-form");
const cancelButton = document.querySelector(".modal__cancel-button");
const closeButton = document.querySelector("#close-delete-modal");

let currentCardElement;
let currentCardID;

deleteModalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = deleteModalForm.querySelector(".modal__submit-button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Deleting...";

  api
    .deleteCard(currentCardID)
    .then(() => {
      currentCardElement.remove();
      closeModal(deleteModal);
    })
    .catch((err) => console.error(`Error: ${err}`))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

cancelButton.addEventListener("click", () => closeModal(deleteModal));
closeButton.addEventListener("click", () => closeModal(deleteModal));

// API Setup
const api = new Api({
  baseURL: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "85d7a969-7c91-4070-b3f0-78f45cb1eb48",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardElements.list.append(cardElement);
    });

    profileElements.nameElement.textContent = userInfo.name;
    profileElements.jobElement.textContent = userInfo.about;
    profileAvatarImage.src = userInfo.avatar;
  })
  .catch((err) => console.error(err));

// Enable Form Validation
enableValidation(validationConfig);
