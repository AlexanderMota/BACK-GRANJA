class AuthController {
  
  constructor({ AuthService, PerfilService }) {
    this.authService = AuthService;
    this.perfilService = PerfilService;
  }

  getMe = async (req, res) => {

    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Usuario no autenticado' });
      
      res.json({message: 'Usuario activo.', user: { email: user.email, role: user.role }});
    } catch (error) {
      console.log('Error:', error.message);
      res.status(406).json({ error: error.message });
    }
  };
  
  crearPerfil = async (req, res) => {
    try {
      const { user } = req.body;
      console.log('Datos recibidos para crear perfil:', user);
      const newUser = await this.perfilService.crearPerfil(user);
      res.status(201).json({ message: 'Perfil creado.', user: newUser });
    } catch (error) {
      //console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { user } = req.body;

      if (!user.email || !user.password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

      const token = await this.authService.login(user.email, user.password);
      
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',    // true en producción (HTTPS)
        sameSite: 'lax',      // o 'strict' según tu caso
        maxAge: 3600000 // 1h
      });
      res.json({message: 'Login exitoso.', user: {email:user.email}});

    } catch (error) {
      
      console.log('Datos de login recibidos.', error);
      res.status(401).json({ error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.clearCookie('access_token');
      res.json({message: 'Logout exitoso.', user: {email: req.user.email}});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

export default AuthController;
  