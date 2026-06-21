import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.access_token;
  console.log('Token recibido en authMiddleware:', token);
  if (!token) {
    return res.status(403).json({ error: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 👈 guardas usuario en request
    console.log('Decoded user:', req.user);
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }
};