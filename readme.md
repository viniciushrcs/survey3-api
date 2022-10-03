# Clean Node Api

This project is an Api built with Node, following the principles of Clean Architecture and respecting TDD practices during the development.

## Layers:
### Presentation: 
- Layer responsible for handling and showing the data to the user.
- Controllers:
  - SignUpController
    - handle requests to save a new user account
### Domain
- Layer responsible for setting the use cases of the system
- UseCases:
  - AddAccount - save a new user account following this interface:
    
```typescript
interface AccountModel {
  id: string;
  name: string;
  email: string;
  password: string;
}

```