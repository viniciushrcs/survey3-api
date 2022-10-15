export default {
  Query: {
    login(email: string, password: string) {
      return {
        accessToken: 'email',
        name: 'password'
      };
    }
  }
};
