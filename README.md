# Project Nexus

## FreshHarvest Marketplace

**FreshHarvest Marketplace** is a complete e-commerce platform where Nairobi customers can browse fresh produce like avocados, tomatoes, and vegetables, add items to a smart shopping cart that automatically handles quantities without duplicates, checkout with cash-on-delivery using their estate address (like "Kilimani, House 123"), and track orders through a beautiful visual progress system from "Pending" to "Delivered". Built with Django REST Framework backend featuring 2-day persistent JWT authentication and React frontend with mobile-first Tailwind CSS design, it provides a seamless end-to-end shopping experience from product discovery to delivery tracking, perfectly tailored for Nairobi's fresh produce market with full Swagger API documentation.

## FreshHarvest Tech Stack

## **Complete Technology Overview**

| Technology                | Layer        | Responsibility                            |
| ------------------------- | ------------ | ----------------------------------------- |
| **Django 6.0.1**          | **Backend**  | Core framework, routing, business logic   |
| **Django REST Framework** | **Backend**  | RESTful APIs, serializers, authentication |
| **PostgreSQL**            | **Database** | Data storage (products, orders, users)    |
| **SimpleJWT**             | **Auth**     | JWT tokens (2-day access, 7-day refresh)  |
| **React 18**              | **Frontend** | UI components, state management           |
| **Tailwind CSS**          | **Styling**  | Mobile-first responsive design            |
| **Vite**                  | **Build**    | Fast frontend bundling & dev server       |
| **Axios**                 | **HTTP**     | API requests with auth headers            |
| **React Router**          | **Routing**  | Client-side navigation (/products, /cart) |

## **Role of Each Technology**

### **Backend Stack**

Django 6.0.1 + DRF  
├── Handles: API endpoints, validation, auth  
├── Smart Cart: get_or_create() logic  
├── Checkout: Order creation + cart clearing  
└── Orders: Status tracking (Pending→Delivered)

---

### **Database**

PostgreSQL (freshharvest_db)  
├── Products: name, price, image, stock  
├── CartItems: user+product UNIQUE constraint  
├── Orders: delivery_address, total, status  
└── Users: Custom user model

---

### **Frontend Stack**

React 18 + Tailwind CSS  
├── React: ProductCard, Cart, Checkout, Orders components  
├── Tailwind: rounded-3xl shadow-xl mobile-first design  
├── Context API: Persistent auth state across refreshes  
└── Vite: Lightning-fast HMR during development

---

### **Authentication Flow**

SimpleJWT → 2-day access tokens  
├── Login: POST /api/auth/login/  
├── Persist: localStorage.setItem("token")  
├── Validate: GET /api/users/me/  
└── Auto-refresh: Page reload → stays logged in

---

### **API Communication**

Axios → All frontend→backend calls  
├── Authorization: Bearer ${token}  
├── BaseURL: http://127.0.0.1:8000/api  
├── Error handling: 401→logout, 400→user feedback  
└── Loading states: Every API call

---

## **Architecture Summary**

Frontend (React 18)        Backend (Django 6)  
↓                         ↓  
Tailwind CSS        ←→    REST Framework APIs  
↓                         ↓  
Vite Build                PostgreSQL Database  
↓  
Axios Requests     ← JWT Auth → Business Logic

## FreshHarvest Backend API Endpoints - Complete Reference

## **Complete Endpoint Directory**

| Method | Endpoint           | Operation   | Description                            | Auth |
| ------ | ------------------ | ----------- | -------------------------------------- | ---- |
| `POST` | `/api/auth/login/` | **Login**   | `{email, password}` → JWT access token | No   |
| `GET`  | `/api/users/me/`   | **Profile** | Get current user data                  | Yes  |

## **Products Endpoints**

| Method | Endpoint         | Operation | Description                | Auth |
| ------ | ---------------- | --------- | -------------------------- | ---- |
| `GET`  | `/api/products/` | **List**  | Get all available products | No   |

## **Cart Endpoints**

| Method   | Endpoint                | Operation         | Description                                             | Auth |
| -------- | ----------------------- | ----------------- | ------------------------------------------------------- | ---- |
| `POST`   | `/api/cart/items/`      | **Create/Update** | **Add to cart** - `get_or_create()` increments quantity | Yes  |
| `GET`    | `/api/cart/items/`      | **List**          | View user's cart items                                  | Yes  |
| `PATCH`  | `/api/cart/items/{id}/` | **Update**        | Change item quantity (`+/-` buttons)                    | Yes  |
| `DELETE` | `/api/cart/items/{id}/` | **Delete**        | Remove item from cart                                   | Yes  |

## **Checkout Endpoint**

| Method | Endpoint                    | Operation    | Description                                               | Auth |
| ------ | --------------------------- | ------------ | --------------------------------------------------------- | ---- |
| `POST` | `/api/cart/items/checkout/` | **Checkout** | **Place Order** - Creates Order + OrderItems, clears cart | Yes  |

## **Orders Endpoints**

| Method | Endpoint       | Operation | Description                               | Auth |
| ------ | -------------- | --------- | ----------------------------------------- | ---- |
| `GET`  | `/api/orders/` | **List**  | User's order history with status tracking | Yes  |
