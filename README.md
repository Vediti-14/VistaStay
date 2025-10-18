#VistaStay – Rental Listings Platform

VistaStay is a full-stack platform for booking and managing rental listings. Users can browse, filter, and book properties, while owners can create, update, and manage their listings. The application uses a secure authentication system, image uploads, and interactive maps for enhanced user experience.

#Features

User Authentication: Secure signup, login, and logout using Passport.js.

CRUD Operations: Create, read, update, and delete rental listings.

Interactive Maps: Leaflet.js integration for visualizing property locations.

Image Uploads: Cloudinary integration for storing and displaying listing images.

Category Filters: Filter listings by category (Rooms, Castles, Pools, etc.).

Booking System: Users can book listings and view their bookings.

Flash Messages: Inform users about successful operations or errors.


#Tech Stack

Frontend: EJS, Bootstrap

Backend: Node.js, Express.js

Database: MongoDB Atlas

Authentication: Passport.js

File Storage: Cloudinary

Maps: Leaflet.js

Deployment: Render

Project Architecture

VistaStay follows the MVC (Model–View–Controller) architecture:

Models: MongoDB schemas (User, Listing, Booking, Review)

Views: EJS templates for frontend rendering

Controllers: Route handlers for CRUD operations, user authentication, and bookings

Routes: Organized by feature (listings, users, reviews, bookings)

Installation

Clone the repository:

git clone https://github.com/vediti-14/VistaStay.git
cd VistaStay


Install dependencies:

npm install


Create a .env file and add your environment variables:

ATLASDB_URL=<Your MongoDB Atlas URI>
SECRET=<Your Session Secret>
CLOUD_NAME=<Cloudinary Name>
CLOUD_API_KEY=<Cloudinary API Key>
CLOUD_API_SECRET=<Cloudinary API Secret>
OPENCAGE_API_KEY=<OpenCage API Key>


Run the application:

npm start


Open your browser at http://localhost:8080

Usage

Browse listings on the homepage.

Filter listings by category using the navigation filters.

Sign up / log in to book listings.

Create, update, or delete your own listings.



#Live Demo

https://vistastay-3.onrender.com
License

This project is licensed under the MIT License.
