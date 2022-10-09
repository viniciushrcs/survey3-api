### - AddSurvey
> ### Success cases ✅
1. Receive a **POST** request on route **/api/surveys**
2. Validate request data: **question**, **answers**
3. Create a new survey
4. Returns 204

> ### Exceptions ❌
1. Returns **404** if route does not exist
2. Returns **400** if fields **question** or **answers** are not in the request
3. Returns **500** if error occurs while creating the new survey
