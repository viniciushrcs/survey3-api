### - Login
> ### Success cases ✅
1. Receive a **POST** request on route **/api/login**
2. Validate request data: **email**, **password**
3. Validate that **email** is a valid email
4. Finds the respective user from the credentials given
5. Generates an **access token**
6. **Save** the token with the user data
7. Returns 200 with the **access token** and **user name**

> ### Exceptions ❌
1. Returns **400** if fields **email**, **password** are not in the request
2. Returns **400** if email is invalid
3. Returns **401** if credentials are invalid
4. Returns **500** if error occurs while generating the **access token**
5. Returns **500** if error occurs while saving the token