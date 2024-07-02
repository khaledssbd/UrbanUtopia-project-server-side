# UrbanUtopia

## Live site:

- Click here- [UrbanUtopia on firebase](https://urbanutopia-by-khaled.web.app)
- Click here- [UrbanUtopia on vercel](https://urbanutopia-by-khaled.vercel.app)
- Click here- [UrbanUtopia on surge](https://urbanutopia-by-khaled.surge.sh)
- Click here-
  [UrbanUtopia on netlify](https://urbanutopia-by-khaled.netlify.app)

## GitHub Repository:

- [Client-Repository](https://github.com/khaledssbd/UrbanUtopia-project-client-side)

- [Server-Repository](https://github.com/khaledssbd/UrbanUtopia-project-server-side)

---

## Getting Started

To run this React project on your local machine follow the instructions-

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/download/) (which includes npm)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   Open your terminal and run the following command to clone the repository:

   ```bash
   git clone https://github.com/khaledssbd/UrbanUtopia-project-server-side
   ```

2. **Navigate to the project directory:**

   ```bash
   cd UrbanUtopia-project-server-side
   ```

3. **Install dependencies:**

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

4. **Start the development server:**

   Once the dependencies are installed, you can start the development server
   with:

   ```bash
   npm run dev
   ```

   This will run the app in development mode. Open
   [http://localhost:5000](http://localhost:5000) to view it in the browser.

# Key Features:

- Admin can post a new apartment info
- User can apply for the agreement for an apartment
- Admin can see, accept and reject the agreement
- If admin accepts the agreement the agreement will be marked as checked, the
  apartment status will be unavailable, the user role will be changed to Member
- The member can pay rent for the apartment using Stripe gateway
- If the admin rejects the agreement the user role will not be changed, but the
  agreement will be marked as checked
- Admin can remove the Member. Then the role will be changed to User
- Besides admin can change thr status of the apartment available
- Admin can also add new apartment, by default the apartment will be available
- Admin can update or remove an apartment
- Admin can add announcements and all users and members can see the
  announcements
- Admin can post coupons with a discount and also can update the status of the
  coupon valid or unvalid
- If admin diclars a coupon unvalid, it will automatically be removed from the
  home page
- Members can lessen their rent by useing a valid coupon code
- Admin can see the statistics of the wobsite like total user, total member,
  total payments, total reviews, total apartments, percentage of available and
  unavailable apartments

# Description of tools

- Creative Design
- All Device Responsive
- Loading data in a amazing way with no bug using TanStack Query
- axiosSecure to force logout a hacker who wants to ge others data
- CRUD or REST(Representational State Transfer) API(Application Programming
  Interface) support with post get put delete requests
- Custom API and Server configuration with database
- tailwind CSS
- Awesome dark theme support
- Toast Message and sweet-alert2 for notifications
- react-responsive-carousel, aos Implementation for better UI
- jspdf for pdf downlaod
- Environment Variable configuration to save admin data from hackers
- Regex with Valid email
- Regex with Uppercase letters, lowercase letters and 6 characters in password
- PrivateRoute, adminRoute, memberRoute to stop one to browse others pages
- Different Dashboard for Admin, Member and user
- Local Storage and API post configuration with Protected route
- jwt configuration to configure security
- react-hook-form in registration
- Adaptable & Robust
- No lorem text and no javascript default alert

# npm Packages

- npm i aos
- npm i axios
- npm i jspdf
- npm i firebase
- npm i react-icons
- npm i sweetalert2
- npm i lottie-react
- npm i react-tooltip
- npm i react-hot-toast
- npm i react-hook-form
- npm i react-router-dom
- npm i react-helmet-async
- npm install react-tooltip
- npm i @tanstack/react-query
- npm install -g firebase-tools
- npm i react-simple-typewriter
