# Knowledgeus Server:

## baseUrl: [https://knowledgeus-server.vercel.app/api/v1](https://knowledgeus-server.vercel.app/api/v1)

## book

### route{add book} : [https://knowledgeus-server.vercel.app/api/v1/books/create-book](https://knowledgeus-server.vercel.app/api/v1/books/create-book) [post]

### route{get single book}: [https://knowledgeus-server.vercel.app/api/v1/books/:id](https://knowledgeus-server.vercel.app/api/v1/books/:id) [get]

### route{update book} : [https://knowledgeus-server.vercel.app/api/v1/books/:id](https://knowledgeus-server.vercel.app/api/v1/books/:id) [patch]

### route{delete book} : [https://knowledgeus-server.vercel.app/api/v1/books/:id](https://knowledgeus-server.vercel.app/api/v1/books/:id) [delete]

## Review

### route{add review} : [https://knowledgeus-server.vercel.app/api/v1/reviews/create-book](https://knowledgeus-server.vercel.app/api/v1/reviews/:id) [post][id=bookId]

### route{get review}: [https://knowledgeus-server.vercel.app/api/v1/reviews/:id](https://knowledgeus-server.vercel.app/api/v1/reviews/:id) [get][id=bookId]

### route{update review} : [https://knowledgeus-server.vercel.app/api/v1/reviews/:id](https://knowledgeus-server.vercel.app/api/v1/reviews/:id) [patch][id=reviewId]

### route{delete review} : [https://knowledgeus-server.vercel.app/api/v1/reviews/:id](https://knowledgeus-server.vercel.app/api/v1/reviews/:id) [delete][id=reviewId]

## User

### routes{add user} : [https://knowledgeus-server.vercel.app/api/v1/users/create-user](https://knowledgeus-server.vercel.app/api/v1/users/create-user) [post]

### routes{get my profile}: [https://knowledgeus-server.vercel.app/api/v1/users/my-profile](https://knowledgeus-server.vercel.app/api/v1/users/my-profile) [get]

## WishList

### routes{get wish} : [https://knowledgeus-server.vercel.app/api/v1/wishlists/](https://knowledgeus-server.vercel.app/api/v1/wishlists/) [get]

### routes{add wish} : [https://knowledgeus-server.vercel.app/api/v1/wishlists/add-wish](https://knowledgeus-server.vercel.app/api/v1/wishlists/add-wish) [post]

### routes{update wish} : [https://knowledgeus-server.vercel.app/api/v1/wishlists](https://knowledgeus-server.vercel.app/api/v1/wishlists) [patch]

### routes{delete wish} : [https://knowledgeus-server.vercel.app/api/v1/wishlists/:id](https://knowledgeus-server.vercel.app/api/v1/wishlists/:id) [delete]

## Auth

### routes{login user} : [https://knowledgeus-server.vercel.app/api/v1/auth/login](https://knowledgeus-server.vercel.app/api/v1/auth/login) [post]
