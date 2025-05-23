import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMyCards,
  selectCardViewMode,
  selectCardForm,
  removeCard,
  setCardViewMode,
  updateCardForm,
  resetCardForm,
  addCard,
} from "../../redux/slices/buyerDashboardSlice";
import SectionWrapper from "../../components/common/SectionWrapper";
import {
  FaPlus,
  FaTrash,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
} from "react-icons/fa";
import "../../styles/BuyerCards.css";

const BuyerCards = () => {
  const dispatch = useDispatch();
  const cards = useSelector(selectMyCards);
  const viewMode = useSelector(selectCardViewMode);
  const cardForm = useSelector(selectCardForm);

  // Toggle between list and add views
  const toggleAddCardView = () => {
    dispatch(setCardViewMode(viewMode === "list" ? "add" : "list"));
    if (viewMode === "add") {
      dispatch(resetCardForm());
    }
  };

  // Handle card deletion
  const handleDeleteCard = (cardId) => {
    if (window.confirm("Are you sure you want to remove this card?")) {
      dispatch(removeCard(cardId));
    }
  };

  // Handle form input changes
  const handleNameChange = (value) => {
    dispatch(updateCardForm({ nameOnCard: value }));
  };

  const handleCardNumberChange = (value) => {
    dispatch(updateCardForm({ cardNumber: value }));
  };

  const handleExpiryDateChange = (value) => {
    dispatch(updateCardForm({ expiryDate: value }));
  };

  const handleCvvChange = (value) => {
    dispatch(updateCardForm({ cvv: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Create a new card object
    const newCard = {
      id: Date.now().toString(),
      lastFourDigits: cardForm.cardNumber.slice(-4),
      cardType: "mastercard",
    };

    // Add the card to the store
    dispatch(addCard(newCard));

    // Reset the form
    dispatch(resetCardForm());

    // Switch back to list view
    dispatch(setCardViewMode("list"));
  };

  return (
    <div className="BuyerCards">
      <SectionWrapper
        icon={<FaCreditCard className="BuyerSidebar__icon" />}
        title="My Cards"
      >
        {viewMode === "list" ? (
          <div className="BuyerCards__list-view">
            <div className="BuyerCards__header">
              <h3 className="BuyerCards__subtitle">Saved Cards</h3>
              <button
                className="BuyerCards__add-btn"
                onClick={toggleAddCardView}
              >
                <FaPlus /> Add New Card
              </button>
            </div>

            <div className="BuyerCards__cards-list">
              {cards.length > 0 ? (
                cards.map((card) => (
                  <div className="BuyerCards__card-item" key={card.id}>
                    <div className="BuyerCards__card-content">
                      <div className="BuyerCards__card-logo">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
                          alt="Mastercard"
                        />
                      </div>
                      <div className="BuyerCards__card-number">
                        •••• •••• •••• {card.lastFourDigits}
                      </div>
                    </div>
                    <button
                      className="BuyerCards__delete-btn"
                      onClick={() => handleDeleteCard(card.id)}
                      aria-label="Delete card"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <div className="BuyerCards__empty-state">
                  <p>You have no saved payment methods yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="BuyerCards__add-view">
            <div className="BuyerCards__header">
              <h3 className="BuyerCards__subtitle">Add New Card</h3>
            </div>

            <div className="BuyerCards__form">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="BuyerCards__form-row">
                  <div className="BuyerCards__input-field BuyerCards__input-field--full">
                    <div className="BuyerCards__input-container">
                      <div className="BuyerCards__input-icon">
                        <FaCreditCard />
                      </div>
                      <input
                        type="text"
                        id="nameOnCard"
                        name="nameOnCard"
                        value={cardForm.nameOnCard}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Name on card"
                        required
                        className="BuyerCards__input"
                      />
                    </div>
                  </div>
                </div>

                <div className="BuyerCards__form-row">
                  <div className="BuyerCards__input-field BuyerCards__input-field--card-number">
                    <div className="BuyerCards__input-container">
                      <div className="BuyerCards__input-icon">
                        <FaCreditCard />
                      </div>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardForm.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="Card Number"
                        required
                        maxLength={19}
                        pattern="[0-9\\s]{13,19}"
                        className="BuyerCards__input"
                      />
                    </div>
                  </div>
                  <div className="BuyerCards__card-logo">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
                      alt="Mastercard"
                    />
                  </div>
                </div>

                <div className="BuyerCards__form-row">
                  <div className="BuyerCards__input-field BuyerCards__input-field--half">
                    <div className="BuyerCards__input-container">
                      <div className="BuyerCards__input-icon">
                        <FaCalendarAlt />
                      </div>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardForm.expiryDate}
                        onChange={(e) => handleExpiryDateChange(e.target.value)}
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                        pattern="^(0[1-9]|1[0-2])\/([0-9]{2})$"
                        className="BuyerCards__input"
                      />
                    </div>
                  </div>
                  <div className="BuyerCards__input-field BuyerCards__input-field--half">
                    <div className="BuyerCards__input-container">
                      <div className="BuyerCards__input-icon">
                        <FaLock />
                      </div>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={(e) =>
                          handleCvvChange(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="CVV"
                        required
                        maxLength={4}
                        pattern="[0-9]{3,4}"
                        className="BuyerCards__input"
                      />
                    </div>
                  </div>
                </div>

                <div className="BuyerCards__form-actions">
                  <button type="submit" className="BuyerCards__submit-btn">
                    Add Card
                  </button>
                </div>
              </form>
            </div>

            <div className="BuyerCards__form-actions">
              <button
                className="BuyerCards__cancel-btn"
                onClick={toggleAddCardView}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default BuyerCards;
