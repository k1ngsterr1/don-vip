"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface DiscountedGame {
  image: string | StaticImport;
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
}

interface MemoryGameProps {
  onComplete: (bonusDiscount: number) => void;
  couponDiscount: number;
  couponCode: string;
  discountedGames?: DiscountedGame[];
}

type Card = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

export function MemoryGame({
  onComplete,
  couponDiscount,
  couponCode,
  discountedGames = [],
}: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [bonusDiscount, setBonusDiscount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Game icons
  const icons = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎰", "🎪"];

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pairs of cards
    const cardValues = [...icons.slice(0, 4), ...icons.slice(0, 4)];

    // Shuffle cards
    const shuffledCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
    setBonusDiscount(0);
  };

  const handleCardClick = (id: number) => {
    // Prevent clicking if already two cards are flipped or the card is already flipped/matched
    if (
      flippedCards.length === 2 ||
      cards[id].flipped ||
      cards[id].matched ||
      isAnimating
    ) {
      return;
    }

    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);

    // Add to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);

    // Check if two cards are flipped
    if (updatedFlippedCards.length === 2) {
      setIsAnimating(true);
      setMoves((prev) => prev + 1);

      // Check if the cards match
      const [firstCardId, secondCardId] = updatedFlippedCards;
      if (cards[firstCardId].value === cards[secondCardId].value) {
        // Cards match
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstCardId].matched = true;
          matchedCards[secondCardId].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs((prev) => prev + 1);
          setIsAnimating(false);

          // Check if all pairs are matched
          if (matchedPairs + 1 === icons.slice(0, 4).length) {
            handleGameComplete();
          }
        }, 500);
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstCardId].flipped = false;
          resetCards[secondCardId].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsAnimating(false);
        }, 1000);
      }
    }
  };

  const handleGameComplete = () => {
    setGameCompleted(true);

    // Calculate bonus discount based on moves
    // Fewer moves = higher bonus
    let bonus = 0;
    if (moves <= 6) {
      bonus = 5; // 5% extra discount for excellent performance
      triggerConfetti();
    } else if (moves <= 8) {
      bonus = 3; // 3% extra discount for good performance
    } else {
      bonus = 1; // 1% extra discount for completing the game
    }

    setBonusDiscount(bonus);

    // Notify parent component after a delay
    setTimeout(() => {
      onComplete(bonus);
    }, 3000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ru-RU") + " ₽";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-medium text-gray-800">
              Промокод активирован
            </h3>
            <div className="flex items-center mt-1">
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {couponCode}
              </div>
              <div className="ml-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                -{couponDiscount}%
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg">
            <Sparkles className="text-blue-500" size={20} />
          </div>
        </div>
        {discountedGames && discountedGames.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Игры со скидкой:
            </h4>
            <div className="space-y-2">
              {discountedGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
                      <Image
                        src={game.image}
                        alt={game.name}
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-sm font-medium">{game.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 line-through mr-2">
                      {game.originalPrice && formatPrice(game.originalPrice)}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {game.discountedPrice &&
                        formatPrice(game.discountedPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
