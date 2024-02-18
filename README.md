## Installation

![](https://byob.yarr.is/kyrregjerstad/crazyAuction/unit-test)
![](https://byob.yarr.is/kyrregjerstad/crazyAuction/build)
![](https://byob.yarr.is/kyrregjerstad/crazyAuction/e2e-tests)

Welcome to CrazyAuction, a frontend-focused project developed as part of my second year semester project at Noroff. This application serves as an interactive platform for users to engage in online auctions, showcasing my skills in frontend development and design.

Live Site: [Crazy Auction](https://crazy.auction/)

## Project Overview

The objective of this project was to create a dynamic and user-friendly frontend for an auction website. Emphasis was placed on:

- Interactive User Interface: Delivering a seamless and engaging user experience.
- Responsive Design: Ensuring accessibility across various devices and screen sizes.
- Modern Web Technologies: Utilizing NextJS 14, Shadcn, TailwindCSS, TypeScript, and Bun.

## Features

**Auction Bidding Interface:** User-friendly bidding interface for auctions.

**User Account Management:** Profile creation and management.

**Product Listings:** Detailed views of auction items with descriptions and images.

### Image Storage and Caching

**Cloudinary Integration:** User-submitted images are stored in Cloudinary. This service handles various image formats and sizes, providing a scalable solution for image storage and retrieval in the application.

**Cloudflare Workers for Caching:** To enhance performance and reduce costs associated with Cloudinary transformations, Cloudflare Workers are implemented for caching. They serve image requests from Cloudflare's edge network, leading to improved response times and reduced bandwidth usage.

## Installation

Ensure you have [Bun installed](https://bun.sh/docs/installation) on your system to manage dependencies and run the project.

Clone the repository and install dependencies:

```bash
gh repo clone kyrregjerstad/crazyAuction
cd crazyAuction
bun install
```

### Running Locally

Start the development server:

```bash
bun run dev
```

Visit http://localhost:3000 to interact with the application.

### Testing

Maintain code integrity and functionality with unit and end-to-end testing:

```bash
# Unit tests:
bun run test

# End-to-End tests (build the application first):
bun run build
bun run test:e2e

# Run End-to-End tests in headless mode:
bun run test:e2e:headless
```

Academic Context
This project is part of my academic coursework at Noroff. It serves as a platform to apply and showcase the skills and knowledge I've acquired in frontend web development.
