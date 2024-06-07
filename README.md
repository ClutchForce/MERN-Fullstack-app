# Superhero Explorer

Superhero Explorer is a full-stack MERN application that allows users to search for superheroes, create personalized lists, and interact with other users' lists.

## 📖 Description

This application enhances the user experience by providing several functionalities:
- **Search for superheroes**: Users can find detailed information about their favorite superheroes.
- **List creation**: Authenticated users can create their own private or public lists of superheroes.
- **Community engagement**: Users can view public lists created by others and leave comments if logged in.
- **User support**: If your account is disabled, please contact the system admin at pgherghe@uwo.ca.

Developed by Paul, this app aims to provide superhero enthusiasts a platform to explore and share their interests.

## 🌟 Features

Superhero Explorer integrates several features:
- **User Authentication**: Managed using Mongoose DB to ensure secure login processes.
- **Limited Access for Guests**: Unauthenticated users can view public lists and learn about the application.
- **Enhanced User Privileges**: Authenticated users have the capability to manage their lists and interact with community content.
- **Admin Functionality**: Includes account management, content moderation, and policy updates.

[Detailed Feature Documentation](https://docs.google.com/document/d/1fhDRT7xKokyC3EoO4ptJ-mVnVQqSMx6DJc0kZTpdB98/edit?usp=sharing)

## 🎬 Video Demo

Explore the functionalities through our [Demo Video](https://youtu.be/yhVZNZOPr8U).

## 🚀 Set Up

To set up the application locally, follow these steps:

1. **Clone the repository**:
    ```
    git clone [repository URL]
    ```
2. **Install Dependencies**:
- Navigate to both the client and server directories in separate terminals and run:
  ```
  npm install
  ```
3. **Database Setup**:
- Install MongoDB using Homebrew:
  ```
  brew install mongodb-community@7.0
  ```

## 🏃 How to Run

To get the application up and running:

- **Start MongoDB**:
```
brew services start mongodb-community@7.0
```
- **Stop MongoDB**:
```
brew services stop mongodb-community@7.0
```
- **Access MongoDB Shell**:
```
mongosh
```


- **Start the Server**:
- Navigate to the server directory:
  ```
  cd server
  npm start
  ```

- **Start the Client**:
- Navigate to the client directory:
  ```
  cd client
  npm start
  ```

## ☁️ Deploying on AWS

This application is deployable on AWS and can be accessed [here](http://ec2-3-81-216-61.compute-1.amazonaws.com:4000/). (No longer available)

To deploy: 
- Ensure MongoDB is running:
```
sudo systemctl start mongod
sudo systemctl status mongod
```

- Run the server from the repository directory:
```
node server/server.js
```

## 🌐 Sample REST APIs

Interact with the application through these sample API calls:

- **Get Hero Info by ID**:
```
curl -X GET "http://localhost:3000/api/superheroes/0"
```

- **Post a New List**:
```
curl -X POST -H "Content-Type: application/json" -d '{"listName": "My Superheroes"}' http://localhost:3000/api/lists
```

- **Update List Content**:
```
curl -X PUT -H "Content-Type: application/json" -d '{"superheroIds": [1, 2, 3]}' http://localhost:3000/api/lists/My%20Superheroes
```

- **Delete a List**:
```
curl -X DELETE http://localhost:3000/api/lists/My%20Superheroes
```


## 📘 Conclusion

Superhero Explorer is designed to offer a robust platform for superhero enthusiasts to explore, share, and discuss their favorite characters. With comprehensive features for different user roles, it provides a dynamic and interactive experience.

