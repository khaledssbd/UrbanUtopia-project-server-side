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

# npm Packages

- npm i cookie-parser
- npm i cors
- npm i dotenv
- npm i express
- npm i jsonwebtoken
- npm i mongodb
- npm i nodemailer
- npm i nodemon
- npm i stripe
