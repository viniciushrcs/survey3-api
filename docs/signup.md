### - SignUp

> ### Success cases ✅
1. Receive a **POST** request on route **/api/signup**
2. Validate request data: **name**, **email**, **password** and **passwordConfirmation**
3. Validate that **password** and **passwordConfirmation** are equal
4. Validate that **email** is a valid email
5. Validate if one account already exists with the given **email**
6. Generates an **encrypted** password to save in Database
7. **Save** a new account for the user
8. Generates an **access token**
9. **Save** the token with the user data
10. Returns 200 with the **access token** and **account data**

> ### Exceptions ❌
1. Returns **400** if fields **name**, **email**, **password** or **passwordConfirmation** are not in the request
2. Returns **400** if password e passwordConfirmation are not equal
3. Returns **400** if email is invalid
4. Returns **500** if error occurs while generating the encrypted password
5. Returns **500** if error occurs while creating the new account