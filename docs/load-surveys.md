### - List All Surveys
> ### Success cases ✅
1. Receive a **GET** request on route **/api/surveys**
2. Validate if request was made by an authenticated **user**
3. Returns 204 if there isn't a survey
4. Returns 200 with the surveys data

> ### Exceptions ❌
1. Returns **404** if route does not exist
2. Returns **403** if request sender is not an user
3. Returns **500** if error occurs while loading the surveys
