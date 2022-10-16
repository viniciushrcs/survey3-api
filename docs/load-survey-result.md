### - Load Survey Result
> ### Success cases ✅
1. Receive a **GET** request on route **/api/surveys/{survey_id}/results**
2. Validate if request was made by an user
3. Returns 200 with the surveys data

> ### Exceptions ❌
1. Returns **404** if route does not exist
2. Returns **403** if request sender is not an user
3. Returns **500** if error occurs while loading the surveys
