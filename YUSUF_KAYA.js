(() => {
    const STORAGE_PRODUCTS = "carouselProducts";
    const STORAGE_LIKED = "likedProducts";

    const init = () => {
        if (!location.hostname.includes("e-bebek.com") || location.pathname !== "/") {
            console.log("wrong page");
            return;
        }

        buildHTML();
        buildCSS();
        loadProducts();
        initEvents();
    };

    const buildHTML = () => {
        const banner = document.querySelector(".Section2A");
        if (!banner) return;

        const html = `
            <div class="banner">
                <div class="container">
                    <h2 class="carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
                    <div style="position:relative;">
                        <div class="carousel-products"></div>
                        <button class="carousel-left-arrow" aria-label="Swipe left">
                        <i></i>
                      </button>
                      <button class="carousel-right-arrow" aria-label="Swipe right">
                        <i></i>
                      </button>
                    </div>
                </div>
            </div>
        `;
        banner.insertAdjacentHTML("afterbegin", html);
    };

    const buildCSS = () => {
        const style = document.createElement("style");
        style.textContent = `
            .carousel-title {
                color: rgb(43, 47, 51);
                font-size: 24px;
                margin: 0;
                font-weight: 500;
                font-family: 'Quicksand-SemiBold';
            }
    
            .carousel-products {
                display: flex;
                align-items: center;
                overflow-x: auto;
                padding: 20px 0;
                scrollbar-width: none;
                -ms-overflow-style: none;
                cursor: grab;
            }
    
            .carousel-products.dragging {
                cursor: grabbing;
            }
    
            .carousel-products::-webkit-scrollbar {
                display: none;
            }
    
            .carousel-product-item {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-width: 243px;
                height: 383px;
                border: 1px solid #f2f5f7;
                border-radius: 8px;
                margin-right: 16px;
                cursor: pointer;
            }
    
            .carousel-product-item:hover {
                border-color: #CDCDCD;
            }
    
            .carousel-product-item img {
                width: 100%;
                margin-bottom: 10px;
            }
    
            .product-like {
                position: absolute;
                top: 0;
                right: 0;
                width: 50px;
                height: 50px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
    
            .bi-heart {
                stroke: #A2B1BC;
                stroke-width: 1.4;
                fill: none;
            }
    
            .product-like:hover .bi-heart {
                stroke: #FF8A00;
            }
    
            .product-like.liked .bi-heart {
                fill: #FF8A00;
                stroke: #FF8A00;
            }
    
            .product-item-content {
                padding: 0 10px 13px;
            }
    
            .carousel-product-item h2 {
                font-size: 12px;
                font-weight: 500;
                line-height: 1.22;
                color: #2b2f33;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-bottom: 10px;
            }
    
            .carousel-product-item .product-price-container {
                display: flex;
                flex-direction: column;
                padding: 6px 10px 15px;
            }
    
            .product-item-price {
                font-size: 20px;
                font-weight: 600;
                line-height: 20px;
            }
    
            .product-original-price {
                display: flex;
                font-size: 12px;
                color: #a2b1bc;
            }
    
            .product-discount-percentage {
                background-color: #00a365;
                color: #fff;
                font-size: 12px;
                padding: 0 4px;
                border-radius: 16px;
                margin-left: 8px;
            }
    
            .carousel-left-arrow,
            .carousel-right-arrow {
                width: 40px;
                height: 40px;
                background-color: #fff;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                box-shadow: 0 6px 2px 0 #b0b0b003,
                            0 2px 9px 0 #b0b0b014,
                            0 2px 4px 0 #b0b0b024,
                            0 0 1px 0 #b0b0b03d,
                            0 0 1px 0 #b0b0b047;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                cursor: pointer;
                z-index: 10;
                padding: 0;
            }
    
            .carousel-left-arrow {
                left: -50px;
            }
    
            .carousel-right-arrow {
                right: -50px;
            }
    
            .carousel-left-arrow i,
            .carousel-right-arrow i {
                display: block;
                width: 14px;
                height: 14px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
            }
    
            .carousel-left-arrow i {
                background-image: url("https://cdn06.e-bebek.com/assets/toys/svg/arrow-left.svg");
            }
    
            .carousel-right-arrow i {
                background-image: url("https://cdn06.e-bebek.com/assets/toys/svg/arrow-right.svg");
            }
    
            .product-stars {
                box-sizing: border-box;
                color: #ffe8cc;
                cursor: pointer;
                display: inline;
                font-family: "Font Awesome 5 Free";
                font-size: 10px;
                font-style: normal;
                margin-bottom: 4px;
            }
    
            .product-stars .fa-star {
                margin-right: 2px;
            }
    
            .product-shipping {
                color: #FF8A00;
                padding-top: 12px !important;
                cursor: pointer;
                display: block;
                font-family: 'Quicksand-SemiBold', sans-serif;
                font-size: 10px;
                font-weight: 400;
                height: 16px;
                line-height: 16px;
                text-align: start;
                user-select: none;
                margin-top: 2px;
            }
    
            .most-seller-badge {
                position: absolute;
                top: 8px;
                left: 8px;
                width: 40px;
                height: 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                user-select: none;
                z-index: 5;
            }
    
            .most-seller-badge i {
                width: 40px;
                height: 40px;
                display: block;
                background-image: url("https://cdn06.e-bebek.com/assets/toys/svg/most-seller-product.svg");
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
            }
    
            .inner-btn {
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                background-color: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: rgba(176, 176, 176, 0.01) 0 6px 2px 0,
                            rgba(176, 176, 176, 0.08) 0 2px 9px 0,
                            rgba(176, 176, 176, 0.14) 0 2px 4px 0,
                            rgba(176, 176, 176, 0.24) 0 0 1px 0,
                            rgba(176, 176, 176, 0.28) 0 0 1px 0;
                cursor: pointer;
                z-index: 10;
                transition: background-color 0.2s;
            }
    
            .inner-btn i {
                width: 14px;
                height: 14px;
                aspect-ratio: 1 / 1;
                display: block;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                font-size: 11px;
                font-weight: 700;
                color: rgb(0,145,213);
                font-family: 'Quicksand-SemiBold';
                transition: all 0.2s;
            }
    
            .inner-btn i.toys-icon-plus-blue {
                background-image: url("https://cdn06.e-bebek.com/assets/toys/svg/plus-blue.svg");
            }
    
            .inner-btn i.toys-icon-plus-white {
                background-image: url("https://cdn06.e-bebek.com/assets/toys/svg/plus-white.svg");
                display: none;
            }
    
            .inner-btn:hover {
                background-color: rgb(0,145,213);
            }
    
            .inner-btn:hover i.toys-icon-plus-blue {
                display: none;
            }
    
            .inner-btn:hover i.toys-icon-plus-white {
                display: block;
            }
    
            @media (max-width: 1480px) {
                .carousel-product-item {
                    min-width: 273px;
                    min-height: 343px;
                }
            }
    
            @media (max-width: 1280px) {
                .carousel-product-item {
                    min-width: 297px;
                    min-height: 343px;
                }
            }
    
            @media (max-width: 991px) {
                .carousel-product-item {
                    min-width: 334.88px;
                    min-height: 362px;
                }
            }
    
            @media (max-width: 768px) {
                .carousel-product-item {
                    min-width: calc(50% - 8px);
                }
            }
    
            @media (max-width: 567px) {
                .carousel-product-item {
                    max-height: 329px;
                }
            }
    
            @media (max-width: 480px) {
                .carousel-title {
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    };
    

    const loadProducts = async () => {
        const localData = localStorage.getItem(STORAGE_PRODUCTS);
        if (localData) {
            addProductsToDOM(JSON.parse(localData));
            return;
        }
    
        try {
            const response = await fetch(
                "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
            );
    
            if (!response.ok) throw new Error("Network error");
    
            const data = await response.json();
            localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(data));
            addProductsToDOM(data);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };
    
    const formatFraction = (num) => {
        return (num.toFixed(2) + "").split(".")[1];
    };
    
    const formatPrice = (price, original) => {
        if (original && original > price) {
            const discount = Math.round(((original - price) / original) * 100);
            return `
                <span class="product-original-price">
                    ${Math.floor(original)},${formatFraction(original)} TL
                    <span class="product-discount-percentage">%${discount}</span>
                </span>
                <span class="product-item-price" style="color:#00a365;">
                    ${Math.floor(price)},${formatFraction(price)} TL
                </span>
            `;
        }
    
        return `
            <span class="product-item-price" style="color:#2b2f33;">
                ${Math.floor(price)},${formatFraction(price)} TL
            </span>
        `;
    };
    
    const createProductCard = (p) => `
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" 
           class="carousel-product-item" aria-label="${p.brand} ${p.name}">
            <span class="most-seller-badge">
                <i class="toys-icon toys-icon-most-seller-product"></i>
            </span>
    
            <div>
                <img src="${p.img}" alt="${p.name}" loading="lazy"/>
                <div class="product-item-content">
                    <h2><b>${p.brand} -</b> <span>${p.name}</span></h2>
                    <div class="product-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <span class="product-shipping">300 TL Üzerine Kargo Bedava!</span>
                </div>
            </div>
    
            <div class="product-price-container">
                ${formatPrice(p.price, p.original_price)}
            </div>
    
            <div class="product-like" data-id="${p.id}" aria-label="Like" role="button" tabindex="0">
                <svg width="15" height="15" viewBox="0 0 18 17" class="bi-heart">
                    <path d="M15.3594 2.3506C14.5916 1.48585 13.55 1 12.4639 1C11.3778 1 10.3362 1.48585 9.5684 2.3506L8.77939 3.23881L7.99038 2.3506C6.39123 0.550396 3.79851 0.550396 2.19936 2.3506C0.600213 4.15081 0.600214 7.06952 2.19936 8.86973L2.98837 9.75794L8.77939 16.2771L14.5704 9.75794L15.3594 8.86973C16.1276 8.00538 16.5592 6.83283 16.5592 5.61017C16.5592 4.38751 16.1276 3.21495 15.3594 2.3506Z"/>
                </svg>
            </div>
    
            <div class="inner-btn">
                <i class="toys-icon toys-icon-plus-blue add-icon"></i>
                <i class="toys-icon toys-icon-plus-white add-icon hovered"></i>
            </div>
        </a>
    `;
    
    const addProductsToDOM = (products) => {
        const container = document.querySelector(".carousel-products");
        if (!container) return;
    
        let html = "";
        products.forEach(p => {
            html += createProductCard(p);
        });
    
        container.insertAdjacentHTML("beforeend", html);
    
        const liked = JSON.parse(localStorage.getItem(STORAGE_LIKED) || "[]");
        liked.forEach(id => {
            const btn = container.querySelector(`.product-like[data-id="${id}"]`);
            if (btn) btn.classList.add("liked");
        });
    };
    
    const initEvents = () => {
        initLikeEvents();
        initScrollEvents();
        initDragEvents();
    };
    
    const initLikeEvents = () => {
        const container = document.querySelector(".carousel-products");
        if (!container) return;
    
        container.addEventListener("click", (e) => {
            const likeBtn = e.target.closest(".product-like");
            if (!likeBtn) return;
    
            e.preventDefault();
            const id = likeBtn.dataset.id;
            let liked = JSON.parse(localStorage.getItem(STORAGE_LIKED) || "[]");
    
            likeBtn.classList.toggle("liked");
            if (likeBtn.classList.contains("liked")) {
                if (!liked.includes(id)) liked.push(id);
            } else {
                liked = liked.filter(x => x !== id);
            }
    
            localStorage.setItem(STORAGE_LIKED, JSON.stringify(liked));
        });
    
        container.addEventListener("keydown", (e) => {
            if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("product-like")) {
                e.preventDefault();
                e.target.click();
            }
        });
    };
    
    const initScrollEvents = () => {
        const left = document.querySelector(".carousel-left-arrow");
        const right = document.querySelector(".carousel-right-arrow");
        const products = document.querySelector(".carousel-products");
        const firstItem = document.querySelector(".carousel-product-item");
    
        if (!left || !right || !products || !firstItem) return;
    
        const margin = parseInt(getComputedStyle(firstItem).marginRight) || 16;
        const productWidth = firstItem.offsetWidth + margin;
    
        right.addEventListener("click", () => {
            products.scrollBy({ left: productWidth, behavior: "smooth" });
        });
    
        left.addEventListener("click", () => {
            products.scrollBy({ left: -productWidth, behavior: "smooth" });
        });
    };
    
    const initDragEvents = () => {
        const container = document.querySelector(".carousel-products");
        const firstItem = document.querySelector(".carousel-product-item");
    
        if (!container || !firstItem) return;
    
        const margin = parseInt(getComputedStyle(firstItem).marginRight) || 16;
        const productWidth = firstItem.offsetWidth + margin;
    
        let isDown = false;
        let startX;
        let deltaX;
    
        const dragStart = (x) => {
            isDown = true;
            startX = x;
            deltaX = 0;
            container.classList.add("dragging");
        };
    
        const dragEnd = () => {
            if (!isDown) return;
            isDown = false;
            container.classList.remove("dragging");
    
            if (Math.abs(deltaX) > 30) {
                const direction = deltaX < 0 ? 1 : -1;
                container.scrollBy({ left: direction * productWidth, behavior: "smooth" });
            }
        };
    
        const dragMove = (x) => {
            if (!isDown) return;
            deltaX = x - startX;
        };
    
        container.addEventListener("mousedown", (e) => dragStart(e.pageX));
        container.addEventListener("mouseup", (e) => { dragEnd(); e.preventDefault(); });
        container.addEventListener("mouseleave", () => { isDown = false; container.classList.remove("dragging"); });
        container.addEventListener("mousemove", (e) => dragMove(e.pageX));
    
        container.addEventListener("touchstart", (e) => dragStart(e.touches[0].pageX), { passive: true });
        container.addEventListener("touchend", (e) => { dragEnd(); e.preventDefault(); }, { passive: false });
        container.addEventListener("touchmove", (e) => dragMove(e.touches[0].pageX), { passive: true });
    };

    init();
})();
