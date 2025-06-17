import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import Product from "./Product";
import instance from "./axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await instance.get("/product");
        setProducts(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const carousels = carouselRefs.map((ref) => ref.current);
    if (!carousels.every((carousel) => carousel) || products.length === 0)
      return;

    const scrollWidths = carousels.map((carousel) => carousel.scrollWidth);
    const clientWidths = carousels.map((carousel) => carousel.clientWidth);
    const scrollPositions = [0, 0, 0];
    const scrollSpeed = 2; // Pixels per frame
    const scrollInterval = 10; // ~60fps

    /*const scrollCarousel = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollWidth - clientWidth) {
        scrollPosition = 0; // back to start
      }
      carousel.scrollTo({ left: scrollPosition, behavior: "smooth" });
    };

    const intervalId = setInterval(scrollCarousel, scrollInterval);
    return () => clearInterval(intervalId);
  }, [products]);*/
    let intervalId;

    const scrollCarousels = () => {
      carousels.forEach((carousel, index) => {
        scrollPositions[index] += scrollSpeed;
        if (
          scrollPositions[index] >=
          scrollWidths[index] - clientWidths[index]
        ) {
          scrollPositions[index] = 0; // Loop back
        }
        carousel.scrollTo({ left: scrollPositions[index], behavior: "smooth" });
      });
    };

    const startScrolling = () => {
      intervalId = setInterval(scrollCarousels, scrollInterval);
    };

    const stopScrolling = () => {
      clearInterval(intervalId);
    };

    carousels.forEach((carousel) => {
      carousel.addEventListener("mouseenter", stopScrolling);
      carousel.addEventListener("mouseleave", startScrolling);
    });

    startScrolling();

    return () => {
      clearInterval(intervalId);
      carousels.forEach((carousel) => {
        carousel.removeEventListener("mouseenter", stopScrolling);
        carousel.removeEventListener("mouseleave", startScrolling);
      });
    };
  }, [products]);

  const scrollCarousel = (index, direction) => {
    const carousel = carouselRefs[index].current;
    if (!carousel) return;
    let scrollAmount;
    if (index === 0) {
      // Row 1: Scroll by 1 product
      const productWidth = carousel.querySelector(".product").offsetWidth + 20;
      scrollAmount = productWidth * (direction === "left" ? -1 : 1);
    } else {
      // Rows 2 & 3: Scroll by group width
      const groupWidth =
        carousel.querySelector(".carousel__group").offsetWidth + 20;
      scrollAmount = groupWidth * (direction === "left" ? -1 : 1);
    }
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Group products for rows 2 and 3
  const groupProducts = (products, size) => {
    const groups = [];
    for (let i = 0; i < products.length; i += size) {
      groups.push(products.slice(i, i + size));
    }
    return groups;
  };

  const row2Groups = groupProducts(products, 3); // 3 products per group
  const row3Groups = groupProducts(products, 2); // 2 products per group

  if (loading) {
    return <div className="home__loading">Loading products...</div>;
  }

  if (error) {
    return <div className="home__error">Error: {error}</div>;
  }

  return (
    <div className="home">
      <div className="home_container">
        <img
          className="home_image"
          src="https://m.media-amazon.com/images/I/81mQrJzvBgL._SX3000_.jpg"
          alt="E-commerce banner"
        />
        {/* Row 1: 1 product */}
        <div className="home_row">
          <div
            className="home__carousel home__carousel--one"
            ref={carouselRefs[0]}
            role="region"
            aria-label="Single product carousel"
          >
            {products.map((product) => (
              <Product
                key={`${product.product_id}-row1`}
                id={product.product_id}
                title={product.product_name}
                image={product.product_img}
                price={product.product_price}
                rating={product.product_rating}
              />
            ))}
          </div>
          <button
            className="home__carousel__prev"
            onClick={() => scrollCarousel(0, "left")}
          >
            &lt;
          </button>
          <button
            className="home__carousel__next"
            onClick={() => scrollCarousel(0, "right")}
          >
            &gt;
          </button>
        </div>
        {/* Row 2: 3 products */}
        <div className="home_row">
          <div
            className="home__carousel home__carousel--three"
            ref={carouselRefs[1]}
            role="region"
            aria-label="Three products carousel"
          >
            {row2Groups.map((group, groupIndex) => (
              <div key={`group-row2-${groupIndex}`} className="carousel__group">
                {group.map((product) => (
                  <Product
                    key={`${product.product_id}-row2`}
                    id={product.product_id}
                    title={product.product_name}
                    image={product.product_img}
                    price={product.product_price}
                    rating={product.product_rating}
                  />
                ))}
              </div>
            ))}
          </div>
          <button
            className="home__carousel__prev"
            onClick={() => scrollCarousel(1, "left")}
          >
            &lt;
          </button>
          <button
            className="home__carousel__next"
            onClick={() => scrollCarousel(1, "right")}
          >
            &gt;
          </button>
        </div>
        {/* Row 3: 2 products */}
        <div className="home_row">
          <div
            className="home__carousel home__carousel--two"
            ref={carouselRefs[2]}
            role="region"
            aria-label="Two products carousel"
          >
            {row3Groups.map((group, groupIndex) => (
              <div key={`group-row3-${groupIndex}`} className="carousel__group">
                {group.map((product) => (
                  <Product
                    key={`${product.product_id}-row3`}
                    id={product.product_id}
                    title={product.product_name}
                    image={product.product_img}
                    price={product.product_price}
                    rating={product.product_rating}
                  />
                ))}
              </div>
            ))}
          </div>
          <button
            className="home__carousel__prev"
            onClick={() => scrollCarousel(2, "left")}
          >
            &lt;
          </button>
          <button
            className="home__carousel__next"
            onClick={() => scrollCarousel(2, "right")}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}



export default Home;
