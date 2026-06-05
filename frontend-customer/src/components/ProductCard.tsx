"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useApp } from "@/lib/context";

interface ProductCardProps {
  id: number;
  name: string;
  category?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  isSale?: boolean;
  stock?: number;
}

export default function ProductCard({
  id,
  name,
  category = "Rings",
  price,
  originalPrice,
  imageUrl = "/placeholder-ring.jpg",
  rating = 4.5,
  reviewCount = 128,
  isSale = false,
  stock = 10,
}: ProductCardProps) {
  const { addToCart } = useApp();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) return;
    addToCart({ product_id: id, product_name: name, price: Number(price), stock: stock ?? 10 });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${id}`}
      style={{ textDecoration: "none" }}
    >
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          background: "rgba(250, 243, 232, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 154, 108, 0.25)",
          boxShadow: isHovered
            ? "0 16px 48px rgba(101, 60, 20, 0.18), 0 4px 16px rgba(101, 60, 20, 0.10)"
            : "0 4px 20px rgba(101, 60, 20, 0.08), 0 1px 4px rgba(101, 60, 20, 0.05)",
          transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
          cursor: "pointer",
        }}
      >
        {/* Image Area */}
        <div
          style={{
            position: "relative",
            height: "220px",
            overflow: "hidden",
            background:
              "linear-gradient(145deg, #F5EDDC 0%, #EDE0C8 50%, #E4D0B0 100%)",
          }}
        >
          {/* Subtle texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)",
              zIndex: 1,
            }}
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Placeholder ring SVG if no image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <circle
                cx="45"
                cy="45"
                r="30"
                stroke="rgba(139,90,43,0.2)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="45"
                cy="45"
                r="18"
                stroke="rgba(196,154,108,0.3)"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="45" cy="15" r="5" fill="rgba(212,169,106,0.5)" />
            </svg>
          </div>

          {/* Badges */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              zIndex: 10,
            }}
          >

            {isSale && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#FAF3E8",
                  letterSpacing: "0.5px",
                  background:
                    "linear-gradient(135deg, #8B5A2B, #C49A6C)",
                  padding: "3px 9px",
                  borderRadius: "20px",
                }}
              >
                Sale
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 10,
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(250, 243, 232, 0.85)",
              backdropFilter: "blur(8px)",
              transition: "all 0.25s",
              transform: isWishlisted ? "scale(1.15)" : "scale(1)",
              boxShadow: "0 2px 8px rgba(101, 60, 20, 0.12)",
            }}
          >
            <Heart
              size={15}
              fill={isWishlisted ? "#8B5A2B" : "none"}
              color={isWishlisted ? "#8B5A2B" : "#8B6240"}
            />
          </button>

          {/* Discount badge */}
          {discount > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                zIndex: 10,
                background: "rgba(139, 90, 43, 0.9)",
                color: "#FAF3E8",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: "20px",
              }}
            >
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px 16px" }}>

          {/* Name */}
          <h3
            style={{
              margin: "0 0 8px",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#3D1F08",
              lineHeight: "1.3",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </h3>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  fill={star <= Math.floor(rating) ? "#C49A6C" : "none"}
                  color={star <= rating ? "#C49A6C" : "#D4B896"}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#9A7050",
              }}
            >
              ({reviewCount})
            </span>
          </div>

          {/* Price + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#4A2E12",
                }}
              >
                ${price.toLocaleString()}
              </span>
              {originalPrice && (
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#B09070",
                    textDecoration: "line-through",
                    marginLeft: "6px",
                  }}
                >
                  ${originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.25s",
                background: addedToCart
                  ? "linear-gradient(135deg, #5C8A2B, #7CB97A)"
                  : "linear-gradient(135deg, #8B5A2B 0%, #C49A6C 100%)",
                color: "#FAF3E8",
                boxShadow: "0 3px 12px rgba(139, 90, 43, 0.3)",
                transform: addedToCart ? "scale(0.96)" : "scale(1)",
                whiteSpace: "nowrap",
              }}
            >
              <ShoppingCart size={12} />
              {addedToCart ? "Added!" : "Add To Cart"}
            </button>
          </div>

          {/* Stock indicator */}
          {stock <= 5 && stock > 0 && (
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#A05020",
                fontWeight: 500,
              }}
            >
              Only {stock} left in stock
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}