# Software Requirement Specification - Team Return0
## Problem Statement
We want to build a **JHU community-exclusive used goods trading platform**.
Each year, new students move in and graduates move out of the Baltimore area. There is much potential for used goods trading even within the JHU community. But existing platforms cannot perfectly solve this pain point because

  - Platforms like eBay are inefficient and expensive. As sellers and buyers of our platform are all present in the same area, we connect these users to facilitate meet & trade locally. For example,
    - Users may conveniently obtain goods like kitchen appliances that will be used on Day 1 moving in.
    - Hard-to-move goods like furniture may no longer need high delivery costs for shipping across the country. But the freshman buyer may find a JHU graduate selling this item who is living upstairs. 
  - Users on existing platforms may not be trustworthy in terms of good quality.

We also find students resolve to online group chats on WhatsApp and WeChat groups for posting this information/advertisements. However, the information is scattered and incomplete. For example, the seller posts an image of a pot he wants to sell to a group chat. It may not contain information about where the seller lives. The message is also among many unrelated messages, making this information hard to find and update.

Our platform wants to address these inefficiencies and enhance the information sharing about used item selling among the JHU community.

## Potential Clients
Students and staff at Johns Hopkins community who
- want to be connected to potential buyers within the JHU community and live in the neighborhood for convenient face-to-face trading
- want to find local deals, ranging from used textbooks, kitchen appliances, and possibly furniture if the situation allows.
## Proposed Solution
We will develop a platform to publish used product media and information. This information will be available to the JHU community. To efficiently connect sellers to potential buyers, we offer
1. **Categorization and tagging**. The user can personalize multiple tags to their product so that it helps the buyer find stuff in need quickly.
2. **Filtering**. The user can also choose to filter by some basic information about the product, such as
    - Location of the owner
    - Rating of the seller
    - Price of the products
    - Tags of the products
3. **Provide recommendations** to encourage users to discover products that they do not know they need/want. We collect product browsing history and provide recommendations based on geolocation proximity and users' interest reflected by their platform utilization data.
4. **Instantly connected to peers living in the neighborhood**. Since we focus on the JHU community and tag the product with residence information, our platform provides students with deals for face-to-face trading that can potentially save shipping time and fees.
5. **A safer trading community**.
   - We will only allow JHU email for user registration to ensure safety;
   - We provide rating features to both seller and buyer to improve the community's trustworthiness

Declaration: Considering the load of the project and the available time, it is unlikely that this solution would be or even attempt to be all-executive. By using this strategy system, user-generated content would be made available, distributed, and aired without any moderator review. Users should exercise their judgment in determining whether or not to engage in a transaction and in verifying any necessary details, including delivery and payment method.

## Functional Requirements
### Must have
1. As a seller, I want to upload images and descriptions to show my product for sale so that my product can attract potential buyers.
2. As a seller, I want to provide my contact info and approximate location information for my product so that potential buyers can easily reach me.
3. As a buyer, I want to search for items or browse in categories so that I can find products that I am interested in.
4. As a buyer, I want to get personalized recommendations based on previous browsing history so that I can easily discover the product I might be interested in.
5. As a buyer/seller, I want to view the ratings of sellers/buyers and rate them after the purchase so that I can be confident about future trade and help other users with their decision-making.
6. As a buyer, I want to have a favorite list to save the products that I may want to buy, so that I can easily find them again later.

### Nice to have
1. As a buyer, I want to view categorized information of a group of products so that I don’t need to look through each product description one by one to find key information.
2. As a user, I want my potential buyers or sellers to be from the JHU community so that the information on the platform can be more trustworthy.
3. As a seller, I want the platform to withhold some credits from my potential buyers to be safe for me to bring out the product to a meet-up.
4. As a seller/buyer, I want to know the actual location of the potential buyer/seller to conveniently arrange the meet-up location visualized on a map.
5. As a seller/buyer, I want to communicate with the buyer/seller, better through email, so that I can learn more details about the product.
6. As a buyer, I want to know my order process such as if my order is approved by the seller so that I can be notified, communicate, and start an offline transaction with the seller.

### Non-functional Requirements
1. JHU-theme user interface for our JHU community
2. Accessibility settings for users with different abilities
3. Strong scalability to provide reliable service for a large number of users and load
4. Security measures to ensure private information like location, email addresses, and usage data will not be compromised.
5. Ensure compatibility and reliability between different devices and operating systems

## Software Architecture & Technology Stack
Since the web is accessible across many platforms and can be easily shared among users as well as search engines, the project will be a web application.
- **Architecture**: Client-Server. MERN stack
- **Language**: Java​Script(Framework: React, Bootstrap, Express, NodeJS), ​H​TML/CSS
Database: MongoDB
- **Recommendation System**: OPT model or other pre-trained self-supervised language models. Using browsing history or wishing list as prompts, and relative words generated from models can be used as recommendations.

## Similar Apps
- eBay/Facebook Marketplace. Both these two applications have a range of nationwide users. However, they do not impose any user verification mechanism so the reliability of both buyers and sellers is not ensured. In addition, since the buyers and sellers are located far away from each other, shipping may be needed leading to long waiting times and extra costs.
- Chat groups for used item trading on WhatsApp, WeChat, etc. Advertisements are scattered and hard to find.
- Our application would solve these pain points by enabling offline trade within the JHU community and increase the platform's trustworthiness by authenticating the users with JHU credentials.
