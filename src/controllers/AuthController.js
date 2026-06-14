class AuthController {
  
  constructor({ AuthService }) {
    this.authService = AuthService;
  }
  
  login = async (req, res) => {
    try {
      const { user } = req.body;

      if (!user.email || !user.password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

      const data = await this.authService.login(user.email, user.password);
      
      res.cookie('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',    // true en producción (HTTPS)
        sameSite: 'lax',      // o 'strict' según tu caso
        maxAge: 3600 // 1h
      });
      res.json({message: 'Login exitoso', user: data.user.email});

    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
}

export default AuthController;
  