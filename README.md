# Crowd-Cube API

A Node.js-based RESTful API for managing campaigns, users, and donations. This API allows users to create, read, update, and delete campaigns, manage user data, and handle donation information.

## Features

- **Campaign Management:**
  - Create a new campaign.
  - Retrieve all campaigns or a specific campaign by ID.
  - Update or delete campaigns.
  - [Campaigns API](https://crowd-cube-server.vercel.app/campaigns)

- **User Management:**
  - Register a new user.
  - Retrieve all users.
  - [Users API](https://crowd-cube-server.vercel.app/users)

- **Donation Handling:**
  - Submit a donation.
  - Retrieve all donations.
  - [Donations API](https://crowd-cube-server.vercel.app/donations)

## Technologies Used

- **Backend Framework:** Express.js
- **Database:** MongoDB
- **Environment Variables:** dotenv
- **Middleware:**
  - CORS for handling cross-origin requests.
  - JSON parser for request bodies.