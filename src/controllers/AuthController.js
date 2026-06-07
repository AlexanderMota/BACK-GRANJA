class AuthController {
    constructor({ AuthService }) {
      this.authService = AuthService;
    }
  
    login = async (req, res) => {
      try {
        const { user } = req.body;

        if (!user.email || !user.password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  
        const data = await this.authService.login(user.email, user.password);
        
        res.json(data);
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    };
  }
  
  export default AuthController;
  