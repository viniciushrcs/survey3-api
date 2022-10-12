### - SaveSurveyResult
> ### Success cases ✅
1. Receive a **PUT** request on route **/api/surveys/{surveyId}/results**
2. Validate if request was made by an **user** authenticated
3. Validate if the parameter **survey_id** is present
4. Validate if the field **answer** is valid
5. Creates a new register of the answer
6. Updates the answer if the user have already answered
7. Returns 200 with the data created

> ### Exceptions ❌
1. Returns **404** if route does not exist
2. Returns **403** if user is not **registered**
3. Returns **403** if the parameter **survey_id** is invalid
4. Returns **403** if the **answer** is invalid
5. Returns **500** if error occurs while creating or updating the new survey result
6. Returns **500** if error occurs while loading the survey
